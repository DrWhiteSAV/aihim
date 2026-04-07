import React, { useMemo, useState } from 'react';
import { AlchemyElement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, User, Zap, Trophy, BookOpen, History, Copy, Check, LogOut, Shield, Link, Send, ExternalLink } from 'lucide-react';
import { calculateRank } from '../constants';
import { ElementDetailsModal } from '../components/ElementDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

interface ProfileProps {
  elements: AlchemyElement[];
  history: Array<{
    elementA: AlchemyElement;
    elementB: AlchemyElement;
    result: AlchemyElement;
    timestamp: number;
    isNew: boolean;
  }>;
  aihim: number;
}

export const Profile: React.FC<ProfileProps> = ({ elements, history, aihim }) => {
  const [selectedHistoryElement, setSelectedHistoryElement] = useState<AlchemyElement | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { profile, entryMode, logout } = useAuth();
  const navigate = useNavigate();
  const { currentRank, level, levelTarget, progressToNextRank, nextRank } = useMemo(() => {
    return calculateRank(elements.length);
  }, [elements.length]);

  const isSuperAdmin = profile?.role === 'superadmin';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const telegramRefLink = profile?.telegram_id 
    ? `https://t.me/AI_HimBot/app?startapp=${profile.telegram_id}`
    : profile?.referral_code 
      ? `https://t.me/AI_HimBot/app?startapp=${profile.referral_code}`
      : '';

  const browserRefLink = profile?.referral_code 
    ? `https://aihim.ru/?ref=${profile.referral_code}`
    : '';

  const inviteText = `🧪 Попробуй AiHim — алхимическую игру с ИИ!\n\n1+1 = Вселенная. Комбинируй элементы, открывай новые сущности.\n\nПрисоединяйся и получи бонус 500 AiHim!\n\n`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8 pb-12"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-5xl shadow-xl relative group overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <>
              <User size={48} className="text-gold/40 absolute -bottom-2 -right-2 rotate-12 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">{currentRank.icon}</span>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-[10px] uppercase font-bold text-gold tracking-[0.3em]">Мастер Алхимии</div>
          <h1 className="text-4xl font-gothic tracking-widest text-sepia">
            {profile?.display_name || currentRank.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sepia/60">
              <Trophy size={14} className="text-gold" />
              Уровень {level}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sepia/60">
              <Zap size={14} className="text-gold" />
              {aihim.toLocaleString()} AiHim
            </div>
            {profile?.telegram_id && (
              <div className="text-[10px] text-sepia/40 font-mono">TG: {profile.telegram_id}</div>
            )}
            {profile?.email && (
              <div className="text-[10px] text-sepia/40">{profile.email}</div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {isSuperAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-900/30 rounded-lg text-xs font-bold uppercase tracking-widest text-red-900 hover:bg-red-900/20 transition-all"
            >
              <Shield size={14} />
              Админка
            </button>
          )}
          {entryMode !== 'lovable' && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-sepia/10 border border-sepia/20 rounded-lg text-xs font-bold uppercase tracking-widest text-sepia/60 hover:bg-sepia/20 transition-all"
            >
              <LogOut size={14} />
              Выход
            </button>
          )}
        </div>
      </div>

      {/* Auth Section */}
      {entryMode === 'telegram' && !profile?.email && (
        <div className="parchment-card p-6 bg-gold/5 border-gold/20">
          <h3 className="text-[10px] uppercase font-bold text-gold tracking-widest mb-3 flex items-center gap-2">
            <ExternalLink size={12} />
            Привязать Google (бонус {1000} AiHim)
          </h3>
          <GoogleAuthButton mode="link" linkUid={profile?.uid} className="w-full" />
        </div>
      )}

      {/* Referral Section */}
      <div className="parchment-card p-6 bg-gold/5 border-gold/20 space-y-4">
        <h3 className="text-[10px] uppercase font-bold text-gold tracking-widest flex items-center gap-2">
          <Link size={12} />
          Реферальная Программа
        </h3>
        <p className="text-xs text-sepia/60">
          Приглашайте друзей и получайте по 500 AiHim — и вы, и приглашённый!
        </p>

        {profile?.referral_code && (
          <div className="flex items-center gap-2 p-3 bg-parchment rounded-lg border border-sepia/10">
            <span className="text-[10px] uppercase font-bold text-sepia/40">Ваш код:</span>
            <span className="font-mono font-bold text-sepia">{profile.referral_code}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Telegram referral */}
          {telegramRefLink && (
            <div className="flex flex-col gap-2 p-3 bg-parchment rounded-lg border border-sepia/10">
              <span className="text-[10px] uppercase font-bold text-sepia/40 flex items-center gap-1">
                <Send size={10} /> Ссылка для Telegram
              </span>
              <div className="text-[10px] text-sepia/60 font-mono break-all">{telegramRefLink}</div>
              <button
                onClick={() => copyToClipboard(inviteText + telegramRefLink, 'tg')}
                className="flex items-center gap-2 justify-center px-3 py-2 bg-gold/10 border border-gold/20 rounded text-xs font-bold text-gold hover:bg-gold/20 transition-all"
              >
                {copiedField === 'tg' ? <Check size={12} /> : <Copy size={12} />}
                {copiedField === 'tg' ? 'Скопировано!' : 'Копировать с текстом'}
              </button>
            </div>
          )}

          {/* Browser referral */}
          {browserRefLink && (
            <div className="flex flex-col gap-2 p-3 bg-parchment rounded-lg border border-sepia/10">
              <span className="text-[10px] uppercase font-bold text-sepia/40 flex items-center gap-1">
                <ExternalLink size={10} /> Ссылка для браузера
              </span>
              <div className="text-[10px] text-sepia/60 font-mono break-all">{browserRefLink}</div>
              <button
                onClick={() => copyToClipboard(inviteText + browserRefLink, 'browser')}
                className="flex items-center gap-2 justify-center px-3 py-2 bg-gold/10 border border-gold/20 rounded text-xs font-bold text-gold hover:bg-gold/20 transition-all"
              >
                {copiedField === 'browser' ? <Check size={12} /> : <Copy size={12} />}
                {copiedField === 'browser' ? 'Скопировано!' : 'Копировать с текстом'}
              </button>
            </div>
          )}
        </div>

        {/* Referral stats */}
        {profile && (
          <div className="flex gap-4 text-xs text-sepia/60">
            <span>Приглашено: <strong className="text-sepia">{profile.referral_count}</strong></span>
            <span>Заработано: <strong className="text-gold">{profile.referral_earnings} AiHim</strong></span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <BookOpen size={12} />
            Открыто Элементов
          </div>
          <div className="text-3xl font-gothic text-sepia">{elements.length} / {levelTarget}</div>
          <div className="w-full h-1.5 bg-sepia/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(elements.length / levelTarget) * 100}%` }}
              className="h-full bg-gold"
            />
          </div>
        </div>

        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <Sparkles size={12} />
            Прогресс Ранга
          </div>
          <div className="text-3xl font-gothic text-sepia">{Math.floor(progressToNextRank)}%</div>
          <div className="w-full h-1.5 bg-sepia/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextRank}%` }}
              className="h-full bg-gold shadow-[0_0_10px_rgba(201,163,67,0.5)]"
            />
          </div>
          <div className="text-[9px] uppercase font-bold text-gold/60 mt-1">
            До {nextRank?.name || 'Предела'}: {nextRank ? nextRank.min - elements.length : 0} элементов
          </div>
        </div>

        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <History size={12} />
            Всего Трансмутаций
          </div>
          <div className="text-3xl font-gothic text-sepia">{history.length}</div>
          <div className="text-[9px] uppercase font-bold text-sepia/40 mt-1 italic">
            Ваш путь записан в веках
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-sepia/10 pb-4">
          <h2 className="text-2xl font-gothic tracking-widest flex items-center gap-3">
            <History className="text-gold" />
            ХРОНИКА ТРАНСМУТАЦИЙ
          </h2>
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest">
            Последние записи
          </div>
        </div>

        <div className="space-y-4">
          {history.map((entry, i) => (
            <motion.div
              key={entry.timestamp + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedHistoryElement(entry.result)}
              className="parchment-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-[10px] font-bold text-sepia/60 w-10 font-mono shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="text-xs font-bold group-hover:text-gold transition-colors truncate max-w-[80px] sm:max-w-none">{entry.elementA.name}</span>
                  <span className="text-sepia/30 text-[10px]">+</span>
                  <span className="text-xs font-bold group-hover:text-gold transition-colors truncate max-w-[80px] sm:max-w-none">{entry.elementB.name}</span>
                </div>
              </div>

              <div className="hidden sm:block">
                <ArrowRight size={14} className="text-sepia/30 group-hover:text-gold/50 transition-colors" />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-sepia/5">
                <div className="text-left sm:text-right flex-1">
                  <div className="text-sm font-gothic text-gold flex items-center gap-1 sm:justify-end">
                    {entry.isNew && <Sparkles size={10} className="animate-pulse" />}
                    {entry.result.name}
                  </div>
                  <div className="text-[9px] uppercase opacity-50 tracking-tighter">{entry.result.rarity}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                   {entry.result.icon}
                </div>
              </div>
            </motion.div>
          ))}

          {history.length === 0 && (
            <div className="parchment-card p-12 text-center opacity-40 italic border-dashed">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              Эксперименты еще не записаны. Начните свой путь в Ателье.
            </div>
          )}
        </div>
      </div>

      <ElementDetailsModal 
        element={selectedHistoryElement} 
        onClose={() => setSelectedHistoryElement(null)} 
      />
    </motion.div>
  );
};
