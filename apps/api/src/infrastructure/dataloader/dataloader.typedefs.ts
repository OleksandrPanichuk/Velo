import type DataLoader from "dataloader";

export interface NestDataLoader<ID, Type> {
	generateDataLoader(): DataLoader<ID, Type | null>;
}

export interface NestDataLoaderContext {
	getLoader: <ID, Type>(
		type: new (...args: any[]) => NestDataLoader<ID, Type>,
	) => DataLoader<ID, Type | null>;
}
