import {
  makeApiRequest,
  generateSymbol,
  parseFullSymbol,
} from "@/utils/helpers";
import { subscribeOnStream, unsubscribeFromStream } from "@/utils/streaming";

const configurationData: {
  supported_resolutions: any[];
  exchanges: any[];
  symbols_types: { name: string; value: string }[];
} = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ["1D", "1W", "1M"],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: "crypto", value: "crypto" }],
};

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map();

// Obtains all symbols for all exchanges supported by CryptoCompare API
async function getAllSymbols() {
  const data = await makeApiRequest("data/v3/all/exchanges");
  let allSymbols: any[] = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange?.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart: any) => {
        const symbol = generateSymbol(
          exchange.value,
          leftPairPart,
          rightPairPart
        );
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: "crypto",
        };
      });
      allSymbols = [...allSymbols, ...symbols];
    }
  }
  return allSymbols;
}

export default {
  onReady: (callback: any) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },
  onRealtimeCallback: (data: any) => {
    console.log(data);
  },
  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: any
  ) => {
    console.log("[searchSymbols]: Method call");
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
    extension: unknown
  ) => {
    console.log("[resolveSymbol]: Method call", symbolName);
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(
      ({ full_name }) => full_name === symbolName
    );
    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }
    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };
    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo: any,
    resolution: number,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log("[getBars]: Method call", symbolInfo, resolution, from, to);
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const urlParameters: { [key: string]: string | number | undefined } = {
      e: parsedSymbol?.exchange,
      fsym: parsedSymbol?.fromSymbol,
      tsym: parsedSymbol?.toSymbol,
      toTs: to,
      limit: 2000,
    };
    const query = Object.keys(urlParameters)
      .map(
        (name) =>
          `${name}=${encodeURIComponent(
            urlParameters[name] as string | number
          )}`
      )
      .join("&");
    try {
      const data = await makeApiRequest(`data/histoday?${query}`);
      if (
        (data.Response && data.Response === "Error") ||
        data.Data.length === 0
      ) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true });
        return;
      }
      let bars: any[] = [];
      data.Data.forEach((bar: any) => {
        if (firstDataRequest) {
          lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
        }
        console.log(`[getBars]: returned ${bars.length} bar(s)`);
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            },
          ];
        }
      });
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscriberUID: string,
    onResetCacheNeededCallback: any
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },
  unsubscribeBars: (subscriberUID: string) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeFromStream(subscriberUID);
  },
};
