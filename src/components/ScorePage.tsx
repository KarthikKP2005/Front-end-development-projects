import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, TreePine, Wind, Recycle, Car, Home, ArrowLeft, RotateCcw } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const ScorePage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { selectedCity, gameScore } = useAppContext();

  useEffect(() => {
    if (!selectedCity || !gameScore) {
      navigate('/');
    }
  }, [selectedCity, gameScore, navigate]);

  if (!selectedCity || !gameScore) {
    return null;
  }

  const getSkylineColor = (aqi: number): string => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    return 'from-purple-400 to-purple-600';
  };

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage >= 80) return 'Outstanding! You are a pollution fighter!';
    if (percentage >= 60) return 'Great job! Keep up the good work!';
    if (percentage >= 40) return 'Good effort! There is room for improvement.';
    if (percentage >= 20) return 'Nice try! Practice makes perfect.';
    return 'Keep trying! Every effort counts.';
  };

  const tips = [
    { icon: <TreePine size={24} />, title: 'Plant Trees', description: 'Trees absorb CO₂ and filter air pollutants' },
    { icon: <Wind size={24} />, title: 'Use Renewable Energy', description: 'Switch to solar and wind power' },
    { icon: <Car size={24} />, title: 'Reduce Vehicle Use', description: 'Walk, bike, or use public transport' },
    { icon: <Recycle size={24} />, title: 'Recycle & Reuse', description: 'Reduce waste and industrial pollution' },
    { icon: <Home size={24} />, title: 'Energy Efficient Homes', description: 'Better insulation reduces energy needs' }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${getSkylineColor(selectedCity.currentAQI.value)} opacity-20`} />

      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <rect x="50" y="150" width="80" height="150" fill={selectedCity.currentAQI.color} />
          <rect x="150" y="100" width="60" height="200" fill={selectedCity.currentAQI.color} />
          <rect x="230" y="120" width="70" height="180" fill={selectedCity.currentAQI.color} />
          <rect x="320" y="80" width="90" height="220" fill={selectedCity.currentAQI.color} />
          <rect x="430" y="140" width="65" height="160" fill={selectedCity.currentAQI.color} />
          <rect x="520" y="90" width="75" height="210" fill={selectedCity.currentAQI.color} />
          <rect x="620" y="110" width="85" height="190" fill={selectedCity.currentAQI.color} />
          <rect x="730" y="130" width="70" height="170" fill={selectedCity.currentAQI.color} />
          <rect x="820" y="100" width="80" height="200" fill={selectedCity.currentAQI.color} />
          <rect x="920" y="120" width="90" height="180" fill={selectedCity.currentAQI.color} />
          <rect x="1030" y="140" width="70" height="160" fill={selectedCity.currentAQI.color} />
        </svg>
      </div>

      <div className="relative z-10 p-8 min-h-screen flex flex-col">
        <button
          onClick={() => navigate(`/city/${cityName}`)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to City View
        </button>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="relative">
                  <Trophy size={80} className="text-yellow-400 animate-bounce" />
                  <div className="absolute inset-0 animate-ping">
                    <Trophy size={80} className="text-yellow-400 opacity-20" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                Game Complete!
              </h1>
              <p className="text-2xl text-blue-200">
                {getPerformanceMessage(gameScore.percentage)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  Your Score
                </h2>

                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">
                      {gameScore.percentage}%
                    </div>
                    <div className="text-blue-200">Pollutants Cleared</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {gameScore.pollutantsCleared}
                      </div>
                      <div className="text-sm text-blue-200 mt-1">Cleared</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-red-400">
                        {gameScore.totalPollutants - gameScore.pollutantsCleared}
                      </div>
                      <div className="text-sm text-blue-200 mt-1">Remaining</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between text-sm text-blue-200 mb-2">
                      <span>Progress</span>
                      <span>{gameScore.pollutantsCleared}/{gameScore.totalPollutants}</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                        style={{ width: `${gameScore.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Real-Time AQI
                </h2>

                <div className="text-center mb-6">
                  <div
                    className="text-6xl font-bold mb-2"
                    style={{ color: selectedCity.currentAQI.color }}
                  >
                    {selectedCity.currentAQI.value}
                  </div>
                  <div className="text-2xl font-semibold text-white mb-1">
                    {selectedCity.currentAQI.level}
                  </div>
                  <div className="text-blue-200">{cityName}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm font-semibold text-white mb-3">Major Pollutants:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCity.currentAQI.majorPollutants.map((pollutant, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                      >
                        {pollutant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                How to Improve Air Quality
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105"
                  >
                    <div className="text-blue-400 mb-4">{tip.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                    <p className="text-sm text-blue-200">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Play Again Tomorrow!
              </h3>
              <p className="text-blue-200 mb-6">
                Check back to see if {cityName}'s air quality has improved. Every action counts towards a cleaner planet!
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(`/game/${cityName}`)}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <RotateCcw size={20} />
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all transform hover:scale-105 border border-white/20"
                >
                  Explore Other Cities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
