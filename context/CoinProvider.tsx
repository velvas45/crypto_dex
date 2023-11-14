"use client";

import { fetchCoin } from "@/services/coin";
import React, { createContext, useContext, useState, useEffect } from "react";

interface CoinContextType {
  coin: string;
  coins: any[];
  price: string | number;
  handleChangeCoinPrice: (coin: string, price: string | number) => void;
  isFetching: boolean;
  btcPrice: string | number;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export function CoinProvider({ children }: { children: React.ReactNode }) {
  const [coin, setCoin] = useState("");
  const [btcPrice, setBtcPrice] = useState<string | number>("");
  const [coins, setCoins] = useState<any[]>([]);
  const [price, setPrice] = useState<string | number>("");
  const [isFetching, setIsFetching] =
    useState<CoinContextType["isFetching"]>(true);

  const handleChangeCoinPrice = async (
    coinParam: string,
    price: string | number
  ) => {
    if (coin !== coinParam) {
      await getCoin();
      setCoin(coinParam);
      setPrice(price);
    }
  };

  const getCoin = async () => {
    try {
      setIsFetching(true);
      const result = await fetchCoin();
      setCoins(
        result.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          percent_change: coin.quote["USD"].percent_change_1h,
          price_in_usd: coin.quote["USD"].price,
        }))
      );
      if (!coin || !price) {
        setCoin(result.data[0].symbol);
        setPrice(result.data[0].quote["USD"].price);
      }
      setBtcPrice(result.data[0].quote["USD"].price);
    } catch (error) {
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getCoin();
  }, []);

  return (
    <CoinContext.Provider
      value={{
        coin,
        price,
        handleChangeCoinPrice,
        isFetching,
        coins,
        btcPrice,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
}

export function useCoin() {
  const context = useContext(CoinContext);

  if (context === undefined)
    throw new Error("useCoin must be used within a CoinProvider");

  return context;
}
