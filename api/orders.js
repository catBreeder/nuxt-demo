import {get,post,shareRequest } from '@/utils/request';
import port from "./port";
// GET /api/shoporder/list
export const shopOrderListApi =(option)=> {return get(port.shop_order_list,option)}
//GET /api/shoporder/count
export const shopOrderCountApi =(from)=> {return get(port.shop_order_count,{from})}
//失败确认
export const shopOrderConfirmApi =(id)=> {return post(port.shop_order_confirm,{id})}
//POST /api/shoporder/remind
export const shopOrderRemindApi =(id)=> {return post(port.shop_order_remind,{id})}
//POST /api/shoporder/editremark shop_order_edit_mark
export const shopOrderEditMarkApi =(option)=> {return shareRequest(port.shop_order_edit_mark,option)}
//POST /api/shoporder/sendall
export const shopOrderSendAllApi =(ids)=> {return post(port.shop_order_send_all, {ids})}
//POST /api/shoporder/cancelarr
export const shopOrderCancelApi =(id)=>{return post(port.shop_order_cancel,{id})}
//get /api/shoporder/searchhistory
export const shopOrderSearchHistoryApi =()=>{return get(port.shop_order_search_history)}
//get /api/shoporder/clearhistory
export const shopOrderClearHistoryApi =()=>{return get(port.shop_order_clear_history)}
//推送订单给团运大使 POST /api/shoporder/groupships
export const shopOrderGroupShipApi =(ids)=>{return post(port.shop_order_group_ships,{ids})}
//团运大使拒绝接单  post /api/shoporder/reject
export const shopOrderRejectApi =(id)=>{return post(port.shop_order_reject,{id})}
// 跟踪记录 GET /api/shoporder/logistics
export const shopOrderLogisticsApi =(id)=> {return get(port.shop_order_logistics,{id})}
//订单详情 GET /api/shoporder/detail
export const shopOrderDetailApi =(id)=>{return get(port.shop_order_detail,{id})}
//修改 GET /api/shoporder/updateorder
export const shopOrderUpdateOrderApi =(option)=> {return get(port.shop_order_update_order,option)}
// get /api/deliveryorder/index toship页面详情
export const deliveryOrderInfoApi =(option)=> {return get(port.delivery_order,option)}

//POST /api/shoporder/sign   签收 shop_order_sign
export const shopOrderSignApi =(id)=> {return post(port.shop_order_sign,{id})}
//GET /api/deliveryorder/combine
export const deliveryorderCombineApi =(option)=>{return get(port.delivery_order_combine,option)}
//POST /api/deliveryorder/save
export const deliveryorderSaveApi =(option)=>{return post(port.delivery_order_save,option)}
//POST 创建工单order_express_work_order
export const orderExpressWordOrderApi =(option)=>{return post(port.order_express_work_order,option)}
//order_delivery_way_transport 自提方式信息
export const orderDeliveryWayTransportApi =(option)=>{return get(port.order_delivery_way_transport,option)}
//order_delivery_way_change 修改自提方式
export const orderDeliveryWayChangeApi =(option)=>{return get(port.order_delivery_way_change,option)}
//出库单详情 order_delivery_detail
export const orderDeliveryDetailApi =(expressid)=> {return post(port.order_delivery_detail,{expressid})}
//评价弹框
export const orderCommentEvaluationDraftApi =(option)=> {return post(port.order_comment_evaluation_draft,option)}
