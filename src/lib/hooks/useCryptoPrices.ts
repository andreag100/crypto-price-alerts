import { useState, useEffect } from 'react';
import { CryptoPrice, CoinGeckoPrice } from '../types/crypto';
import { fetchCryptoPrices } from '../api/coingecko';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function updatePrices() {
      const data = await fetchCryptoPrices();
      const formattedPrices: CryptoPrice[] = data.map((coin: CoinGeckoPrice) => ({
        symbol: coin.symbol,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
      }));
      setPrices(formattedPrices);
      setLoading(false);
    }

    updatePrices();
    const interval = setInterval(updatePrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { prices, loading };
}