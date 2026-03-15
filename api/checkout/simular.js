// api/checkout/simular.js
// POST — simula pagamento e provisiona aluno no Supabase
// Substitui o MercadoPago na fase de prototipagem

import { supabaseAdmin } from '../../lib/supabase-admin.js';

const CENARIOS = {
  '4111111111111111': 'aprovado',
  '4000000000000002': 'recusado',
  '4000000000000119': 'timeout',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, senha, plano_id, numero_cartao } = req.body;

  if (!nome || !email || !senha || !plano_id || !numero_cartao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const numLimpo = numero_cartao.replace(/\s/g, '');
  const cenario  = CENARIOS[numLimpo] || 'aprovado';

  if (cenario === 'recusado') {
    return res.status(402).json({ error: 'Pagamento recusado. Verifique os dados do cartão.' });
  }

  if (cenario === 'timeout') {
    await new Promise((r) => setTimeout(r, 4000));
    return res.status(408).json({ error: 'Tempo esgotado. Tente novamente.' });
  }

  // Busca o plano
  const { data: plano, error: erroPlano } = await supabaseAdmin
    .from('planos')
    .select('id, nome, preco')
    .eq('id', plano_id)
    .single();

  if (erroPlano || !plano) {
    return res.status(400).json({ error: 'Plano não encontrado.' });
  }

  // Cria usuário no Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, role: 'aluno' },
  });

  if (authError) {
    // Se já existe, busca o usuário
    if (authError.message?.includes('already registered')) {
      return res.status(409).json({ error: 'Este e-mail já possui uma conta.' });
    }
    return res.status(500).json({ error: 'Erro ao criar conta.' });
  }

  const userId = authData.user.id;

  // Cria matrícula ativa
  const validade = new Date();
  validade.setMonth(validade.getMonth() + 1);

  const { error: erroMatricula } = await supabaseAdmin
    .from('matriculas')
    .insert({
      aluno_id:      userId,
      plano_id:      plano.id,
      status:        'ativa',
      mp_payment_id: `FAKE-${Date.now()}`,
      validade:      validade.toISOString(),
    });

  if (erroMatricula) {
    return res.status(500).json({ error: 'Erro ao criar matrícula.' });
  }

  return res.status(200).json({
    ok: true,
    mensagem: 'Pagamento aprovado! Conta criada com sucesso.',
    email,
    redirect: '/public/login.html?cadastro=ok',
  });
}
