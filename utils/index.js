/*
*
* 将对象转成数组
*/
import moment from 'moment'
import Store from '@/store';
import {getCurrentPageSpmID, getLoginInfo, getRefer, getRefSpm, getUserID,getCurrentPage} from './memory';
import { spmLogApi ,registerErrorUploadApi} from '@/api/common';

export const objectTranToArray =(object)=> {
  let newVal=[];
  for(let k in object){
    newVal.push({
      id:Number(k),
      name:object[k]
    })
  }
  return newVal
}
export const objectTranToArrayString =(object)=>{
  let newVal=[];
  for(let k in object){
    newVal=[...newVal,{
      id:k,
      name:object[k]
    }]
  }
  return newVal
}
//金额保留两位小数，且不四舍五入
export const decimalFun =(num)=>{

  var bb = String(num);
  var dian = bb.indexOf('.');
  var result = "";
  if(dian == -1){
    result =  num.toFixed(2);
  }else{
    let value =bb.split('.')[1];//小数部分
    let intVal =bb.split('.')[0];//整数部分
     result = intVal +'.'+value.substr(0, 2);
  }
  return Number(result)
}
//获取网址变量
export const getQueryVariable =(variable)=>{
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for(let i =0;i<vars.length;i++){
    let pair = vars[i].split('=');
    if(pair[0]===variable) return pair[1]
  }
  return false;
}
export function emailValidate(value){
  let reg="^(\\w-*\\.*)+@(\\w-?)+(\\.\\w{2,})+$";
  return new RegExp(reg).test(value);
}
export function phoneValidate(value) {
  let reg = /^[0-9]+.?[0-9]*$/;
  return reg.test(value);
}
export function pwdValidate(value){
  let reg = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$";
  // let reg = "^(?![A-Z]+$)(?![a-z]+$)(?!\\d+$)(?![\\W_]+$)\\S{6,16}$";
  return new RegExp(reg).test(value)
}


//时间格式化
export const timeFormatValidate =(value,type)=>{
  switch (type){
    case 'YM':return moment(value).format('YYYY-MM');
    case 'YMD':return moment(value).format('YYYY-MM-DD');
    case 'YMDHM': return moment(value).format('YYYY-MM-DD HH:mm');
    case 'YMDHMS':return moment(value).format('YYYY-MM-DD HH:mm:ss');
    default: return moment(value).format('YYYY-MM-DD');
  }
}

export const trackTagFun =(option)=>{
  let p = option.page;
  let spmvalue = getCurrentPageSpmID() ;
  let spm =`a0001.${p}.${option.fun}.${option.index?option.index:0}.${spmvalue}`
  let params ={
    userid:getUserID()?getUserID(): "",
    spmvalue,
    p,
    opeation:'click',
    device:'mobile',
    spm,
    referer:getRefer(),
    refspm:getRefSpm()
  }
  spmLogApi(params).then(res=>{

  })
}
export const getOrigUrlOption=()=>{
  let url = window.location.search;
  if (url.indexOf('?') == 1) {return false; }
  if(url.indexOf('origUrl')!=-1){
    let index = url.indexOf('origUrl');
    let newValue= url.substring(index+8);
    return newValue;
  }

}
export const getUrlParamsFun =(name,url)=>{
  console.log(url);
  if (url.indexOf('?') == 1) {return false; }
  url = url.substr(1);
  url = url.split('&');
  var name = name || '';
  var nameres;
  // 获取全部参数及其值
  for(var i=0;i<url.length;i++) {
    var info = url[i].split('=');
    var obj = {};
    obj[info[0]] = decodeURI(info[1]);
    url[i] = obj;
  }
  // 如果传入一个参数名称，就匹配其值
  if (name) {
    for(var i=0;i<url.length;i++) {
      for (const key in url[i]) {
        if (key == name) {
          nameres = url[i][key];
        }
      }
    }
  } else {
    nameres = url;
  }
  // 返回结果
  return nameres;
}

//获取网址参数
export const getUrlParams=(name)=> { // 不传name返回所有值，否则返回对应值
  var url = window.location.search;
  if (url.indexOf('?') == 1) { return false; }
  url = url.substr(1);
  url = url.split('&');
  var name = name || '';
  var nameres;
  // 获取全部参数及其值
  for(var i=0;i<url.length;i++) {
    var info = url[i].split('=');
    var obj = {};
    obj[info[0]] = decodeURI(info[1]);
    url[i] = obj;
  }
  // 如果传入一个参数名称，就匹配其值
  if (name) {
    for(var i=0;i<url.length;i++) {
      for (const key in url[i]) {
        if (key == name) {
          nameres = url[i][key];
        }
      }
    }
  } else {
    nameres = url;
  }
  // 返回结果
  return nameres;
}
//对象数组去重
export const objectArrayRepeat=(arr)=>{
  let obj ={};
  arr = arr.reduce((item,next)=>{
    obj[next.key]?"":obj[next.key] = true && item.push(next)
    return item;
  },[])
  return arr;
}
//计算两个时间戳之间的时间差
//计算两个时间之间的时间差 多少天时分秒
export const  intervalTimeFun =(endTime)=> {
  var date1=new Date().getTime(); //开始时间
  var date2 = endTime; //结束时间
  var date3 =  date2.getTime() - date1.getTime(); //时间差的毫秒数
  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  //计算出小时数

  var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数

  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  console.log(days + "天 " + hours + "小时 ")
  return   days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
}
//点击埋点
//option所传:spm,p,
export const clickPointFun=(option)=>{
  spmLogApi({
    ...option,
    ...{
      spmvalue:getCurrentPageSpmID()?getCurrentPageSpmID():'',
      opeation:'click',
      device:'mobile',
      referer:getRefer()?getRefer():'',
      refspm:getRefSpm()?getRefSpm():'',
      userid:getUserID()?getUserID():'',
    }
  }).then(res=>{

  })
}

//错误信息option={errorno,errorreason}
export const errorFun =(option)=>{
  let params ={
    device:'mobile',
    brower:navigator.userAgent,//浏览器型号
    browerversion:navigator.appVersion,
    width:document.body.clientWidth,
    height:document.documentElement.clientHeight,
    pageurl:window.location.href,
  }
  registerErrorUploadApi({...option,...params}).then(res=>{

  })
}
//去除所有空格
export const removeAllSpace =(str)=> {
  return str.replace(/\s+/g, "")
}
//判断是不是空对象
export const objectIsExist =(object)=>{
  return JSON.stringify(object) !== "{}";
}
/*SEO优化*/
export const optimizeUtils =(object)=> {
  // let metaList = document.getElementsByTagName("meta");
  // const {description, title, keywords} = object;
  // document.title =title? `${title} - ShopShipShake`:'ShopShipShake';
  // for (let i = 0; i < metaList.length; i++) {
  //   if (metaList[i].getAttribute("property") == "og:title") {
  //     metaList[i].content = `${title} - ShopShipShake`;
  //   }
  //   if (metaList[i].getAttribute("property") == "og:description") {
  //     metaList[i].content = description?description:'ShopShipShake.com offers you the largest online 1688.com shopping option in China, the fastest we can do is 3 days to JNB (Door to Door) with reasonable cost purchasing more than 1 billion different products directly from the Chinese factory. ';
  //   }
  //   if (metaList[i].getAttribute("name") == "keywords") {
  //     metaList[i].content = keywords?keywords:'1688, alibaba cn, 1688 english, chinese alibaba, 1688 agent, 1688 buying agent, buy from 1688, 1688 wholesale, 1688 delivery';
  //   }
  //   if (metaList[i].getAttribute("name") == "description") {
  //     metaList[i].content = description?description:'ShopShipShake.com offers you the largest online 1688.com shopping option in China, the fastest we can do is 3 days to JNB (Door to Door) with reasonable cost purchasing more than 1 billion different products directly from the Chinese factory. ';
  //   }
  // }
}
/*返回埋点所需的optino*/
export const keywordOption =(option={})=>{
  const {operate ,p,spm,resultdata} = option;
  let spmvalue = operate=='page'?-1:getCurrentPageSpmID();
  let opeation = operate;//用户操作
  return {
    device:'mobile',
    userid:getUserID()?getUserID():'',//用户id
    p,//当前页面名称
    spm,
    opeation,
    spmvalue,
    refer:getRefer()?getRefer():'',
    refspm:getRefSpm()?getRefSpm():'',
    resultdata
  }
}
