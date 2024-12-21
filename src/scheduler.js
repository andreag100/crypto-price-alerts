const cron = require('node-cron');
const fetchCryptoPrices = require('./fetchCryptoPrices');
const checkPriceAlerts = require('./checkPriceAlerts');

cron.schedule('*/5 * * * *', async () => {
  const prices = await fetchCryptoPrices();
  if (prices) {
    checkPriceAlerts(prices);
  }
});