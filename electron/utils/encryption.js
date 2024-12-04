import crypto from "crypto";
import process from "process";
import { Buffer } from "buffer";

const ENCRYPTION_KEY = process.env?.ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export async function encrypt(data) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);

    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100_000, 32, "sha256");

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    const result = Buffer.concat([salt, iv, tag, encrypted]);

    return result.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

export async function decrypt(encryptedData) {
  try {
    const buffer = Buffer.from(encryptedData, "base64");

    if (buffer.length < SALT_LENGTH + IV_LENGTH + TAG_LENGTH) {
      throw new Error("Invalid encrypted data");
    }

    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH,
    );
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, "sha256");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8"));
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}
