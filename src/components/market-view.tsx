"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketTable } from "./market-table";


export function MarketView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>
          Live prices and 24-hour change for top cryptocurrencies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MarketTable />
      </CardContent>
    </Card>
  );
}
