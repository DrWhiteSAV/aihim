import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function GoogleCallbackPage() {
  const [phase, setPhase] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    const processSession = async (userId: string, metadata: Record<string, any>, email: string | null) => {
      if (processedRef.current) return;
      processedRef.current = true;

      // Clear auth hash
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      const displayName = metadata?.full_name || metadata?.name || email?.split('@')[0] || 'Алхимик';
      const avatarUrl = metadata?.avatar_url || metadata?.picture || null;

      // Check/create profile
      const { data: existing } = await supabase
        .from('profiles')
        .select('uid')
        .eq('uid', userId)
        .maybeSingle();

      if (!existing) {
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await supabase.from('profiles').insert({
          uid: userId,
          email,
          display_name: displayName,
          avatar_url: avatarUrl,
          balance: 1000,
          role: 'player',
          level: 1,
          referral_code: referralCode,
          referral_count: 0,
          referral_earnings: 0,
        });
      } else {
        await supabase.from('profiles').update({
          email,
          display_name: displayName,
          avatar_url: avatarUrl,
        }).eq('uid', userId);
      }

      // Process pending referral
      const refCode = sessionStorage.getItem('pending_ref') || localStorage.getItem('pending_ref');
      if (refCode) {
        sessionStorage.removeItem('pending_ref');
        localStorage.removeItem('pending_ref');
        try {
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
          await fetch(`${SUPABASE_URL}/functions/v1/handle-referral`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ user_uid: userId, referrer_referral_code: refCode }),
          });
        } catch (e) {
          console.error('[GoogleCallback] referral error:', e);
        }
      }

      window.location.replace('/');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        await processSession(session.user.id, session.user.user_metadata, session.user.email || null);
      }
    });

    setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        subscription.unsubscribe();
        await processSession(data.session.user.id, data.session.user.user_metadata, data.session.user.email || null);
      } else if (!processedRef.current) {
        subscription.unsubscribe();
        setErrorMsg('Ошибка входа. Попробуйте ещё раз.');
        setPhase('error');
        setTimeout(() => window.location.replace('/'), 3000);
      }
    }, 2000);

    return () => subscription.unsubscribe();
  }, []);

  if (phase === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-parchment">
        <div className="text-5xl">❌</div>
        <p className="text-lg font-bold text-sepia">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-parchment">
      <div className="h-16 w-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
      <p className="text-lg font-gothic text-sepia">Завершаем вход через Google...</p>
    </div>
  );
}
