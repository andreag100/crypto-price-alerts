import { logDebug, logError } from '../utils/debug';

const API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export async function sendPriceAlert(
  to: string,
  cryptoSymbol: string,
  targetPrice: number,
  currentPrice: number,
  alertType: 'above' | 'below'
) {
  logDebug('Brevo', 'Sending price alert email', {
    to,
    cryptoSymbol,
    targetPrice,
    currentPrice,
    alertType
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "Crypto Price Alerts",
          email: "alerts@cryptopricealerts.online"
        },
        to: [{ email: to }],
        subject: `Price Alert: ${cryptoSymbol} is ${alertType} ${targetPrice}`,
        htmlContent: `
          <h2>Crypto Price Alert</h2>
          <p>Your price alert for ${cryptoSymbol} has been triggered!</p>
          <p>
            Target Price: $${targetPrice}<br>
            Current Price: $${currentPrice}<br>
            Alert Type: Price went ${alertType} target
          </p>
          <p>
            Visit <a href="https://cryptopricealerts.online">Crypto Price Alerts</a> to manage your alerts.
          </p>
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const result = await response.json();
    logDebug('Brevo', 'Email sent successfully', result);
    return { success: true };
  } catch (error) {
    logError('Brevo', error);
    return { success: false, error };
  }
}
