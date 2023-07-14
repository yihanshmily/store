const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: {
        '/file/upload': {
            // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
            target: 'http://v.juhe.cn/calendar/day?date=2023-2-3&key=17a370865c0bb4bb428b248060b4dc4d',
            // 允许跨域
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                '/file/upload': ''
            }
        }
      }
}})
