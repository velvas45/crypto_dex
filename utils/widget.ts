import Datafeed from "@/utils/datafeed";

export const createWidget = (containerChart: string, symbol: string) => {
  if (
    document.getElementById("tv_chart_container") &&
    "TradingView" in window &&
    window
  ) {
    new (window.TradingView as any).widget({
      autosize: true,
      symbol,
      interval: "D",
      fullscreen: true,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      datafeed: Datafeed,
      enable_publishing: false,
      container_id: containerChart,
      enabled_features: ["header_fullscreen_button"],
      disabled_features: ["edit_buttons_in_legend"],
    });
  }
};
