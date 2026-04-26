import type { MIME_TYPES_MAP } from "@/constants";
import type { Readable } from "stream";

export type MimeType = (typeof MIME_TYPES_MAP)[keyof typeof MIME_TYPES_MAP];

export interface FileUpload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream(): Readable;
}

export interface UploadOptions {
	folder?: string;
	fileName?: string;
	allowedMimeTypes?: MimeType[];
	maxSizeBytes?: number;
	metadata?: Record<string, string>;
	contentDisposition?: "inline" | "attachment";
}

export interface UploadResult {
	url: string;
	key: string;
	fileName: string;
	mimeType: string;
	size: number;
}

export interface PresignedUploadOptions {
	folder?: string;
	fileName: string;
	mimeType: MimeType;
	expiresIn?: number;
}

export interface PresignedUploadResult {
	uploadUrl: string;
	key: string;
	expiresAt: Date;
}

export interface FileMetadata {
	key: string;
	size: number;
	mimeType: string;
	lastModified: Date;
	metadata: Record<string, string>;
}

export interface DeleteFilesResult {
	deleted: string[];
	failed: Array<{ key: string; reason: string }>;
}
