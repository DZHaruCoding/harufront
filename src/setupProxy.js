const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080/haru',
      changeOrigin: true
    })
  );
  app.use(
    '/socket',
    createProxyMiddleware({
      target: 'http://localhost:8080/haru',
      changeOrigin: true
    })
  );
  app.use(cors());
};
