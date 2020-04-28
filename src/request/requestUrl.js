let url = {};

// 开发环境
if(process.env.NODE_ENV == 'development') {
  url = {
    baseUrl: 'http://kernel.services.test.xingchen.cn/',
    qiniuUrl: 'https://api.services.xingchen.cn/',
    staticUrl: 'https://cdn.xingchen.cn/'
  };
}

// 测试环境
if(process.env.NODE_ENV == 'test') {
  url = {
    baseUrl: 'http://kernel.services.test.xingchen.cn/',
    qiniuUrl: 'https://api.services.xingchen.cn/',
    staticUrl: 'https://cdn.xingchen.cn/'
  };
};

// 生产环境
if(process.env.NODE_ENV == 'production') {
  url = {
    baseUrl: 'https://kernel.services.xingchen.cn/',
    qiniuUrl: 'https://api.services.xingchen.cn/',
    staticUrl: 'https://cdn.xingchen.cn/'
  };
}

export default url;