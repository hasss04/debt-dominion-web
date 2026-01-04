"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react";

/* ---------------- INLINE AUDIO READER WITH WORKING VOLUME ---------------- */
const AudioReader: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const articleTextRef = useRef<string>("");
  const wordsRef = useRef<{ word: string; element: HTMLElement; originalText: string }[]>([]);
  const isStoppingRef = useRef(false);
  const currentWordIndexRef = useRef(0);
  const highlightedIndexRef = useRef(-1);

  // Parse article and wrap each word in a span for reliable highlighting
  const prepareArticleForHighlighting = () => {
    const el = document.getElementById("article-content");
    if (!el) {
      console.log("❌ Article content element not found");
      return { text: "", words: [] };
    }

    // Check if already prepared
    if (el.querySelector('.tts-word')) {
      console.log("✅ Article already prepared");
      return extractPreparedText();
    }

    const words: { word: string; element: HTMLElement; originalText: string }[] = [];
    let fullText = "";

    // Walk through all text nodes
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToReplace: { node: Node; parent: HTMLElement; spans: HTMLElement[] }[] = [];

    let node;
    while (node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;

      const text = node.textContent || '';
      const textWords = text.split(/(\s+)/).filter(t => t.length > 0);
      
      const spans: HTMLElement[] = [];

      textWords.forEach(token => {
        if (token.trim().length > 0) {
          // It's a word
          const span = document.createElement('span');
          span.className = 'tts-word';
          span.textContent = token;
          span.style.transition = 'background-color 0.2s, color 0.2s';
          spans.push(span);
          
          words.push({
            word: token,
            element: span,
            originalText: token
          });
          
          fullText += token + ' ';
        } else {
          // It's whitespace
          const span = document.createElement('span');
          span.textContent = token;
          spans.push(span);
        }
      });

      if (spans.length > 0) {
        nodesToReplace.push({ node, parent, spans });
      }
    }

    // Replace text nodes with spans
    nodesToReplace.forEach(({ node, parent, spans }) => {
      const fragment = document.createDocumentFragment();
      spans.forEach(span => fragment.appendChild(span));
      parent.replaceChild(fragment, node);
    });

    wordsRef.current = words;
    articleTextRef.current = fullText.trim();

    console.log(`✅ Prepared ${words.length} words for highlighting`);

    return { text: fullText.trim(), words };
  };

  // Extract text from already prepared article
  const extractPreparedText = () => {
    const el = document.getElementById("article-content");
    if (!el) return { text: "", words: [] };

    const wordElements = Array.from(el.querySelectorAll('.tts-word')) as HTMLElement[];
    const words = wordElements.map(elem => ({
      word: elem.textContent || '',
      element: elem,
      originalText: elem.textContent || ''
    }));

    const text = words.map(w => w.word).join(' ');

    wordsRef.current = words;
    articleTextRef.current = text;

    return { text, words };
  };

  // Highlight specific word by index
  const highlightWord = (wordIndex: number) => {
    // Remove previous highlight
    if (highlightedIndexRef.current >= 0 && highlightedIndexRef.current < wordsRef.current.length) {
      const prevWord = wordsRef.current[highlightedIndexRef.current];
      prevWord.element.style.backgroundColor = '';
      prevWord.element.style.color = '';
      prevWord.element.style.padding = '';
      prevWord.element.style.borderRadius = '';
    }

    // Add new highlight
    if (wordIndex >= 0 && wordIndex < wordsRef.current.length) {
      const currentWord = wordsRef.current[wordIndex];
      currentWord.element.style.backgroundColor = '#fb923c';
      currentWord.element.style.color = 'white';
      currentWord.element.style.padding = '2px 4px';
      currentWord.element.style.borderRadius = '4px';
      
      highlightedIndexRef.current = wordIndex;
    }
  };

  // Remove all highlights
  const removeAllHighlights = () => {
    wordsRef.current.forEach(({ element }) => {
      element.style.backgroundColor = '';
      element.style.color = '';
      element.style.padding = '';
      element.style.borderRadius = '';
    });
    highlightedIndexRef.current = -1;
  };

  // Check if browser supports speech synthesis
  const isSpeechSupported = () => {
    return 'speechSynthesis' in window;
  };

  // Start reading from specific word index
  const startReadingFrom = (wordIndex: number) => {
    if (!isSpeechSupported()) {
      setError("Your browser doesn't support text-to-speech.");
      return;
    }

    let words = wordsRef.current;
    if (words.length === 0) {
      const prepared = prepareArticleForHighlighting();
      words = wordsRef.current;
      
      if (words.length === 0) {
        setError("No article content found to read.");
        return;
      }
    }

    // Clamp word index
    wordIndex = Math.max(0, Math.min(wordIndex, words.length - 1));
    currentWordIndexRef.current = wordIndex;
    isStoppingRef.current = false;
    setError("");

    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("Speech cancel error:", e);
    }

    removeAllHighlights();

    setTimeout(() => {
      if (isStoppingRef.current) return;

      // Get text from word index onwards
      const textToSpeak = words.slice(wordIndex).map(w => w.word).join(' ');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speed;
      utterance.volume = isMuted ? 0 : volume; // ✅ Apply current volume
      utterance.pitch = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        if (!isStoppingRef.current) {
          setIsPlaying(true);
          setIsPaused(false);
          highlightWord(wordIndex);
        }
      };

      utterance.onend = () => {
        if (!isStoppingRef.current) {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(100);
          removeAllHighlights();
        }
      };

      utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error("Speech error:", event.error);
          setError(`Speech error: ${event.error}`);
        }
        
        if (!isStoppingRef.current) {
          setIsPlaying(false);
          setIsPaused(false);
          removeAllHighlights();
        }
      };

      utterance.onboundary = (event) => {
        if (isStoppingRef.current) return;
        
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          
          // Calculate which word we're at in the remaining text
          let currentChar = 0;
          const remainingWords = words.slice(wordIndex);
          
          for (let i = 0; i < remainingWords.length; i++) {
            const wordLength = remainingWords[i].word.length;
            
            if (currentChar <= charIndex && charIndex < currentChar + wordLength) {
              const actualIndex = wordIndex + i;
              currentWordIndexRef.current = actualIndex;
              highlightWord(actualIndex);
              
              // Calculate progress
              const progressPercent = Math.min(100, (actualIndex / words.length) * 100);
              setProgress(progressPercent);
              break;
            }
            
            currentChar += wordLength + 1; // +1 for space
          }
        }
      };

      utteranceRef.current = utterance;
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Failed to start speech:", e);
        setError("Failed to start audio playback.");
        setIsPlaying(false);
      }
    }, 150);
  };

  // Start reading from beginning
  const startReading = () => {
    setTimeout(() => {
      prepareArticleForHighlighting();
      startReadingFrom(0);
    }, 100);
  };

  // Pause reading
  const pauseReading = () => {
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } catch (e) {
      console.warn("Pause error:", e);
    }
  };

  // Resume reading
  const resumeReading = () => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } catch (e) {
      console.warn("Resume error:", e);
    }
  };

  // Stop reading
  const stopReading = () => {
    isStoppingRef.current = true;
    
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("Stop error:", e);
    }
    
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    currentWordIndexRef.current = 0;
    removeAllHighlights();
    
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 200);
  };

  // Skip backward (10 seconds ≈ 30 words at normal speed)
  const skipBackward = () => {
    const wordsToSkip = Math.floor(30 * speed);
    const newIndex = Math.max(0, currentWordIndexRef.current - wordsToSkip);
    
    stopReading();
    setTimeout(() => {
      startReadingFrom(newIndex);
    }, 300);
  };

  // Skip forward (10 seconds ≈ 30 words at normal speed)
  const skipForward = () => {
    const wordsToSkip = Math.floor(30 * speed);
    const newIndex = Math.min(wordsRef.current.length - 1, currentWordIndexRef.current + wordsToSkip);
    
    stopReading();
    setTimeout(() => {
      startReadingFrom(newIndex);
    }, 300);
  };

  // Handle progress bar drag/click
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsDragging(false);
    
    const newProgress = parseFloat((e.target as HTMLInputElement).value);
    
    if (wordsRef.current.length === 0) {
      prepareArticleForHighlighting();
    }
    
    const totalWords = wordsRef.current.length;
    const wordIndex = Math.floor((newProgress / 100) * totalWords);
    
    if (isPlaying || isPaused) {
      stopReading();
      setTimeout(() => {
        startReadingFrom(wordIndex);
      }, 300);
    } else {
      currentWordIndexRef.current = wordIndex;
      highlightWord(wordIndex);
      setProgress(newProgress);
    }
  };

  // Update speed
  const updateSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying && utteranceRef.current) {
      const currentWord = currentWordIndexRef.current;
      stopReading();
      setTimeout(() => {
        startReadingFrom(currentWord);
      }, 300);
    }
  };

  // FIXED: Update volume with restart if playing
  const updateVolume = (newVolume: number) => {
    const oldVolume = volume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    // If currently playing, restart with new volume
    if (isPlaying && !isPaused) {
      const currentWord = currentWordIndexRef.current;
      
      // Only restart if volume changed significantly (avoid too many restarts during drag)
      if (Math.abs(newVolume - oldVolume) >= 0.1) {
        stopReading();
        setTimeout(() => {
          startReadingFrom(currentWord);
        }, 200);
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // If currently playing, restart with new mute state
    if (isPlaying && !isPaused) {
      const currentWord = currentWordIndexRef.current;
      stopReading();
      setTimeout(() => {
        startReadingFrom(currentWord);
      }, 200);
    }
  };

  // ✅ NEW: Handle volume slider mouse up (apply final volume)
  const handleVolumeMouseUp = () => {
    if (isPlaying && !isPaused) {
      const currentWord = currentWordIndexRef.current;
      stopReading();
      setTimeout(() => {
        startReadingFrom(currentWord);
      }, 200);
    }
  };

  // Prepare article on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      prepareArticleForHighlighting();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isStoppingRef.current = true;
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore cleanup errors
      }
      removeAllHighlights();
    };
  }, []);

  return (
    <div className="sticky top-4 z-10 my-6 p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Audio Player
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Draggable Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span className="font-medium">{isPlaying ? (isPaused ? "Paused" : "Playing") : "Ready"}</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          onMouseDown={handleProgressMouseDown}
          onMouseUp={handleProgressMouseUp}
          onTouchStart={handleProgressMouseDown}
          onTouchEnd={handleProgressMouseUp}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`
          }}
        />
      </div>

      {/* Play Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={skipBackward}
          disabled={!isPlaying && !isPaused}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-orange-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Skip Backward 10s"
        >
          <RotateCcw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </button>

        {!isPlaying ? (
          <button
            onClick={startReading}
            className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            title="Play"
          >
            <Play className="w-6 h-6 text-white" fill="white" />
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeReading}
            className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            title="Resume"
          >
            <Play className="w-6 h-6 text-white" fill="white" />
          </button>
        ) : (
          <button
            onClick={pauseReading}
            className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            title="Pause"
          >
            <Pause className="w-6 h-6 text-white" fill="white" />
          </button>
        )}

        <button
          onClick={skipForward}
          disabled={!isPlaying && !isPaused}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-orange-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Skip Forward 10s"
        >
          <RotateCw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {/* Speed & Volume Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Speed */}
        <div>
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-2">
            <span className="font-medium">Speed</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">{speed}x</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[0.75, 1, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => updateSpeed(s)}
                className={`py-1.5 text-xs rounded-md font-semibold transition-all ${
                  speed === s
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-2">
            <span className="font-medium">Volume {Math.round(volume * 100)}%</span>
            <button onClick={toggleMute} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => updateVolume(parseFloat(e.target.value))}
            onMouseUp={handleVolumeMouseUp}
            onTouchEnd={handleVolumeMouseUp}
            className="w-full h-1.5 accent-orange-500 cursor-pointer"
          />
        </div>
      </div>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
        Drag the progress bar to skip • Scroll freely while listening
      </p>
    </div>
  );
};

export default AudioReader;
