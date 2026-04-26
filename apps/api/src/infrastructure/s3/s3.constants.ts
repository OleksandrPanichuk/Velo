import { minutes } from "@repo/primitives";

export const AWS_MAX_RETRIES = 3;

export const S3_BATCH_DELETE_LIMIT = 1000;

export const PRESIGNED_UPLOAD_EXPIRES_IN_SEC = minutes(15) / 1000; // 15 minutes
export const PRESIGNED_DOWNLOAD_EXPIRES_IN_SEC = minutes(1) / 1000; // 1 minute

export const MULTIPART_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
export const MULTIPART_QUEUE_SIZE = 4;
