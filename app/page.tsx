'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Laugh, CloudRain, Zap, Coffee, Ghost } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const moods = [
  { id: 'happy', name: 'Happy', icon: Laugh, color: 'text-yellow-400', bg: 'bg-yellow-400', hex: 'rgba(250, 204, 21, 0.2)' },
  { id: 'sad', name: 'Sad', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400', hex: 'rgba(96, 165, 250, 0.2)' },
  { id: 'energetic', name: 'Energetic', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400', hex: 'rgba(251, 146, 60, 0.2)' },
  { id: 'bored', name: 'Bored', icon: Coffee, color: 'text-purple-400', bg: 'bg-purple-400', hex: 'rgba(192, 132, 252, 0.2)' },
  { id: 'lonely', name: 'Lonely', icon: Ghost, color: 'text-indigo-400', bg: 'bg-indigo-400', hex: 'rgba(129, 140, 248, 0.2)' },
];

const quotes = [
  "Disconnect from the noise. Find your frequency in the void.",
  "Express your true feelings without fear of judgment.",
  "Anonymity is the ultimate freedom to just be yourself.",
  "Connect instantly. Match your vibe. Start talking.",
  "Your mood is your ticket. Find someone who understands."
];

const floatingEmojis = [
  { icon: '🥰', top: '15%', left: '10%', delay: 0, size: 'text-6xl' },
  { icon: '😎', top: '70%', left: '15%', delay: 2, size: 'text-7xl' },
  { icon: '🤝', top: '25%', right: '12%', delay: 1, size: 'text-8xl' },
  { icon: '🌐', top: '65%', right: '8%', delay: 3, size: 'text-6xl' },
  { icon: '🤭', top: '45%', left: '5%', delay: 1.5, size: 'text-5xl' },
  { icon: '😜', top: '80%', right: '25%', delay: 2.5, size: 'text-5xl' },
  { icon: '🥺', top: '20%', right: '35%', delay: 1.8, size: 'text-7xl' },
  { icon: '🤯', top: '85%', left: '35%', delay: 0.5, size: 'text-6xl' },
  { icon: '🤠', top: '40%', right: '20%', delay: 2.2, size: 'text-7xl' },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || showGreeting) return;
    const currentQuote = quotes[quoteIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));
        }, 20); // Extrafast deleting speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 200); // Small pause before typing next
      }
    } else {
      // typing
      if (displayedText.length < currentQuote.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1));
        }, 50); // typing speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000); // pause at the end
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, quoteIndex, mounted, showGreeting]);

  const handleEnterAsGuest = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Redirect to chat with mood
        router.push(`/chat?mood=${selectedMood}`);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine ambient glow color based on hover or selection
  const activeMoodId = hoveredMood || selectedMood;
  const activeMoodObj = moods.find(m => m.id === activeMoodId);
  const auraGlow = activeMoodObj ? activeMoodObj.hex : 'rgba(99, 102, 241, 0.05)'; 

  return (
    <div className="text-slate-900 dark:text-slate-100 flex flex-col relative overflow-x-hidden bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-indigo-500/30 transition-colors duration-500">
      <ThemeToggle className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 text-slate-800 dark:text-slate-200" />
      
      {/* Dynamic Mesh Ambient Background & 3D Emojis */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: 1000 }}>
          {/* Volumetric 3D Floating Emojis */}
          {floatingEmojis.map((emoji, i) => (
            <motion.div
              key={i}
              className={`absolute ${emoji.size} opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen drop-shadow-2xl`}
              style={{
                ...(emoji.top && { top: emoji.top }),
                ...(emoji.left && { left: emoji.left }),
                ...(emoji.right && { right: emoji.right }),
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(2px 20px 20px rgba(0,0,0,0.5)) brightness(1.1)'
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, -30, 0],
                rotateZ: [0, 15, -15, 0],
                rotateX: [15, -35, 35, 15],
                rotateY: [-15, 40, -40, -15],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 14 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: emoji.delay,
              }}
            >
              {emoji.icon}
            </motion.div>
          ))}

          <motion.div 
            animate={{ backgroundColor: auraGlow }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
          />
          <motion.div
            animate={{ 
              x: [0, 50, -50, 0], 
              y: [0, -50, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/30 dark:bg-indigo-900/40 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
          />
          <motion.div
             animate={{ 
              x: [0, -60, 40, 0], 
              y: [0, 60, -40, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-400/20 dark:bg-purple-900/30 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />
          <motion.div
             animate={{ backgroundColor: activeMoodObj ? activeMoodObj.hex.replace('0.2', '0.4') : 'rgba(99,102,241,0.1)' }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] rounded-full blur-[140px] opacity-60 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen"
          />
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-center w-full p-4 sm:p-6 relative z-10">
        {mounted && (
        <AnimatePresence mode="wait">
        {showGreeting ? (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-12 z-10 w-full max-w-3xl text-center min-h-[50vh]"
          >
            <div className="space-y-4">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
               >
                 <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">Anonymous Chat Network</span>
               </motion.div>
               <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-700 to-slate-400 dark:from-white dark:via-slate-200 dark:to-slate-500 drop-shadow-xl dark:drop-shadow-2xl">
                 Welcome
               </h1>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl font-serif italic tracking-wide max-w-xl leading-relaxed">
              Step into a world where your feelings connect you seamlessly with others.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGreeting(false)}
              className="group relative mt-12 px-12 py-5 flex items-center justify-center gap-3 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 transition-all font-bold tracking-[0.2em] uppercase text-sm text-slate-800 dark:text-white overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:border-slate-300 dark:hover:border-white/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-slate-900/5 dark:via-white/10 to-indigo-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10">Enter The Void</span>
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-300 relative z-10 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center"
          >
            {/* Elegant Minimalist Branding Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1, duration: 1.2, ease: 'easeOut' }}
              className="mx-auto flex flex-col items-center justify-center py-6 mb-12 w-full"
            >
              <div className="relative flex flex-col items-center justify-center cursor-default">
                {/* Clean, Thin, Spaced-out Typography */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-[0.4em] md:tracking-[0.6em] pl-4 text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 uppercase relative z-10 drop-shadow-sm">
                  CONEMO
                </h1>
                
                {/* Subtle Brand Accent Line */}
                <div className="flex items-center gap-4 mt-6 opacity-70">
                  <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-indigo-500/50"></span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] dark:shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                  <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-indigo-500/50"></span>
                </div>
              </div>
            </motion.div>

            {/* Glowing Typewriter Box */}
            <div className="w-full max-w-2xl mx-auto mb-12 relative group rounded-2xl p-[1px] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 dark:via-indigo-500/30 to-purple-500/0 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-2xl py-6 px-8 flex items-center justify-center border border-slate-200 dark:border-white/5 shadow-inner">
                 <p className="text-slate-800 dark:text-slate-300 text-sm md:text-lg font-serif italic tracking-wide leading-relaxed text-center h-[40px] md:h-[28px] flex items-center justify-center">
                   &quot;{displayedText}<span className="inline-block w-[2px] h-5 bg-indigo-500 dark:bg-indigo-400 ml-1.5 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)] dark:shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>&quot;
                 </p>
               </div>
            </div>

            {/* Premium Glassmorphism Mood Card */}
            <motion.div 
              animate={{ borderColor: activeMoodObj ? activeMoodObj.hex.replace('0.2', '0.4') : 'rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.5 }}
              className="w-full bg-white/70 dark:bg-[#0a0f1d]/60 backdrop-blur-3xl p-6 sm:p-10 rounded-[2.5rem] border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-500/[0.02] dark:from-white/[0.03] to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-slate-500 dark:text-slate-400 font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-8 flex items-center justify-center gap-4">
                  <span className="hidden sm:block w-12 h-[1px] bg-gradient-to-r from-transparent to-slate-400/50 dark:to-slate-500/50"></span>
                  How are you feeling?
                  <span className="hidden sm:block w-12 h-[1px] bg-gradient-to-l from-transparent to-slate-400/50 dark:to-slate-500/50"></span>
                </h2>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 mb-10">
                  {moods.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    const isHovered = hoveredMood === mood.id;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        onMouseEnter={() => setHoveredMood(mood.id)}
                        onMouseLeave={() => setHoveredMood(null)}
                        className={`group flex flex-col items-center gap-3 p-3 md:p-5 rounded-[1.75rem] w-[calc(50%-0.4rem)] sm:w-[calc(33.33%-0.7rem)] md:w-auto md:flex-1 transition-all duration-500 relative outline-none ${
                          isSelected
                            ? 'bg-white shadow-xl dark:bg-white/10 dark:shadow-2xl scale-105'
                            : 'bg-white/40 hover:bg-white/80 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] hover:-translate-y-2'
                        }`}
                        style={isSelected || isHovered ? { boxShadow: `0 0 30px -10px ${mood.hex.replace('0.2', '0.8')}` } : { border: '1px solid rgba(15,23,42,0.05)' }}
                      >
                        {isSelected && (
                          <motion.div layoutId="activeMoodSelection" className="absolute inset-0 rounded-[1.75rem] border-2" style={{ borderColor: mood.hex.replace('0.2', '0.6') }}></motion.div>
                        )}
                        
                        <div className={`p-4 rounded-2xl relative z-10 transition-all duration-500 border border-slate-900/5 dark:border-white/5 shadow-inner ${
                           isSelected || isHovered ? `${mood.bg} ${isSelected ? 'text-slate-900' : 'text-slate-800'}` : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                        }`}>
                          <mood.icon className={`w-6 h-6 md:w-8 md:h-8 transition-transform duration-500 ${isSelected || isHovered ? 'scale-110' : ''}`} />
                        </div>
                        <span className={`text-sm md:text-base font-bold tracking-wide relative z-10 transition-colors duration-300 ${isSelected || isHovered ? 'text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md' : 'text-slate-600 dark:text-slate-400'}`}>
                          {mood.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  disabled={!selectedMood || loading}
                  onClick={handleEnterAsGuest}
                  whileHover={selectedMood && !loading ? { scale: 1.02 } : {}}
                  whileTap={selectedMood && !loading ? { scale: 0.98 } : {}}
                  className={`w-full sm:w-2/3 mx-auto py-5 px-8 rounded-2xl font-bold text-base md:text-lg tracking-[0.1em] transition-all duration-500 relative overflow-hidden flex items-center justify-center gap-3 ${
                    selectedMood && !loading
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] cursor-pointer'
                      : 'bg-white/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed group'
                  }`}
                  style={selectedMood && !loading ? { boxShadow: `0 0 30px 0 ${activeMoodObj?.hex.replace('0.2', '0.5')}` } : {}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 mix-blend-difference dark:mix-blend-normal">
                    {loading ? <Sparkles className="animate-spin w-5 h-5" /> : null}
                    <span className="text-white dark:text-slate-900">{loading ? 'Initializing Connection...' : 'Start Session'}</span>
                  </span>
                  {selectedMood && !loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-400/20 to-transparent opacity-20 -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
        )}
      </main>
      
      <footer className="w-full relative z-40 py-6 sm:py-8 border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/40 backdrop-blur-xl mt-auto">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
            <span className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-default">Secure</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-default">Anonymous</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-default">Safe</span>
          </div>
          <p className="text-slate-500 dark:text-slate-600 mt-1 sm:mt-2 text-[10px] tracking-widest uppercase flex items-center gap-1.5 opacity-80">
            Made with <span className="text-red-500/80 animate-pulse text-sm drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] dark:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">♥</span> for the community
          </p>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        @keyframes hue-shift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}} />
    </div>
  );
}
