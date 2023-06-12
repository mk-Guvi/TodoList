import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  className?: string;
  containerClassName?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height, width, className = '', containerClassName = '' }) => {
  return (
    <div className={`animate-pulse relative h-${height || 'full'} w-${width || 'full'} ${containerClassName}`}>
      <div className={` transition-all duration-100 bg-gray-200 opacity-60 h-full   ${className}`}></div>
      <div className={` transition-all absolute top-0 duration-100 bg-gray-100 opacity-60  w-full h-full  ${className}`}></div>
    </div>
  );
};
