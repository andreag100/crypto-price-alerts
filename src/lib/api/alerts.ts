import { supabase } from '../supabase';

export interface CryptoAlert {
  id: string;
  crypto_symbol: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
}

export async function fetchAlerts() {
  return await supabase
    .from('crypto_alerts')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createAlert(alert: Omit<CryptoAlert, 'id' | 'is_active'>) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error('User not authenticated') };
  }

  return await supabase
    .from('crypto_alerts')
    .insert([{
      ...alert,
      user_id: user.id
    }]);
}

export async function toggleAlert(id: string, isActive: boolean) {
  return await supabase
    .from('crypto_alerts')
    .update({ is_active: !isActive })
    .eq('id', id);
}

export async function deleteAlert(id: string) {
  return await supabase
    .from('crypto_alerts')
    .delete()
    .eq('id', id);
}
