export function safeHttpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || /[\u0000-\u001f\u007f]/.test(value)) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function safeLink(value: unknown): string | undefined {
  if (typeof value === "string" && /^\/(?![\/\\])/.test(value) && !/[\\\u0000-\u001f\u007f]/.test(value)) return value;
  return safeHttpsUrl(value);
}
