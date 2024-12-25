import { TransactionalEmailsApi, SendSmtpEmail } from '@brevo/node';
import { logDebug, logError } from '../utils/debug';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new TransactionalEmailsApi();

if (!BREVO_API_KEY) {
  logError('Brevo', 'Missing BREVO_API_KEY environment variable');
} else {
  apiInstance.setApiKey(TransactionalEmailsApi.ApiKeysEnum.apiKey, BREVO_API_KEY);
}

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

  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = `Price Alert: ${cryptoSymbol} is ${alertType} ${targetPrice}`;
  sendSmtpEmail.htmlContent = `
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
  `;
  sendSmtpEmail.sender = { name: "Crypto Price Alerts", email: "alerts@cryptopricealerts.online" };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    logDebug('Brevo', 'Email sent successfully', response);
    return { success: true };
  } catch (error) {
    logError('Brevo', error);
    return { success: false, error };
  }
}
