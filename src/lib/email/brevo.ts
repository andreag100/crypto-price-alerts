import { TransactionalEmailsApi, SendSmtpEmail } from '@brevo/node';

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApi.ApiKeysEnum.apiKey, import.meta.env.VITE_BREVO_API_KEY);

export async function sendPriceAlert(
  to: string,
  cryptoSymbol: string,
  targetPrice: number,
  currentPrice: number,
  alertType: 'above' | 'below'
) {
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
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
