import React from 'react';
import { motion } from 'motion/react';

export const VortexAnimation: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center justify-center ${className || 'w-48 h-48'}`}>
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-90">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="10 5">
        <animateTransform 
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="6s"
          repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5 10" opacity="0.5">
        <animateTransform 
          attributeName="transform"
          type="rotate"
          from="360 100 100"
          to="0 100 100"
          dur="8s"
          repeatCount="indefinite"/>
      </circle>
    </svg>
    
    <div className="z-10 flex gap-4">
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="w-4 h-4 rounded-full bg-current blur-sm"
       />
       <motion.div 
         animate={{ scale: [1.2, 1, 1.2], opacity: [1, 0.5, 1] }}
         transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
         className="w-4 h-4 rounded-full bg-current blur-sm opacity-60"
       />
    </div>
  </div>
);

export const MagicParticles: React.FC = () => (
  <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <circle key={i} cx="100" cy="100" r="2.5" fill="#FFD700">
        <animate attributeName="cx" from="100" to={50 + Math.random() * 100} dur={`${1 + Math.random() * 2}s`} repeatCount="indefinite"/>
        <animate attributeName="cy" from="100" to={50 + Math.random() * 100} dur={`${1 + Math.random() * 2}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" from="1" to="0" dur={`${1 + Math.random() * 2}s`} repeatCount="indefinite"/>
      </circle>
    ))}
  </svg>
);

export const RareFlash: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.5] }}
    transition={{ duration: 0.8 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
  >
    <div className="w-32 h-32 rounded-full bg-gold blur-2xl" />
  </motion.div>
);

export const ForgeSparks: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: (Math.random() - 0.5) * 200, 
            y: (Math.random() - 0.5) * 200 - 50,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.4 + Math.random() * 0.3, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 w-1 h-3 bg-gold rounded-full blur-[1px]"
          style={{ 
            boxShadow: '0 0 10px #C9A343',
            transformOrigin: 'center'
          }}
        />
      ))}
    </div>
  );
};
