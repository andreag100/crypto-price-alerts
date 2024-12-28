import { logDebug, logError } from '../utils/debug';
import { MAILGUN_CONFIG } from './config';
import { getPriceAlertTemplate } from './templates/priceAlert';

interface EmailResponse {
  success: boolean;
  error?: Error;
  messageId?: string;
}

export async function sendPriceAlert(
  to: string,
  cryptoSymbol: string,
  targetPrice: number,
  currentPrice: number,
  alertType: 'above' | 'below'
): Promise<EmailResponse> {
  logDebug('Mailgun', 'Preparing price alert email', {
    to,
    cryptoSymbol,
    targetPrice,
    currentPrice,
    alertType
  });

  const formData = new FormData();
  formData.append('from', `${MAILGUN_CONFIG.FROM_NAME} <${MAILGUN_CONFIG.FROM_EMAIL}>`);
  formData.append('to', to);
  formData.append('subject', `Price Alert: ${cryptoSymbol} is ${alertType} ${targetPrice}`);
  formData.append('html', getPriceAlertTemplate(cryptoSymbol, targetPrice, currentPrice, alertType));

  try {
    const response = await fetch(`${MAILGUN_CONFIG.API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${MAILGUN_CONFIG.API_KEY}`)}`,
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const result = await response.json();
    logDebug('Mailgun', 'Email sent successfully', result);
    return {
      success: true,
      messageId: result.id
    };
  } catch (error) {
    logError('Mailgun', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}
