

export type CryptoData = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

export type CryptoMarketData = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
};

export type Transaction = {
  id: string;
  type: "Deposit" | "Withdrawal" | "Bonus";
  asset: string;
  amount: number;
  status: "Completed" | "Pending" | "Processing" | "Approved" | "Declined";
  date: string;
  address?: string; // Optional field for withdrawal address
};

export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    balance: number;
    joinDate: string;
    transactions?: Transaction[];
    phoneNumber?: string;
    country?: string;
    avatar?: string;
};

export type CryptoNewsArticle = {
  id: string;
  title: string;
  url: string;
  imageurl: string;
  body: string;
  tags: string;
  categories: string;
  published_on: number;
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
  source: string;
};
