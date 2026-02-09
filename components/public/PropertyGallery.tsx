"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Grid as GridIcon, Maximize2 } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[400px] lg:h-[550px] relative z-10">
        {/* Main large image */}
        <div 
            className="lg:col-span-2 h-[300px] sm:h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer"
            onClick={() => openLightbox(0)}
        >
          <img 
            src={images[0]} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
             View Fullscreen
          </div>
        </div>

        {/* Side grid - Desktop Only */}
        <div className="hidden lg:grid grid-cols-1 gap-4 h-full">
          {images.slice(1, 4).map((img, i) => (
            <div 
                key={i} 
                className="h-full rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer"
                onClick={() => openLightbox(i + 1)}
            >
              <img src={img} alt={`${title} ${i+2}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              
              {/* Overlay for the last image if there are more */}
              {i === 2 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center group-hover:bg-black/70 transition-colors">
                  <span className="font-black text-2xl mb-1">+{images.length - 4}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">More Photos</span>
                </div>
              )}
            </div>
          ))}
          
          {/* Fallback frame if fewer images */}
          {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, i) => (
              <div key={`placeholder-${i}`} className="hidden lg:flex h-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 items-center justify-center">
                  <div className="text-center opacity-40">
                      <GridIcon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">More coming soon</span>
                  </div>
              </div>
          ))}
        </div>
        
        {/* Mobile "View All" button overlay */}
        <button 
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 lg:hidden bg-white text-black text-xs font-black px-4 py-2 rounded-full shadow-lg border border-gray-100 z-20 flex items-center gap-2"
        >
            <GridIcon className="h-3 w-3" />
            View Gallery ({images.length})
        </button>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200">
            {/* Close button */}
            <button 
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110]"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/50 text-xs font-black uppercase tracking-widest z-[110]">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Main Image Container */}
            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center relative">
                <img 
                    src={images[currentIndex]} 
                    alt={title} 
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl relative z-0"
                />

                {/* Navigation Arrows */}
                <button 
                    onClick={prevImage}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all sm:flex hidden z-[110]"
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                
                <button 
                    onClick={nextImage}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all sm:flex hidden z-[110]"
                >
                    <ChevronRight className="h-8 w-8" />
                </button>
            </div>

            {/* Thumbnails (Desktop) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex gap-2 p-2 bg-black/50 rounded-2xl backdrop-blur-md max-w-[90vw] overflow-x-auto">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                        className={`relative h-12 w-16 rounded-lg overflow-hidden transition-all ${currentIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                    >
                        <img src={img} className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
            
            {/* Mobile Swipe Hints (Simple overlay) */}
            <div className="absolute bottom-10 w-full text-center text-white/30 text-[10px] font-bold uppercase tracking-widest lg:hidden pointer-events-none">
                Swipe or Tap sides to navigate
            </div>

            {/* Mobile Tap Areas */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-10 lg:hidden" onClick={prevImage} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-10 lg:hidden" onClick={nextImage} />
        </div>
      )}
    </>
  );
}
