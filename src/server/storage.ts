import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { getOperationalSettings } from "./operational-settings";

async function client() {
  const { s3 } = await getOperationalSettings();
  if (!s3.bucket || !s3.region || !s3.accessKeyId || !s3.secretAccessKey) throw new Error("Cloud storage is not fully configured.");
  return {
    bucket: s3.bucket,
    client: new S3Client({ region: s3.region, endpoint: s3.endpoint || undefined, forcePathStyle: Boolean(s3.endpoint), credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey } }),
  };
}

export async function uploadBase64File(folder: string, fileName: string, mimeType: string, base64: string) {
  const { client: s3, bucket } = await client();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const key = `${folder}/${randomUUID()}-${safeName}`;
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from(base64, "base64"), ContentType: mimeType }));
  return key;
}

export async function readStoredFile(key: string) {
  const { client: s3, bucket } = await client();
  const result = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!result.Body) throw new Error("Stored file could not be read.");
  return Buffer.from(await result.Body.transformToByteArray());
}
