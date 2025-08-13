import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Forma vertical (mais alta) */}
      <path
        d="M8 4C8 4 10 6 10 12C10 18 8 20 8 20"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Forma horizontal (mais larga) */}
      <path
        d="M4 10C4 10 6 8 12 8C18 8 20 10 20 10"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Forma vertical (mais baixa) */}
      <path
        d="M16 4C16 4 14 6 14 12C14 18 16 20 16 20"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Forma horizontal (mais baixa) */}
      <path
        d="M4 14C4 14 6 16 12 16C18 16 20 14 20 14"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
