import { Env } from "@/config";
import { SECOND } from "@repo/primitives";
import { MAX_FILE_SIZE } from "@/constants";
import {
	CopyObjectCommand,
	CreateBucketCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	HeadObjectCommand,
	type HeadObjectCommandOutput,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import * as path from "path";
import type { Readable } from "stream";
import {
	AWS_MAX_RETRIES,
	MULTIPART_CHUNK_SIZE,
	MULTIPART_QUEUE_SIZE,
	PRESIGNED_DOWNLOAD_EXPIRES_IN_SEC,
	PRESIGNED_UPLOAD_EXPIRES_IN_SEC,
	S3_BATCH_DELETE_LIMIT,
} from "./s3.constants";
import type {
	DeleteFilesResult,
	FileMetadata,
	FileUpload,
	PresignedUploadOptions,
	PresignedUploadResult,
	UploadOptions,
	UploadResult,
} from "./s3.typedefs";

@Injectable()
export class S3Service implements OnModuleInit {
	private readonly logger = new Logger(S3Service.name);
	private readonly client: S3Client;
	private readonly bucketName: string;
	private readonly endpoint: string;
	private readonly forcePathStyle: boolean;
	private readonly region: string;

	constructor(private readonly config: ConfigService<Env>) {
		this.bucketName = this.config.getOrThrow("AWS_S3_BUCKET_NAME");
		this.endpoint = this.config.getOrThrow("AWS_S3_ENDPOINT");
		this.forcePathStyle = this.config.getOrThrow("AWS_S3_FORCE_PATH_STYLE");
		this.region = this.config.getOrThrow("AWS_S3_REGION");

		this.client = new S3Client({
			region: this.region,
			credentials: {
				accessKeyId: this.config.getOrThrow("AWS_S3_ACCESS_KEY"),
				secretAccessKey: this.config.getOrThrow("AWS_S3_SECRET_ACCESS_KEY"),
			},
			endpoint: this.endpoint,
			forcePathStyle: this.forcePathStyle,
			maxAttempts: 1,
		});
	}

	public async onModuleInit(): Promise<void> {
		await this.createBucketIfNotExists();
	}

	public getClient(): S3Client {
		return this.client;
	}

	public async uploadFromGraphQL(
		file: FileUpload | Promise<FileUpload>,
		options: UploadOptions = {},
	): Promise<UploadResult> {
		const resolved = await Promise.resolve(file);
		const { filename, mimetype } = resolved;
		const maxSizeBytes = options.maxSizeBytes ?? MAX_FILE_SIZE;

		this.validateMimeType(mimetype, options.allowedMimeTypes ?? []);

		const buffer = await this.streamToBuffer(resolved.createReadStream(), maxSizeBytes);

		return this.uploadBuffer(buffer, mimetype, {
			...options,
			fileName: options.fileName ?? filename,
		});
	}

	public async uploadBuffer(
		buffer: Buffer,
		mimeType: string,
		options: UploadOptions = {},
	): Promise<UploadResult> {
		const maxSizeBytes = options.maxSizeBytes ?? MAX_FILE_SIZE;
		this.validateMimeType(mimeType, options.allowedMimeTypes ?? []);
		this.validateSize(buffer.length, maxSizeBytes);

		const key = this.generateKey(
			options.folder ?? "uploads",
			options.fileName ?? `file-${Date.now()}`,
		);

		await this.executeWithRetry(async () =>
			this.client.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: key,
					Body: buffer,
					ContentType: mimeType,
					ContentLength: buffer.length,
					ContentDisposition: options.contentDisposition ?? "inline",
					Metadata: options.metadata,
				}),
			),
		);

		return {
			url: this.getPublicUrl(key),
			key,
			fileName: path.basename(key),
			mimeType,
			size: buffer.length,
		};
	}

	public async uploadStream(
		stream: Readable,
		mimeType: string,
		options: UploadOptions & { size?: number } = {},
	): Promise<UploadResult> {
		this.validateMimeType(mimeType, options.allowedMimeTypes ?? []);

		const key = this.generateKey(
			options.folder ?? "uploads",
			options.fileName ?? `file-${Date.now()}`,
		);

		const upload = new Upload({
			client: this.client,
			params: {
				Bucket: this.bucketName,
				Key: key,
				Body: stream,
				ContentType: mimeType,
				ContentDisposition: options.contentDisposition ?? "inline",
				Metadata: options.metadata,
			},
			queueSize: MULTIPART_QUEUE_SIZE,
			partSize: MULTIPART_CHUNK_SIZE,
			leavePartsOnError: false,
		});

		await upload.done();

		return {
			url: this.getPublicUrl(key),
			key,
			fileName: path.basename(key),
			mimeType,
			size: options.size ?? 0,
		};
	}

	public async getPresignedUploadUrl(
		options: PresignedUploadOptions,
	): Promise<PresignedUploadResult> {
		const key = this.generateKey(options.folder ?? "uploads", options.fileName);
		const expiresIn = options.expiresIn ?? PRESIGNED_UPLOAD_EXPIRES_IN_SEC;

		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			ContentType: options.mimeType,
		});

		const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });

		return {
			uploadUrl,
			key,
			expiresAt: new Date(Date.now() + expiresIn * 1000),
		};
	}

	public async getPresignedDownloadUrl(
		key: string,
		expiresIn: number = PRESIGNED_DOWNLOAD_EXPIRES_IN_SEC,
	): Promise<string> {
		const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
		return getSignedUrl(this.client, command, { expiresIn });
	}

	public async deleteFile(key: string): Promise<void> {
		await this.executeWithRetry(async () =>
			this.client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key })),
		);
	}

	public async deleteFiles(keys: string[]): Promise<DeleteFilesResult> {
		if (keys.length === 0) return { deleted: [], failed: [] };

		const batches: string[][] = [];
		for (let i = 0; i < keys.length; i += S3_BATCH_DELETE_LIMIT) {
			batches.push(keys.slice(i, i + S3_BATCH_DELETE_LIMIT));
		}

		const results = await Promise.all(
			batches.map(async (batch) =>
				this.executeWithRetry(async () =>
					this.client.send(
						new DeleteObjectsCommand({
							Bucket: this.bucketName,
							Delete: {
								Objects: batch.map((k) => ({ Key: k })),
								Quiet: false,
							},
						}),
					),
				),
			),
		);

		const deleted: string[] = [];
		const failed: Array<{ key: string; reason: string }> = [];

		for (const result of results) {
			for (const obj of result.Deleted ?? []) {
				if (obj.Key) deleted.push(obj.Key);
			}
			for (const err of result.Errors ?? []) {
				if (err.Key) {
					failed.push({ key: err.Key, reason: err.Message ?? "Unknown error" });
				}
			}
		}

		return { deleted, failed };
	}

	public async fileExists(key: string): Promise<boolean> {
		try {
			await this.executeWithRetry(async () =>
				this.client.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key })),
			);
			return true;
		} catch (error) {
			if (this.isS3Exception(error) && error.$metadata?.httpStatusCode === 404) {
				return false;
			}
			throw error;
		}
	}

	public async getFileMetadata(key: string): Promise<FileMetadata> {
		let result: HeadObjectCommandOutput;
		try {
			result = await this.executeWithRetry(async () =>
				this.client.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key })),
			);
		} catch (error) {
			if (this.isS3Exception(error) && error.$metadata?.httpStatusCode === 404) {
				throw new NotFoundException(`File not found: ${key}`);
			}
			throw error;
		}

		return {
			key,
			size: result.ContentLength ?? 0,
			mimeType: result.ContentType ?? "application/octet-stream",
			lastModified: result.LastModified ?? new Date(),
			metadata: result.Metadata ?? {},
		};
	}

	public async copyFile(sourceKey: string, destKey: string): Promise<string> {
		await this.executeWithRetry(async () =>
			this.client.send(
				new CopyObjectCommand({
					Bucket: this.bucketName,
					CopySource: `${this.bucketName}/${sourceKey}`,
					Key: destKey,
				}),
			),
		);
		return this.getPublicUrl(destKey);
	}

	public getPublicUrl(key: string): string {
		if (this.forcePathStyle) {
			return `${this.endpoint}/${this.bucketName}/${key}`;
		}
		return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
	}

	private generateKey(folder: string, originalFileName: string): string {
		const ext = path.extname(originalFileName).toLowerCase();
		const normalized = folder.replace(/^\/+|\/+$/g, "");
		return normalized ? `${normalized}/${randomUUID()}${ext}` : `${randomUUID()}${ext}`;
	}

	private validateMimeType(mimeType: string, allowedTypes: string[]): void {
		if (allowedTypes.length > 0 && !allowedTypes.includes(mimeType)) {
			throw new BadRequestException(
				`File type "${mimeType}" is not allowed. Accepted: ${allowedTypes.join(", ")}`,
			);
		}
	}

	private validateSize(size: number, maxBytes: number): void {
		if (size > maxBytes) {
			throw new BadRequestException(`File size ${size} B exceeds the ${maxBytes} B limit`);
		}
	}

	private async streamToBuffer(stream: Readable, maxBytes: number): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = [];
			let totalSize = 0;

			stream.on("data", (chunk: Buffer) => {
				totalSize += chunk.length;
				if (totalSize > maxBytes) {
					stream.destroy(new BadRequestException(`File exceeds maximum size of ${maxBytes} bytes`));
					return;
				}
				chunks.push(chunk);
			});

			stream.on("end", () => resolve(Buffer.concat(chunks)));
			stream.on("error", reject);
		});
	}

	private async executeWithRetry<T>(
		operation: () => Promise<T>,
		retries: number = AWS_MAX_RETRIES,
	): Promise<T> {
		let lastError: unknown;

		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				// eslint-disable-next-line no-await-in-loop -- retries are sequential by definition
				return await operation();
			} catch (error) {
				lastError = error;

				if (
					this.isS3Exception(error) &&
					error.$metadata?.httpStatusCode !== undefined &&
					error.$metadata?.httpStatusCode >= 400 &&
					error.$metadata?.httpStatusCode < 500
				) {
					throw error;
				}

				if (attempt < retries - 1) {
					const delay = 2 ** attempt * SECOND;
					this.logger.warn(
						`Operation failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`,
					);
					// eslint-disable-next-line no-await-in-loop -- backoff must delay this attempt
					await this.sleep(delay);
				}
			}
		}

		throw lastError;
	}

	private async sleep(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	private isS3Exception(error: unknown): error is S3ServiceException {
		return (
			typeof error === "object" &&
			error !== null &&
			"$metadata" in error &&
			typeof (error as Record<string, unknown>).$metadata === "object"
		);
	}

	private async createBucketIfNotExists(): Promise<void> {
		try {
			await this.client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
			this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
		} catch (error) {
			if (this.isS3Exception(error)) {
				if (error.name === "BucketAlreadyOwnedByYou" || error.name === "BucketAlreadyExists") {
					this.logger.debug(`Bucket "${this.bucketName}" already exists.`);
					return;
				}
				this.logger.error(
					`AWS Error: Failed to create bucket "${this.bucketName}": ${error.message}`,
				);
			} else {
				this.logger.error(
					`Unexpected error creating bucket "${this.bucketName}": ${error instanceof Error ? error.message : String(error)}`,
				);
			}
			throw error;
		}
	}
}
