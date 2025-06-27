// ============================================
// PROFESSIONAL GALLERY SLIDER - Homepage Hero Gallery
// Modern, responsive, auto-sliding gallery with professional animations
// ============================================

"use client";

import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useActiveGallerySlides } from "@/hooks/useGallery";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/parallax";

export function ProfessionalGallerySlider() {
  const { data: slides, isLoading, error } = useActiveGallerySlides();
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(null);

  // Set background images dynamically
  useEffect(() => {
    const bgElements = document.querySelectorAll(".gallery-bg-image[data-bg-image]");
    bgElements.forEach(element => {
      const bgImage = element.getAttribute("data-bg-image");
      if (bgImage) {
        (element as HTMLElement).style.backgroundImage = `url(${bgImage})`;
      }
    });
  }, [slides]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!swiperInstance) return;

      if (e.key === "ArrowLeft") {
        swiperInstance.slidePrev();
      } else if (e.key === "ArrowRight") {
        swiperInstance.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [swiperInstance]);

  if (isLoading) {
    return (
      <div className="relative h-[400px] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-20 md:h-[500px] lg:h-[600px] xl:h-[700px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            <p className="text-lg font-medium">Loading Gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !slides || slides.length === 0) {
    return (
      <div className="relative h-[400px] bg-gradient-to-br from-gray-800 via-gray-900 to-black pt-20 md:h-[500px] lg:h-[600px] xl:h-[700px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4 text-6xl">📷</div>
            <h3 className="mb-2 text-xl font-semibold">Gallery Coming Soon</h3>
            <p className="text-gray-300">Our gallery content is being prepared.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative z-0 h-[400px] overflow-hidden pt-20 md:h-[500px] lg:h-[600px] xl:h-[700px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        parallax={true}
        loop={slides.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          el: ".swiper-pagination-custom",
          clickable: true,
          bulletClass: "gallery-bullet",
          bulletActiveClass: "gallery-bullet-active",
        }}
        speed={1000}
        className="h-full w-full"
        onSwiper={swiper => {
          setSwiperInstance(swiper);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image with Parallax */}
            <div
              className="gallery-bg-image absolute inset-0 bg-cover bg-center bg-no-repeat"
              data-swiper-parallax="-300"
              data-bg-image={slide.image_url}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl">
                  {/* Animated Content */}
                  <div data-swiper-parallax="-600">
                    {slide.subtitle && (
                      <p className="mb-2 text-sm font-medium tracking-wider text-blue-200 uppercase md:mb-4 md:text-base lg:text-lg">
                        {slide.subtitle}
                      </p>
                    )}
                    <h1 className="mb-4 text-3xl leading-tight font-bold text-white md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl">
                      {slide.title}
                    </h1>
                  </div>

                  <div data-swiper-parallax="-400">
                    {slide.description && (
                      <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-200 md:mb-8 md:text-lg lg:text-xl">
                        {slide.description}
                      </p>
                    )}
                  </div>

                  <div data-swiper-parallax="-200">
                    {slide.link_url && slide.link_text && (
                      <a
                        href={slide.link_url}
                        className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl md:px-8 md:py-4 md:text-lg"
                      >
                        {slide.link_text}
                        <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Counter */}
            <div className="absolute right-4 bottom-4 rounded-full bg-black/30 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm md:right-6 md:bottom-6">
              {index + 1} / {slides.length}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            className="swiper-button-prev-custom group absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 md:left-6 md:p-3"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 md:h-6 md:w-6" />
          </button>
          <button
            className="swiper-button-next-custom group absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 md:right-6 md:p-3"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {slides.length > 1 && (
        <div className="swiper-pagination-custom absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2 md:bottom-6"></div>
      )}
    </section>
  );
}
