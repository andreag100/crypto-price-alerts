import React from 'react';
import { Plus } from 'lucide-react';

interface AlertFormProps {
  cryptoSymbol: string;
  targetPrice: string;
  alertType: 'above' | 'below';
  emailNotifications: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string | boolean) => void;
}

export function AlertForm({
  cryptoSymbol,
  targetPrice,
  alertType,
  emailNotifications,
  onSubmit,
  onChange
}: AlertFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8 bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Crypto Symbol (e.g., BTC)"
          value={cryptoSymbol}
          onChange={(e) => onChange('crypto_symbol', e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Target Price"
          value={targetPrice}
          onChange={(e) => onChange('target_price', e.target.value)}
          className="border rounded p-2"
          required
        />
        <select
          value={alertType}
          onChange={(e) => onChange('alert_type', e.target.value)}
          className="border rounded p-2"
        >
          <option value="above">Price Above</option>
          <option value="below">Price Below</option>
        </select>
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="emailNotifications"
          checked={emailNotifications}
          onChange={(e) => onChange('email_notifications', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="emailNotifications" className="text-sm text-gray-600">
          Send email notifications when price target is reached
        </label>
      </div>
      <button
        type="submit"
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Alert
      </button>
    </form>
  );
}
