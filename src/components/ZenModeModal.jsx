import React, { useState } from 'react';
import { Volume2, VolumeX, X, CloudRain, Waves, Sparkles, Heart } from 'lucide-react';
import { playAmbientSound, stopAmbientSound } from '../services/soundSynth';

export default function ZenModeModal({ isOpen, onClose, quoteObj }) {
  const [activeSound, setActiveSound] = useState(null);

  if (!isOpen) return null;

  const handleSelectSound = (type) => {
    if (activeSound === type) {
      stopAmbientSound();
      setActiveSound(null);
    } else {
      playAmbientSound(type);
      setActiveSound(type);
    }
  };

  const handleClose = () => {
    stopAmbientSound();
    setActiveSound(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl animate-fade-in">
      
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all"
        title="Exit Zen Mode"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Zen Ambient Sound Controls Bar */}
      <div className="absolute top-6 left-6 flex items-center gap-2 bg-stone-900/80 border border-stone-800/80 p-1.5 rounded-full">
        <button
          onClick={() => handleSelectSound('rain')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeSound === 'rain' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          Gentle Rain
        </button>

        <button
          onClick={() => handleSelectSound('waves')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeSound === 'waves' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          Ocean Waves
        </button>

        <button
          onClick={() => handleSelectSound('zen')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeSound === 'zen' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Zen Chord
        </button>
      </div>

      {/* Main Focus Quote Display */}
      <div className="max-w-3xl text-center space-y-8 px-6">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
          <Volume2 className="w-6 h-6" />
        </div>

        <blockquote className="space-y-6">
          <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-100 leading-relaxed tracking-wide font-light">
            “{quoteObj ? quoteObj.quote : "Silence is a source of Great Strength."}”
          </p>
          <cite className="block not-italic font-sans text-sm font-bold tracking-widest text-amber-400/90 uppercase">
            — {quoteObj ? quoteObj.author : "Lao Tzu"}
          </cite>
        </blockquote>

        <p className="text-xs text-stone-500 font-sans tracking-wider">
          {activeSound ? `Now Playing Ambient ${activeSound.toUpperCase()} Soundscape` : "Select an ambient soundscape above to focus"}
        </p>
      </div>

    </div>
  );
}
