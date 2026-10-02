import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'pink' | 'green' | 'yellow' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  showPercentText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'pink',
  height = 'md',
  showPercentText = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const colorStyles = {
    pink: 'bg-gradient-to-r from-fairy-pink-light to-fairy-pink',
    green: 'bg-gradient-to-r from-fairy-green-light to-fairy-green',
    yellow: 'bg-gradient-to-r from-fairy-yellow-light to-fairy-yellow',
    purple: 'bg-gradient-to-r from-purple-200 to-purple-400',
  }[color];

  const trackBg = {
    pink: 'bg-fairy-pink-light/40',
    green: 'bg-fairy-green-light/40',
    yellow: 'bg-fairy-yellow-light/50',
    purple: 'bg-purple-100/50',
  }[color];

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[height];

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className={`flex-1 rounded-full ${trackBg} ${heightStyles} overflow-hidden p-0.5 border border-white/60 shadow-inner`}>
        <div
          className={`${heightStyles} rounded-full ${colorStyles} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercentText && (
        <span className="text-xs font-semibold text-fairy-text-secondary w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};
