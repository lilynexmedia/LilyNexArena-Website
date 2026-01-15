import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { homeVideoUrl, isLoading } = useSiteSettings();
  const defaultVideo = 'https://ik.imagekit.io/w637nv5dta/New%20Folder/Anime.mp4?updatedAt=1766558870637';
  const videoUrl = homeVideoUrl || defaultVideo;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Handle visibility change (pause when tab is inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      {!isLoading && (
        <video
          ref={videoRef}
          key={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Scan Lines */}
      <div className="absolute inset-0 scan-lines pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="inline-block px-4 py-2 mb-6 text-xs font-heading uppercase tracking-[0.3em] text-primary border border-primary/30 bg-primary/10 rounded-full">
            Season 2025 Now Live
          </span>
        </div>

        <h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="text-foreground">LILY</span>
          <span className="text-gradient">NEX</span>
          <br />
          <span className="text-primary text-glow-cyan">ESPORTS</span>
        </h1>

        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 font-heading animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          Where Champions Are Forged. Compete in Elite Tournaments, 
          Prove Your Skill, Claim Your Glory.
        </p>

        <div 
          className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/events">View Events</Link>
          </Button>
          <Button variant="heroOutline" size="xl" asChild>
            <Link to="/events">Register Now</Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 z-20",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="container mx-auto">
          <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md rounded-lg p-3 border border-border/50">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-primary" />
              ) : (
                <Play className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Progress Bar */}
            <div
              className="flex-1 h-1 bg-muted rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
