/**
 * Session Security Utility for PR-PPAO APP HUB
 * Uses Web Crypto API (HMAC-SHA256) for signed, stateless sessions.
 * Compatible with both Node.js and Edge Runtime.
 */

export const SESSION_COOKIE_NAME = 'prppao_admin_session';
export const SESSION_MAX_AGE = 60 * 60; // 1 hour (3600 seconds)

export interface SessionPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

const SECRET_SALT = 'prppao-admin-session-v1-salt';

function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  // Fallback for Node environments where Buffer is available
  return Buffer.from(binary, 'binary').toString('base64url');
}

function fromBase64Url(str: string): Uint8Array {
  if (typeof atob === 'function') {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  // Fallback for Node
  return new Uint8Array(Buffer.from(str, 'base64url'));
}

async function getCryptoKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_PASSWORD || 'admin1234';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(`${secret}:${SECRET_SALT}`);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed session token valid for maxAgeSeconds (default: 1 hour).
 */
export async function createAdminSessionToken(maxAgeSeconds = SESSION_MAX_AGE): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    role: 'admin',
    iat: now,
    exp: now + maxAgeSeconds * 1000,
  };

  const encoder = new TextEncoder();
  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = toBase64Url(encoder.encode(payloadStr));

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
  const signatureBase64 = toBase64Url(signatureBuffer);

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies the signed session token and checks if it has expired.
 */
export async function verifyAdminSessionToken(token?: string | null): Promise<{
  valid: boolean;
  payload?: SessionPayload;
  reason?: string;
}> {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing_token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'malformed_token' };
  }

  const [payloadBase64, signatureBase64] = parts;
  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const signatureBytes = fromBase64Url(signatureBase64);

    const isValidSig = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadBase64)
    );

    if (!isValidSig) {
      return { valid: false, reason: 'invalid_signature' };
    }

    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadBase64));
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, reason: 'expired', payload };
    }

    if (payload.role !== 'admin') {
      return { valid: false, reason: 'unauthorized_role' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, reason: 'verification_failed' };
  }
}
