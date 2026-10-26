import rss from '@astrojs/rss';
import { getNotes } from '../lib/content';
import { entryUrl } from '../lib/urls';
import { siteConfig } from '../config';
import type { APIContext } from 'astro';
export async function GET(context: APIContext) {
  const notes = await getNotes();
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: new URL(import.meta.env.BASE_URL, context.site!),
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.description,
      link: entryUrl('notes', note.id),
    })),
    customData: '<language>zh-cn</language>',
  });
}
