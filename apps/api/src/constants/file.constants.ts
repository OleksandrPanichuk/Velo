export const MIME_TYPES_MAP = {
	".pdf": "application/pdf",
	".doc": "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".txt": "text/plain",
	".md": "text/markdown",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".webp": "image/webp",
	".mp4": "video/mp4",
	".mp3": "audio/mpeg",
	".wav": "audio/wav",
	".zip": "application/zip",
	".json": "application/json",
	".xml": "application/xml",
	".csv": "text/csv",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".xls": "application/vnd.ms-excel",
	".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_IMAGE_TYPES = [
	MIME_TYPES_MAP[".jpg"],
	MIME_TYPES_MAP[".jpeg"],
	MIME_TYPES_MAP[".png"],
	MIME_TYPES_MAP[".gif"],
	MIME_TYPES_MAP[".svg"],
	MIME_TYPES_MAP[".webp"],
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
	MIME_TYPES_MAP[".pdf"],
	MIME_TYPES_MAP[".doc"],
	MIME_TYPES_MAP[".docx"],
	MIME_TYPES_MAP[".txt"],
	MIME_TYPES_MAP[".md"],
	MIME_TYPES_MAP[".ppt"],
	MIME_TYPES_MAP[".pptx"],
	MIME_TYPES_MAP[".xls"],
	MIME_TYPES_MAP[".xlsx"],
	MIME_TYPES_MAP[".csv"],
] as const;

export const ALLOWED_AUDIO_TYPES = [
	MIME_TYPES_MAP[".mp3"],
	MIME_TYPES_MAP[".wav"],
] as const;

export const ALLOWED_VIDEO_TYPES = [
	MIME_TYPES_MAP[".mp4"],
] as const;

export const ALLOWED_FILE_TYPES = [
	...ALLOWED_IMAGE_TYPES,
	...ALLOWED_DOCUMENT_TYPES,
	...ALLOWED_AUDIO_TYPES,
	...ALLOWED_VIDEO_TYPES,
] as const;
