"use client";

import { useCoin } from "@/context/CoinProvider";
import { useOrderBook } from "@/context/OrderBookProvider";
import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  type: string;
}

const TableOrder = ({ title, type }: Props) => {
  const { orderBook } = useOrderBook();
  const { coin } = useCoin();
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
    const filterOrderBook =
      type === "mBuy"
        ? orderBook.buy.filter((item) => item.symbol === coin)
        : orderBook.sell.filter((item) => item.symbol === coin);

    setMarketData(filterOrderBook);
  }, [orderBook.buy, orderBook.sell, coin]);
  return (
    <div>
      <h2 className="font-semibold text-lg text-gray-600">{title}</h2>
      <div className="table-container mt-3">
        <table>
          <thead>
            <tr>
              <th>Harga (USD)</th>
              <th>{coin}</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {marketData.length > 0 ? (
              marketData.map((item, idx) => (
                <tr key={item.idx}>
                  <td>{Number(item.price).toFixed(2)}</td>
                  <td>{Number(item.sumCoin).toFixed(2)}</td>
                  <td>{Number(item.sumPrice).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center p-10" colSpan={3}>
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOrder;
