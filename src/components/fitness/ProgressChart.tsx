import React from 'react';

interface DataPoint {
  date: Date;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  lineColor?: string;
  backgroundColor?: string;
  showLabels?: boolean;
  title?: string;
  className?: string;
}

/**
 * A simple chart component for visualizing progress over time
 */
const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  height = 200,
  width = 500,
  lineColor = '#3b82f6',
  backgroundColor = '#f0f9ff',
  showLabels = true,
  title,
  className = '',
}) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find min and max values for scaling
  const values = sortedData.map(d => d.value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 10);
  
  // Calculate scaling factors
  const xScale = width / Math.max(sortedData.length - 1, 1);
  const yScale = height / (maxValue - minValue || 1);
  
  // Generate path for the line
  const pathData = sortedData.map((point, index) => {
    const x = index * xScale;
    const y = height - (point.value - minValue) * yScale;
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');
  
  // Generate points for the dots
  const points = sortedData.map((point, index) => {
    const x = index * xScale;
    const y = height - (point.value - minValue) * yScale;
    return { x, y, value: point.value, date: point.date };
  });
  
  // Format date for labels
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      
      <div 
        className="relative" 
        style={{ 
          height: `${height}px`, 
          width: '100%', 
          backgroundColor,
          borderRadius: '0.5rem',
          padding: '1rem',
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Line */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={lineColor} 
            strokeWidth="2" 
          />
          
          {/* Points */}
          {points.map((point, index) => (
            <circle 
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={lineColor}
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* Labels */}
        {showLabels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
            {sortedData.length > 0 && (
              <>
                <span>{formatDate(sortedData[0].date)}</span>
                {sortedData.length > 2 && (
                  <span>{formatDate(sortedData[Math.floor(sortedData.length / 2)].date)}</span>
                )}
                {sortedData.length > 1 && (
                  <span>{formatDate(sortedData[sortedData.length - 1].date)}</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
};

export default ProgressChart;