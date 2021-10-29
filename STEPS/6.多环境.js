/*
  1.安装插件
  npm install --save-dev cross-env
  2.根目录下新建env.js
  module.export ={

    zhouzhendev:{
      NODE_ENV: 'dev',
        ENV_API:'http://192.168.0.46:28081'
    },
    jianweidev:{
    NODE_ENV: 'dev',
    ENV_API:'http://192.168.0.46:18080'
  },
  zhouzhenprod:{
    NODE_ENV: 'prod',
    ENV_API:'http://192.168.0.46:28081'
  },
  jianweiprod:{
    NODE_ENV: 'prod',
    ENV_API:'http://192.168.0.46:18080'
  },
  }
  3.在nuxt.config.js中配置
  const env = require('./env')
  env:{
    baseUrl:env[process.env.NODE_ENV].ENV_API
  },
  4.package.json中配置命令行
  "start:jianwei": "cross-env NODE_ENV=jianweidev nuxt",
   "generate:zhouzhen": "cross-env NODE_ENV=zhouzhenprod nuxt generate",
* */
