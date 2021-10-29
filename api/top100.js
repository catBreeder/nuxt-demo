import { post , get } from '@/utils/request';
import port from './port'
/*
获取top100产品列表
/api/supplier/top100SupplierProduct
sortby:1-Bestselling；2-Price:low to high；3-Price:high to low；4-NEW；5-Recommend；）
sellerid：卖家信息id
productid：产品id
page:页码
minprice：最小价格
maxprice：最大价格
*/

export const top100SupplierProductApi =(option)=>{return get(port.top100_supplier_product,option)}
/*
* params
* @intro:获取top100品牌商列表
* @参数：{
*   page:页码
*   sellerid:卖家信息ID
* }
* */
export const top100SupplierApi =(option)=>{return get(port.top100_supplier_brand,option)}
