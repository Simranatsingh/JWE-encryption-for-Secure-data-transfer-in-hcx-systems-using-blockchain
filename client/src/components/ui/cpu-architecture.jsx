import React from 'react';
import { motion } from 'framer-motion';

export const CpuArchitecture = ({ width = "24", height = "24", text = "" }) => {
  // Grid settings
  const gridSize = 4;
  const circleSize = Math.min(parseInt(width), parseInt(height)) / (gridSize * 3);
  
  // Generate grid positions
  const gridPositions = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridPositions.push({
        x: (width / gridSize) * j + (width / gridSize / 2),
        y: (height / gridSize) * i + (height / gridSize / 2),
      });
    }
  }

  return (
    <div className="relative inline-block">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        {/* Connection lines */}
        {gridPositions.map((pos, i) => 
          gridPositions.slice(i + 1).map((pos2, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={pos.x}
              y1={pos.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: Math.random() > 0.7 ? 1 : 0,
                opacity: Math.random() > 0.7 ? 0.5 : 0
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2
              }}
            />
          ))
        )}
        
        {/* Grid points */}
        {gridPositions.map((pos, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={pos.x}
            cy={pos.y}
            r={circleSize}
            fill="rgb(59, 130, 246)"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </svg>
      
      {/* Optional text overlay */}
      {text && (
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs">
          {text}
        </div>
      )}
    </div>
  );
}; 