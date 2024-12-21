import React from 'react';

interface Alert {
  id: string;
  crypto_symbol: string;
  target_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
}

interface AlertListProps {
  alerts: Alert[];
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export function AlertList({ alerts, onToggle, onDelete }: AlertListProps) {
  return (
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
              onClick={() => onToggle(alert.id, alert.is_active)}
              className={`px-3 py-1 rounded ${
                alert.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {alert.is_active ? 'Active' : 'Inactive'}
            </button>
            <button
              onClick={() => onDelete(alert.id)}
              className="bg-red-100 text-red-800 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}