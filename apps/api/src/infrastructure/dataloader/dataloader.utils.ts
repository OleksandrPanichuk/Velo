export function mapToOrderedArray<TId extends string | number, T>(
	items: readonly T[],
	ids: readonly TId[],
	keyFn: (item: T) => TId,
): (T | null)[] {
	const itemMap = new Map<TId, T>();

	for (const item of items) {
		itemMap.set(keyFn(item), item);
	}

	return ids.map((id) => itemMap.get(id) ?? null);
}
