
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
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? articles.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, articles.length]);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === articles.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, articles.length]);

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 7000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);

    if (!articles || articles.length === 0) {
        return null;
    }

    const currentArticle = articles[currentIndex];

    return (
        <section className="relative w-full h-[75vh] sm:h-[60vh] rounded-xl overflow-hidden group shadow-2xl">
            <div
                style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
                className="w-full h-full bg-center bg-cover duration-500"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                <span className="inline-block bg-brand-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {currentArticle.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold font-serif leading-tight mb-4 max-w-4xl">
                    <Link to={`/article/${currentArticle.slug}`}>
                        {currentArticle.title}
                    </Link>
                </h1>
                <p className="text-base md:text-lg text-gray-200 max-w-3xl hidden md:block">{currentArticle.excerpt}</p>
            </div>

            {/* Left Arrow */}
            <button 
                onClick={prevSlide}
                className="absolute top-1/2 -translate-y-1/2 left-5 text-white bg-black/30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            {/* Right Arrow */}
            <button 
                onClick={nextSlide}
                className="absolute top-1/2 -translate-y-1/2 right-5 text-white bg-black/30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
                {articles.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentIndex === slideIndex ? 'bg-brand-primary scale-125' : 'bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;