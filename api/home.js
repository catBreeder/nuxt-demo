import { get ,post  ,shareRequest} from '@/utils/request';
import port from './port';
import config from '@/config'
/*
* params
* @intro:获取主页banner参数
* @参数：
* */
export const homeBannerListApi =()=>{return get(port.home_banner)}
/*
* params
* @intro:获取top100商品列表
* @url: 'supplier/topSupplier'
* @参数：
* */
export const topSupplierApi=()=>{return get(port.supplier_topSupplier)}

/*
* params
* @intro:获取主页商品列表
* @url:'/shoppingmall/topicGoodsList'
* @参数：
* */
export const topicGoodsListApi =()=>{return get(port.shoppingMall_topicGoodsList)}
/*
* params
* @intro:获取所有类别
* @url: /api/category/list
* @参数：
* */
export const categoryListApi =()=>{return get(port.home_category_list)}


/*
* params
* @intro:根据categoryid，找到相应的列表
* @url:/api/shoppingmall/queryProductsByCategory
* @参数：{
*   categoryid:类目ID，0代表全部,
*   thirdid:三级目录ID
*   sortby:排序字段（1-Bestselling；2-Price:low to high；3-Price:high to low；4-NEW；5-Recommend；）
*   page:页码
*   minprice:价格范围-小
*   maxprice"价格范围-大
* }
* */
export const queryProductsByCategoryApi =(option)=>{return get(port.home_query_products_by_category,option)}
/*
* params
* @intro:根据图片的key获取图片的列表
* @url: /api/search/imagesearchlist
* @参数：{
*     imageAddress:图片上传回传的key(*)
*    categoryId:所属类目id
*     region:服务器区域
*     page:页码(*)
*   }
*
* */

export const imagesearchlistApi =(option)=>{return post(port.home_search_imagesearchlist,option)}
/*
* params
* @intro:图片剩余搜索次数
* @url:  /api/search/searchcount
* @参数：
* */

export const searchcountApi =()=>{return post(port.home_search_searchcount,{ticket:config.ticket})}
/*
* params
* @intro:获取热搜词
* @url: GET /api/search/hotkeyword
* @参数：
* */
export const hotKeyWordApi =()=>{return get(port.home_search_hotkeyword)}
/*
* params
* @intro:根据1688产品url进行搜索
* @url:GET /api/search/producturlSearch
* @参数：url
* */
export const searchProductUrlSearchApi =(producturlSearch)=>{return get(port.home_search_product_url,{producturlSearch})}

/*
* params
* @intro:模糊搜索
* @url: GET /api/search/searchlink
* @参数：keyword
* */
export const searchlinkApi =(keyword)=> {return get(port.home_search_line,{keyword})}
/*
* params
* @intro:根据图片链接获取数据
* @url: GET /api/search/urlsearch
* @参数：imageurl
* */
export const urlSearchApi =(imageurl)=>{return get(port.home_search_urlsearch,{imageurl,ticket:config.ticket})}

//类目-all-top_rank_category
export const childCategoriesApi=(categoryId)=>{return get(port.top_rank_child_category,{categoryId})}
/*
* params
* @intro:关键词搜索
* @url: home_search_keyword
* @参数：{keyword,page}
* */
export const keywordSearchApi=(keyword)=>{return get(port.home_search_keyword, {keyword})}
export const keySearchListApi=(option)=>{return get(port.home_search_keyword_list,option)}
/*
* params
* @intro:当1688没有数据，显示自有商品
* @url: /api/search/keysearchlist1688
* @参数：
* */
export const keySearchList1688Api=(keyword)=>{return get(port.home_key_search_list1688,{keyword})}
//当搜索关键字是big tree ------/api/search/keysearchlistBigtree
export const keysearchlistBigtreeApi =(page)=>{return get(port.home_key_search_big_tree,{page}) }
//分享商品 ----/api/share/init
export const shareInitApi =(productid)=>{return post(port.home_share_init,{productid}) }
//分享商品信息---/api/share/info
export const shareInfoApi =(record)=>{return shareRequest(port.home_share_info,record)}
// export const shareInfoApi =(record)=>{return post(port.home_share_info,record)}
export const childCategoryListApi =(categoryId)=>{return get(port.top_rank_child_category_list,{categoryId})}

//首页获取消息个数接口
export const unReadMessageApi =()=>{return get(port.home_unread_message,{from:1})}
//首页弹框读取接口
export const homeReadPopupApi =(option)=>{return get(port.home_popup_read,option)};
//首页弹框处理接口
export const homePopupHandleApi =(option)=>{return get(port.home_popup_handle,option)}
//首页弹出框类型
export const showPopupApi =(location)=>{ return get(port.home_popup ,{location})}
//收藏
export const collectGoodsApi =(productid)=>{return get(port.goods_collect,{productid})}
//caontact
export const contactApi =()=>{return post(port.home_user_bussiness)}
//home_popup_draft
export const homePopupDraftApi =(option)=> {return get(port.home_popup_draft,option)}

// 抢券  /api/activityrules/snatchcoupon/index
export const activityRulesApi =()=>{return get(port.activity_rules_snatch_coupon)}
//POST /api/activity/snatchcoupon  抢券
export const activitySnatchApi =(id)=> {return post(port.activity_snatch_coupon,{id})}

//专题活动 /api/thematicactivities/categoryproduct
export const thematicactivitiesCategoryproductApi =(option)=> {return get(port.thematicactivities_categoryproduct,option)}
//专题活动分类列表 /api/thematicactivities/categorylist
export const thematicactivitiesCategorylistApi =(option)=> {return get(port.thematicactivities_categorylist,option)}
// GET /api/thematicactivities/hot/categorynamelist  爆款新品分类列表 thematicactivities_hot_category_name_list
export const thematicactivitiesHotCategorynamelistApi =()=> {return get(port.thematicactivities_hot_category_name_list)}
// GET /api/thematicactivities/hot/categorylist  爆款新品商品列表  thematicactivities_hot_category_list
export const thematicactivitiesHotCategoryListApi =(option)=> {return get(port.thematicactivities_hot_category_list,option)}
// GET /api/thematicactivities/new/productlist新品上新-商品列表  thematicactivities_new_product_list
export const thematicactivitiesNewProductListApi =(option)=>{return get(port.thematicactivities_new_product_list,option)}


///api/thematicactivities/categorydetaillist 专题活动分类，重量和运输方式
export const thematicactivitiesCategoryDetailListApi =(option)=>{return get(port.thematicactivities_category_detail_list,option)}
//获取以图搜图分类 home_search_get_allCategory
export const searchImgCategoryApi =()=>{return get(port.home_search_get_allCategory)}
//转运单信息
export const otherShopInfoApi =()=>{return get(port.home_shop_order_other_shop)}
//提交转运单
export const otherShopSaveApi =(option)=>{return shareRequest(port.home_shop_order_other_shop_save,option)}
//供应商店铺页面
export const supplierStoreApi =(sellerid,productid)=>{return get(port.home_supplier_store,{sellerid,productid})}
//供应商店铺商品列表
export const supplierStoreProductListApi =(option)=>{return get(port.home_supplier_product_list,option)}
//收藏店铺
export const supplierStoreAddCollectionApi =(sellerid)=>{return get(port.home_supplier_product_favorite_add,{sellerid})}
export const supplierStoreCancelCollectionApi =(sellerid)=>{return get(port.home_supplier_product_favorite_cancel,{sellerid})}
/*废弃包裹订单*/
export const homeAbandonOrderListApi =(page)=>{return get(port.home_abandon_list,{page})}
/*废弃订单详情*/
export const homeAbandonOrderDetailApi =(id)=>{return get(port.home_abandon_order_detail,{id})}
/*废弃订单支付*/
export const homeAbandonOrderPayApi =(id)=> { return post(port.home_abandon_order_pay,{id})}
