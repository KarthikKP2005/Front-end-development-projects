import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import LandingPage from '@/components/LandingPage';
import CityPage from '@/components/CityPage';
import GamePage from '@/components/GamePage';
import ScorePage from '@/components/ScorePage';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/city/:cityName" element={<CityPage />} />
        <Route path="/game/:cityName" element={<GamePage />} />
        <Route path="/score/:cityName" element={<ScorePage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
