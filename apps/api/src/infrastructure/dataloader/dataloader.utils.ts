export function mapToOrderedArray<ID extends string | number, T>(
  items: readonly T[],
  ids: readonly ID[],
  keyFn: (item: T) => ID,
): (T | null)[] {
  const itemMap = new Map<ID, T>();

  for (const item of items) {
    itemMap.set(keyFn(item), item);
  }

  return ids.map((id) => itemMap.get(id) || null);
}

