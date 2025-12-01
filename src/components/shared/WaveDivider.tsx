'use client'

import { motion } from 'framer-motion';

interface WaveDividerProps {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
}

export default function WaveDivider({
  topColor = '#fff',
  bottomColor = '#fef8fb',
  flip = false,
}: WaveDividerProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bottomColor,
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="relative block w-full"
        style={{ height: '80px' }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z"
          fill={topColor}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}