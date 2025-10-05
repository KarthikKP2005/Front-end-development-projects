import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TreePine, Wind as WindIcon, Sun, Zap, CloudRain } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'PM2.5' | 'NO₂' | 'O₃' | 'SO₂';
  size: number;
  speed: number;
  health: number;
}

interface Solution {
  id: string;
  name: string;
  icon: React.ReactNode;
  targets: string[];
}

interface PowerUp {
  id: number;
  type: 'rain' | 'wind';
  x: number;
  y: number;
}

const GamePage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { selectedCity, setGameScore } = useAppContext();

  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [showTooltip, setShowTooltip] = useState<{ particleId: number; info: string } | null>(null);
  const [gameActive, setGameActive] = useState(true);

  const solutions: Solution[] = [
    { id: 'tree', name: 'Plant Trees', icon: <TreePine size={24} />, targets: ['PM2.5', 'O₃'] },
    { id: 'wind', name: 'Wind Energy', icon: <WindIcon size={24} />, targets: ['NO₂', 'SO₂'] },
    { id: 'solar', name: 'Solar Panels', icon: <Sun size={24} />, targets: ['NO₂', 'SO₂'] }
  ];

  const difficulty = selectedCity ? Math.floor(selectedCity.currentAQI.value / 50) + 1 : 1;
  const spawnRate = Math.max(500 - (difficulty * 100), 200);

  const getParticleInfo = (type: string): string => {
    const info: { [key: string]: string } = {
      'PM2.5': 'Fine particulate matter from vehicles and industry',
      'NO₂': 'Nitrogen dioxide from traffic and power plants',
      'O₃': 'Ground-level ozone from sunlight reactions',
      'SO₂': 'Sulfur dioxide from coal combustion'
    };
    return info[type] || 'Pollutant particle';
  };

  const spawnParticle = useCallback(() => {
    if (!gameActive) return;

    const types: Array<'PM2.5' | 'NO₂' | 'O₃' | 'SO₂'> = ['PM2.5', 'NO₂', 'O₃', 'SO₂'];
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: Math.random() * 90 + 5,
      y: -10,
      type: types[Math.floor(Math.random() * types.length)],
      size: Math.random() * 20 + 30,
      speed: Math.random() * 0.5 + 0.3 + (difficulty * 0.1),
      health: 100
    };

    setParticles(prev => [...prev, newParticle]);
    setTotalSpawned(prev => prev + 1);
  }, [difficulty, gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(spawnParticle, spawnRate);
    return () => clearInterval(spawnInterval);
  }, [spawnParticle, spawnRate, gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.speed
      })).filter(p => p.y < 110));
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const powerUpInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newPowerUp: PowerUp = {
          id: Date.now(),
          type: Math.random() < 0.5 ? 'rain' : 'wind',
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        };
        setPowerUps(prev => [...prev, newPowerUp]);
      }
    }, 8000);

    return () => clearInterval(powerUpInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive && timeLeft === 0) {
      const clearedPercentage = totalSpawned > 0 ? Math.round((score / totalSpawned) * 100) : 0;
      setGameScore({
        pollutantsCleared: score,
        totalPollutants: totalSpawned,
        percentage: clearedPercentage,
        duration: 60
      });

      setTimeout(() => {
        navigate(`/score/${cityName}`);
      }, 1000);
    }
  }, [gameActive, timeLeft, score, totalSpawned, setGameScore, navigate, cityName]);

  const handleParticleClick = (particle: Particle) => {
    if (!selectedSolution) {
      setShowTooltip({ particleId: particle.id, info: getParticleInfo(particle.type) });
      setTimeout(() => setShowTooltip(null), 2000);
      return;
    }

    const isCorrect = selectedSolution.targets.includes(particle.type);

    if (isCorrect) {
      setParticles(prev => prev.map(p => {
        if (p.id === particle.id) {
          const newHealth = p.health - 50;
          if (newHealth <= 0) {
            setScore(s => s + 1);
            return { ...p, health: 0 };
          }
          return { ...p, health: newHealth, size: p.size * 0.7 };
        }
        return p;
      }).filter(p => p.health > 0));
    } else {
      const duplicated = { ...particle, id: Date.now() + Math.random(), x: particle.x + 10 };
      setParticles(prev => [...prev, duplicated]);
      setTotalSpawned(prev => prev + 1);
    }
  };

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (powerUp.type === 'rain') {
      setParticles(prev => prev.filter(() => Math.random() > 0.5));
      const cleared = Math.floor(particles.length / 2);
      setScore(s => s + cleared);
    } else if (powerUp.type === 'wind') {
      setParticles(prev => prev.map(p => ({ ...p, x: p.x + 30 })));
    }

    setPowerUps(prev => prev.filter(pu => pu.id !== powerUp.id));
  };

  const getParticleColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'PM2.5': '#78716c',
      'NO₂': '#dc2626',
      'O₃': '#6366f1',
      'SO₂': '#fbbf24'
    };
    return colors[type] || '#9ca3af';
  };

  if (!selectedCity) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600 to-green-400">
        <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" fill="#16a34a" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div className="text-3xl font-bold">
            Score: {score}/{totalSpawned}
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{cityName}</div>
            <div className="text-sm">AQI: {selectedCity.currentAQI.value}</div>
          </div>
          <div className="text-3xl font-bold">
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-0 right-0 p-6 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Select Solution:</h3>
            <div className="flex gap-4 justify-center">
              {solutions.map(solution => (
                <button
                  key={solution.id}
                  onClick={() => setSelectedSolution(solution)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all transform hover:scale-105 ${
                    selectedSolution?.id === solution.id
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {solution.icon}
                  <span className="text-sm font-semibold">{solution.name}</span>
                  <span className="text-xs opacity-75">
                    {solution.targets.join(', ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          onClick={() => handleParticleClick(particle)}
          className="absolute rounded-full cursor-pointer transition-all hover:scale-110 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: getParticleColor(particle.type),
            opacity: particle.health / 100,
            filter: 'blur(2px)',
            boxShadow: `0 0 20px ${getParticleColor(particle.type)}`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {particle.type}
          </div>
        </div>
      ))}

      {powerUps.map(powerUp => (
        <div
          key={powerUp.id}
          onClick={() => handlePowerUpClick(powerUp)}
          className="absolute cursor-pointer transition-all hover:scale-110 bg-white rounded-full p-4 shadow-2xl animate-bounce"
          style={{
            left: `${powerUp.x}%`,
            top: `${powerUp.y}%`,
            zIndex: 15
          }}
        >
          {powerUp.type === 'rain' ? (
            <CloudRain size={32} className="text-blue-500" />
          ) : (
            <Zap size={32} className="text-yellow-500" />
          )}
        </div>
      ))}

      {showTooltip && (
        <div
          className="absolute bg-black/80 text-white px-4 py-2 rounded-lg text-sm z-30 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {showTooltip.info}
        </div>
      )}

      {!gameActive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-3xl p-12 text-center max-w-md">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Time's Up!</h2>
            <p className="text-xl text-gray-600">Calculating your score...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
