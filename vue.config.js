module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    proxy: {
      '/proxies': {
        target: 'https://proxyfordevelopers.com/api/proxies/?format=json',
        pathRewrite: { '^/proxies': '' },
        changeOrigin: true,
        secure: true,
      },
    },
  },
};