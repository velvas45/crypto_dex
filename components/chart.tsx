"use client";
import { useEffect, useState } from "react";
import { createWidget } from "@/utils/widget";
import { useCoin } from "@/context/CoinProvider";

const Chart = () => {
  const { coin } = useCoin();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    // script.src =
    //   "https://charting-library.tradingview-widget.com/charting_library/charting_library.standalone.js";
    script.async = true;
    script.onload = () => createWidget("tv_chart_container", `${coin}USD`);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [coin]);

  return (
    <>
      <div id="tv_chart_container" className="h-screen py-4"></div>
    </>
  );
};

export default Chart;
