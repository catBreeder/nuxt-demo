export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-demo',
    htmlAttrs: {
      lang: 'en'
    },
    bodyAttrs:{
      style:'font-size:14px'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel:'stylesheet',href:'//at.alicdn.com/t/font_2383374_z8yunxp635.css'}
    ]
  },
  
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/reset.css'
  ],
  router:{
    base:'/shop',
    extendRoutes(routes,resolve){
      routes.push(
        {
          path: '/',
          redirect:'/shoppingmall/index'

        },
        {
          path: '/shoppingmall/index',
          name:'home',
          component:resolve(__dirname,'pages/Home/index.vue'),

        },
        {
          path: '/shop/shoporder/cart',
          name:'Cart',
          component:resolve(__dirname,'pages/Cart/index.vue'),

        },
        {
          path: '/shoporder/2/index',
          name:'Orders',
          component:resolve(__dirname,'pages/Orders/index.vue'),

        },
        {
          path: '/account/index',
          name:'Account',
          component:resolve(__dirname,'pages/Account/index.vue'),

        },
      )
    }
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/api/test.js',
    {src:'@/plugins/vant-ui.js',ssr:true},
    {
      src: '@/plugins/lib-flexible',
      ssr: false //不设置会报错
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

    //修改vant主题颜色
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.less$/,
        use: [
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                '@green': '#Fcc900'
              }
            }
          }
        ]
      })
    },
    //移动端适配
    postcss: {
      plugins: {
        'postcss-px2rem-exclude': {
          remUnit: 37.5, // 设计图为750 * height
          remPrecision: 2, // rem的小数点后位数
          exclude: /node_modules|folder_name/i //取消vant组件css转成rem
        }
      }
    },
  }
}
