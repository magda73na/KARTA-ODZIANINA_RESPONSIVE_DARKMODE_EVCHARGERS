import { useState, useEffect, useCallback } from 'react';

const NOTIFICATIONS_KEY = 'ev-lodz-notifications';

export interface StationSubscription {
  stationId: string;
  stationName: string;
  subscribedAt: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscriptions, setSubscriptions] = useState<StationSubscription[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const subscribe = useCallback(async (stationId: string, stationName: string) => {
    let currentPermission = permission;
    
    if (currentPermission === 'default') {
      currentPermission = await requestPermission();
    }

    if (currentPermission !== 'granted') {
      return false;
    }

    setSubscriptions(prev => {
      if (prev.some(s => s.stationId === stationId)) return prev;
      return [...prev, {
        stationId,
        stationName,
        subscribedAt: new Date().toISOString(),
      }];
    });

    // Show confirmation notification
    new Notification('Subskrypcja aktywna', {
      body: `Otrzymasz powiadomienie gdy ${stationName} będzie dostępna`,
      icon: '/favicon.ico',
    });

    return true;
  }, [permission, requestPermission]);

  const unsubscribe = useCallback((stationId: string) => {
    setSubscriptions(prev => prev.filter(s => s.stationId !== stationId));
  }, []);

  const isSubscribed = useCallback((stationId: string) => {
    return subscriptions.some(s => s.stationId === stationId);
  }, [subscriptions]);

  const sendNotification = useCallback((title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, [permission]);

  return {
    permission,
    subscriptions,
    requestPermission,
    subscribe,
    unsubscribe,
    isSubscribed,
    sendNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}
