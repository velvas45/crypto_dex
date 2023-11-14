import Chart from "@/components/chart";
import OrderBookSection from "@/components/order-book-section";
import TableCoinListing from "@/components/shared/table-coin-listing";

export default async function Home() {
  return (
    <main className="flex flex-col space-y-4 pt-2">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-2">
        <div className="basis-2/3 h-screen">
          <Chart />
        </div>
        <div className="basis-1/3 h-screen">
          <div className="w-full">
            <TableCoinListing title="Listing Coins" />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-2 pb-10 pt-4">
        <OrderBookSection />
      </div>
    </main>
  );
}
