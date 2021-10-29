import {get,post ,shareRequest } from '@/utils/request';
import port from "./port";
//recharge页面基本信息
export const rechargeApi =(option)=>{return get(port.recharge_user_recharge,option)}
//创建支付订单 /api/user/createPayOrder
export const createPayOrderApi =(option)=>{return post(port.recharge_user_createPayOrder,option)}
//转账/api/user/transfer
// export const transferApi =(option)=>{return shareRequest(port.recharge_user_transfer,{vo:JSON.stringify(option)})}
export const transferApi =(option)=>{return shareRequest(port.recharge_user_transfer,JSON.stringify(option))}

//充值列表GET /api/paymentvoucher/list
export const paymenToucherListApi =(page)=>{return get(port.recharge_checkout_history,{page})}
//GET /api/paymentvoucher/index 充值检查首页查询
export const paymentVoucherIndexApi =()=>{return get(port.recharge_payment_voucher_index)}
//POST /api/paymentvoucher/save   充值检查(Recharge Check
export const paymentVoucherSaveApi =(option)=>{ return post(port.recharge_payment_voucher_save,option)}
// /api/paymentvoucher/widthdraw 撤回凭证
export const paymentVoucherWithdrawApi =(id)=>{return post(port.recharge_payment_voucher_withdraw,{id})}
export const getMembershipPriorityApi =()=>{return get(port.recharge_memberShip_priority)}
//GET /api/activityrules/rechargeactivityinfo 获取recharege活动信息
export const activityRechargeInfoApi =()=> {return get(port.recharge_activity_info)}
