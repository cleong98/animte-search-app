import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const BREAKPOINTS = {
  sm: 640, // Small devices (phones, landscape)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
  "2xl": 1536, // 2X large devices
} as const;

export function useBreakpoint() {
  const { width } = useWindowSize();

  return {
    isMobile: width < BREAKPOINTS.md, // < 768px
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg, // 768px - 1023px
    isDesktop: width >= BREAKPOINTS.lg, // >= 1024px
    width,
  };
}

/**
 * Get the number of grid columns based on screen size
 * Mobile (< 768px): 2 columns
 * Tablet/Desktop (768px - 1279px): 3 columns
 * Large Desktop (≥ 1280px): 4 columns
 */
export function getGridColumns(width: number): number {
  if (width >= BREAKPOINTS.xl) return 4; // >= 1280px
  if (width >= BREAKPOINTS.md) return 3; // >= 768px
  return 2; // < 768px (mobile)
}
