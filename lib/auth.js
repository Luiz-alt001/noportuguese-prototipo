// lib/auth.js
// Middleware de autenticação JWT reutilizável nas Serverless Functions
// Uso: const user = await autenticar(req, res); if (!user) return;

import { supabaseAdmin } from './supabase-admin.js';

/**
 * Extrai e valida o JWT do header Authorization.
 * Se inválido, responde com 401 e retorna null.
 * Se válido, retorna o objeto do usuário com role.
 *
 * @param {object} req
 * @param {object} res
 * @param {string} [roleRequerida] — se informado, verifica se o usuário tem esse role
 * @returns {object|null} usuário autenticado ou null
 */
export async function autenticar(req, res, roleRequerida = null) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Token não informado.' });
    return null;
  }

  // Valida o JWT com o Supabase
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return null;
  }

  // Busca o role do usuário na tabela usuarios
  const { data: perfil, error: erroPerfil } = await supabaseAdmin
    .from('usuarios')
    .select('id, nome, email, role')
    .eq('id', user.id)
    .single();

  if (erroPerfil || !perfil) {
    res.status(401).json({ error: 'Usuário não encontrado.' });
    return null;
  }

  // Verifica role se necessário
  if (roleRequerida && perfil.role !== roleRequerida) {
    res.status(403).json({ error: 'Acesso negado.' });
    return null;
  }

  return perfil;
}
