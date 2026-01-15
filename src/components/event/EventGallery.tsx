import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventGalleryImage } from "@/lib/types";

interface GalleryProps {
  images: EventGalleryImage[];
  title: string;
  emptyMessage?: string;
}

export function EventGallery({ images, title, emptyMessage = "Gallery coming soon" }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const closeLightbox = useCallback(() => {
    setIsLightboxVisible(false);
    setTimeout(() => {
      setSelectedIndex(null);
      setDragOffset(0);
    }, 200);
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex !== null && !isAnimating) {
      setIsAnimating(true);
      setDragOffset(-window.innerWidth * 0.3);
      setTimeout(() => {
        setSelectedIndex((selectedIndex + 1) % images.length);
        setDragOffset(0);
        setIsAnimating(false);
      }, 200);
    }
  }, [selectedIndex, images.length, isAnimating]);
  
  const goPrev = useCallback(() => {
    if (selectedIndex !== null && !isAnimating) {
      setIsAnimating(true);
      setDragOffset(window.innerWidth * 0.3);
      setTimeout(() => {
        setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        setDragOffset(0);
        setIsAnimating(false);
      }, 200);
    }
  }, [selectedIndex, images.length, isAnimating]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goNext, goPrev, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      // Animate in
      requestAnimationFrame(() => {
        setIsLightboxVisible(true);
      });
    } else {
      document.body.style.overflow = '';
      setIsLightboxVisible(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setDragOffset(0);
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const diff = currentTouch - touchStart;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    } else {
      setDragOffset(0);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      {/* Premium Gallery Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative w-full overflow-hidden rounded-xl bg-muted/20 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            {/* Aspect ratio container - 4:3 for better mobile viewing */}
            <div className="aspect-[4/3] relative">
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Caption at bottom */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium line-clamp-2">{image.caption}</p>
                  </div>
                )}
              </div>
              
              {/* Image number indicator */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {index + 1} / {images.length}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Premium Fullscreen Lightbox - Rendered via Portal */}
      {selectedIndex !== null && createPortal(
        <div 
          ref={lightboxRef}
          className={cn(
            "fixed inset-0 z-[9999] flex flex-col transition-all duration-300",
            isLightboxVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Blurred dark background - Click to close */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer" 
            onClick={closeLightbox}
          />
          
          {/* Close button - Top right, responsive sizing */}
          <button
            onClick={closeLightbox}
            className="absolute top-3 right-3 md:top-5 md:right-5 z-30 p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 backdrop-blur-md border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Image counter - Top left */}
          <div className="absolute top-3 left-3 md:top-5 md:left-5 z-30 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs md:text-sm font-medium border border-white/10">
            {selectedIndex + 1} / {images.length}
          </div>
          
          {/* Navigation Arrows - Always visible on desktop/tablet */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="hidden sm:flex absolute left-2 md:left-4 lg:left-8 xl:left-12 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 lg:p-5 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all hover:scale-110 items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="hidden sm:flex absolute right-2 md:right-4 lg:right-8 xl:right-12 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 lg:p-5 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all hover:scale-110 items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
          
          {/* Main Image Container - Full viewport */}
          <div 
            className="flex-1 flex items-center justify-center px-4 py-4 sm:px-20 md:px-12 lg:px-16 relative z-10 select-none overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative w-full h-full flex items-center justify-center transition-transform duration-200",
                isLightboxVisible ? "scale-100" : "scale-95"
              )}
              style={{
                transform: `translateX(${dragOffset}px) scale(${isLightboxVisible ? 1 : 0.95})`,
                transition: isAnimating ? 'transform 0.2s ease-out' : 'none',
              }}
            >
              <img
                src={images[selectedIndex].image_url}
                alt={images[selectedIndex].caption || "Gallery image"}
                className="max-w-full max-h-[calc(100vh-160px)] object-contain rounded-lg shadow-2xl"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {/* Footer with Caption & Navigation */}
          <div className="relative z-10 px-4 py-3 md:px-8 md:py-4 bg-gradient-to-t from-black/50 to-transparent" onClick={(e) => e.stopPropagation()}>
            {/* Caption */}
            {images[selectedIndex].caption && (
              <p className="text-center text-white/90 text-sm md:text-base lg:text-lg mb-3 max-w-3xl mx-auto">
                {images[selectedIndex].caption}
              </p>
            )}
            
            {/* Mobile Swipe Hint + Arrows */}
            {images.length > 1 && (
              <div className="sm:hidden flex items-center justify-center gap-2 mb-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="p-2 rounded-full bg-white/10 active:bg-white/25 text-white border border-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white/50 text-xs px-2">Swipe or tap</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="p-2 rounded-full bg-white/10 active:bg-white/25 text-white border border-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Thumbnail Strip - Desktop/Tablet */}
            {images.length > 1 && (
              <div className="hidden sm:flex items-center justify-center gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-4xl mx-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                    className={cn(
                      "relative w-14 h-10 md:w-16 md:h-12 lg:w-20 lg:h-14 rounded-lg overflow-hidden transition-all shrink-0 border-2",
                      selectedIndex === index 
                        ? "border-primary ring-2 ring-primary/50 scale-110 z-10 opacity-100" 
                        : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/40"
                    )}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Mobile Dots Indicator */}
            {images.length > 1 && images.length <= 12 && (
              <div className="sm:hidden flex items-center justify-center gap-1.5 flex-wrap">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      selectedIndex === index 
                        ? "bg-primary w-4 scale-110" 
                        : "bg-white/40 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

interface VideoGalleryProps {
  videos: Array<{
    youtube_id: string;
    title: string;
    description?: string | null;
  }>;
  title: string;
  emptyMessage?: string;
}

export function VideoGallery({ videos, title, emptyMessage = "Match videos coming soon" }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (!videos || videos.length === 0) {
    return (
      <div className="esports-card p-6">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
          <Play className="w-6 h-6 text-primary" />
          {title}
        </h2>
        <div className="text-center py-12 text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="esports-card p-6">
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
        <Play className="w-6 h-6 text-primary" />
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <button
            key={video.youtube_id}
            onClick={() => setSelectedVideo(video.youtube_id)}
            className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer bg-muted"
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                <Play className="w-8 h-8 text-primary ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-heading text-sm line-clamp-2">{video.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          style={{ top: '72px' }}
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="w-full max-w-5xl aspect-video px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ComingSoonVideoProps {
  videoId: string;
}

export function ComingSoonVideo({ videoId }: ComingSoonVideoProps) {
  return (
    <div className="esports-card p-6">
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
        <Play className="w-6 h-6 text-secondary" />
        Event Preview
      </h2>
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
