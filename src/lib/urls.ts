import { withBase } from './paths.mjs';
export const url = (path = '/') => withBase(path, import.meta.env.BASE_URL);
export const entryUrl = (kind: 'notes' | 'projects', id: string) =>
  url(`/${kind}/${id.split('/').map(encodeURIComponent).join('/')}/`);
