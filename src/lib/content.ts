import { getCollection } from 'astro:content';

// Drafts never enter routes, search, homepage or RSS, including local preview.
export async function getNotes() {
  return (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
export async function getProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
export const formatDate = (date: Date) => date.toISOString().slice(0, 10).replaceAll('-', '.');
export function readingTime(body = '') {
  const chinese = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const words = body
    .replace(/[\u3400-\u9fff]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
}
