//图片曝光的api
import { get ,getExposure,post} from '@/utils/request';
import port from './port';
import axios from 'axios'
import { getUserTicket } from "@/utils/memory";
import {getCurrentPageSpmID} from "../utils/memory";
import config from '@/config'
/*
export const uploadImgNormalApi =(option)=>{return get(port.common_upload_img,option)}
* */

//用户操作日志api  GET /api/spm/log
export const spmLogApi =(option)=>{return get(port.spm_log,option)}
//分享初始化
export const shareInitApi=(productid)=>{return post(port.common_share_init,{productid})}
//图片上传
export const uploadImageApi =(file)=>{
  let formData = new FormData();
  formData.append('file',file.file);
  formData.append('ticket',getUserTicket());
  let config = {
    headers:{'Content-Type':'multipart/form-data'}
  };
  return axios.post(`/api/search/uploadimage`,formData,config);
}

//图片曝光埋点
export const imgExposureApi =(option)=>{
  return getExposure(port.exposure_category,{
    expdata:option,
    refspm:getCurrentPageSpmID(),
  })
}
//GET /api/shoppingmall/remindtimes新手引导记录第几次登录
export const remindTimesApi =(type)=>{return get(port.remind_time,{type})}
export const registerErrorUploadApi =(option)=>{return post(port.register_error_upload,option)}
//banner 列表 common_banner_adv_list
export const commonBannerAdvListApi =(code)=> {return get(port.common_banner_adv_list,{code})}
///api/supplier/getTitle
export const getDynamicTitleApi =(code)=> {return get(port.common_get_title,{code})}

///api/shoppingmall/querySeoInfoByCategoryid seo优化
export const commonCategorySEOApi =(categoryid)=>{return get(port.common_category_seo,{categoryid})}
