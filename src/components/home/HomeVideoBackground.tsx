import { useEffect, useMemo, useRef, useState, memo } from "react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function HomeVideoBackgroundComponent() {
  const { homeVideoUrl, isLoading } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isFixed, setIsFixed] = useState(true);
  const [releaseTop, setReleaseTop] = useState<number | null>(null);

  const videoUrl = useMemo(() => {
    return (
      homeVideoUrl ||
      "https://ik.imagekit.io/w637nv5dta/New%20Folder/Anime.mp4?updatedAt=1766558870637"
    );
  }, [homeVideoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // Autoplay may be blocked
      }
    };

    const t = window.setTimeout(tryPlay, 50);
    return () => window.clearTimeout(t);
  }, [videoUrl]);

  useEffect(() => {
    let ticking = false;
    
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const footer = document.querySelector("footer");
        if (!footer) {
          ticking = false;
          return;
        }
        
        const footerRect = footer.getBoundingClientRect();
        const shouldRelease = footerRect.top <= window.innerHeight;

        if (shouldRelease && isFixed) {
          setIsFixed(false);
          setReleaseTop(window.scrollY);
        }

        if (!shouldRelease && !isFixed) {
          setIsFixed(true);
          setReleaseTop(null);
        }
        
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFixed]);

  if (isLoading) {
    return <div className="fixed inset-0 bg-background z-0" aria-hidden />;
  }

  return (
    <div
      className={cn(
        "inset-0 w-screen h-screen will-change-transform",
        isFixed ? "fixed" : "absolute"
      )}
      style={{ 
        zIndex: 0,
        ...(isFixed ? {} : { top: releaseTop ?? 0 })
      }}
    >
      <video
        ref={videoRef}
        key={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Optimized overlays - single gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
    </div>
  );
}

export const HomeVideoBackground = memo(HomeVideoBackgroundComponent);
