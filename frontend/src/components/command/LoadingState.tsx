import React, { useEffect, useState } from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'INITIALIZING INTELLIGENCE SYSTEM' }) => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#05070b] flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="relative">
        <div
          className="text-6xl font-mono font-bold text-cyan-400 animate-pulse"
          style={{
            textShadow: '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)',
          }}
        >
          DEEVO
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          {message}
          <span className="inline-block w-6 text-left">{dots}</span>
        </div>
      </div>

      {/* Subtle animation indicator */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-cyan-500/40"
            style={{
              animation: `pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
