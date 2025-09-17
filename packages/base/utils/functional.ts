/** Map {k: v} to {k: pred(v)} */
export function mapValues<V, V2>(
  record: Record<string, V>,
  pred: (value: V) => V2,
): Record<string, V2> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, pred(v as V)]),
  );
}
