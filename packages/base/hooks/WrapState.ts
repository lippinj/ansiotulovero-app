import { useState } from "react";

export interface WrapState<T> {
  current: T;
  set: (value: T) => void;
}

export function useWrapState<T>(initialState: T): WrapState<T> {
  const [current, set] = useState<T>(initialState);
  return { current, set };
}
