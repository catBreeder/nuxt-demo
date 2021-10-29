<template>
    <div>

    </div>
</template>

<script>
  import {shareURL, productURL, imageWebsiteURL, uploadImgURL, onlineImgURL} from '@/config/urls'
  const baseURL = process.env.baseUrl;
  export default {
    baseURL,
    duringWait: 500,
    shareURL,//分享的网址
    productURL,
    jianweiDomain:baseURL,
    imageURL: imageWebsiteURL,//图片搜索上传后返回的域名
    uploadImgURL,
    onlineImgURL,//图片上传的域名
    //b客户和c用户的区分
    customerIdentityType:{
      personal:1, //C用户
      business:2,//B用户
    },
    //全职和兼职
    timeJobEnumerate:{
      1:'Part-time',
      2:'Full time'
    },
    experienceEnumerate:{
      1:'0-2',
      2:'3-5',
      3:'5+'
    },
    workerEnumerate:{
      0:'Own-Account (no workers)',
      1:'Micros (1 to 4 employees)',
      2:'Small (5 to 9 employees)',
      3:'Medium (10 to 49 employees)',
      4:'Large (50 employees more)'
    },

    //区号和国家 start
    areaCode: {
      1: '27',
      2: '258',
      3: '260',
      4: '263',
      5: '264',
      6: '265',
      7: '266',
      8: '267',
    },
    areaCodeCount:{
      '27': 9,
      '258': 9,
      '260': 9,
      '263': 9,
      '264': 9,
      '265':9,
      '266': 8,
      '267': 8,
    },
    countryListObj: {
      1: 'South Africa',
      2: 'Mozambique',
      3: 'Zambia',
      4: 'Zimbabwe',
      5: 'Namibia',
      6: 'Malawi',
      7: 'Lesotho',
      8: 'Botswana'
    },
    countryAreaCode: {
      1: '+27',
      2: '+258',
      3: '+260',
      4: '+263',
      5: '+264',
      6: '+265',
      7: '+266',
      8: '+267',
    },
    //区号和国家 end
    commonCountryList:[
      {countryCode:27,count:9,name:'South Africa'},
      {countryCode:258,count:9,name:'Mozambique'},
      {countryCode:260,count:9,name:'Zambia'},
      {countryCode:263,count:9,name:'Zimbabwe'},
      {countryCode:264,count:9,name:'Namibia'},
      {countryCode:265,count:9,name:'Malawi'},
      {countryCode:266,count:8,name:'Lesotho'},
      {countryCode:267,count:8,name:'Botswana'},
    ],

    sortByNum: {
      'Bestselling': 1,//畅销的
      'Price:low to high': 2,//价格从低到高
      'Price:high to low': 3,//价格从高到底
      'NEW': 4,//最新的
      'Recommend': 5,//推荐
    },
    sortBy: {
      1: 'Bestselling',
      2: 'Price:low to high',
      3: 'Price:high to low',
      4: 'NEW',
      5: 'Recommend',
    },
    platform: {
      'Facebook': 1,
      'WhatsApp': 2
    },
    sendCode: {
      'phone': 1,//短信验证码
      'email': 2,//邮箱验证码
    },
    //弹框类型
    popupType: {
      GUIDE: 1,//引导
      NOTICE: 2,//通知
      MESSAGE: 3,//消息
      TASK: 4,//任务
      FEEDBACK: 5,//反馈
      COUPON: 6,//优惠卷
      VIP: 7,//会员
      RESEARCH: 8//调研
    },
    //会员类型
    memberType: {
      PLATINUM: 1,//铂金会员
      GOLDEN: 2,//黄金会员
      SILVER: 3,//白银会员
    },

    memberTypeZn: {
      1: '铂金会员',
      2: '黄金会员',
      3: '白银会员'
    },
    //消息类别
    messageType: {
      'ALL': 1,//全部
      'UNREAD': 2,//未读
      'ORDER': 3,//订单
      'MEMBERSHIP': 4,//会员
      'NOTIFICATION': 5//网站通知
    },
    messageStype: {
      'MONEY': 10,
      'COUPON': 30,
      'SCOIN': 40,
      'MEMBER': 50,
      'QUALITY': 60
    },
    noticeType: {
      'MESSAGE': 0,
      'NOTICE': 1
    },
    //help-cost-出运方式
    transportWay: {
      'NORMAL': 1,//普运
      'AIRLIFT': 2,//空运
    },
    //支付方式
    rechargeWay: {
      'CARD': 4,//信用卡充值
      "EFT": 5
    },
    //充值历史
    rechargeCheckOutStatusZn: {
      30: 'Unapproved',
      40: 'Giveup'
    },
    rechargeCheckOutStatus: {
      'UNAPPROVED': 30,//审核不通过
      'GIVEUP': 40,//方式
      'UNDERREVIEW': 10,//未审核
      'APPROVED': 20,//审核通过
    },
    //是否强制提交
    rechargeForce: {
      'YES': 1,//是
      'NO': 0,//否
    },
    //recharege -save后返回的状态
    rechargeSaveStatus: {
      'SUCCESS': 0,//成功
      'ERROR': 1,//异常
      'CLOSE': 2,//关闭弹框
      'STILL': 3,//强制提交
    },
    memberShipType: {
      'PLATINUM': 1,//铂金
      'GOLDEN': 2,//黄金
      'SLIVER': 3//白银
    },
    //checkout后判断有没有缺货
    toRiskType: {
      'YES': 1,//有
      'NO': 0,//么有
    },
    //今日好卷类型
    activityCouponType: {
      1: 'Shop Coupon',
      2: 'ship Coupon',
      0: 'Almighty Coupon'
    },
    //优惠卷类别
    couponType: {
      'TRANSPORTATION': 1,//运费
      'PURCHASE': 2,//采购费
    },
    //order的状态
    orderStatusEn: {
      10: 'Awaiting Payment',//待付款
      20: 'Paid',//已付款
      30: 'Purchased',//已采购未付款
      31: 'Failed',//采购失败
      32: 'Purchased',//已采购付款
      35: 'Seller Shipped',//商家已发货
      36: 'Seller Shipped',//1688签收未入库
      37: 'Seller Shipped',//已到货
      40: 'Collected',//已上架
      50: 'Waiting Shipment',//已安排发货
      60: 'Shipped',//已发货
      70: 'Signed',//已签收
      80: 'Closed',//已关单
      90: 'Cancelled',//取消
    },
    orderStatusColor: {
      10: '#8B8989',//待付款
      20: '#fcc900',//已付款
      30: '#fcc900',//已采购未付款
      31: '#f00',//采购失败
      32: '#fcc900',//已采购付款
      35: '#BEBEBE',//商家已发货
      36: '#BEBEBE',//1688签收未入库
      37: '#F4A460',//已到货
      40: '#F4A460',//已上架
      50: '#F4A460',//已安排发货
      60: '#F4A460',//已发货
      70: '#fcc900',//已签收
      80: '#f00',//已关单
      90: '#f00',//取消
    },
    orderStatus: {
      'AwaitingPayment': 10,
      'Paid': 20,
      'PurchasedNoPay': 30,
      'Failed': 31,
      'PurchasedAndPay': 32,
      'SellerShipped_1': 35,
      'SellerShipped_2': 36,
      'SellerShipped_3': 37,
      'Collected': 40,
      'WaitingShipment': 50,
      'Shipped': 60,
      'Signed': 70,
      'Closed': 80,
      'Cancelled': 90,
    },
    //order中tab
    orderTab: {
      'all': 1,
      'purchase': 3,
      'ship': 4,
      'transit': 5,
      'complete': 6,
      'fail': 7,
      'combine': 8,
      'comment': 9
    },
    orderSource: {
      'MYORDERS': 0,
      'CART': 1,
      'SEARCH': 2
    },
    orderUnit: {
      10: 'pice',
      20: 'pair',
      30: 'carton',
      40: 'pack',
      50: 'set'
    },
    //order中用户身份
    orderUserType: {
      'NORMAL': 0,//未参团
      'MANAGER': 1,//团长
      'MEMBER': 2,//团员
      'BIGCUSTOMER': 4,//大客户

    },
    //订单类型
    orderType: {
      0: 'Purchase',//采购订单
      10: 'Transfer',//转运订单
    },
    //国家
    countryCode: {
      'South Africa': 1
    },
    countryCodeZn: {
      1: 'South Africa'
    },
    //订单售后服务类型
    orderAfterSaleType:{
      '40':'Damaged',
      '30':'Wrong Qty',
      '50':'Wrong Product'
    },
    //专题活动
    themeActivityType: {
      1: 'source',//源头工厂
      2: 'sale',//-爆款热销
      4: 'updated',//新品上新
      8: 'season',//换季备货
      16: 'via',//运送方式
      32: 'kilo',//重量活动
    },
    themeActivityTypeEn: {
      'source': 1,//源头工厂
      'sale': 2,//爆款热销
      'updated': 4,//新品上新
      'season': 8,//换季备货
      'via': 16,//运输方式
      'kilo': 32,//重量
    },

    loadingType: {
      LOADING: 1,
      FINISHED: 2
    },

    fromWayType: {
      'Facebook Ads': 'Facebook Ads',
      'Facebook Group': 'Facebook Group',
      'Google': 'Google',
      'Whatsapp group': 'Whatsapp group',
      'Youtube': 'Youtube',
      'Tiktok': 'Tiktok',
      'Linkedin/Quora/Gumtree': 'Linkedin/Quora/Gumtree',
      'Others': 'Others'
    },
    mainPurpose: {
      'Personal use': 'Personal use',
      'Pre-order/Runner': 'Pre-order/Runner',
      'Purchase as stock': 'Purchase as stock'
    },
    siteType: {
      'Yes, build through Shopify': 'Yes, build through Shopify',
      'Yes, build through others': 'Yes, build through others',
      'No': 'No'
    },
    amountType: {
      '0-2000R': '0-2000R',
      '2001-5000R': '2001-5000R',
      '5001-10000R': '5001-10000R',
      'above 10000R': 'above 10000R'
    },
    noticeReadType: {
      'shop': 1,
      'ship': 2,
      'recharge': 3,
      'purchase': 4,
      'add to cart': 5
    },
    //神策埋点--专题页面 当前页面fromType类型：source(源头工程) via（运输方式） updated(上新榜) kilo(各公斤段) sale(爆款热销)
    analysisTitleType: {
      'source': '源头工厂',
      'via': '运输方式',
      'updated': '新品上新',
      'sale': '热卖',
      'kilo': '重量估算活动',
      'season': '夏日特供',

    },
    //修改专题活动英文标题
    specialActivity: {
      'source': 'Manufactories',
      'via': 'Shipping Method',
      'updated': 'New Arrivals',
      'sale': 'Hot Sales',
      'kilo': 'Weight Estimation Activity ',
      'season': 'Summer Essentials'
    },
    //积分类型
    scoinChangeRecordType:{

    },
    //弹框类型
    noticeDialogType:{
      'SHOP':1,
      'SHIP':2,
      'RECHARGE':3,
      'PURCHASE':4,
      'ADDTOCART':5
    },
    //产品类型
    specialGoodsType:{
      'NORMAL':0,//普通
      'MAGNET':1,//带磁电
      'LIQUID':2,//粉末液体
    }
  }
</script>

<style scoped>

</style>
