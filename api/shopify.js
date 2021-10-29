import port from './port';
import {get,post  } from '@/utils/request';
/*获取shopify商品列表*/
export const getShopifyListApi =(option)=>{return get(port.shopify_product_list,option)}
/*获取store列表*/
export const getShopifyStoreListApi =(page)=>{return get(port.shopify_store_list,{page})}
/*获取ａｃｈｉｅｄ列表*/
export const getArchivedListApi =(option)=>{return get(port.shopify_listed_Archived_list,option)}
/*获取个人信息*/
export const getPersonInfoApi=()=>{return get(port.shopify_person_info)}
/*商品上架*/
export const shopifyShareToStoreApi=(productid,shopids)=>{return post(port.shopify_share_to_store,{productid,shopids})}
export const shopifyPrivateShareToStoreApi=(productid,shopids)=>{return post(port.shopify_private_share_to_store,{productid,shopids})}
/*商店数量*/
export const shopifyStoreCountApi =()=>{return post(port.shopify_store_count)}
/*删除商品*/
export const shopifyStoreDeleteApi =(id)=>{return post(port.shopify_store_delete,{id})}
/*商品下架*/
export const shopifyArchiveApi =(id)=>{return post(port.shopify_archive,{id})}
/*商品重新上架*/
export const shopifyArchiveToListApi =(id)=>{return post(port.shopify_archive_to_list,{id})}
/*添加商品*/
export const shopifyAuthorVerifyApi=(shop,code)=>{return post(port.shopify_author_verify,{shop,code})}
/*shopify类目接口*/
export const shopifyCategoryListApi =()=>{return get(port.shopify_category_list)}
/*shopify私人列表*/
export const shopifyPrivateListApi =(option)=>{return get(port.shopify_private_list,option)}
/*私人商品删除*/
export const shopifyPrivateRemoveApi =(productid)=>{return post(port.shopify_private_remove,{productid})}
