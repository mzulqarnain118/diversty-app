import crypto from 'crypto';

// Encryption key (must be kept secret)
const ENCRYPTION_KEY = '9f0a5b781e3c7d2a8f4e6b9c5a2d1e3f';
// Initialization vector (must be unique for each encryption)

// Function to generate a deterministic IV from the input data
function generateIV(data:string) {
  // Use a cryptographic hash function (e.g., SHA-256) to generate the IV
  const hash = crypto.createHash('sha256').update(data).digest();
  // Use the first 16 bytes of the hash as the IV
  return hash.slice(0, 16);
}

// Function to encode an integer ID to a random value
export function encodeID(id: number| string) {
  // Generate a deterministic IV based on the input data (ID)
  const iv = generateIV(id.toString());
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(id.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decode a random value back to the original integer ID
export function decodeID(encodedID: string) {
  const parts = encodedID.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return parseInt(decrypted.toString());
}

