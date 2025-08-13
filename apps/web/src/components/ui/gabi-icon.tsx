import React from 'react';

interface GabiIconProps {
  className?: string;
  size?: number;
}

export function GabiIcon({ className = "", size = 24 }: GabiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Formas entrelaçadas em ciano */}
      <path
        d="M6 8C6 8 8 6 12 6C16 6 18 8 18 8"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M6 16C6 16 8 18 12 18C16 18 18 16 18 16"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 6C8 6 10 8 10 12C10 16 8 18 8 18"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 6C16 6 14 8 14 12C14 16 16 18 16 18"
        stroke="#53c4cd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Formas internas */}
      <path
        d="M9 9C9 9 11 11 12 11C13 11 15 9 15 9"
        stroke="#53c4cd"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9 15C9 15 11 13 12 13C13 13 15 15 15 15"
        stroke="#53c4cd"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
