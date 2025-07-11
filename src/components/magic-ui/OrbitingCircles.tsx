import React from 'react';
import { cn } from '@/lib/utils';

export interface OrbitingCirclesProps {
  className?: string;
  items: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color?: string;
  }[];
  centerIcon: React.ReactNode;
  centerLabel?: string;
  radius?: number;
  duration?: number;
  reverse?: boolean;
  showLabels?: boolean;
}

export const OrbitingCircles: React.FC<OrbitingCirclesProps> = ({
  className,
  items,
  centerIcon,
  centerLabel,
  radius = 120,
  duration = 20,
  reverse = false,
  showLabels = true,
}) => {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Center icon */}
      <div className="absolute z-10 flex flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg">
          {centerIcon}
        </div>
        {centerLabel && (
          <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {centerLabel}
          </span>
        )}
      </div>

      {/* Orbital path */}
      <div
        className="absolute rounded-full border border-dashed border-gray-200 dark:border-gray-700"
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      />

      {/* Orbiting items */}
      {items.map((item, index) => {
        const angle = (index * (360 / items.length) * Math.PI) / 180;
        const orbitStyle = {
          animation: `orbit${reverse ? 'Reverse' : ''} ${duration}s linear infinite`,
          transformOrigin: 'center',
        };

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              ...orbitStyle,
              transform: `rotate(${(index * 360) / items.length}deg) translateX(${radius}px)`,
            }}
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full shadow-md',
                  item.color || 'bg-white dark:bg-gray-800'
                )}
              >
                {item.icon}
              </div>
              {showLabels && (
                <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(${radius}px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(${radius}px) rotate(-360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: rotate(0deg) translateX(${radius}px) rotate(0deg);
          }
          to {
            transform: rotate(-360deg) translateX(${radius}px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default OrbitingCircles;
