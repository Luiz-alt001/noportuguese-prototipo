// api/health.js
// GET /api/health — verifica se a aplicação está no ar

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    env: {
      supabase:     !!process.env.SUPABASE_URL,
      mercadopago:  !!process.env.MP_ACCESS_TOKEN,
    },
  });
}
