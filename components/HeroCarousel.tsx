import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../services/types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface HeroCarouselProps {
  articles: Article[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((idx) => (idx === 0 ? articles.length - 1 : idx - 1));
  }, [articles.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((idx) => (idx === articles.length - 1 ? 0 : idx + 1));
  }, [articles.length]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <section className="relative w-full min-h-[18rem] h-[52vh] sm:h-[60vh] lg:h-[68vh] rounded-xl overflow-hidden group shadow-2xl">
      <div
        style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
        className="w-full h-full bg-center bg-no-repeat bg-cover will-change-transform"
        role="img"
        aria-label={currentArticle.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 sm:p-8 lg:p-12 text-white max-w-[95%] sm:max-w-4xl">
        <span className="inline-block bg-brand-primary text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4">
          {currentArticle.category}
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif leading-tight mb-3 sm:mb-4">
          <Link to={`/article/${currentArticle.slug}`} className="hover:underline">
            {currentArticle.title}
          </Link>
        </h1>
        <p className="hidden md:block text-lg text-gray-200 max-w-3xl">
          {currentArticle.excerpt}
        </p>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-5 text-white bg-black/35 rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/55 focus:opacity-100 focus:outline-none"
      >
        <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-5 text-white bg-black/35 rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/55 focus:opacity-100 focus:outline-none"
      >
        <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {articles.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === slideIndex ? 'bg-brand-primary scale-110' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;