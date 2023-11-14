"use client";

import { useState, useEffect } from "react";
import { useCoin } from "@/context/CoinProvider";
import { fetchCoin } from "@/services/coin";
import { Input } from "../ui/input";
import { SyncLoader } from "react-spinners";

interface Props {
  title: string;
}

const TableCoinListing = ({ title }: Props) => {
  const { handleChangeCoinPrice, coins, isFetching } = useCoin();
  const setCoin = (symbol: string, price: string | number) => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    handleChangeCoinPrice(symbol, price);
  };

  return (
    <>
      <h2 className="font-semibold text-lg text-gray-600">{title}</h2>
      <div className="table-container-coin mt-3">
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Price (USD)</th>
              <th>%Change</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={3}>
                  <div className="w-full mx-auto p-2">
                    <SyncLoader color="#b0a04a" size={16} />
                  </div>
                </td>
              </tr>
            ) : coins.length > 0 ? (
              coins.map((item) => (
                <tr
                  className="cursor-pointer"
                  key={item.id}
                  onClick={() => setCoin(item.symbol, item.price_in_usd)}
                >
                  <td className="font-medium text-sm">{item.symbol}</td>
                  <td className="font-medium text-sm">
                    {Number(item.price_in_usd).toFixed(2)}
                  </td>
                  <td
                    className={`font-medium text-sm ${
                      item.percent_change.toString().includes("-")
                        ? "text-red-400"
                        : "text-green-500"
                    }`}
                  >
                    {item.percent_change.toString().includes("-")
                      ? Number(item.percent_change).toFixed(3)
                      : Number(item.percent_change) === 0
                      ? Number(item.percent_change)
                      : `+${Number(item.percent_change).toFixed(3)}`}
                  </td>
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
    </>
  );
};

export default TableCoinListing;
