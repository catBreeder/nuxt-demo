import {get,post } from '@/utils/request';
import port from "./port";
// get /api/cart cart页面基本信息
export const cartBasicInfoApi =()=>{return get(port.cart_basic_info)}
//  get /api/cart/list
export const cartListApi=(page)=>{return get(port.cart_list,{page})}
//POST /api/cart/updateqty
export const cartUpdateQtyApi=(option)=>{return post(port.cart_update_qty,option)}
//GET /api/cart/checkout
export const cartCheckoutApi =(option)=>{return get(port.cart_checkout,option)}
//POST /api/coupon/available
export const cartCouponAvailableApi =(option)=>{return post(port.cart_coupon_available,option)}
//GET /api/user/balance
export const cartUserBalanceApi =()=>{return get(port.cart_user_balance)}
// post /api/cart/confirmpay
export const confirmPayApi =(option)=>{return post(port.cart_confirm_pay,option)}
//GET /api/cart/selectall
export const cartSelectAllApi=()=>{return get(port.cart_select_all)}
// get /api/cart/topay
export const cartToPayApi =()=>{return get(port.cart_to_pay)}
//POST /api/cart/topay/cance
export const cartToPayCancelApi =(sid)=>{return post(port.cart_toPay_cancel,{sid})}
//POST /api/cart/topay/check
export const cartToPayCheckApi =(ids)=>{return post(port.cart_toPay_check,{ids})}
//get cart_delivery_order_estimate_cost /api/deliveryorder/estimatecost
export const cartDeliveryOrderEstimateCostApi =(option)=>{return get(port.cart_delivery_order_estimate_cost,option)}
// /api/cart/cancel
export const cartDeleteApi =(ids)=>{return post(port.cart_delete,{ids})}
// POST cart_edit_shopify_orderNo
export const cartEditShopifyOrderNoApi =(id,shopifyorderno)=>{return post(port.cart_edit_shopify_orderNo,{id,shopifyorderno})}
//POST cart_goods_share 团长给团员分享商品
export const cartGoodsShareApi =(option)=>{return post(port.cart_goods_share,option)}
//get 团员接受分享商品
export const cartAcceptGoodApi =()=>{return get(port.cart_goods_load_accept)}
//port 团员接受商品
export const cartConfirmAcceptApi =(accept)=>{return post(port.cart_goods_confirm_accept,{accept})};//0不接收 1接收
