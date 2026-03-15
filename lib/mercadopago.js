// lib/mercadopago.js
// Cliente MercadoPago e validação HMAC-SHA256 do webhook
// ⚠️  USAR APENAS em Serverless Functions — nunca exponha o access token no frontend

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import crypto from 'crypto';

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const mpPayment    = new Payment(mp);
export const mpPreference = new Preference(mp);

/**
 * Valida a assinatura HMAC-SHA256 do webhook do MercadoPago.
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 *
 * @param {object} req — objeto de request da Serverless Function
 * @returns {boolean} true se a assinatura for válida
 */
export function validarAssinaturaWebhook(req) {
  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];
  const dataId     = req.query?.['data.id'] ?? req.body?.data?.id;

  if (!xSignature || !xRequestId || !dataId) return false;

  const ts = xSignature.split(',').find((p) => p.startsWith('ts='))?.split('=')[1];
  const v1 = xSignature.split(',').find((p) => p.startsWith('v1='))?.split('=')[1];

  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac     = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
}
