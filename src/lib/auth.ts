export const ADMIN_COOKIE_NAME = "admin_session";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.JWT_SECRET ||
    "ceylon-trail-secure-admin-session-secret-key-2026-auth"
  );
}

/**
 * Validates provided credentials against environment variables or configured defaults.
 */
export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;

  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@ceylontrail.com").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "CeylonTrail@Admin2026!";

  const inputEmail = email.trim().toLowerCase();
  const inputPassword = password;

  return inputEmail === expectedEmail && inputPassword === expectedPassword;
}

/**
 * Creates a signed JWT token valid for 7 days using Web Crypto HMAC-SHA256.
 */
export async function createAdminToken(email: string): Promise<string> {
  const secret = getSecretKey();
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    email: email.trim().toLowerCase(),
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const encodedHeader = bytesToBase64Url(encoder.encode(JSON.stringify(header)));
  const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const dataToSign = encoder.encode(`${encodedHeader}.${encodedPayload}`);

  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    dataToSign as unknown as BufferSource
  );
  const encodedSignature = bytesToBase64Url(new Uint8Array(signatureBuffer));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies a JWT token signature and expiration using Web Crypto HMAC-SHA256.
 */
export async function verifyAdminToken(
  token?: string | null
): Promise<{ valid: boolean; email?: string }> {
  try {
    if (!token || typeof token !== "string") return { valid: false };

    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const secret = getSecretKey();
    const key = await getHmacKey(secret);

    const dataToVerify = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const signatureBytes = base64UrlToBytes(encodedSignature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      dataToVerify as unknown as BufferSource
    );

    if (!isValid) return { valid: false };

    const payloadRaw = decoder.decode(base64UrlToBytes(encodedPayload));
    const payload = JSON.parse(payloadRaw);

    const currentEpoch = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentEpoch) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch (error) {
    return { valid: false };
  }
}
