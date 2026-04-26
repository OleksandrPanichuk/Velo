export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const seconds = (n: number) => n * SECOND;
export const minutes = (n: number) => n * MINUTE;
export const hours = (n: number) => n * HOUR;
export const days = (n: number) => n * DAY;
