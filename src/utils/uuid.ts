export function encodeUUID(uuid: string) {
  // Convert UUID string to buffer
  const buffer = Buffer.from(uuid, "utf8");
  // Encode buffer to base64 string
  const base64 = buffer.toString("base64");
  // Replace characters that are not URL-safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeUUID(encodedUUID: string) {
  // Add padding if necessary
  const paddingLength = (4 - (encodedUUID.length % 4)) % 4;
  const paddedEncodedUUID = encodedUUID + "=".repeat(paddingLength);
  // Replace URL-safe characters
  const base64 = paddedEncodedUUID.replace(/-/g, "+").replace(/_/g, "/");
  // Decode base64 string to buffer
  const buffer = Buffer.from(base64, "base64");
  // Convert buffer to UUID string
  return buffer.toString("utf8");
}
