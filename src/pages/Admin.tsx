import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'motion/react';
import { Users, Database, Settings, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'elements' | 'game_states' | 'referrals'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [gameStates, setGameStates] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin = profile?.role === 'superadmin';

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchData();
  }, [activeTab, isSuperAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setUsers(data || []);
      } else if (activeTab === 'elements') {
        const { data } = await supabase.from('user_elements').select('*').order('created_at', { ascending: false }).limit(200);
        setElements(data || []);
      } else if (activeTab === 'game_states') {
        const { data } = await supabase.from('game_state').select('*').order('updated_at', { ascending: false });
        setGameStates(data || []);
      } else if (activeTab === 'referrals') {
        const { data } = await supabase.from('referrals').select('*').order('created_at', { ascending: false });
        setReferrals(data || []);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">🔒</div>
        <p className="text-lg font-gothic text-sepia">Доступ запрещён</p>
        <button onClick={() => navigate('/profile')} className="text-gold underline text-sm">Вернуться</button>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    !searchQuery || 
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.telegram_id?.includes(searchQuery) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'users', icon: Users, label: 'Пользователи', count: users.length },
    { id: 'elements', icon: Database, label: 'Элементы', count: elements.length },
    { id: 'game_states', icon: Settings, label: 'Состояния', count: gameStates.length },
    { id: 'referrals', icon: Users, label: 'Рефералы', count: referrals.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 pb-12"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/profile')} className="text-sepia/60 hover:text-sepia">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="font-gothic text-3xl text-sepia tracking-widest">АДМИН-ПАНЕЛЬ</h1>
          <p className="text-sepia italic text-sm opacity-70">Управление вселенной</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-gold text-white' : 'bg-gold/10 text-sepia/60 hover:bg-gold/20'
            }`}
          >
            <tab.icon size={14} />
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sepia/40" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск..."
          className="w-full pl-10 pr-4 py-2 bg-parchment border border-sepia/20 rounded-lg text-sm text-sepia outline-none focus:border-gold"
        />
      </div>

      {loading && <div className="text-center text-sepia/40 py-8">Загрузка...</div>}

      {/* Users Table */}
      {activeTab === 'users' && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-sepia/20">
                <th className="text-left p-2 text-gold uppercase tracking-widest">Имя</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">TG ID</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Email</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Роль</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Баланс</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Реф. код</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Рефералы</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.uid} className="border-b border-sepia/10 hover:bg-gold/5">
                  <td className="p-2 font-bold text-sepia">{u.display_name}</td>
                  <td className="p-2 text-sepia/60 font-mono">{u.telegram_id || '-'}</td>
                  <td className="p-2 text-sepia/60">{u.email || '-'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'superadmin' ? 'bg-red-100 text-red-800' : 'bg-sepia/10 text-sepia/60'
                    }`}>{u.role}</span>
                  </td>
                  <td className="p-2 text-sepia font-mono">{u.balance?.toLocaleString()}</td>
                  <td className="p-2 text-sepia/60 font-mono">{u.referral_code || '-'}</td>
                  <td className="p-2 text-sepia/60 font-mono">{u.referral_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Elements Table */}
      {activeTab === 'elements' && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-sepia/20">
                <th className="text-left p-2 text-gold uppercase tracking-widest">User</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Элемент</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Редкость</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Стаб.</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Темп.</th>
              </tr>
            </thead>
            <tbody>
              {elements.map(e => (
                <tr key={e.id} className="border-b border-sepia/10 hover:bg-gold/5">
                  <td className="p-2 text-sepia/60 font-mono text-[10px]">{e.user_uid?.substring(0, 8)}...</td>
                  <td className="p-2 font-bold text-sepia">{e.icon} {e.name}</td>
                  <td className="p-2 text-sepia/60">{e.rarity}</td>
                  <td className="p-2 text-sepia/60 font-mono">{Math.round(e.stability)}%</td>
                  <td className="p-2 text-sepia/60 font-mono">{Math.round(e.temperature)}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Game States */}
      {activeTab === 'game_states' && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-sepia/20">
                <th className="text-left p-2 text-gold uppercase tracking-widest">User</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Фаза</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">AiHim</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Ранг</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Слой</th>
              </tr>
            </thead>
            <tbody>
              {gameStates.map(gs => (
                <tr key={gs.id} className="border-b border-sepia/10 hover:bg-gold/5">
                  <td className="p-2 text-sepia/60 font-mono text-[10px]">{gs.user_uid?.substring(0, 8)}...</td>
                  <td className="p-2 text-sepia">{gs.world_phase === 'day' ? '☀️ День' : '🌙 Ночь'}</td>
                  <td className="p-2 text-sepia font-mono">{gs.aihim_balance?.toLocaleString()}</td>
                  <td className="p-2 text-sepia/60">{gs.prev_rank}</td>
                  <td className="p-2 text-sepia/60 font-mono">{gs.selected_reality_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Referrals */}
      {activeTab === 'referrals' && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-sepia/20">
                <th className="text-left p-2 text-gold uppercase tracking-widest">Пригласивший</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Приглашённый</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Бонус</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Источник</th>
                <th className="text-left p-2 text-gold uppercase tracking-widest">Дата</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id} className="border-b border-sepia/10 hover:bg-gold/5">
                  <td className="p-2 text-sepia/60 font-mono text-[10px]">{r.referrer_uid?.substring(0, 8)}...</td>
                  <td className="p-2 text-sepia/60 font-mono text-[10px]">{r.referred_uid?.substring(0, 8)}...</td>
                  <td className="p-2 text-sepia font-mono">{r.bonus_amount}</td>
                  <td className="p-2 text-sepia/60">{r.source}</td>
                  <td className="p-2 text-sepia/60">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center text-[10px] text-sepia/30 uppercase tracking-widest mt-4">
        Суперадмин: {profile?.display_name} | UID: {profile?.uid?.substring(0, 12)}...
      </div>
    </motion.div>
  );
};
