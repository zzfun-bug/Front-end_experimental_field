import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const BAIDU_AK = process.env.BAIDU_AK || 'N777CZMTHKGqTpopH79cFoYiItgrxPpn';   // 这里先写死也行

/* 1. 托管前端页面 */
app.use(express.static(join(__dirname, 'public')));
app.get('/favicon.ico', (_, res) => res.status(204).end());

/* 2. 代理 /map → https://api.map.baidu.com */
app.use('/map',
  createProxyMiddleware({
    target: 'https://api.map.baidu.com',
    changeOrigin: true,
    pathRewrite: { '^/map': '' },
    onProxyReq(proxyReq, req) {
      // 如果前端没带 ak，这里强制补
      const [path, query = ''] = req.url.split('?');
      if (!query.includes('ak=')) {
        const sep = query ? '&' : '?';
        proxyReq.path = `${path}${sep}ak=${BAIDU_AK}`;
      }
    }
  })
);

/* 3. 404 兜底 */
app.use((_, res) => res.status(404).send('Not Found'));

app.listen(PORT, () => {
  console.log(`✅ 本地代理+页面已启动 → http://localhost:${PORT}`);
});