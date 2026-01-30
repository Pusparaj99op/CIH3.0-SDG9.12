'use client';

import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

let lenisInstance: Lenis | null = null;

// Initialize Lenis smooth scroll
export const initSmoothScroll = (): Lenis | null => {
  if (typeof window === 'undefined') return null;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return null;

  // Check if mobile
  const isMobile = window.innerWidth < 768;

  lenisInstance = new Lenis({
    duration: isMobile ? 1 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: isMobile ? 0.8 : 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Animation loop
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenisInstance;
};

// Destroy Lenis instance
export const destroySmoothScroll = (): void => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

// Get Lenis instance
export const getLenis = (): Lenis | null => {
  return lenisInstance;
};

// Scroll to element
export const scrollToElement = (
  element: HTMLElement | string,
  options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
  }
): void => {
  if (!lenisInstance) return;

  const target = typeof element === 'string'
    ? document.querySelector(element) as HTMLElement
    : element;

  if (!target) return;

  lenisInstance.scrollTo(target, {
    offset: options?.offset || 0,
    duration: options?.duration,
    easing: options?.easing,
  });
};

// Scroll to top
export const scrollToTop = (options?: { duration?: number }): void => {
  if (!lenisInstance) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  lenisInstance.scrollTo(0, {
    duration: options?.duration || 1,
  });
};

// Hook for using Lenis in React components
export const useLenis = (callback?: (lenis: Lenis) => void, deps: any[] = []) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!lenisRef.current) {
      lenisRef.current = initSmoothScroll();
    }

    if (callback && lenisRef.current) {
      callback(lenisRef.current);
    }

    return () => {
      // Don't destroy on every component unmount, only when app unmounts
      // destroySmoothScroll();
    };
  }, deps);

  return lenisRef.current;
};

// Stop smooth scroll temporarily
export const stopScroll = (): void => {
  if (lenisInstance) {
    lenisInstance.stop();
  }
};

// Start smooth scroll
export const startScroll = (): void => {
  if (lenisInstance) {
    lenisInstance.start();
  }
};

export default {
  initSmoothScroll,
  destroySmoothScroll,
  getLenis,
  scrollToElement,
  scrollToTop,
  useLenis,
  stopScroll,
  startScroll,
};
