export function isNotNullEmptyZero<T extends string | number>(o: T | null | undefined): o is T {
  return o != null && o !== "";
}
