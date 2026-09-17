"use client";

import { useEffect } from "react";

export function ViewportLock() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Prevent Safari gesture zooming (pinch-to-zoom)
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });

    // 2. Prevent multi-touch pinch
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchstart", handleTouchStart, { passive: false });

    // 3. Prevent double-tap to zoom on non-interactive elements
    let lastTouch = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouch <= 320) {
        const target = e.target as HTMLElement | null;
        const isInteractive = target?.closest?.("button, a, [role='button'], input, textarea, select");
        if (!isInteractive) {
          e.preventDefault();
        }
      }
      lastTouch = now;
    };
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    // 4. Prevent rubber-banding and sliding blank space across the entire window
    let startX = 0;
    let startY = 0;

    const handleTouchMoveStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };
    document.addEventListener("touchstart", handleTouchMoveStart, { passive: true });

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        return;
      }

      // Check if current target is inside an explicitly scrollable container
      let el = e.target as HTMLElement | null;
      let scrollableEl: HTMLElement | null = null;

      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const canScrollY = (style.overflowY === "auto" || style.overflowY === "scroll") && el.scrollHeight > el.clientHeight;
        if (canScrollY) {
          scrollableEl = el;
          break;
        }
        el = el.parentElement;
      }

      // If not inside a scrollable container, block ALL dragging / rubberbanding
      if (!scrollableEl) {
        if (e.cancelable) {
          e.preventDefault();
        }
        return;
      }

      // If inside a scrollable container, block horizontal sliding completely
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      if (diffX > diffY) {
        // Horizontal drag -> strictly block
        if (e.cancelable) {
          e.preventDefault();
        }
        return;
      }

      // Check vertical bounce boundaries
      const atTop = scrollableEl.scrollTop <= 0;
      const atBottom = scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight - 1;
      const movingDown = currentY > startY;
      const movingUp = currentY < startY;

      if ((atTop && movingDown) || (atBottom && movingUp)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Ensure window stays locked at 0,0
    const handleScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchstart", handleTouchMoveStart);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
