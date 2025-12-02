import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserStats {
  coins: number;
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  name: string;
  avatar: string; // URL
}

interface GamificationContextType {
  stats: UserStats;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  buyItem: (cost: number) => boolean;
}

// Mock initial data
const initialStats: UserStats = {
  coins: 1250,
  streak: 5,
  level: 4,
  xp: 350,
  xpToNextLevel: 1000,
  name: "Alex Student",
  avatar: "", // Will be set to the generated asset in the component if empty
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(initialStats);

  // Load from local storage if available (mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('levelup_stats');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('levelup_stats', JSON.stringify(stats));
  }, [stats]);

  const addCoins = (amount: number) => {
    setStats(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const addXp = (amount: number) => {
    setStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;

      if (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.2);
        // Level up logic (could trigger a modal here)
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext
      };
    });
  };

  const incrementStreak = () => {
    setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const buyItem = (cost: number) => {
    if (stats.coins >= cost) {
      setStats(prev => ({ ...prev, coins: prev.coins - cost }));
      return true;
    }
    return false;
  };

  return (
    <GamificationContext.Provider value={{ stats, addCoins, addXp, incrementStreak, buyItem }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
