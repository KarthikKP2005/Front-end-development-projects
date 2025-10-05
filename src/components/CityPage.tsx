import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wind, Droplets, Sun, Factory, ArrowLeft, Play } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const CityPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, searchCity } = useAppContext();
  const [timelineIndex, setTimelineIndex] = useState(30);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: string; opacity: number }>>([]);

  useEffect(() => {
    if (!selectedCity && cityName) {
      searchCity(cityName).then(data => setSelectedCity(data));
    }
  }, [cityName, selectedCity, searchCity, setSelectedCity]);

  useEffect(() => {
    if (!selectedCity) return;

    const particleCount = Math.floor((selectedCity.currentAQI.value / 50) * 20) + 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: selectedCity.currentAQI.majorPollutants[i % selectedCity.currentAQI.majorPollutants.length],
      opacity: Math.random() * 0.3 + 0.3
    }));
    setParticles(newParticles);
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + 0.2) % 100,
        x: p.x + (Math.random() - 0.5) * 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!selectedCity) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading city data...</div>
      </div>
    );
  }

  const currentHistoricalData = selectedCity.historicalData[timelineIndex];
  const displayAQI = currentHistoricalData ? currentHistoricalData.aqi : selectedCity.currentAQI.value;

  const getPollutantInfo = (pollutant: string) => {
    const info: { [key: string]: { icon: React.ReactNode; source: string } } = {
      'PM2.5': { icon: <Factory size={16} />, source: 'Vehicles, industry, combustion' },
      'NO₂': { icon: <Wind size={16} />, source: 'Traffic, power plants' },
      'O₃': { icon: <Sun size={16} />, source: 'Sunlight + pollutants reaction' },
      'SO₂': { icon: <Factory size={16} />, source: 'Coal burning, industry' },
      'CO': { icon: <Wind size={16} />, source: 'Incomplete combustion' }
    };
    return info[pollutant] || { icon: <Droplets size={16} />, source: 'Various sources' };
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 to-transparent" />
        <svg className="w-full h-64 absolute bottom-0" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,100 L50,90 L100,95 L150,85 L200,90 L250,80 L300,85 L350,75 L400,80 L450,70 L500,75 L550,65 L600,70 L650,60 L700,65 L750,55 L800,60 L850,50 L900,55 L950,45 L1000,50 L1050,40 L1100,45 L1150,35 L1200,40 L1200,200 L0,200 Z"
                fill={selectedCity.currentAQI.color}
                opacity="0.3" />
        </svg>
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: selectedCity.currentAQI.color,
            opacity: particle.opacity,
            filter: 'blur(2px)',
            transition: 'all 0.05s linear'
          }}
        />
      ))}

      <div className="relative z-10 p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Globe
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {selectedCity.name}
            </h1>
            <p className="text-xl text-blue-200">{selectedCity.country}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 transition-all"
              style={{ borderColor: selectedCity.currentAQI.color }}
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-4" style={{ color: selectedCity.currentAQI.color }}>
                  {displayAQI}
                </div>
                <div className="text-2xl font-semibold text-white mb-2">
                  {selectedCity.currentAQI.level}
                </div>
                <div className="text-blue-200">Air Quality Index</div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="text-white font-semibold mb-3">Major Pollutants:</div>
                {selectedCity.currentAQI.majorPollutants.map((pollutant, idx) => {
                  const info = getPollutantInfo(pollutant);
                  return (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="text-blue-400 mt-1">{info.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{pollutant}</div>
                        <div className="text-sm text-blue-200">{info.source}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Health Impact</h3>

              <div className="space-y-4 text-white/90">
                {selectedCity.currentAQI.value <= 50 && (
                  <p>Air quality is satisfactory and poses little or no risk.</p>
                )}
                {selectedCity.currentAQI.value > 50 && selectedCity.currentAQI.value <= 100 && (
                  <p>Air quality is acceptable. Sensitive individuals may experience minor issues.</p>
                )}
                {selectedCity.currentAQI.value > 100 && selectedCity.currentAQI.value <= 150 && (
                  <p>Members of sensitive groups may experience health effects. The general public is less likely to be affected.</p>
                )}
                {selectedCity.currentAQI.value > 150 && selectedCity.currentAQI.value <= 200 && (
                  <p>Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.</p>
                )}
                {selectedCity.currentAQI.value > 200 && (
                  <p>Health alert: everyone may experience serious health effects. Avoid outdoor activities.</p>
                )}
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Recommendations:</h4>
                <ul className="space-y-2 text-blue-200 text-sm">
                  <li>• Check AQI before outdoor activities</li>
                  <li>• Use air purifiers indoors</li>
                  <li>• Wear masks on high pollution days</li>
                  <li>• Reduce vehicle usage</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Historical Timeline</h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-blue-200 mb-2">
                <span>{selectedCity.historicalData[0]?.date}</span>
                <span className="font-semibold text-white">
                  {currentHistoricalData?.date || 'Today'}
                </span>
                <span>{selectedCity.historicalData[selectedCity.historicalData.length - 1]?.date}</span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedCity.historicalData.length - 1}
                value={timelineIndex}
                onChange={(e) => setTimelineIndex(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${selectedCity.currentAQI.color} 0%, ${selectedCity.currentAQI.color} ${(timelineIndex / (selectedCity.historicalData.length - 1)) * 100}%, rgba(255,255,255,0.2) ${(timelineIndex / (selectedCity.historicalData.length - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            <div className="h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="aqi-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: selectedCity.currentAQI.color, stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: selectedCity.currentAQI.color, stopOpacity: 0 }} />
                  </linearGradient>
                </defs>

                <polyline
                  fill="url(#aqi-gradient)"
                  stroke="none"
                  points={selectedCity.historicalData.map((d, i) => {
                    const x = (i / (selectedCity.historicalData.length - 1)) * 800;
                    const y = 200 - (d.aqi / 300) * 180;
                    return `${x},${y}`;
                  }).join(' ') + ` 800,200 0,200`}
                />

                <polyline
                  fill="none"
                  stroke={selectedCity.currentAQI.color}
                  strokeWidth="3"
                  points={selectedCity.historicalData.map((d, i) => {
                    const x = (i / (selectedCity.historicalData.length - 1)) * 800;
                    const y = 200 - (d.aqi / 300) * 180;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                <circle
                  cx={(timelineIndex / (selectedCity.historicalData.length - 1)) * 800}
                  cy={200 - (displayAQI / 300) * 180}
                  r="6"
                  fill="white"
                  stroke={selectedCity.currentAQI.color}
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate(`/game/${cityName}`)}
              className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
            >
              <Play size={28} />
              Play Clean Air Game
            </button>
            <p className="text-blue-200 mt-4">Help reduce pollution in {selectedCity.name}!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
