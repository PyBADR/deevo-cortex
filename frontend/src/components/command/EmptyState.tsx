import React from 'react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#080c14] border border-white/10 rounded-lg">
      <div className="text-center space-y-4 px-6">
        <div className="p-8 border border-white/10 rounded-lg bg-gray-950/30 inline-block">
          <p className="text-sm text-gray-500 font-mono">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
