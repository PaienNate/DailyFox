const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FOXPIC = path.join(ROOT, 'foxpic');
const PUBLIC = path.join(ROOT, 'public');
const FUNCTIONS = path.join(ROOT, 'functions');
const DIST = path.join(ROOT, 'dist');

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i;

function rm(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function cp(src, dst) {
  fs.cpSync(src, dst, { recursive: true });
}

function readImages(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`目录不存在: ${dir}`);
    return [];
  }
  return fs.readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort();
}

// 1. 清空并重建 dist
rm(DIST);
fs.mkdirSync(DIST, { recursive: true });

// 2. 复制图库
if (fs.existsSync(FOXPIC)) {
  cp(FOXPIC, path.join(DIST, 'foxpic'));
}

// 3. 复制静态页内容到 dist 根
if (fs.existsSync(PUBLIC)) {
  for (const f of fs.readdirSync(PUBLIC)) {
    cp(path.join(PUBLIC, f), path.join(DIST, f));
  }
}

// 4. 扫描图库，生成清单模块（dev 与 deploy 共用源码 functions/）
const images = readImages(FOXPIC);
const js = '// 自动生成，勿手改。由 build.js 扫描 foxpic/ 生成。\n'
  + `export const IMAGES = ${JSON.stringify(images, null, 2)};\n`;
fs.writeFileSync(path.join(FUNCTIONS, '_images.js'), js);

// 5. 复制函数（含刚生成的 _images.js）进 dist
if (fs.existsSync(FUNCTIONS)) {
  cp(FUNCTIONS, path.join(DIST, 'functions'));
}

console.log(`构建完成: ${images.length} 张图片，输出到 dist/`);
