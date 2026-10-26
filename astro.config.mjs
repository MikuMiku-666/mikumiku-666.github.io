import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeBase, { remarkBase } from './src/plugins/rehype-base.mjs';

const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const base = `/${(env.BASE_PATH || '').split('/').filter(Boolean).join('/')}`;

export default defineConfig({
  site: env.SITE_URL || 'https://mikumiku-666.github.io',
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkBase, { base }]],
      rehypePlugins: [[rehypeBase, { base }]],
    }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: true },
  },
  devToolbar: { enabled: false },
});
