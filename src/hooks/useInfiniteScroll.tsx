import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  items: T[];
  initialCount: number;
  batchSize: number;
}

export function useInfiniteScroll<T>({ items, initialCount, batchSize }: UseInfiniteScrollOptions<T>) {
  const [displayedCount, setDisplayedCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = displayedCount < items.length;
  const displayedItems = items.slice(0, displayedCount);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    // Small delay for smooth skeleton display
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + batchSize, items.length));
      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore, batchSize, items.length]);

  // Reset when items change (e.g., filter/search)
  useEffect(() => {
    setDisplayedCount(Math.min(initialCount, items.length));
  }, [items, initialCount]);

  // Setup IntersectionObserver
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    sentinelRef.current = node;
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return {
    displayedItems,
    isLoadingMore,
    hasMore,
    sentinelRef: setSentinelRef,
  };
}
