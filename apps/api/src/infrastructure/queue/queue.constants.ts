export const QueueName = {
	MAIL: "mail",
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];
