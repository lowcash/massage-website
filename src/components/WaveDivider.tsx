'use client'

import { motion } from 'framer-motion'

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  color?: string;
  flip?: boolean;
}

export function WaveDivider({ position = 'bottom', color = '#faf7f2', flip = false }: WaveDividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none ${
        flip ? 'rotate-180' : ''
      }`}
      style={{ height: '80px' }}
    >
      <motion.svg
        className="relative block w-full"
        style={{ height: '80px' }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z"
          fill={color}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
}
