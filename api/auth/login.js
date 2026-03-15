import { supabaseAdmin } from '../../lib/supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (authError || !authData.user) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const { data: usuario, error: erroUsuario } = await supabaseAdmin
    .from('usuarios')
    .select('id, nome, email, role')
    .eq('id', authData.user.id)
    .single();

  if (erroUsuario || !usuario) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }

  let redirect;
  if (usuario.role === 'admin') {
    redirect = '/admin/dashboard.html';
  } else if (usuario.role === 'professor') {
    redirect = '/professor/dashboard.html';
  } else {
    const { data: matricula } = await supabaseAdmin
      .from('matriculas')
      .select('id, status')
      .eq('aluno_id', usuario.id)
      .eq('status', 'ativa')
      .single();

    redirect = matricula ? '/aluno/dashboard.html' : '/aluno/mensalidade.html';
  }

  return res.status(200).json({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
    usuario,
    redirect,
  });
}
