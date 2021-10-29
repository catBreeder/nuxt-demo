// 进入页面，离开页面埋点
import { spmLogApi } from '@/api/common';
import {getUserID, setCurrentPageSpmID, getCurrentPageSpmID, getRefSpm, getRefer} from '../memory';



export const loginRegisterPageBury =(option={})=>{
  const {operate ,p,spm,resultdata} = option;
  /*
  * userid:用户id,非必填
  * spm:a0001,页面编号，功能编号，自定义，当前页面的spmID
  * spmvalue:operate=='page'?-1:上一个请求的spmID
  * referer:上个页面的url
  *  opeation：page(页面加载)close(页面关闭)click(单击事件)
  *   refspm:上个页面的spm
  *   p:当前页面名称
  *   device:设备 mobile/pc
  * */
  //如果是page传-1，不然传上一个当前页面的spmID
  let spmvalue = operate=='page'?-1:getCurrentPageSpmID();
  let opeation = operate;//用户操作
  let params ={
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
  spmLogApi(params).then(res=>{
    setCurrentPageSpmID(res.spmid);//保存当前页面的spmid
    // store().commit('setCurrentPageSpmID',res.spmid)
  })

}
//关键字埋点
export const keywordPageBury =(option={})=>{
  const {operate ,p,spm,resultdata} = option;
  /*
  * userid:用户id,非必填
  * spm:a0001,页面编号，功能编号，自定义，当前页面的spmID
  * spmvalue:operate=='page'?-1:上一个请求的spmID
  * referer:上个页面的url
  *  opeation：page(页面加载)close(页面关闭)click(单击事件)
  *   refspm:上个页面的spm
  *   p:当前页面名称
  *   device:设备 mobile/pc
  * */
  //如果是page传-1，不然传上一个当前页面的spmID
  let spmvalue = operate=='page'?-1:getCurrentPageSpmID();
  let opeation = operate;//用户操作
  let params ={
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
  spmLogApi(params).then(res=>{

  })

}
