import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface UserProfile {
  uid: string;
  telegram_id: string | null;
  display_name: string;
  username: string | null;
  telegram_profile_url: string | null;
  avatar_url: string | null;
  email: string | null;
  role: string;
  balance: number;
  level: number;
  referral_code: string | null;
  referral_count: number;
  referral_earnings: number;
  referred_by: string | null;
  referred_code: string | null;
  created_at: string;
}

export type EntryMode = 'lovable' | 'telegram' | 'browser';

export function detectEntryMode(): EntryMode {
  const hostname = window.location.hostname;
  const href = window.location.href;

  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initDataUnsafe?.user || (tg?.initData && tg.initData.length > 0)) {
    return 'telegram';
  }

  try {
    if (window.self !== window.top) return 'lovable';
  } catch (_) {
    return 'lovable';
  }

  if (href.includes('id-preview--') || hostname.includes('lovable.dev')) {
    return 'lovable';
  }

  return 'browser';
}

export const LOVABLE_SUPER_USER: UserProfile = {
  uid: '00000000-0000-0000-0000-000000000001',
  telegram_id: '169262990',
  display_name: 'Создатель (Dev)',
  username: null,
  telegram_profile_url: null,
  avatar_url: null,
  email: null,
  role: 'superadmin',
  balance: 999999,
  level: 99,
  referral_code: 'DEVCODE',
  referral_count: 0,
  referral_earnings: 0,
  referred_by: null,
  referred_code: null,
  created_at: new Date().toISOString(),
};

export function useTelegramAuth() {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entryMode, setEntryMode] = useState<EntryMode>('browser');

  const refetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('uid', uid)
      .maybeSingle();
    if (data) setProfile(data as unknown as UserProfile);
  };

  useEffect(() => {
    const init = async () => {
      const mode = detectEntryMode();
      setEntryMode(mode);

      if (mode === 'lovable') {
        setProfile(LOVABLE_SUPER_USER);
        setIsLoading(false);
        return;
      }

      if (mode === 'browser') {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const u = sessionData.session.user;
          const browserDisplayName =
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email?.split('@')[0] ||
            'Алхимик';

          setTelegramUser({
            id: 0,
            first_name: browserDisplayName,
            username: u.email?.split('@')[0],
            photo_url: u.user_metadata?.avatar_url || u.user_metadata?.picture || undefined,
          });

          const { data: browserProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('uid', u.id)
            .maybeSingle();

          if (browserProfile) {
            setProfile(browserProfile as unknown as UserProfile);

            // Process pending referral
            const pendingRef = localStorage.getItem('pending_ref');
            if (pendingRef && !browserProfile.referred_by && !browserProfile.referred_code) {
              localStorage.removeItem('pending_ref');
              sessionStorage.removeItem('pending_ref');
              try {
                const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-referral`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  },
                  body: JSON.stringify({ user_uid: u.id, referrer_referral_code: pendingRef }),
                });
                const result = await res.json();
                if (result.success) {
                  const { data: refreshed } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('uid', u.id)
                    .maybeSingle();
                  if (refreshed) setProfile(refreshed as unknown as UserProfile);
                }
              } catch (e) {
                console.error('[BrowserAuth] referral error:', e);
              }
            }
          } else {
            const displayName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Алхимик';
            const avatarUrl = u.user_metadata?.avatar_url || u.user_metadata?.picture || null;
            const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const { data: created } = await supabase
              .from('profiles')
              .upsert({
                uid: u.id,
                email: u.email || null,
                display_name: displayName,
                avatar_url: avatarUrl,
                balance: 1000,
                role: 'player',
                level: 1,
                referral_code: referralCode,
                referral_count: 0,
                referral_earnings: 0,
              }, { onConflict: 'uid' })
              .select()
              .single();
            if (created) setProfile(created as unknown as UserProfile);
          }
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        return;
      }

      // Telegram Mini App flow
      const tg = (window as any).Telegram?.WebApp;
      let user: TelegramUser | null = null;

      if (tg?.initDataUnsafe?.user) {
        user = tg.initDataUnsafe.user as TelegramUser;
        try { tg.expand(); } catch (_) {}
      } else {
        try {
          const raw = tg?.initData || '';
          if (raw) {
            const params = new URLSearchParams(raw);
            const userStr = params.get('user');
            if (userStr) user = JSON.parse(decodeURIComponent(userStr));
          }
        } catch (_) {}
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      setTelegramUser(user);

      const telegramIdStr = String(user.id);
      const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ');
      const usernameFormatted = user.username ? `@${user.username}` : null;
      const profileUrl = user.username
        ? `https://t.me/${user.username}`
        : `tg://user?id=${user.id}`;

      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramIdStr)
        .maybeSingle();

      let resultData: any = null;

      if (existing) {
        const { data: updated } = await supabase
          .from('profiles')
          .update({
            display_name: displayName,
            avatar_url: user.photo_url ?? null,
            username: usernameFormatted,
            telegram_profile_url: profileUrl,
          })
          .eq('telegram_id', telegramIdStr)
          .select()
          .single();
        resultData = updated;
      } else {
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const isSuperAdmin = user.id === 169262990;

        const { data: inserted } = await supabase
          .from('profiles')
          .insert({
            uid: crypto.randomUUID(),
            telegram_id: telegramIdStr,
            display_name: displayName,
            avatar_url: user.photo_url ?? null,
            username: usernameFormatted,
            telegram_profile_url: profileUrl,
            role: isSuperAdmin ? 'superadmin' : 'player',
            balance: 1000,
            level: 1,
            referral_code: referralCode,
            referral_count: 0,
            referral_earnings: 0,
          })
          .select()
          .single();
        resultData = inserted;
      }

      if (resultData) {
        setProfile(resultData as unknown as UserProfile);

        // Handle start_param for referrals
        const startParam: string | null =
          tg?.initDataUnsafe?.start_param ??
          (() => {
            try {
              const params = new URLSearchParams(tg?.initData || '');
              return params.get('start_param') ?? null;
            } catch (_) { return null; }
          })();

        if (startParam && /^\d+$/.test(startParam) && startParam !== String(user.id)) {
          try {
            const resp = await fetch(`${SUPABASE_URL}/functions/v1/handle-referral`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                user_uid: resultData.uid,
                referrer_telegram_id: startParam,
              }),
            });
            const result = await resp.json();
            if (result.success) {
              const { data: fresh } = await supabase
                .from('profiles')
                .select('*')
                .eq('uid', resultData.uid)
                .maybeSingle();
              if (fresh) setProfile(fresh as unknown as UserProfile);
            }
          } catch (e) {
            console.error('[TgAuth] referral error:', e);
          }
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  return { telegramUser, profile, isLoading, entryMode, refetchProfile };
}
