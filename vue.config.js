let config = {
    publicPath: "./",
    outputDir: "dist",
    lintOnSave: false,
    runtimeCompiler: false,
    productionSourceMap: false,
    devServer: {
        host: "0.0.0.0",
        port: 8088,
        https: false,
        disableHostCheck: true
    },
    configureWebpack: {
        externals: {
            // 'vue-draggable-resizable-gorkys': 'VueDraggableResizable'
        },
        devtool: 'source-map'
    }
};

// if(process.env.NODE_ENV == 'development') {
//     // 开发环境时 跨域代理
//     config.configureWebpack.devtool = 'source-map';
//     config.devServer.proxy = {
//         '/api': {
//             target: 'https://iimg.com.cn/api',  // 测试
//             changeOrigin: true,   //允许跨域
//             ws: true,
//             pathRewrite: {
//                 '^/api': ''
//             }
//         }
//     }
// };

module.exports = config;