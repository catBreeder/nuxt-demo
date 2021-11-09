import axios from 'axios';
import {stringify} from 'qs';
import { getUserTicket,setUserTicket } from '@/utils/memory';
axios.defaults.baseURL =process.env.baseUrl;
const service = axios.create({
  headers: {
    "X-Requested-With":"XMLHttpRequest",
    post: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    get:{
      'Content-Type':'application/json;charset=utf-8'
    }
  },
})
const shareService = axios.create({
  headers: {
    "X-Requested-With":"XMLHttpRequest",
    post: {
      'Content-Type': 'application/json',
    }
  },
})

service.interceptors.request.use(config=>{
  return config;
},err=>{
  return Promise.reject(err)
})
service.interceptors.response.use(response=>{

  if(response.status===200){
    return response.data;
  }
},err=>{
  if(err){
    if(err.response && err.response.status==401){
      let ajaxdata = err.response.data;
      if(ajaxdata.code=='3000012'){
        window.location.href=ajaxdata.redirect;
      }else{
        return Promise.reject(err)
      }
    }else{
      return Promise.reject(err)
    }
  }


})
export const post =(url,object)=>{
  let ticket =getTicket();
  return service.post(`${url}?ticket=${ticket || ''}`,stringify(object));
}
export const get =(url,option)=> {
  let ticket = getTicket();
  if(url.indexOf('api/popupwindow/pop')!==-1
    || url.indexOf('/api/search/producturlSearch')!==-1
    || url.indexOf('/api/deliveryorder/deliveryway')!==-1
    || url.indexOf('/api/user/sendMobileactivationcode')!==-1
    || url.indexOf('/api/user/sendEmailactivationcode')!==-1
    || url.indexOf('/api/user/update')!==-1
    || url.indexOf('/api/updatepwd/updatepassword')!==-1
    || url.indexOf('/api/shoporder/detail')!==-1
    || url.indexOf('/api/customertask/todo')!==-1
    || url.indexOf('/api/cart/loadaccept')!==-1
    || url.indexOf('/api/membership/priceinfo')!==-1
    || url.indexOf('/api/deliveryorder/combine')!==-1
    || url.indexOf('/api/supplier/addfavorite')!==-1
    || url.indexOf('/api/supplier/removefavorite')!==-1
    || url.indexOf('/api/product/productlimit')!==-1
    || url.indexOf('/api/customertask/promotion')!==-1
    || url.indexOf('/api/customertask/getBillList')!==-1
  ){
    //如果是pop，就返回res
    let originUrl = ticket?`${url}?ticket=${ticket || ''}`:`${url}`
    return service.get(originUrl,{params:option}).then(res=>res)
  }else{
    let newVal = ticket?`${url}?ticket=${ticket || ''}`:`${url}`
    let urlVal = url.indexOf('/api/spm/log') >0 ?url:`${newVal}`;
    return service.get(urlVal,{params:option}).then(res=>res.data)
  }

}

//商品分享接口
export const shareRequest = (url,params={})=>{
  let ticket =getTicket();
  let originUrl = ticket?`${url}?ticket=${ticket || ''}`:`${url}`
  return shareService.post(originUrl,params)}

//图片暴露由数组形式
export const getExposure = (url,params={})=>{
  let ticket = getTicket();
  let originUrl = ticket?`${url}?ticket=${ticket || ''}`:`${url}`
  return service.post(originUrl,stringify(params))}

//获取网址的参数
function getUrlParams(name){ // 不传name返回所有值，否则返回对应值
  var url =''
  if(process.client){
    url = window.location.search
  }
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

//获取ticket
function getTicket(){
  let s3UserTicket = getUserTicket() || '';
  if(!s3UserTicket){
    s3UserTicket = getUrlParams('ticket')
    if(s3UserTicket){
      setUserTicket(s3UserTicket)
    }
  }
  return s3UserTicket;
}
