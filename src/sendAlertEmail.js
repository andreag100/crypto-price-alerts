const brevo = require('brevo');

async function sendAlertEmail(alert, currentPrice) {
  const emailParams = {
    to: alert.email,
    subject: `Price Alert: ${alert.crypto_id} is ${alert.condition} ${alert.price}`,
    text: `The current price of ${alert.crypto_id} is ${currentPrice} ${alert.currency}.`,
  };

  try {
    await brevo.sendEmail(emailParams);
    console.log('Alert email sent successfully');
  } catch (error) {
    console.error('Error sending alert email:', error);
  }
}

module.exports = sendAlertEmail;