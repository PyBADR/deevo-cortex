import React from 'react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-d-shell border border-d-border/30 rounded-lg">
      <div className="text-center space-y-4 px-6">
        <div className="p-8 border border-d-border/30 rounded-lg bg-gray-950/30 inline-block">
          <p className="text-sm text-d-muted font-mono">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
