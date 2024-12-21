const { createClient } = require('@supabase/supabase-js');

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sendAlertEmail = require('./sendAlertEmail');

async function checkPriceAlerts(prices) {
  const { data: alerts, error } = await supabase
    .from('price_alerts')
    .select('*');

  if (error) {
    console.error('Error fetching alerts:', error);
    return;
  }

  alerts.forEach(alert => {
    const currentPrice = prices[alert.crypto_id][alert.currency.toLowerCase()];
    if ((alert.condition === 'above' && currentPrice > alert.price) ||
        (alert.condition === 'below' && currentPrice < alert.price)) {
      sendAlertEmail(alert, currentPrice);
    }
  });
}

module.exports = checkPriceAlerts;