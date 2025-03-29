import { useEffect, useState } from "react";

function removePrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.substr(prefix.length) : s;
}

function removeSuffix(s: string, suffix: string) {
  return s.endsWith(suffix) ? s.substr(0, s.length - suffix.length) : s;
}

export class DataSource {
  readonly prefix: string;

  constructor(prefix: string) {
    const base = removeSuffix(import.meta.env.BASE_URL ?? "", "/");
    const tail = removePrefix(prefix, "/");
    this.prefix = `${base}/${tail}`;
  }

  fullUrl(url: string): string {
    return `${this.prefix}${url}`;
  }
}

export function useJsonData(url: string, dataSource?: DataSource) {
  url = dataSource ? dataSource.fullUrl(url) : url;

  const [json, setJson] = useState(null);
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setJson(json))
      .catch((e) => console.error(`Failed to fetch data from ${url}: ${e}`));
  }, [url]);

  return [json, <p>Loading {url}...</p>];
}
