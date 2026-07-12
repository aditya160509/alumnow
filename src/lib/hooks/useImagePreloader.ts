"use client";
import { useEffect, useRef } from "react";

const imageCache = new Map<string, HTMLImageElement>();

export function useImagePreloader(urls: string[], currentIndex = 0) {
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const start = currentIndex + 1;
    const end = Math.min(start + 3, urls.length);

    for (let i = start; i < end; i++) {
      const url = urls[i];
      if (!url || imageCache.has(url)) continue;

      const preloadIndex = i - start;
      const schedule = preloadIndex >= 2 && typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb as IdleRequestCallback, { timeout: 2000 })
        : (cb: () => void) => cb();

      schedule(() => {
        if (cancelledRef.current) return;
        const img = new Image();
        img.loading = "lazy";
        img.onerror = () => {};
        img.src = url;
        imageCache.set(url, img);
      });
    }

    return () => { cancelledRef.current = true; };
  }, [urls, currentIndex]);
}
