import { supabaseAdmin } from '../../lib/supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    await supabaseAdmin.auth.admin.signOut(token);
  }

  return res.status(200).json({ ok: true });
}
