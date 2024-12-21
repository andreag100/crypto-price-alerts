import React, { useEffect, useState } from 'react';
import { AlertForm } from './alerts/AlertForm';
import { AlertList } from './alerts/AlertList';
import { Notification } from './Notification';
import { useNotification } from '../lib/hooks/useNotification';
import { CryptoAlert, fetchAlerts, createAlert, toggleAlert, deleteAlert } from '../lib/api/alerts';

export function CryptoAlerts() {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    crypto_symbol: '',
    target_price: '',
    alert_type: 'above' as const,
  });
  
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    const { data, error } = await fetchAlerts();
    if (error) {
      showNotification('Error fetching alerts', 'error');
    } else {
      setAlerts(data || []);
    }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await createAlert({
      crypto_symbol: newAlert.crypto_symbol.toUpperCase(),
      target_price: parseFloat(newAlert.target_price),
      alert_type: newAlert.alert_type,
    });

    if (error) {
      showNotification(error.message || 'Error creating alert', 'error');
    } else {
      showNotification('Alert created successfully!', 'success');
      setNewAlert({
        crypto_symbol: '',
        target_price: '',
        alert_type: 'above',
      });
      loadAlerts();
    }
  }

  async function handleToggleAlert(id: string, isActive: boolean) {
    const { error } = await toggleAlert(id, isActive);

    if (error) {
      showNotification('Error toggling alert status', 'error');
    } else {
      showNotification(
        `Alert ${!isActive ? 'activated' : 'deactivated'} successfully!`,
        'success'
      );
      loadAlerts();
    }
  }

  async function handleDeleteAlert(id: string) {
    const { error } = await deleteAlert(id);

    if (error) {
      showNotification('Error deleting alert', 'error');
    } else {
      showNotification('Alert deleted successfully!', 'success');
      loadAlerts();
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setNewAlert(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Crypto Price Alerts</h1>
      
      <AlertForm
        cryptoSymbol={newAlert.crypto_symbol}
        targetPrice={newAlert.target_price}
        alertType={newAlert.alert_type}
        onSubmit={handleCreateAlert}
        onChange={handleFormChange}
      />

      <AlertList
        alerts={alerts}
        onToggle={handleToggleAlert}
        onDelete={handleDeleteAlert}
      />
    </div>
  );
}