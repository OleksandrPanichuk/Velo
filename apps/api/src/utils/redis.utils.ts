interface GenerateRedisUrlProps {
	host: string;
	port: number;
}

export const generateRedisUrl = ({ host, port }: GenerateRedisUrlProps): string =>
	`redis://${host}:${port}`;
