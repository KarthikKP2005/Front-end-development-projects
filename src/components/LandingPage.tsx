import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

const GlassBallWithEyes: React.FC = () => {
  const ballRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!ballRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
      const rect = ballRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const maxMove = 15;
      const moveX = Math.min(Math.max(deltaX / 10, -maxMove), maxMove);
      const moveY = Math.min(Math.max(deltaY / 10, -maxMove), maxMove);
      leftEyeRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      rightEyeRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    function handleMouseLeave() {
      if (!leftEyeRef.current || !rightEyeRef.current) return;
      leftEyeRef.current.style.transform = 'translate(0, 0)';
      rightEyeRef.current.style.transform = 'translate(0, 0)';
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="glass-ball" ref={ballRef}>
      <div className="eyes">
        <div className="eye left" ref={leftEyeRef}></div>
        <div className="eye right" ref={rightEyeRef}></div>
      </div>
      <style>{`
        .glass-ball { width: 350px; height: 350px; background: radial-gradient(circle, rgba(0, 140, 255, 0.6), rgba(0, 0, 0, 0.8)); border-radius: 50%; position: relative; top: -25px; box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(0, 140, 255, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; overflow: hidden; }
        .eyes { position: absolute; width: 60%; display: flex; justify-content: space-between; }
        .eye { width: 15px; height: 40px; background: white; border-radius: 10px; position: relative; transition: transform 0.1s ease-out; animation: blink 4s infinite; }
        @keyframes blink { 0%, 90% { height: 40px; } 95% { height: 5px; } 100% { height: 40px; } }
      `}</style>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const vantaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { searchCity, setSelectedCity } = useAppContext();

  useEffect(() => {
    let vantaEffect: any = null;
    const loadVanta = async () => {
      const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds2.min.js');
      // @ts-ignore
      if (window.VANTA && window.VANTA.CLOUDS2 && vantaRef.current) {
        // @ts-ignore
        vantaEffect = window.VANTA.CLOUDS2({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          speed: 2.6,
          backgroundColor: 0x0,
          skyColor: 0x5ca6ca,
          cloudColor: 0x334d80,
          lightColor: 0xffffff,
          texturePath: './gallery/noise.png'
        });
      }
    };
    loadVanta();
    return () => { if (vantaEffect && typeof vantaEffect.destroy === 'function') vantaEffect.destroy(); };
  }, []);

  const handleSearch = async () => {
    if (!cityInput.trim()) return;
    setIsLoading(true);
    try {
      const city = await searchCity(cityInput.trim());
      setSelectedCity(city);
      navigate(`/city/${encodeURIComponent(cityInput.trim())}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={vantaRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-16 relative z-10">
        <div className="flex justify-center items-center" style={{ marginRight: '2rem' }}>
          <GlassBallWithEyes />
        </div>
        <div className="flex flex-col items-start gap-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">Breath of Earth</h1>
          <div className="flex items-center gap-4 w-full">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={20} />
              {isLoading ? 'Searching...' : 'Explore'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
