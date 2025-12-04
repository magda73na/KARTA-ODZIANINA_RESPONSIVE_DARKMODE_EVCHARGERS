import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'karta-lodzianina-charging-history';

export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  duration: number; // minutes
  energy: number; // kWh
  cost: number; // PLN
  connectorType: string;
  power: number; // kW
}

export function useChargingHistory() {
  const [sessions, setSessions] = useState<ChargingSession[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((session: Omit<ChargingSession, 'id'>) => {
    const newSession: ChargingSession = {
      ...session,
      id: crypto.randomUUID(),
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  }, []);

  const removeSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
  }, []);

  const getTotalStats = useCallback(() => {
    return sessions.reduce(
      (acc, session) => ({
        totalCost: acc.totalCost + session.cost,
        totalEnergy: acc.totalEnergy + session.energy,
        totalDuration: acc.totalDuration + session.duration,
        totalSessions: acc.totalSessions + 1,
      }),
      { totalCost: 0, totalEnergy: 0, totalDuration: 0, totalSessions: 0 }
    );
  }, [sessions]);

  const getMonthlyStats = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
      })
      .reduce(
        (acc, session) => ({
          totalCost: acc.totalCost + session.cost,
          totalEnergy: acc.totalEnergy + session.energy,
          totalDuration: acc.totalDuration + session.duration,
          totalSessions: acc.totalSessions + 1,
        }),
        { totalCost: 0, totalEnergy: 0, totalDuration: 0, totalSessions: 0 }
      );
  }, [sessions]);

  return {
    sessions,
    addSession,
    removeSession,
    clearHistory,
    getTotalStats,
    getMonthlyStats,
    sessionsCount: sessions.length,
  };
}
