"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface IOrderBook {
  buy: {
    [key: string]: number | string;
  }[];
  sell: {
    [key: string]: number | string;
  }[];
}

interface OrderBookContextType {
  orderBook: IOrderBook;
  saveOrderBook: (type: string, data: any) => void;
}

const OrderBookContext = createContext<OrderBookContextType | undefined>(
  undefined
);

export function OrderBookProvider({ children }: { children: React.ReactNode }) {
  const [orderBook, setOrderBook] = useState<IOrderBook>({
    buy: [],
    sell: [],
  });

  const saveOrderBook = (type: string, data: any) => {
    if (type === "buy") {
      setOrderBook((prevData) => ({
        ...prevData,
        buy: [...prevData.buy, data],
      }));
    } else {
      setOrderBook((prevData) => ({
        ...prevData,
        sell: [...prevData.sell, data],
      }));
    }
  };

  return (
    <OrderBookContext.Provider value={{ orderBook, saveOrderBook }}>
      {children}
    </OrderBookContext.Provider>
  );
}

export function useOrderBook() {
  const context = useContext(OrderBookContext);

  if (context === undefined)
    throw new Error("useOrderBook must be used within a OrderBookProvider");

  return context;
}
