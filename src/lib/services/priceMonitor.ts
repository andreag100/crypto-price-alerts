import { logDebug, logError } from '../utils/debug';
import { CryptoAlert } from '../api/alerts';
import { sendPriceAlert } from '../email/mailgun';
import { supabase } from '../supabase';

export async function checkPriceAlerts(prices: Record<string, number>) {
  logDebug('PriceMonitor', 'Checking price alerts', prices);

  try {
    // Get user and alerts
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logError('PriceMonitor', 'No authenticated user');
      return;
    }

    const { data: alerts, error } = await supabase
      .from('crypto_alerts')
      .select('*, users:user_id(email)')
      .eq('is_active', true)
      .eq('user_id', user.id);

    if (error) {
      logError('PriceMonitor', error);
      return;
    }

    // Check each alert
    for (const alert of alerts) {
      const currentPrice = prices[alert.crypto_symbol.toLowerCase()];
      if (!currentPrice) continue;

      const shouldTrigger = alert.alert_type === 'above'
        ? currentPrice >= alert.target_price
        : currentPrice <= alert.target_price;

      if (shouldTrigger) {
        logDebug('PriceMonitor', 'Alert triggered', {
          symbol: alert.crypto_symbol,
          target: alert.target_price,
          current: currentPrice
        });

        // Send email if enabled
        if (alert.email_notifications) {
          const userEmail = alert.users?.email;
          if (!userEmail) {
            logError('PriceMonitor', 'No user email found');
            continue;
          }

          const result = await sendPriceAlert(
            userEmail,
            alert.crypto_symbol,
            alert.target_price,
            currentPrice,
            alert.alert_type
          );

          logDebug('PriceMonitor', 'Email send result', result);
        }

        // Deactivate the alert
        await supabase
          .from('crypto_alerts')
          .update({ is_active: false })
          .eq('id', alert.id);
      }
    }
  } catch (error) {
    logError('PriceMonitor', error);
  }
}
