import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const BLOCK_SIZE = 16;
const HASH_SIZE = 32;

export function encrypt(args: { payload: string | ArrayBuffer }): string {
  try {
    const payloadBuffer =
      typeof args.payload === "string"
        ? Buffer.from(args.payload)
        : Buffer.from(args.payload);
    const keyHash = createHash("sha256").update(ENCRYPTION_KEY).digest();
    const encryptedDataWithHash = Buffer.concat([
      createHash("sha256").update(payloadBuffer).digest(),
      Buffer.from(payloadBuffer),
    ]);
    const iv = randomBytes(BLOCK_SIZE);
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, keyHash, iv);
    const ctBuffer = Buffer.concat([
      cipher.update(encryptedDataWithHash),
      cipher.final(),
    ]);
    return Buffer.concat([iv, ctBuffer]).toString("base64");
  } catch (error: unknown) {
    throw new Error(`Error encrypting message: ${(error as Error).message}`);
  }
}

export function decrpyt(args: { data: string }): Buffer {
  try {
    const dataBuffer = Buffer.from(args.data, "base64");
    const keyHash = createHash("sha256").update(ENCRYPTION_KEY).digest();
    const iv = dataBuffer.subarray(0, BLOCK_SIZE);
    const ct = dataBuffer.subarray(BLOCK_SIZE);
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, keyHash, iv);
    const decryptedDataWithHash = Buffer.concat([
      decipher.update(ct),
      decipher.final(),
    ]);
    const hashFromData = decryptedDataWithHash.subarray(0, HASH_SIZE);
    const originalData = decryptedDataWithHash.subarray(HASH_SIZE);
    const originalDataHash = createHash("sha256").update(originalData).digest();
    if (!originalDataHash.equals(hashFromData)) {
      throw new Error("Data integrity check fail during decryption");
    }
    return originalData;
  } catch (error: unknown) {
    throw new Error(`Error decrypting message: ${(error as Error).message}`);
  }
}
