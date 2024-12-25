import { useState, useEffect } from 'react';
import { CryptoPrice, CoinGeckoPrice } from '../types/crypto';
import { fetchCryptoPrices } from '../api/coingecko';
import { checkPriceAlerts } from '../services/priceMonitor';
import { logDebug } from '../utils/debug';

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

      // Create price map for alert checking
      const priceMap = formattedPrices.reduce((acc, coin) => ({
        ...acc,
        [coin.symbol]: coin.price
      }), {});

      logDebug('CryptoPrices', 'Checking alerts with prices', priceMap);
      await checkPriceAlerts(priceMap);
    }

    updatePrices();
    const interval = setInterval(updatePrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { prices, loading };
}
