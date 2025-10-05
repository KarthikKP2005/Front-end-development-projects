import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AQIData {
  value: number;
  level: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  majorPollutants: string[];
  timestamp: string;
}

export interface HistoricalData {
  date: string;
  aqi: number;
}

export interface CityData {
  name: string;
  country: string;
  currentAQI: AQIData;
  historicalData: HistoricalData[];
  coordinates: { lat: number; lon: number };
}

export interface GameScore {
  pollutantsCleared: number;
  totalPollutants: number;
  percentage: number;
  duration: number;
}

interface AppContextType {
  selectedCity: CityData | null;
  setSelectedCity: (city: CityData | null) => void;
  gameScore: GameScore | null;
  setGameScore: (score: GameScore | null) => void;
  searchCity: (cityName: string) => Promise<CityData>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);

  const searchCity = async (cityName: string): Promise<CityData> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockAQI = Math.floor(Math.random() * 300) + 1;
    const level = getAQILevel(mockAQI);
    const color = getAQIColor(mockAQI);

    return {
      name: cityName,
      country: 'Mock Country',
      currentAQI: {
        value: mockAQI,
        level,
        color,
        majorPollutants: ['PM2.5', 'NO₂', 'O₃'],
        timestamp: new Date().toISOString()
      },
      historicalData: generateHistoricalData(),
      coordinates: { lat: 0, lon: 0 }
    };
  };

  return (
    <AppContext.Provider value={{ selectedCity, setSelectedCity, gameScore, setGameScore, searchCity }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

function getAQILevel(aqi: number): AQIData['level'] {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy';
  if (aqi <= 200) return 'Very Unhealthy';
  return 'Hazardous';
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#fbbf24';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#a855f7';
}

function generateHistoricalData(): HistoricalData[] {
  const data: HistoricalData[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.floor(Math.random() * 200) + 20
    });
  }

  return data;
}
