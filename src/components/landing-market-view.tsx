import { MarketTable } from "./market-table";

export function LandingMarketView() {
  return (
    <section id="market" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Live Market Data
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Stay ahead of the curve with real-time price information for the top crypto assets.
          </p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-2 md:p-6">
            <MarketTable />
        </div>
      </div>
    </section>
  );
}
