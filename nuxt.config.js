const {internalIpV4Sync} = require('internal-ip')
const env = require('./env')
export default {
  mode: 'universal',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'shopshipshake',
    htmlAttrs: {
      lang: 'en'
    },
    // bodyAttrs:{
    //   style:'font-size:14px'
    // },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ShopShipShake.com offers you the largest online 1688.com shopping option in China, the fastest we can do is 3 days to JNB (Door to Door) with reasonable cost purchasing more than 1 billion different products directly from the Chinese factory. ' },
      { hid: 'keywords', name: 'keywords', content: '1688, alibaba cn, 1688 english, chinese alibaba, 1688 agent, 1688 buying agent, buy from 1688, 1688 wholesale, 1688 delivery' },
      { hid: 'og:keywords', name: 'og:keywords', content: '1688, alibaba cn, 1688 english, chinese alibaba, 1688 agent, 1688 buying agent, buy from 1688, 1688 wholesale, 1688 delivery' },
      { name: 'format-detection', content: 'telephone=no' },
      {hid:'og:title',property:'og:title',content:'ShopShipShake'},
      {hid:'og:type',property:'og:type',content:'website'},
      {hid:'og:image',property:'og:image',content:'https://shop.shopshipshake.com/resources/images/logo-fb.jpg'},
      {hid:'og:description',property:'og:description',content:'ShopShipShake.com offers you the largest online 1688.com shopping option in China, the fastest we can do is 3 days to JNB (Door to Door) with reasonable cost purchasing more than 1 billion different products directly from the Chinese factory.'},

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel:'stylesheet',href:'//at.alicdn.com/t/font_2383374_qq2slo5rq2.css'}
    ]
  },
  env:{
    // envVariable: envVariable,
    baseUrl:env[process.env.NODE_ENV].ENV_API
  },
  server:{
    host:internalIpV4Sync(),    port: 3000
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/reset.css',
    '@/assets/css/common.css',
  ],
  router:{
    base:'/shop',
    extendRoutes(routes,resolve){
      routes.push(
        {
          path: '/',
          redirect:'/shoppingmall/index'

        },
        //----------------------首页开始------------------
        {
          path: '/shoppingmall/index',
          name:'home',
          component:resolve(__dirname,'pages/Home/index.vue'),
          meta:{
            content:'Home',
            analyTitle:'首页',
            showQuestion:true
          }

        },
        //专题活动
        {
          path:'/activity/product/:type',
          name:'activityProduct',
          component:resolve(__dirname,'pages/Home/Activity/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        //滞留商品
        {
          path:'/clearance/index',
          name:'clearanceProduct',
          component:resolve(__dirname,'pages/Home/DetainProduct/List/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        //滞留商品详情
        {
          path:'/clearance/detail/:id',
          name:'clearanceProductDetail',
          component:resolve(__dirname,'pages/Home/DetainProduct/Detail/index.vue'),
          meta:{
            hideTabbar: true
          }
        },
        {
          path:'/shoppingmall/search/:type',
          name:'HomeSearch',
          component:resolve(__dirname,'pages/Home/HomeSearch/index.vue'),
          meta:{
            isSearch:true,//到达topRank要清除缓存
            analyTitle:'Search Result',
            hideTabbar:true
          }
        },
        {
          path:'/othershop/index',
          name:'otherShopIndex',
          component:resolve(__dirname,'pages/Home/OtherShop/index.vue'),
          meta: {
            content:'Shipping Agency',
            analyTitle: '货运代理'
          }
        },
        {
          path:'/shoppingmall/imagesearch',
          name:'imgofferlist',
          component:resolve(__dirname,'pages/Home/SearchProductDetail/index.vue'),
          meta: {
            content:'Shop for me',
            analyTitle:'Shop for me',
            hideTabbar:true
          }
        },
        {
          path:'/supplier/product/index',
          name:'supplierProductIndex',
          component:resolve(__dirname,'pages/Home/SupplierProductIndex/index.vue'),
          meta: {
            analyTitle:'Top 100 Suppliers',
            content:'Top 100 Suppliers'
          }
        },
        {
          path:'/supplier/store/index',
          name:'supplierStoreIndex',
          component:resolve(__dirname,'pages/Home/SupplierStoreIndex/index.vue'),
          meta: {
            analyTitle: '优质供应商店铺列表',
          }
        },
        //今日好券
        {
          path:'/today/special',
          name:'todaySpecial',
          component:resolve(__dirname,'pages/Home/TodaySpecial/index.vue'),
          meta: {
            content:'Today\'s Coupons ',
            analyTitle:'每日特殊优惠券'
          }
        },
        {
          path:'/helpcenter/userguidance',
          name: 'UserGuidance',
          component:resolve(__dirname,'pages/Home/UserGuidance/index.vue'),
          meta: {
            analyTitle:'教学',
            content:'User Guidance ',
            hideTabbar:true
          }
        },
        {
          path:'/shoppingmall/categorylist',
          name:'CategoryIndex',
          component:resolve(__dirname,'pages/Category/index.vue'),
          meta: {
            content:'Category',
            analyTitle:'分类查询',
          }
        },
        {
          path:'/message/index',
          name:'MessageHome',
          component:resolve(__dirname,'pages/Message/index.vue'),
          meta:{
            analyTitle:'消息中心',
            content:'Message Center'
          }
        },
        {
          path:'/message/detail/:id/:type',
          name:'MessageDetail',
          component:resolve(__dirname,'pages/Message/MessageDetail/index.vue'),
          meta:{
            analyTitle:'信息详情',
            content:'Message Detail'
          }
        },
        {
          path:'/search',
          name:'goodDetail',
          component:resolve(__dirname,'pages/Product/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        {
          path:'/helpcenter/sizeguide',
          name: 'SizeGuidance',
          component:resolve(__dirname,'pages/Product/SizeGuide/index.vue'),
          meta: {
            analyTitle:'教学',
            content:'Size Guide',
          }
        },
        {
          path:'/search/service/:productID',
          name:'productService',
          component:resolve(__dirname,'pages/Product/productService/index.vue'),
          meta: {
            keepAlive: true,
            content:'service choice',
            hideTabbar:true
          }
        },
        {
          path:'/reviewpage/:productID',
          name:'ProductReview',
          component:resolve(__dirname,'pages/Product/ProductReview/index.vue'),
          meta: {
            content:'Review',
            hideTabbar:true
          }
        },
        {
          path:'/home/shopStore',
          name:'ShopStore',
          component:resolve(__dirname,'pages/Store/ShopStore/index.vue'),
          meta: {
            content:'Search Result',
            hideTabbar:true
          }
        },
        {
          path:'/supplier/store/:storeID/:goodID',
          name:'supplierStore',
          component:resolve(__dirname,'pages/Store/SupplierStore/index.vue'),
          meta: {
            analyTitle: '供应商商店商品列表',

          }
        },
        {
          path:'/shoppingmall/categoryproduct',
          name:'Top100',
          component:resolve(__dirname,'pages/TopRank/index.vue'),
          meta: {
            analyTitle:'分类查询结果',
          }
        },
        {
          path:'/shoppingmall/comments/:type',
          name:'shoppingMallComments',
          component:resolve(__dirname,'pages/TopRank/CommentsProduct/index.vue'),
          meta: {
            content:'Search Result'
          }
        },
        {
          path:'/helpcenter/index',
          name:'HelpCenter',
          component:resolve(__dirname,'pages/Help/index.vue'),
          meta: {
            analyTitle:'帮助',
            content:'Help'
          }
        },
//-----------------------首页结束--------------------------
        //-------------购物车开始----------------
        {
          path: '/shoporder/cart',
          name:'CartIndex',
          component:resolve(__dirname,'pages/Cart/index.vue'),
          meta:{
            analyTitle:'购物车',
            content:'Cart',
          }
        },
        {
          path:'/cart/exchange',
          name:'cartExchange',
          component:resolve(__dirname,'pages/Cart/ExchangeGoods/index.vue'),
          meta: {
            analyTitle: 'Check out',
            content:'Check out'
          }
        },
        {
          path:'/shoporder/checkpaynew',
          name:'ShopOrderCheckPayNew',
          component:resolve(__dirname,'pages/Cart/Checkout/index.vue'),
          meta:{
            analyTitle:'付款结算页',
            content:'Check Out'
          }
        },
        {
          path:'/shoporder/orderList',
          name:'ShopOrderOrderList',
          component:resolve(__dirname,'pages/Cart/Checkout/OrderList/index.vue'),
          meta: {
            analyTitle:'付款结算页',
            content:'Check Out',
            hideTabbar:true
          }

        },
        {
          path:'/shoporder/paysuccess',
          name:'shopOrderPaySuccess',
          component:resolve(__dirname,'pages/Cart/SuccessPay/index.vue'),
          meta: {
            showTabbar: true,
            analyTitle: 'Cart',
            content:'Cart'
          }
        },



        //----------------购物车结束---------------
//-------------recharge开始-----------------
        {
          path: '/user/recharge',
          name:'RechargeIndex',
          component:resolve(__dirname,'pages/Recharge/index.vue'),
          meta:{
            analyTitle:'充值',
            content:'Recharge'
          }
        },
        {
          path:'/paymentvoucher/index',
          name:'paymentVoucherIndex',
          component:resolve(__dirname,'pages/Recharge/RechargeCheck/index.vue'),
          meta:{
            content:'Client Management',
            analyTitle: 'Client Management'
          }
        },
        {
          path:'/paymentvoucher/sample',
          name:'paymentVoucherSample',
          component:resolve(__dirname,'pages/Recharge/Sample/index.vue'),
          meta:{
            content:'Client Management',
            analyTitle: 'Client Management',
            hideTabbar:true
          }

        },

        //-------------recharge结束-----------------
        //------------order 开始 --------------------
        {
          path: '/shoporder/2/index',
          name:'OrdersIndex',
          component:resolve(__dirname,'pages/Orders/index.vue'),
          meta:{
            analyTitle:'我的订单',
            content:'My Orders',
          }

        },
        {
          path:'/shoporder/2/logistics/:id',
          name:'shopOrderLogistics',
          component:resolve(__dirname,'pages/Orders/TrackParcel/index.vue'),
          meta:{
          }
        },
        {
          path:'/deliveryorder/detail/:id',
          name:'DeliveryDetail',
          component:resolve(__dirname,'pages/Orders/RelatedShippingNote/index.vue'),
          meta: {}
        },
        {
          path:'/deliveryorder/2/index',
          name:'deliveryOrderIndex',
          component:resolve(__dirname,'pages/Orders/OrderShip/index.vue'),
          meta: {
            content:'Ship',
            analyTitle: 'Ship',
            hideTabbar:true
          }
        },
        {
          path:'/share/index/:id',
          name:'shareIndex',
          component:resolve(__dirname,'pages/Orders/OrderShare/index.vue'),
          meta:{
            content:'Order Share',
            analyTitle: 'Order Share'
          }
        },
        {
          path:'/shoporder/2/search',
          name:'shopOrderSearch',
          component:resolve(__dirname,'pages/Orders/OrderSearch/index.vue'),
          meta:{
            keepAlive: true,
            content:'Order Search',
            analyTitle: 'Order Search'
          }
        },
        {
          path:'/shoporder/evaluate/:id',
          name:'shopOrderEvaluate',
          component:resolve(__dirname,'pages/Orders/OrderRate/index.vue'),
          meta:{
            content:'Order Rate',
            analyTitle: 'Order Rate'
          }
        },
        {
          path:'/shoporder/2/detail/:id',
          name:'shopOrderDetail',
          component:resolve(__dirname,'pages/Orders/OrderDetail/index.vue'),
          meta: {
            analyTitle: 'Orders',
            content:'Orders',
            hideTabbar:true
          }

        },
        {
          path:'/deliveryorder/combine',//
          name:'deliveryCombine',
          component:resolve(__dirname,'pages/Orders/OrderCombine/index.vue'),
          meta:{
            analyTitle: 'Order Combine',
            content:'Order Combine',
          }
        },
        {
          path:'/shoporder/workorder/:id',
          name:'shopOrderWorkOrder',
          component:resolve(__dirname,'pages/Orders/OrderAfterSale/index.vue'),
          meta:{
            analyTitle: 'After Sale',
            content:'After Sale',
          }
        },
        {
          path:'/shopOrder/edit',
          name:'shopOrderEdit',
          component:resolve(__dirname,'pages/Orders/EditMark/index.vue'),
          meta:{
            analyTitle: 'Orders',
            content:'Orders',
            hideTabbar:true
          }
        },
        {
          path:'/deliveryorder/2/receiver',
          name:'deliveryReceiver',
          component:resolve(__dirname,'pages/Orders/DeliveryWayReceiver/index.vue'),
          meta:{
            analyTitle: 'Orders Delivery',
            content:'Orders Delivery',
          }
        },
        {
          path:'/deliveryorder/2/transport',
          name:'deliveryOrderTransport',
          component:resolve(__dirname,'pages/Orders/DeliveryWay/index.vue'),
          meta:{
            analyTitle: 'Orders Transport',
            content:'Orders Transport',
            hideTabbar:true
          }
        },
//------------order 结束--------------------
//------account 开始------------------
//
        {
          path:'/customertask/promotiontool',
          name:'customerPromotionTool',
          component:resolve(__dirname,'pages/Account/Influence/PromotionTool'),
          meta:{
            analyTitle: 'Promotion',
          }
        },
        {
          path:'/customertask/awards',
          name:'customerTaskAwards',
          component:resolve(__dirname,'pages/Account/Influence/AwardHistory'),
          meta:{
            analyTitle: 'Promotion',
          }
        },
        {
          path:'/customertask/promotiondetail',
          name:'customerTaskPromotionDetail',
          component:resolve(__dirname,'pages/Account/Influence/PromotionReward'),
          meta:{
            analyTitle:'Influence',
          }
        },
        {
          path:'/customertask/promotioninfo',
          name:'customerTaskPromotionInfo',
          component:resolve(__dirname,'pages/Account/Influence/PromotionInfo'),
          meta:{
            analyTitle:'Influence',
          }
        },
        {
          path: '/account/index',
          name:'AccountIndex',
          component:resolve(__dirname,'pages/Account/index.vue'),
          meta:{
            analyTitle:'个人账号',
            content:'My Account',
          }

        },
        {
          path:'/scoin/index',
          name:'scoinIndex',
          component:resolve(__dirname,'pages/Account/Scoin/index.vue'),
          meta:{
            analyTitle:'积分',
            hideTabbar:true,
            content:'Points'
          }
        },
        {
          path:'/customertask/promotion',
          name:'customertaskPromotion',
          component:resolve(__dirname,'pages/Account/Influence/index.vue'),
          meta: {

            analyTitle:'Influence',
            content:'Influence'
          }
        },
        {
          path:'/scoin/detail',
          name:'scoinDetail',
          component:resolve(__dirname,'pages/Account/Scoin/ScoinDetails/index.vue'),
          meta: {
            analyTitle:'Scoin',
            content:'Scoin',
            hideTabbar:true

          }
        },
        {
          path:'/bill/index',
          name:'billIndex',
          component:resolve(__dirname,'pages/Account/Balance/index.vue'),
          meta: {
            analyTitle:'资产',
            content:'Balance'
          }

        },
        {
          path:'/scoin/description',
          name:'scoinDescription',
          component:resolve(__dirname,'pages/Account/Scoin/AboutScoin/index.vue'),
          meta: {
            content:'S Coin Description',
            analyTitle: 'S Coin Description',
            hideTabbar:true
          }

        },
        {
          path:'/scoin/exchange/:type/:param?',
          name:'scoinExchange',
          component:resolve(__dirname,'pages/Account/Scoin/ExchangeDetail/index.vue'),
          meta: {
            content:'S coin exchange',
            analyTitle: 'S coin exchange',
            hideTabbar:true
          }
        },
        {
          path:'/customertask/todo',
          name:'CustomerTaskTodo',
          component:resolve(__dirname,'pages/Account/Task/index.vue'),
          meta:{
            content:'Customer To do',
            analyTitle: 'Customer To do'
          }
        },
        {
          path:'/recent/view',
          name:'recentView',
          component:resolve(__dirname,'pages/Account/RecentView/index.vue'),
          meta:{
            content:'View',
            analyTitle: 'View',
            hideTabbar:true
          }
        },
        {
          path:'/user/info',
          name:'userInfo',
          component:resolve(__dirname,'pages/Account/UserInfo/index.vue'),
          meta:{
            content:'Personal Info',
            analyTitle:'个人信息',
          }
        },
        {
          path:'/user/updatepassword',
          name:'updatePassword',
          component:resolve(__dirname,'pages/Account/UpdatePassword/index.vue'),
          meta: {
            analyTitle:'更改密码',
            content:'Change Your Password'
          }
        },
        {
          path:'/workorder/index',
          component:resolve(__dirname,'pages/Account/AfterSaleService/index.vue'),
          meta: {
            analyTitle:'售后服务',
            content:'After Sales'
          }
        },
        {
          path:'/user/info/change/:type',
          name:'userInfoChange',
          component:resolve(__dirname,'pages/Account/UserInfo/ProfileChange/index.vue'),
          meta:{
            analyTitle:'UserInfo Change',
            content:'UserInfo Change'
          }
        },
        {
          path:'/membership/index',
          name:'membershipIndex',
          component:resolve(__dirname,'pages/Account/MemberShip/index.vue'),
          meta:{
            analyTitle:'会员详情',
            content:'Member Info',
          }
        },
        {
          path:'/membership/checkout',
          name:'membershipCheckOut',
          component:resolve(__dirname,'pages/Account/MemberShip/Checkout/index.vue'),
          meta:{
            analyTitle:'会员购买',
            content:'Member Orders'
          }
        },
        {
          path:'/account/saving',
          name:'accountSaving',
          component:resolve(__dirname,'pages/Account/MemberShip/AccountSaving/index.vue'),
          meta: {
            analyTitle:'Money-saving Bills',
            content:'Money-saving Bills'
          }
        },
        {
          path:'/groupship/index',
          name:'groupShip',
          component:resolve(__dirname,'pages/Account/GroupShip/index.vue'),
          meta:{
            analyTitle:'加入团购',
            content:'Join Group Purchase',
            hideTabbar:true
          }
        },
        {
          path:'/groupship/bindAmbassador',
          name:'groupShipBindAmbassador',
          component:resolve(__dirname,'pages/Account/GroupShip/BindSuccess/index.vue'),
          meta: {
            analyTitle:'Join Group Success',
            content:'Join Group Success'
          }
        },
        {
          path:'/client/index',
          name:'clientIndex',
          component:resolve(__dirname,'pages/Account/Client/index.vue'),
          meta:{
            showTabbar:true,
            analyTitle:'客户管理',
            content:'Customer Management'
          }
        },
        {
          path:'/client/edit/:id',
          name:'ClientEdit',
          component:resolve(__dirname,'pages/Account/Client/ClientEdit/index.vue'),
          meta:{
            content:'Customer Management',
            analyTitle:'客户管理',
          }
        },
        {
          path:'/user/toTransfer',
          name:'userToTransfer',
          component:resolve(__dirname,'pages/Account/Transfer/index.vue'),
          meta:{
            analyTitle:'资产转移',
            content:'Balance Transfer'
          }
        },
        {
          path: '/coupon/index',
          name:'couponIndex',
          component:resolve(__dirname,'pages/Account/CouponList/index.vue'),
          meta:{
            analyTitle:'优惠券',
            content:'Coupons',
          }
        },
        {
          path:'/questionFeedback/feedbacksearch',
          name:'questionFeebackSearch',
          component:resolve(__dirname,'pages/Account/Question/Answer/index.vue'),
          meta: {
            content:'Answer',
            hideTabbar:true
          }
        },
        {
          path:'/questionFeedback/index',
          name:'questionFeebackIndex',
          component:resolve(__dirname,'pages/Account/Question/FeebackList/index.vue'),
          meta: {
            content:'Feedback',
            hideTabbar:true
          }
        },
        {
          path:'/questionFeedback/feedback',
          name:'questionFeeback',
          component:resolve(__dirname,'pages/Account/Question/Feeback/index.vue'),
          meta: {
            content:'Feedback',
            hideTabbar:true
          }
        },
        {
          path:'/question/topics/:id',
          name:'questionTopics',
          component:resolve(__dirname,'pages/Account/Question/QuestionTopics/index.vue'),
          meta:{

            content:'Ambassador Q&A'
          }
        },
        {
          path:'/question/answer/:id',
          name:'questionAnswer',
          component:resolve(__dirname,'pages/Account/Question/QuestionDetail/index.vue'),
          meta:{
            analyTitle:'大使问答',
            content:'Question search'
          }
        },
        {
          path:'/question/search',
          name:'questionSearchIndex',
          component:resolve(__dirname,'pages/Account/Question/QuestionSearch/index.vue'),
          meta: {
            analyTitle:'大使问答',
            content:'Question search',
            hideTabbar:true
          }
        },
        {
          path:'/question/index',
          name:'questionIndex',
          component:resolve(__dirname,'pages/Account/Question/index.vue'),
          meta: {
            analyTitle:'大使问答',
            content:'Ambassador Q&A',
            hideTabbar:true
          }
        },
        {
          path:'/shoppingmall/collectionproduct',
          name:'collectionProduct',
          component:resolve(__dirname,'pages/Account/Favorites/index.vue'),
          meta: {
            analyTitle:'收藏',
            content:'Favorites',
            hideTabbar:true
          }
        },
        {
          path:'/helpcenter/index/:type',
          name:'HomeHelpDetial',
          // component:()=>import('@/views/Help/HelpDetail'),
          component:resolve(__dirname,'pages/Help/HelpDetail/index.vue'),
          meta: {
            content:'Help',
            analyTitle: '帮助'
          }
        },
//------account 开始------------------

        //地址列表
        {
          path:'/client/2/index',
          name:'clientIndex2',
          component:resolve(__dirname,'pages/Client/AddressList/index.vue'),
          meta:{
            showTabbar:true,
            content: 'Purchase Order',
            analyTitle: 'Purchase Order'
          }
        },
        //添加或者编辑地址
        {
          path:'/client/2/edit',
          name:'clientAddressOperate',
          component:resolve(__dirname,'pages/Client/AddressOperate/index.vue'),
          meta:{
            content: 'Purchase Order',
            analyTitle: 'Purchase Order'
          }

        },
        /*---------------------第三版登录注册----------------*/
        {
          path: '/login',
          name: 'login',
          component:resolve(__dirname,'pages/User/Login/index.vue'),
          meta:{
            analyTitle:'登录',
            hideTabbar:true,
            isShopify:false
          }
        },
        {
          path:'/register',
          component:resolve(__dirname,'pages/User/Register/PersonRegister/index.vue'),
          meta:{
            analyTitle: 'customers-register',
            content:'customers-register'
          }
        },
        {
          path: '/register/business',
          component:resolve(__dirname,'pages/User/Register/BusinessRegister/index.vue'),
          meta:{
            analyTitle: 'clients-register',
            content:'clients-register',

          }
        },
        {
          path: '/register/shopify',
          component:resolve(__dirname,'pages/User/Register/ShopifyRegister/index.vue'),
          meta:{
            analyTitle: 'shopify-register',
            content:'shopify-register',

          }
        },
        /*------------登录注册结束-----------------*/
        /*------------shopify结束-----------------*/
        {
          path:'/shopify/index',
          name:'ShopifyIndex',
          component:resolve(__dirname,'pages/Shopify/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        {
          path:'/shopify/tutorial',
          name:'ShopifyTutorial',
          component:resolve(__dirname,'pages/Shopify/Tutorial/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        {
          path:'/shopify/contact',
          name:'ShopifyContact',
          component:resolve(__dirname,'pages/Shopify/Contact/index.vue'),
          meta:{
            hideTabbar:true
          }
        },
        /*------------shopify结束-----------------*/
      )
    }
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/utils/request.js',
    {src:'@/plugins/vant-ui.js',ssr:true},

    {
      src: '@/plugins/lib-flexible',
      ssr: false //不设置会报错
    },
    {
      src: '@/plugins/gTag.js',
      ssr: true //不设置会报错
    },
    {
      src: '@/plugins/eventBus.js',
      ssr: true //不设置会报错
    },
    '@/plugins/directives.js',
    '@/plugins/animate',
    '@/plugins/filter.js',
    '@/plugins/clipBoard.js',
    {src:'@/plugins/router.js',ssr:false},
    {src:'@/plugins/intro.js',ssr:false},
    {src: '@/plugins/sensor.js',ssr:false},
    {src: '@/plugins/vueCropper.js',ssr:false},
    { src: '@/plugins/localStorage.js', ssr: false },
    {src: '@/plugins/main', ssr: true},
    {src:'@/plugins/exposure.js',ssr:false},
    {src:'@/plugins/swiper.js',ssr:false},
    {src:'@/plugins/drag.js',ssr:true},
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
  axios:{
    //开启代理
    proxy: true,
    //最多重发三次
    retry: { retries: 3 },
    //是否是可信任
    withCredentials: true
  },
  proxy:{
    '/api':{
      target:env[process.env.NODE_ENV].ENV_API,
      changeOrigin:true,
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: { allChunks: true },
    vendor: ["axios"],
    // optimization:{
    //   splitChunks:true
    // },
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

