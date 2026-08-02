export type AnyFunction = (...args: unknown[]) => unknown;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mail template contexts are arbitrary shapes
export type AnyRecord = Record<string, any>;
