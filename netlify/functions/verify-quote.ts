import { Handler } from '@netlify/functions';

interface FormPayload {
  token: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  closings: string;
  comments: string;
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload: Partial<FormPayload>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { token, ...formData } = payload;

  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'reCAPTCHA token is required' }) };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY environment variable is not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  // Verify the reCAPTCHA token with Google
  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  );
  const verifyData = (await verifyRes.json()) as RecaptchaResponse;

  if (!verifyData.success || verifyData.score < 0.3) {
    console.warn('reCAPTCHA failed:', verifyData);
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'reCAPTCHA verification failed' })
    };
  }

  // Forward the validated submission to Netlify Forms
  const siteUrl = process.env.URL || 'http://localhost:8888';
  const formBody = new URLSearchParams({
    'form-name': 'quote',
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    company: formData.company || '',
    phone: formData.phone || '',
    email: formData.email || '',
    closings: formData.closings || '',
    comments: formData.comments || '',
  }).toString();

  const netlifyFormRes = await fetch(siteUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  });

  if (!netlifyFormRes.ok) {
    console.error('Netlify Forms submission failed:', netlifyFormRes.status);
    return { statusCode: 502, body: JSON.stringify({ error: 'Form submission failed' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
