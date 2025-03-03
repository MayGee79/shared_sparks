'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

type LinkWrapperProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
};

export function LinkWrapper({ 
  href, 
  children, 
  className = '',
  'aria-label': ariaLabel 
}: LinkWrapperProps) {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };
  
  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}