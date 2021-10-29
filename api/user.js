import {post,get} from '@/utils/request';
import port from './port'
//登录接口
export const loginApi =(option)=>{ return post(port.login,option)}
//注册接口
export const registerApi =(option)=>{return post(port.register,option)}
//发送验证码
export const sendCodeApi =(option)=> { return post(port.sendCode,option) }
//验证短信验证码
export const checkSmspinApi =(option)=>{return post(port.checksmspin,option)}
//修改手机号或者邮箱
export const updateApi =(option)=>{return post(port.update,option)}
//退出
export const logoutApi =(option)=>{ return post(port.logout,option)}
//新版本--POST /api/register/verifystatus 判断手机号是否需要验证
export const newRegisterVerifyStatusApi =(option)=> {return post(port.register_verify_status,option)}
//新版本 --POST /api/register/smspin/cellphone 发送短信验证码
export const newRegisterSmsPinCellphoneApi =(option)=>{return post(port.register_smsPin_cellphone,option)}
//NEW --- POST /api/register/checksmspin/cellphone检查验证码  register_check_smsPin_cellphone
export const newRegisterCheckSmsPinCellphoneApi =(option)=>{return post(port.register_check_smsPin_cellphone,option)}
//NEW- POST /api/register   注册验证 new_register
export const newRegisterApi =(option)=> {return post(port.new_register,option)}
//NEW -POST /api/register/update 更新注册信息 register_update_email
export const newRegisterUpdateApi =(option)=> {return post(port.register_update_email,option)}
//NEW -GET /api/register/survey 获取已填写的问卷答案
export const getNewRegisterSurvey =(id)=> {return get(port.register_survey,{id})}
export const setNewRegisterSurvey =(option)=> {return post(port.register_survey,option)}
//NEW --- GET /api/register/success   注册成功  register_success
export const registerSuccessApi =(id)=> {return get(port.register_success,{id})}
//NEW - POST /api/login/check 登陆校验
export const newLoginCheckApi =(option)=> {return post(port.login_check,option)}
//NEW -
export const newLogoutApi =()=> {return get(port.logout_new)}
//老版本发送短信验证码
export const newSendCodeApi =(option) =>{return post(port.register_sms_pin,option)}
//老版本验证短信
export const oldCheckCodeApi =(option)=>{return post(port.register_check_sms_pin,option)}
//新页面和旧页面的区分
export const skipPageApi =()=>{return get(port.register_skip_page)}
/*第三版登录注册接口　开始*/
//B端客户注册
export const businessRegisterApi =(option)=>{
  return post(port.third_business_register,option)
}
//person注册
export const personRegisterApi =(option)=>{
  return post(port.third_person_register,option)
}
//发送验证码
export const thirdTelephoneSendCodeApi =(countrycode,cellphone)=>{
  return post(port.third_register_send_cellphone,{countrycode,cellphone})
}
//发送邮箱
export const thirdEmailSendCodeApi =(option)=>{
  return post(port.third_register_send_email,option)
}
//登录接口
export const thirdLoginApi =(option)=>{
  return post(port.third_login,option)
}
/*第三版登录注册接口　结束*/
