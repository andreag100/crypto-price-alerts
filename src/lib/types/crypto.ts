export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}
