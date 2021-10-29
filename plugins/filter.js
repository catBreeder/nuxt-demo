import Vue from 'vue';
import moment from "moment";
import config from '@/config'
//时间格式化
Vue.filter('timeFormat',(value,type)=>{
  switch (type){
    case 'YM':return moment(value).format('YYYY-MM');
    case 'ym':return moment(value).format('YYYY-M')
    case 'YMD':return moment(value).format('YYYY-MM-DD');
    case 'YMDHM': return moment(value).format('YYYY-MM-DD HH:mm');
    case 'YMDHMS':return moment(value).format('YYYY-MM-DD HH:mm:ss');
    default: return moment(value).format('YYYY-MM-DD');
  }
})

//金钱格式化
Vue.filter('moneyFormat',(value, show=true, decimals)=>{
  let digitsRE=/(\d{3})(?=\d)/g;
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  let currency = show?'R ':''
  decimals = decimals != null ? decimals : 2
  let stringified = Math.abs(value).toFixed(decimals)
  let _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  let i = _int.length % 3
  let head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  let _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  let sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float;
})

//优惠卷类型
Vue.filter('activityCouponFilter',(value)=>{
  return config.activityCouponType[value]
})
Vue.filter('monthFilter',num=>{
  if(!num) return;
  let value =['January','February','March','April','May','June','July','August','September','October','November','December'];
  return value[num];
})

Vue.filter('strSpliceFilter',value=>{
  if(!value) return;
  if(value.length>=15){
    return `${value.substring(0,15)}...`
  }else{
    return value
  }

})
