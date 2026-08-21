# 随机狐狸图库

一个托管在 Cloudflare Pages 的随机狐狸图片接口。往 `foxpic/` 丢图，手动点一次 GitHub Action 部署，图库自动扩增。

## 接口

| 路径 | 说明 |
|---|---|
| `GET /random` | 随机返回一张图，JSON：`{"url":"https://<域名>/foxpic/xxx.jpg","file":"xxx.jpg"}` |
| `GET /random?redirect=1` | 302 直接跳转到随机图，`<img src>` 直接可用 |
| `GET /list` | 返回全部图清单：`{"count":282,"images":[...]}` |
| `GET /` | 浏览器展示页，一键换一张 |

所有响应带 `Access-Control-Allow-Origin: *`，跨域可调。

## 首次部署（一次性）

### 1. 创建 GitHub 仓库并推上去

```bash
git init
git add .
git commit -m "foxpic"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 2. 创建 Cloudflare Pages 项目

1. 打开 Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages**
2. 项目名填 `foxpic`（要和 `wrangler.toml`/`deploy.yml` 里的 `--project-name=foxpic` 一致）
3. 可以选 "Connect to Git" 连这个仓库（只是方便看代码，**不依赖它的自动部署**），也可以不连，直接用 Action 部署
4. 创建一个 API Token：My Profile → API Tokens → Create Token，选模板 **"Edit Cloudflare Workers"**，权限包含 **Account: Cloudflare Pages: Edit**，Scope 选你的账号

### 3. 给仓库配置两个 Secrets

仓库 → **Settings → Secrets and variables → Actions → New repository secret**：

| Secret 名 | 值 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | 上一步创建的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 控制台首页右侧的 Account ID |

### 4. 手动部署

仓库 → **Actions** → 选 **Deploy to Cloudflare Pages** → **Run workflow** → 等跑完。

之后会拿到 `https://foxpic.pages.dev`，绑域名由你自己处理。

## 日常使用：扩增图库

1. 往 `foxpic/` 加图（GitHub 网页拖拽上传，或本地 `git push`）
2. 去仓库 **Actions** 点 **Run workflow** 手动部署一次
3. 图库立即生效

## 本地开发

```bash
npm install
npm run dev     # 构建 + 本地起服务，默认 http://localhost:8788
```

`npm run deploy` 可在本地直接部署（需配好 wrangler 登录或环境变量）。

## 目录结构

```
foxpic/                    ← 图库，只支持 jpg/jpeg/png/gif/webp/bmp
functions/random.js        ← /random 接口
functions/list.js          ← /list 接口
public/index.html          ← 展示页
build.js                   ← 扫描 foxpic 生成 _images.js 清单
.github/workflows/deploy.yml
```
