import type DataLoader from "dataloader";

export interface NestDataLoader<TId, TEntity> {
	generateDataLoader(): DataLoader<TId, TEntity | null>;
}

export interface NestDataLoaderContext {
	getLoader: <TId, TEntity>(
		type: new (...args: any[]) => NestDataLoader<TId, TEntity>,
	) => DataLoader<TId, TEntity | null>;
}
