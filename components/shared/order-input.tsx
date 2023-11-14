"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useCoin } from "@/context/CoinProvider";
import { Button } from "@/components/ui/button";
import { useOrderBook } from "@/context/OrderBookProvider";

const OrderInput = ({ type }: { type: string }) => {
  const { coin, price } = useCoin();
  const { saveOrderBook } = useOrderBook();
  const [currPrice, setCurrentPrice] = useState(price);
  const [currSum, setCurrSum] = useState<number>(0);

  const onBtnSubmit = () => {
    saveOrderBook(type, {
      price,
      sumCoin: currSum,
      sumPrice: currPrice,
      symbol: coin,
    });
  };

  const validationNumberAndDotInput = (value: string) =>
    value
      .replace(/[^\d.]/g, "") // Allow only digits and dots
      .replace(/(\..*)\./g, "$1"); // Remove extra dots

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric values with at most one dot
    e.target.value = validationNumberAndDotInput(e.target.value);

    setCurrentPrice(+e.target.value);
  };

  const handleJumlahChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric values with at most one dot
    e.target.value = validationNumberAndDotInput(e.target.value);

    setCurrSum(Number(e.target.value));
    const sumPriceEst = +e.target.value * +price;
    setCurrentPrice(sumPriceEst);
  };

  useEffect(() => {
    setCurrentPrice(price);
  }, [price]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="py-1 px-4 bg-gray-100 border-none flex items-center space-x-2 rounded-lg">
        <span className="text-sm font-medium text-slate-600">Harga</span>
        <Input
          type="text"
          className="bg-transparent border-none rounded-lg focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none p-2 ring-offset-0 focus-visible:ring-offset-0 text-right"
          onChange={handleInputChange}
          value={currPrice}
        />
        <span className="text-sm font-semibold text-slate-600">USD</span>
      </div>
      <div className="py-1 px-4 bg-gray-100 border-none flex items-center space-x-2 rounded-lg">
        <span className="text-sm font-medium text-slate-600">Jumlah</span>
        <Input
          type="text"
          className="bg-transparent border-none rounded-lg focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none p-2 ring-offset-0 focus-visible:ring-offset-0 text-right"
          onChange={handleJumlahChange}
          value={currSum}
        />
        <span className="text-sm font-semibold text-slate-600">{coin}</span>
      </div>
      <Button
        className="w-40 bg-sky-500 hover:bg-sky-700 self-end"
        onClick={onBtnSubmit}
      >
        {type === "buy" ? "Buy" : "Sell"}
      </Button>
    </div>
  );
};

export default OrderInput;
