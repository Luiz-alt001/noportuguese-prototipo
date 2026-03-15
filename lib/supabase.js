// lib/supabase.js
// Cliente Supabase com anon key — usa JWT do usuário para RLS
// Use este cliente em rotas que precisam respeitar as permissões do usuário

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * Retorna um cliente Supabase autenticado com o JWT do usuário.
 * O RLS do banco será aplicado com base nesse token.
 *
 * @param {string} accessToken — JWT extraído do header Authorization
 */
export const supabaseClient = (accessToken) =>
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
