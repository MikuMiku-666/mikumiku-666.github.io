/** Prefix local absolute URLs once. Keep external URLs and fragments intact. */
export function withBase(path = '/', base = '/') {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = `/${base.split('/').filter(Boolean).join('/')}`;
  if (
    prefix === '/' ||
    path === prefix ||
    path.startsWith(`${prefix}/`) ||
    path.startsWith(`${prefix}?`) ||
    path.startsWith(`${prefix}#`)
  )
    return path;
  return `${prefix}${path}`;
}
