"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderInput from "@/components/shared/order-input";
import TableOrder from "@/components/shared/table-order";
import { useCoin } from "@/context/CoinProvider";
import { Skeleton } from "./ui/skeleton";

const OrderBookSection = () => {
  const { isFetching } = useCoin();
  return (
    <>
      {isFetching ? (
        <div>
          <Skeleton className="w-1/3 h-10" />
          <div className="flex flex-col space-y-4 mt-6 w-1/2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="w-40 h-10 self-end" />
          </div>
        </div>
      ) : (
        <Tabs defaultValue="order_buy">
          <TabsList>
            <TabsTrigger value="order_buy">Order Buy</TabsTrigger>
            <TabsTrigger value="order_sell">Order Sell</TabsTrigger>
            <TabsTrigger value="market_buy">M Buy</TabsTrigger>
            <TabsTrigger value="market_sell">M Sell</TabsTrigger>
          </TabsList>
          <TabsContent className="p-3 w-full md:w-1/2" value="order_buy">
            <OrderInput type="buy" />
          </TabsContent>
          <TabsContent className="p-3 w-full md:w-1/2" value="order_sell">
            <OrderInput type="sell" />
          </TabsContent>
          <TabsContent className="p-3 w-full md:w-2/3" value="market_buy">
            <TableOrder title="Market Buy" type="mBuy" />
          </TabsContent>
          <TabsContent className="p-3 w-full md:w-2/3" value="market_sell">
            <TableOrder title="Market Sell" type="mSell" />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default OrderBookSection;
