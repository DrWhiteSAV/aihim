import React, { createContext, useContext } from 'react';
import { useTelegramAuth, TelegramUser, UserProfile, EntryMode } from '../hooks/useTelegramAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: TelegramUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  entryMode: EntryMode;
  updateBalance: (newBalance: number) => Promise<void>;
  logout: () => void;
  refetchProfile: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { telegramUser, profile, isLoading, entryMode, refetchProfile } = useTelegramAuth();

  const updateBalance = async (newBalance: number) => {
    if (!profile) return;
    await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('uid', profile.uid);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{
      user: telegramUser,
      profile,
      loading: isLoading,
      isAuthReady: !isLoading,
      entryMode,
      updateBalance,
      logout,
      refetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
