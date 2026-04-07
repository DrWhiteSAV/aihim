import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

export function BrowserLoginPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      sessionStorage.setItem('pending_ref', ref);
      localStorage.setItem('pending_ref', ref);
    }
  }, []);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 p-8 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 max-w-sm w-full"
      >
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <img 
            src="https://i.ibb.co/5g4dfh7f/aihim.png" 
            alt="AiHim" 
            className="relative h-[30vh] max-h-[200px] w-auto drop-shadow-2xl" 
          />
        </motion.div>

        <h1 className="text-4xl font-gothic uppercase tracking-widest text-gold drop-shadow-lg">AiHim</h1>
        <p className="text-sm text-sepia/60">Войдите, чтобы начать путь алхимика</p>

        <div className="w-full parchment-card p-8 space-y-4 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sepia/40">Вход через браузер</p>
          <GoogleAuthButton mode="signin" className="w-full" onError={setError} />
          
          <div className="flex items-center gap-3 text-sepia/30 text-xs">
            <div className="flex-1 h-px bg-sepia/10" />
            <span>или</span>
            <div className="flex-1 h-px bg-sepia/10" />
          </div>
          
          <a
            href="https://t.me/AI_HimBot/app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gold/20 bg-parchment px-6 py-3 text-sm font-bold transition-all hover:bg-gold/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#229ED9]">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            Войти через Telegram
          </a>

          {error && (
            <p className="text-xs text-red-600 bg-red-100 rounded-xl p-3">{error}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
