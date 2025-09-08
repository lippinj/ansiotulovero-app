export function removePrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.substr(prefix.length) : s;
}

export function removeSuffix(s: string, suffix: string) {
  return s.endsWith(suffix) ? s.substr(0, s.length - suffix.length) : s;
}

/** Join strings by spaces (shorthand for css classes) */
export function cj(...args: string[]): string {
  return args.join(" ");
}
