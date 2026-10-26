# 留白 · 个人博客

一个用 Markdown 写笔记、展示项目的个人博客。使用 Astro 7 和 MDX 构建为静态网站，不需要数据库或常驻服务器；提交到 GitHub 后，可由 GitHub Pages 托管。

仓库：[MikuMiku-666/mikumiku-666.github.io](https://github.com/MikuMiku-666/mikumiku-666.github.io)。发布成功后的网站地址：[https://mikumiku-666.github.io/](https://mikumiku-666.github.io/)。

## 开始使用

需要安装 Node.js 24 或更新版本。打开项目目录，在终端运行：

```bash
npm install
npm run dev
```

按终端提示打开本地地址，通常是 <http://127.0.0.1:4321/>。编辑保存后，浏览器会自动更新。发布前运行：

```bash
npm run verify
```

它会检查内容、运行项目检查、构建网站并核对生成页面中的本地链接和附件。Windows PowerShell 如果提示不允许运行 `npm.ps1`，把命令中的 `npm` 换成 `npm.cmd`，例如 `npm.cmd run dev`。

## 日常修改

- **站点名称、介绍、作者和联系地址：** 修改 [`src/config.ts`](src/config.ts)。把 `github` 和 `email` 换成自己的地址；留空则不显示对应链接。
- **笔记：** 放在 `src/content/notes/`，文件格式为 `.md` 或 `.mdx`。
- **项目：** 放在 `src/content/projects/`，文件格式为 `.md` 或 `.mdx`。
- **图片：** 放在 `public/images/`；文章图片、项目封面等本地地址都从 `/images/` 开始写。
- **视频和 PDF：** 放在 `public/media/`，引用地址从 `/media/` 开始写。
- **颜色和样式：** 修改 [`src/styles/global.css`](src/styles/global.css) 顶部的 CSS 颜色变量。

页面组件在 `src/components/`，通用页面布局在 `src/layouts/`。修改代码后可运行 `npm run format` 自动整理排版，方便继续维护。

仓库自带 4 篇笔记和 2 个项目页作为示例，`demo: true` 表示示例内容。可以直接改写或删除。静态网站没有后台上传功能；放入 `public/` 的文件和文章都会随网站公开发布。较大的视频建议放到视频平台或其他文件托管服务，再在文章中链接或嵌入。

## 新建内容

可以复制现有文章并修改，也可以用生成命令新建草稿。`slug` 是文件名，只能使用小写英文字母、数字和连字符；文件名不能重复。例如：

```bash
npm run new -- note learning-notes
npm run new -- project reading-list
```

生成的文件会带有 `draft: true`。草稿在本地开发预览和正式网站中都不会显示；编辑完成后改成 `draft: false`，再运行 `npm run dev` 检查或推送发布。

### 笔记示例

文件：`src/content/notes/learning-notes.md`

```markdown
---
title: 整理一次学习笔记
description: 用一两句话说明这篇笔记记录了什么。
date: 2026-10-27
category: 学习笔记
tags: [学习, 记录]
draft: true
demo: false
# 更新已有文章时可填写：updated: 2026-10-28
---

从这里开始写正文。使用 Markdown 标题、列表、链接和代码块即可。
```

`title`、`description` 和 `date` 必填。`category` 默认为“随手记”；`tags`、`draft`、`demo` 可按需设置；`updated` 是可选的最近更新日期。

### 项目示例

文件：`src/content/projects/reading-list.md`

```markdown
---
title: 阅读清单
description: 为想读和读过的内容留一个简单的位置。
date: 2026-10-27
status: 构想中
cover: /images/project-reading.svg
stack: [Markdown, Astro]
tags: [个人工具]
order: 1
draft: true
demo: false
---

介绍项目的目标、做法和进展。
```

`status` 可填写 `进行中`、`已完成` 或 `构想中`，默认是 `进行中`。`cover` 是封面图片地址，`stack` 是使用的技术或工具，`order` 是数字排序值。`repository`（源码地址）和 `link`（项目地址）为可选字段；填写时使用完整网址，例如 `https://github.com/example/reading-list`。

## 图片、视频与 PDF

### 图片和普通链接

在 Markdown 中用以 `/` 开头的本地地址：

```markdown
![学习过程示意图](/images/learning-map.svg)
[查看项目](/projects/reading-room/)
```

构建时会自动适配 GitHub Pages 的仓库路径，因此本地图片和站内链接也请使用这种根路径写法。

### 视频和 PDF

在 `.mdx` 文章顶部导入组件，再在正文中使用：

```mdx
import Video from '../../components/media/Video.astro';
import Pdf from '../../components/media/Pdf.astro';

<Video src="/media/demo.mp4" caption="演示" />
<Pdf src="/media/example.pdf" title="示例 PDF" />
```

也可以在普通 `.md` 文章中使用 HTML：

```html
<video controls playsinline src="/media/demo.mp4"></video>
<iframe src="/media/example.pdf" title="示例 PDF" width="100%" height="500"></iframe>
```

带引号的本地 `src`、`href` 和 `poster` 地址会自动补上仓库路径。视频和 PDF 放入 `public/media/` 后即可引用；PDF 同时提供打开链接，方便不支持内嵌预览的设备。

## 发布到 GitHub Pages

1. 当前项目对应的仓库是 `MikuMiku-666/mikumiku-666.github.io`，日常维护无需再次创建仓库或初始化 Git。
2. 在仓库的 **Settings → Pages** 中，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 每次编辑完成后，在本地项目目录打开终端，检查并推送到 `main` 分支：

   ```bash
   npm run verify
   git add .
   git commit -m "更新博客内容"
   git push
   ```

4. 推送后，仓库的 **Actions** 页面会显示构建和发布进度。成功后，在 **Settings → Pages** 查看网站地址。之后推送到 `main` 会自动重新发布；也可以在 Actions 页面手动运行部署工作流。

部署工作流会读取 GitHub Pages 提供的网站地址和路径，因此无需在配置文件中写入 GitHub 用户名。绑定自定义域名时，在 Pages 设置域名并完成 DNS 配置，然后重新运行部署工作流。

在另一台电脑继续维护时，先运行 `git clone https://github.com/MikuMiku-666/mikumiku-666.github.io.git`，进入下载的目录，再运行 `npm install` 和 `npm run dev`。在已下载的目录中开始编辑前，可先运行 `git pull --ff-only` 获取最新内容。

本地需要模拟部署地址时，可在根目录的 `.env` 中设置（该文件已被 Git 忽略）：

```dotenv
SITE_URL=https://example.com
BASE_PATH=/repo
```

根域名站点或已绑定自定义域名时，`BASE_PATH` 留空。修改环境后运行 `npm run build`，再运行 `npm run preview` 预览构建结果。

部署配置参考 [Astro 官方 GitHub Pages 文档](https://docs.astro.build/en/guides/deploy/github/)。作者和 GitHub 链接已填写，站点名称、简介和联系方式仍可在 `src/config.ts` 中继续调整。

## 项目结构

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── .github/workflows/ci.yml       # Pull Request 检查
├── public/
│   ├── images/                    # 图片和项目封面
│   └── media/                     # 自己添加的视频和 PDF
├── scripts/                       # 新建内容与构建检查脚本
├── src/
│   ├── components/media/          # 视频和 PDF 组件
│   ├── config.ts                  # 站点文字与个人链接
│   ├── content/
│   │   ├── notes/                 # Markdown / MDX 笔记
│   │   └── projects/              # Markdown / MDX 项目
│   ├── content.config.ts          # 内容字段规则
│   └── styles/global.css          # 样式与颜色
└── astro.config.mjs               # Astro 与部署路径设置
```

## 常见问题

- **PowerShell 无法运行 npm：** 使用 `npm.cmd`，例如 `npm.cmd install`。
- **修改后没有出现在网站或本地预览：** 检查 frontmatter 中的 `draft` 是否为 `false`，并确认文件位于 `src/content/notes/` 或 `src/content/projects/`。
- **图片或附件打不开：** 检查文件是否在 `public/images/` 或 `public/media/`，并确认 Markdown 地址以 `/images/` 或 `/media/` 开头。
- **Pages 没有更新：** 检查仓库是否公开、Pages 来源是否为 GitHub Actions，并在 Actions 页面查看最近一次部署是否成功。
