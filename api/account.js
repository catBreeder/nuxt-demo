import {get,post } from '@/utils/request';
import port from "./port";
//GET /api/account/index
export const accountBasicInfoApi =()=>{return get(port.account_basic_info,{iframe:false})}
//GET /api/groupship/info
export const accountGroupShipInfoApi =()=> {return get(port.account_group_ship_info)}
//POST /api/groupship/bind
export const accountGroupShipBindApi =(option)=> {return post(port.account_group_ship_bind,option)}
//GET /api/groupship/memberlist
export const accountGroupShipMemberListApi =(option)=> {return get(port.account_group_ship_member_list,option)}
//GET /api/groupship/billlist  团运Bill  account_group_ship_bill_list
export const groupShipBillListApi =(option)=>{return get(port.account_group_ship_bill_list,option)}
// GET /api/groupship/cominglist  团运Coming
export const accountGroupShipComingList =(option)=> {return get(port.account_group_coming_list,option)}
///api/deletecollection/selectCollectionDetail 收藏列表
export const selectCollectionApi =(page)=>{return post(port.select_collection_detail_list,{page})}
// 删除 post /api/deletecollection/deleteCollectionDetail
export const deleteCollectionApi =(productid)=>{return post(port.delete_collection_detail_list,{productid})}
//账单 account_user_balance
export const accountUserBalanceApi =()=>{return get(port.account_user_balance)}
//userInfo account_user_info
export const accountUserInfoApi =()=>{return get(port.account_user_info)}
//发送新手机验证码 account_send_mobile_activation_code
export const accountSendNewMobileCodeApi =(option)=>{return get(port.account_send_mobile_activation_code,option)}
export const accountSendNewEmailCodeApi =(option)=>{return get(port.account_send_email_activation_code,option)};
export const accountUserUpdateMobileApi =(option)=>{return post(port.account_user_update_mobile,option)};
export const accountUserUpdateEmailApi =(option)=>{return post(port.account_user_update_email,option)}
//修改个人信息
export const accountUserInfoUpdateApi =(option)=>{return get(port.account_user_info_update,option)}
//推广人员account_user_invite_list
export const accountUserInviteListApi =(option)=>{return get(port.account_user_invite_list,option)}
//账单列表 account_bill_list
export const accountBillListApi =(option)=> {return post(port.account_bill_list,option)}
//转帐
export const accountUserToTransferApi =()=>{return post(port.account_user_to_transfer)}
//修改密码
export const accountUpdatePasswordApi =(option)=> {return get(port.account_user_update_password,option)}
//获取所有优惠卷
export const accountCouponApi =(page)=>{return post(port.account_user_coupon,{page})}
//查看优惠卷使用详情
export const accountCouponUseDetailApi =(couponrecordid)=>{return get(port.account_coupon_use_detail,{couponrecordid})}
/*推广任务*/
export const  accountCustomerTaskTodoApi =()=> {return get(port.account_customer_task_todo)}
/*推广任务验证*/
export const accountCustomerTaskVerifyApi =(id)=> {return get(port.account_task_todo_verify,{id})}
/*积分信息*/
export const accountScoinIndexApi =()=>{return get(port.account_scoin_index)}
/*积分明细*/
export const accountScoinListApi =(page)=> {return get(port.account_scoin_list,{page})}

/*改变会员状态 /api/groupship/changeFlag*/
export const changeMemberStatusApi =(id)=>{return post(port.account_change_member_status,{id})}
/*FAQ 开始*/
//FAQ首页
export const questionIndexApi =()=>{return get(port.account_question_index)}
export const questionSearchApi =(name)=>{return get(port.account_question_search,{name})}
export const questionAnswerApi =(id)=>{return get(port.account_question_answer,{id})}
export const questionOperateApi =(id,type)=>{return post(port.account_question_operate,{id,type})}
export const questionOperateModelApi =(id,pagenum)=>{return get(port.account_question_model,{id,pagenum})}
export const questionOperateFeebackApi =(option)=>{return post(port.account_question_feeback,option)}
//用户反馈首页
export const feedbackIndexApi =()=>{return get(port.account_feeback_index)}
//用户反馈搜索列表
export const feedbackSearchListApi =(option)=>{return get(port.account_feeback_search,option)}
//用户反馈点赞
export const feedbackOperateApi =(option)=>{return post(port.account_feedback_operate,option)};
export const feedbackOperatePlusApi=(backid)=>{return post(port.account_feedback_plus,{backid})}
/*FAQ 结束*/

/*会员开始*/
export const accountVipInfoApi=()=>{return get(port.account_vip_info)}
export const accountMemberShipPriorityApi=()=>{return get(port.account_memberShip_priority)}
export const accountMemberShipCheckoutApi=(vipgradeid)=>{return get(port.account_memberShip_checkout,{vipgradeid})}
export const accountMemberShipDescribeApi =(vipgradepriceid)=>{return get(port.account_memberShip_describe,{vipgradepriceid})}
export const accountMemberShipPlanApi =(vipgradeid)=>{return get(port.account_memberShip_plan,{vipgradeid})}

//会员套餐价格 account_memberShip_price_info
export const accountMemberShipPriceInfoApi =(option)=>{return get(port.account_memberShip_price_info,option)}
//会员支付
export const accountMemberShipPayApi =(option)=>{return post(port.account_memberShip_pay,option)}
export const accountMemberShipSavingApi =()=>{return get(port.account_memberShip_saving)}
/*会员结束*/
/*售后服务 开始*/
export const accountWorkOrderListApi =(page)=>{return get(port.account_work_order_list,{page})}
export const accountWorkOrderDetailApi =(shoporderid)=>{return get(port.account_work_order_detail,{shoporderid})}
export const accountWorkOrderSaveApi =(option)=>{return post(port.account_work_order_save,option)}
/*售后服务 结束*/
/*团员绑定结果*/
export const accountGroupShipBindResultApi =(inc)=>{return post(port.account_group_ship_bind_result,{inc})}
/*推广开始*/
export const accountCustomerTaskPromotionApi =()=>{return get(port.account_customer_task_promotion)}
//获取customer List
export const accountCustomerTaskCustomerListApi =(option)=>{return get(port.account_customer_task_promotion_list,option)}
//推广佣金
export const accountCustomerTaskRewardApi =()=>{return get(port.account_customer_task_reward)}
//佣金账单
export const accountCustomerBillListApi =(startdate	)=>{return get(port.account_customer_bill_list,{startdate	})}
export const accountCustomerAwardListApi =(page)=>{return get(port.account_customer_award_list,{page})}
/*推广结束*/
