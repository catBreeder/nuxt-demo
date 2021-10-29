module.exports ={
  /*周振测试环境*/
  zhouzhendev:{
    NODE_ENV: 'dev',
    ENV_API:'http://192.168.0.46:28081'
  },
  /*建伟测试环境*/
  jianweidev:{
    NODE_ENV: 'dev',
    ENV_API:'http://192.168.0.46:18080'
  },
  xueyandev:{
    NODE_ENV: 'dev',
    ENV_API:'http://192.168.0.46:38080'
  },
  /*正式环境*/
  prod:{
    NODE_ENV: 'prod',
    ENV_API:'https://shop.shopshipshake.com'
  },
  /*预发布环境*/
  pre:{
    NODE_ENV: 'prod',
    ENV_API:'http://pre.shopshipshake.com'
  },
  /*周振打包环境*/
  zhouzhenprod:{
    NODE_ENV: 'prod',
    ENV_API:'http://192.168.0.46:28081'
  },
  /*建伟打包环境*/
  jianweiprod:{
    NODE_ENV: 'prod',
    ENV_API:'http://192.168.0.46:18080'
  },
  xueyanprod:{
    NODE_ENV: 'prod',
    ENV_API:'http://192.168.0.46:38080'
  }
}
