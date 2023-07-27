const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  chainWebpack: (config) => {
      config
          .plugin('html')
          .tap((args) => {
              args[0].title = 'JayMe小程序后台';
              return args;
          });
  },
  configureWebpack: config => {
    // 环境判断
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.optimization.minimizer[0].options.minimizer.options.compress = Object.assign(
        config.optimization.minimizer[0].options.minimizer.options.compress,
        {
          drop_console: true
        }
      );
    } else {
      // 为开发环境修改配置...
    }
  }
})
