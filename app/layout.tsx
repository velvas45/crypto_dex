import type { Metadata } from "next";
import { Inter, Agbalumo } from "next/font/google";
import "./globals.css";
import { CoinProvider } from "@/context/CoinProvider";
import { OrderBookProvider } from "@/context/OrderBookProvider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });
const agbalumo = Agbalumo({ weight: ["400"], subsets: ["cyrillic-ext"] });

export const metadata: Metadata = {
  title: "Crypto Dex",
  description:
    "Explore the exciting world of cryptocurrency trading with our user-friendly and feature-rich Crypto Trading Application. Stay updated on market trends, execute trades seamlessly, and manage your portfolio with ease. Start your journey into the crypto market today!",
  keywords:
    "crypto trading, cryptocurrency, bitcoin, ethereum, trading platform, digital assets",
  authors: [{ name: "Helmi", url: "https://github.com/velvas45" }],
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <script src="charting_library/charting_library.standalone.js"></script> */}
      </head>
      <body className={`${inter.className}${agbalumo.className}`}>
        <CoinProvider>
          <OrderBookProvider>
            <main className="min-h-screen w-full overflow-x-auto">
              <Navbar />
              {children}
            </main>
          </OrderBookProvider>
        </CoinProvider>
      </body>
    </html>
  );
}
