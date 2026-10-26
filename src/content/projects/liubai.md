---
title: 留白 · 个人博客
description: 用文字记录，用作品表达。一个轻盈、安静，也有一点色彩的个人空间。
date: 2026-10-26
status: 已完成
cover: /images/project-notes.svg
stack: [Astro, Markdown, GitHub Pages]
repository: https://github.com/MikuMiku-666/mikumiku-666.github.io
link: https://mikumiku-666.github.io
tags: [个人网站]
order: 1
demo: true
---

这就是你现在看到的博客框架。这个项目页作为示例，展示如何介绍一个作品：从它解决的问题，到技术选择，再到后续计划。

## 想解决什么问题

让日常笔记与项目作品有一个固定的家。写作时使用 Markdown，发布时自动生成网页，日常维护尽量只改内容文件。

## 已经具备的功能

- 响应式首页、笔记归档与项目展示。
- 文章目录、代码高亮、复制代码、阅读进度。
- 支持本地图片、视频和 PDF。
- 全站搜索、分类筛选与深浅色主题。
- RSS、站点地图和基本的分享元数据。
- GitHub Actions 自动构建并部署到 GitHub Pages。

## 为什么这样组织

文章与页面样式分别管理。新增一篇笔记不需要修改页面代码；修改站点名称、简介或联系地址只需要编辑一份配置。

不需要数据库或持续运行的服务器。页面在构建时生成，生成结果可以直接交给静态托管服务。

## 换成你自己的项目

在这个文件的顶部补充 `repository` 与 `link`，项目页会出现「查看源码」与「访问项目」按钮。没有地址时，不会展示空链接。

项目完成后，可以继续在这里记录迭代，而不是只放一张截图。
