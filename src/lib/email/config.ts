export const MAILGUN_CONFIG = {
  API_URL: `https://api.mailgun.net/v3/${import.meta.env.VITE_MAILGUN_DOMAIN}`,
  API_KEY: import.meta.env.VITE_MAILGUN_API_KEY,
  FROM_EMAIL: `alerts@${import.meta.env.VITE_MAILGUN_DOMAIN}`,
  FROM_NAME: 'Crypto Price Alerts'
};
