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
    <div className="w-screen h-screen bg-d-bg flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="relative">
        <div className="text-6xl font-mono font-bold text-d-blue animate-pulse-slow">
          DEEVO
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <div className="text-xs font-mono text-d-muted uppercase tracking-widest">
          {message}
          <span className="inline-block w-6 text-left">{dots}</span>
        </div>
      </div>

      {/* Subtle animation indicator */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-d-blue/40 animate-pulse-slow"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
