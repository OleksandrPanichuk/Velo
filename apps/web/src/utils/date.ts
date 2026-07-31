const dateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

export function formatDate(value: string) {
	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatDateTime(value: string) {
	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}
