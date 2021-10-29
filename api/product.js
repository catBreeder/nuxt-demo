
import { get ,getExposure,post,shareRequest} from '@/utils/request';
import port from './port';

//商品详情
export const productDetailApi =(option)=>{return get(port.common_product_detail,option)}
export const productDescriptionApi =(productid)=>{return get(port.common_product_description,{productid})}
export const productPriceApi =(option)=>{return get(port.common_product_get_price,option)}
//加购关闭提醒框
export const productSetRemindTimesApi =(type)=>{return get(port.account_shopping_mall_set_remind_times,{type})}
export const ProductLimitApi =(productid)=>{return get(port.common_product_limit,{productid})}
//商品坏的评价
export const productBadReviewApi =(option)=>{return post(port.product_bad_review,option)}
//商品加购
export const productToBuyApi =(option)=>{return shareRequest(port.product_to_buy,option)}
//商品评价
export const productReviewApi =(option)=>{return get(port.product_review,option)}
