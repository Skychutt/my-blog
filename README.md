# 夏日札记

一个适合持续写作的中文个人博客，使用 React、TypeScript 与 Vite 构建，可通过 GitHub Actions 自动发布到阿里云 OSS。

## 本地运行

```powershell
npm install
npm run dev
```

打开终端显示的本地地址即可预览。

## 修改个人资料

编辑 `src/site.config.ts`，替换姓名、简介、邮箱和 GitHub 地址。

## 添加或修改文章

编辑 `src/data/posts.ts`。每篇文章包含标题、摘要、分类、日期、阅读时间和正文段落。复制一篇现有文章对象并修改即可新增文章。

## 检查生产版本

```powershell
npm run build
npm run preview
```

生产文件生成在 `dist` 文件夹。

## 发布

完整步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md)。
