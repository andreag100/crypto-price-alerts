import { useState } from 'react';

export interface NotificationState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    show: false,
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
}