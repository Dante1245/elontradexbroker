
import { NextResponse } from 'next/server';

const COIN_IDS = "bitcoin,ethereum,tether,ripple,cardano,solana,dogecoin";

export async function GET() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}`,
      {
        next: {
            revalidate: 60 // Revalidate every 60 seconds
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from CoinGecko: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Could not fetch market data." }, { status: 500 });
  }
}
