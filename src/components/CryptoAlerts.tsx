import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus } from 'lucide-react';
import { Notification } from './Notification';

interface CryptoAlert {
  id: string;
  crypto_symbol: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export function CryptoAlerts() {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    crypto_symbol: '',
    target_price: '',
    alert_type: 'above' as const,
  });
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    show: false,
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from('crypto_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showNotification('Error fetching alerts', 'error');
    } else {
      setAlerts(data || []);
    }
  }

  function showNotification(message: string, type: 'success' | 'error') {
    setNotification({ message, type, show: true });
  }

  async function createAlert(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('crypto_alerts')
      .insert([{
        crypto_symbol: newAlert.crypto_symbol.toUpperCase(),
        target_price: parseFloat(newAlert.target_price),
        alert_type: newAlert.alert_type,
      }]);

    if (error) {
      showNotification('Error creating alert', 'error');
    } else {
      showNotification('Alert created successfully!', 'success');
      setNewAlert({
        crypto_symbol: '',
        target_price: '',
        alert_type: 'above',
      });
      fetchAlerts();
    }
  }

  async function toggleAlert(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('crypto_alerts')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      showNotification('Error toggling alert status', 'error');
    } else {
      showNotification(
        `Alert ${!isActive ? 'activated' : 'deactivated'} successfully!`,
        'success'
      );
      fetchAlerts();
    }
  }

  async function deleteAlert(id: string) {
    const { error } = await supabase
      .from('crypto_alerts')
      .delete()
      .eq('id', id);

    if (error) {
      showNotification('Error deleting alert', 'error');
    } else {
      showNotification('Alert deleted successfully!', 'success');
      fetchAlerts();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Crypto Price Alerts</h1>
      
      <form onSubmit={createAlert} className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Crypto Symbol (e.g., BTC)"
            value={newAlert.crypto_symbol}
            onChange={(e) => setNewAlert(prev => ({ ...prev, crypto_symbol: e.target.value }))}
            className="border rounded p-2"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Target Price"
            value={newAlert.target_price}
            onChange={(e) => setNewAlert(prev => ({ ...prev, target_price: e.target.value }))}
            className="border rounded p-2"
            required
          />
          <select
            value={newAlert.alert_type}
            onChange={(e) => setNewAlert(prev => ({ ...prev, alert_type: e.target.value as 'above' | 'below' }))}
            className="border rounded p-2"
          >
            <option value="above">Price Above</option>
            <option value="below">Price Below</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Alert
        </button>
      </form>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <span className="font-bold">{alert.crypto_symbol}</span>
              <span className="mx-2">→</span>
              <span>{alert.alert_type === 'above' ? '↑' : '↓'}</span>
              <span className="ml-2">${alert.target_price}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => toggleAlert(alert.id, alert.is_active)}
                className={`px-3 py-1 rounded ${
                  alert.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {alert.is_active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="bg-red-100 text-red-800 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}