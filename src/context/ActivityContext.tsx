import React, { createContext, useState, useCallback, ReactNode } from 'react';

type Activity = {
  id: string;
  message: string;
  timestamp: Date;
};

type ActivityContextType = {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
};

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...activity,
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const clearActivities = useCallback(() => setActivities([]), []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};
