'use client';

import { useEffect } from 'react';
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smoothScroll';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize smooth scroll
    const lenis = initSmoothScroll();

    // Cleanup on unmount
    return () => {
      destroySmoothScroll();
    };
  }, []);

  return <>{children}</>;
}
