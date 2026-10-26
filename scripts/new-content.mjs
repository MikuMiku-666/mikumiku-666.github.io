import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const [kind, slug] = process.argv.slice(2);
if (!['note', 'project'].includes(kind) || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    '用法：npm run new -- note my-first-note 或 npm run new -- project my-project\n文件名请使用小写英文字母、数字和连字符。',
  );
  process.exit(1);
}
const folder = kind === 'note' ? 'notes' : 'projects';
const directory = new URL(`../src/content/${folder}/`, import.meta.url);
const filename = new URL(`${slug}.md`, directory);
const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date());
const extra =
  kind === 'note'
    ? 'category: 随手记\ntags: []'
    : 'status: 进行中\ncover: /images/project-notes.svg\nstack: []\ntags: []\norder: 10\n# repository: https://github.com/yourname/your-project\n# link: https://example.com';
const content = `---\ntitle: ${kind === 'note' ? '我的新笔记' : '我的新项目'}\ndescription: 在这里写一段简短的介绍。\ndate: ${date}\n${extra}\ndraft: true\ndemo: false\n---\n\n从这里开始写吧。准备发布时，把上方的 draft 改为 false。\n\n## ${kind === 'note' ? '这次想记录什么' : '项目介绍'}\n\n写下问题、思考和过程。\n`;
try {
  await mkdir(directory, { recursive: true });
  await writeFile(filename, content, { flag: 'wx' });
  console.log(
    `已创建：${fileURLToPath(filename)}\n当前是草稿。改为 draft: false 后，会显示在网站上。`,
  );
} catch (error) {
  console.error(
    error.code === 'EEXIST' ? '同名文件已经存在，请换一个名字，已有内容未被覆盖。' : error.message,
  );
  process.exit(1);
}
