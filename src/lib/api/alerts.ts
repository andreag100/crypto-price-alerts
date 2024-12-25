import { supabase } from '../supabase';
import { logDebug, logError } from '../utils/debug';

export interface CryptoAlert {
  id: string;
  crypto_symbol: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
  email_notifications: boolean;
}

export async function fetchAlerts() {
  logDebug('Alerts', 'Fetching alerts');
  const response = await supabase
    .from('crypto_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (response.error) {
    logError('Alerts', response.error);
  }
  return response;
}

export async function createAlert(alert: Omit<CryptoAlert, 'id' | 'is_active'>) {
  logDebug('Alerts', 'Creating alert', alert);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const error = new Error('User not authenticated');
    logError('Alerts', error);
    return { error };
  }

  const response = await supabase
    .from('crypto_alerts')
    .insert([{
      ...alert,
      user_id: user.id
    }]);

  if (response.error) {
    logError('Alerts', response.error);
  }
  return response;
}

export async function toggleAlert(id: string, isActive: boolean) {
  logDebug('Alerts', `Toggling alert ${id} to ${!isActive}`);

  const response = await supabase
    .from('crypto_alerts')
    .update({ is_active: !isActive })
    .eq('id', id);

  if (response.error) {
    logError('Alerts', response.error);
  }
  return response;
}

export async function deleteAlert(id: string) {
  logDebug('Alerts', `Deleting alert ${id}`);

  const response = await supabase
    .from('crypto_alerts')
    .delete()
    .eq('id', id);

  if (response.error) {
    logError('Alerts', response.error);
  }
  return response;
}
