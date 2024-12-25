export const DEBUG = import.meta.env.MODE === 'development';

export function logDebug(component: string, message: string, data?: any) {
  if (DEBUG) {
    console.log(`[${component}]`, message, data || '');
  }
}

// Also log in production for critical errors
export function logError(component: string, error: any) {
  console.error(`[${component}]`, error);
}
