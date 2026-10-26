import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve('dist');
const base = `/${(process.env.BASE_PATH || '').split('/').filter(Boolean).join('/')}`;
const failures = [];
async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? filesAt(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}
const pages = (await filesAt(directory)).filter((file) => file.endsWith('.html'));
if (!pages.length) throw new Error('没有生成 HTML 页面，请先运行 npm run build。');
const htmlByPath = new Map(
  await Promise.all(pages.map(async (file) => [file, await readFile(file, 'utf8')])),
);
let checks = 0;
for (const [page, html] of htmlByPath) {
  // Only actual opening tags, not embedded search JSON or escaped code samples.
  const tags = html.matchAll(/<(?:a|img|link|script|video|source|iframe|object)\b[^>]*>/gi);
  for (const [tag] of tags) {
    for (const [, , raw] of tag.matchAll(/\s(?:href|src|poster|data)=(['"])(.*?)\1/g)) {
      if (!raw || (!raw.startsWith('/') && !raw.startsWith('#')) || raw.startsWith('//')) continue;
      const targetUrl = new URL(raw.replaceAll('&amp;', '&'), 'https://local.test');
      const isFragment = raw.startsWith('#');
      let targetPath = decodeURIComponent(targetUrl.pathname);
      if (!isFragment && base !== '/') {
        if (targetPath !== base && !targetPath.startsWith(`${base}/`)) {
          failures.push(`${path.relative(directory, page)}: 未包含仓库前缀 ${raw}`);
          continue;
        }
        targetPath = targetPath.slice(base.length) || '/';
      }
      let target = isFragment ? page : path.join(directory, targetPath);
      try {
        if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
        await stat(target);
        if (targetUrl.hash && htmlByPath.has(target)) {
          const id = decodeURIComponent(targetUrl.hash.slice(1));
          if (!htmlByPath.get(target).includes(`id="${id}"`))
            failures.push(`${path.relative(directory, page)}: 找不到锚点 ${raw}`);
        }
        checks++;
      } catch {
        failures.push(`${path.relative(directory, page)}: 链接或附件不存在 ${raw}`);
      }
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`已检查 ${pages.length} 个页面、${checks} 个本地链接/附件（部署前缀：${base}）。`);
