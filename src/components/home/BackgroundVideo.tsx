import { useRef, useEffect, useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface BackgroundVideoProps {
  onFadeOut?: boolean;
}

export function BackgroundVideo({ onFadeOut = false }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { homeVideoUrl, isLoading } = useSiteSettings();
  const [isVisible, setIsVisible] = useState(true);

  // Default fallback video
  const defaultVideo = 'https://ik.imagekit.io/w637nv5dta/New%20Folder/Anime.mp4?updatedAt=1766558870637';
  const videoUrl = homeVideoUrl || defaultVideo;

  // Handle visibility change (pause when tab is inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle scroll-based fade out
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fadeStart = viewportHeight * 2.5;
      const fadeEnd = viewportHeight * 3;

      if (scrollY >= fadeEnd) {
        setIsVisible(false);
      } else if (scrollY >= fadeStart) {
        setIsVisible(true);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fadeStart = viewportHeight * 2;
      const fadeEnd = viewportHeight * 3;

      if (scrollY <= fadeStart) {
        setOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setOpacity(0);
      } else {
        const fadeProgress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setOpacity(1 - fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen -z-10 bg-background" />
    );
  }

  return (
    <>
      {/* Fixed Video Background */}
      <div 
        className="fixed inset-0 w-screen h-screen -z-10 transition-opacity duration-500"
        style={{ opacity: isVisible ? opacity : 0 }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Fallback background when video fades out */}
      <div 
        className="fixed inset-0 w-screen h-screen -z-20 bg-background"
      />
    </>
  );
}
