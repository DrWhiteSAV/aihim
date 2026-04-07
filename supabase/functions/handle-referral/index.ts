import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_uid, referrer_telegram_id, referrer_referral_code } = await req.json();

    if (!user_uid) {
      return new Response(JSON.stringify({ error: 'user_uid required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user already has a referrer
    const { data: existingRef } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_uid', user_uid)
      .maybeSingle();

    if (existingRef) {
      return new Response(JSON.stringify({ success: false, message: 'Already referred' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let referrerUid: string | null = null;

    // Find referrer by telegram_id
    if (referrer_telegram_id) {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('uid')
        .eq('telegram_id', referrer_telegram_id)
        .maybeSingle();
      if (referrer) referrerUid = referrer.uid;
    }

    // Or find by referral_code
    if (!referrerUid && referrer_referral_code) {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('uid')
        .eq('referral_code', referrer_referral_code)
        .maybeSingle();
      if (referrer) referrerUid = referrer.uid;
    }

    if (!referrerUid || referrerUid === user_uid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid referrer' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const BONUS = 500;

    // Create referral record
    await supabase.from('referrals').insert({
      referrer_uid: referrerUid,
      referred_uid: user_uid,
      bonus_amount: BONUS,
      source: referrer_telegram_id ? 'telegram' : 'browser',
    });

    // Give bonus to both
    await supabase.rpc('increment_balance', { uid_param: referrerUid, amount: BONUS }).catch(() => {
      // Fallback: manual update
      return supabase.from('profiles')
        .select('balance, referral_count, referral_earnings')
        .eq('uid', referrerUid)
        .single()
        .then(({ data }) => {
          if (data) {
            return supabase.from('profiles').update({
              balance: (data.balance || 0) + BONUS,
              referral_count: (data.referral_count || 0) + 1,
              referral_earnings: (data.referral_earnings || 0) + BONUS,
            }).eq('uid', referrerUid);
          }
        });
    });

    // Bonus to referred user
    const { data: referredProfile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('uid', user_uid)
      .single();

    if (referredProfile) {
      await supabase.from('profiles').update({
        balance: (referredProfile.balance || 0) + BONUS,
        referred_by: referrerUid,
      }).eq('uid', user_uid);
    }

    // Also update game_state balance
    await supabase.from('game_state')
      .update({ aihim_balance: (referredProfile?.balance || 1000) + BONUS })
      .eq('user_uid', user_uid);

    return new Response(JSON.stringify({ success: true, bonus: BONUS }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
