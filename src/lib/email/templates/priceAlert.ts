export function getPriceAlertTemplate(
  cryptoSymbol: string,
  targetPrice: number,
  currentPrice: number,
  alertType: 'above' | 'below'
) {
  return `
    <h2>Crypto Price Alert</h2>
    <p>Your price alert for ${cryptoSymbol} has been triggered!</p>
    <p>
      Target Price: $${targetPrice.toFixed(2)}<br>
      Current Price: $${currentPrice.toFixed(2)}<br>
      Alert Type: Price went ${alertType} target
    </p>
    <p>
      Visit <a href="https://cryptopricealerts.online">Crypto Price Alerts</a> to manage your alerts.
    </p>
  `;
}
