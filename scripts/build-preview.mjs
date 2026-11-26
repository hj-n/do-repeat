#!/usr/bin/env node
/**
 * 웹 미리보기 빌드
 *
 * `npx expo export --platform web` 결과를 claude.ai 미리보기 페이지로 올릴 수 있는 형태로 바꿉니다.
 * - JS와 CSS는 HTML 안에 넣고 (미리보기 페이지는 외부 스크립트를 막기 때문)
 * - 이미지/폰트 경로는 페이지 기준 상대 경로로 바꿉니다.
 *
 * 결과: preview/index.html, preview/assets/**, preview/files.json (Artifact `files` 맵)
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, '.preview-build');
const outDir = path.join(root, 'preview');

fs.rmSync(buildDir, { recursive: true, force: true });
fs.rmSync(outDir, { recursive: true, force: true });

execFileSync('npx', ['expo', 'export', '--platform', 'web', '--output-dir', buildDir], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, CI: '1' },
});

const exported = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
const scriptSrcs = [...exported.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
const cssHrefs = [...exported.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);

const read = (urlPath) => fs.readFileSync(path.join(buildDir, urlPath.replace(/^\//, '')), 'utf8');

function inlineJs(code) {
  if (/["'`]\/_expo\/static\/js\//.test(code)) {
    throw new Error('Bundle still loads chunks at runtime; keep asyncRoutes disabled in app.json.');
  }
  return code
    .replaceAll('"/assets/', '"./assets/')
    .replaceAll("'/assets/", "'./assets/")
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--');
}

const css = cssHrefs
  .map((href) => read(href).replaceAll('url(/assets/', 'url(./assets/').replace(/<\/style/gi, '<\\/style'))
  .join('\n');
const js = scriptSrcs.map((src) => `<script>\n${inlineJs(read(src))}\n</script>`).join('\n');

const template = fs.readFileSync(path.join(root, 'scripts', 'preview-template.html'), 'utf8');
const html = template.replace('/*__CSS__*/', () => css).replace('<!--__JS__-->', () => js);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);

const files = {};
const assetsSrc = path.join(buildDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, path.join(outDir, 'assets'), { recursive: true });
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : [p];
    });
  for (const file of walk(path.join(outDir, 'assets'))) {
    const rel = path.relative(outDir, file).split(path.sep).join('/');
    files[rel] = path.relative(root, file).split(path.sep).join('/');
  }
}
fs.writeFileSync(path.join(outDir, 'files.json'), JSON.stringify(files, null, 2) + '\n');

const kb = (n) => `${Math.round(n / 1024)}KB`;
console.log(`\npreview/index.html ${kb(Buffer.byteLength(html))}, ${Object.keys(files).length} asset files`);
