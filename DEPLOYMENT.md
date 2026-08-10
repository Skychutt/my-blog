# 发布到 GitHub 与阿里云 OSS

网站已配置为纯静态项目。日常流程是：修改内容 → 提交 Git → 推送 GitHub → GitHub Actions 自动构建并上传到阿里云 OSS。

## 一、先在 GitHub 创建仓库

1. 登录 GitHub，新建一个空仓库，例如 `my-blog`。
2. 不要勾选自动创建 README、`.gitignore` 或 License。
3. 在本项目目录中执行：

```powershell
git add .
git commit -m "feat: create personal blog"
git remote add origin https://github.com/你的用户名/my-blog.git
git push -u origin main
```

## 二、在阿里云创建 OSS Bucket

1. 开通对象存储 OSS，创建一个 Bucket。
2. Bucket 用于网站时需要允许访客读取网页；推荐通过自定义域名和 CDN 对外访问，并按阿里云控制台的安全提示配置。
3. 在“静态页面”或“静态网站托管”设置中，将默认首页设为 `index.html`，默认 404 页面也可先设为 `index.html`。
4. 记下三个值：

   - Bucket 名称，例如 `my-personal-blog`
   - 地域 ID，例如 `cn-hangzhou`
   - 外网 Endpoint，例如 `oss-cn-hangzhou.aliyuncs.com`

> 如果 Bucket 位于中国内地并绑定自己的域名，通常需要先完成 ICP 备案。暂时不想备案时，可选择符合你需求的非中国内地地域，但应自行确认访问速度、费用和当时的服务规则。

## 三、创建最小权限的 RAM 用户

不要使用阿里云主账号 AccessKey。单独创建一个 RAM 用户，只授予目标 Bucket 所需的列举和上传权限；当前工作流不自动删除云端文件。

需要的核心 OSS 权限是：

- `oss:ListObjects`
- `oss:PutObject`

创建 RAM 用户的 AccessKey 后妥善保存。密钥只能放入 GitHub Secrets，不能写入代码、聊天记录或提交历史。

## 四、设置 GitHub Actions 参数

进入 GitHub 仓库：`Settings → Secrets and variables → Actions`。

在 `Secrets` 中创建：

- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`

在 `Variables` 中创建：

- `OSS_BUCKET`
- `OSS_REGION`
- `OSS_ENDPOINT`

推送 `main` 分支后，打开仓库的 `Actions` 页面查看发布结果。

## 五、绑定公共域名

1. 购买并实名认证域名。
2. 按 OSS 控制台提示绑定自定义域名并配置 DNS 解析。
3. 开启 HTTPS；可使用阿里云证书服务或 CDN 提供的证书配置。
4. 中国内地 Bucket 绑定域名前，先完成 ICP 备案。

## 以后如何更新

```powershell
git add .
git commit -m "更新文章：文章标题"
git push
```

推送后无需手动上传网页，GitHub Actions 会自动运行 `.github/workflows/deploy-aliyun-oss.yml`。
