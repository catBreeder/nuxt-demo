import {uploadImgURL } from '@/config/urls'
export default  {

  /*公共接口 /api/banner/ad*/
  'common_banner_adv_list':`/api/banner/ad`,
  /*消息接口 start*/
  'message_detail':`/api/message/detail`,
  'message_read':`/api/message/read`,
  'message_record':`/api/message/record`,
  'remind_time':`/api/shoppingmall/remindtimes`,
  'register_error_upload':`/api/registermobileerror/upload`,//上传错误信息
  'common_get_title':`/api/supplier/getTitle`,//
  'common_category_seo':'/api/shoppingmall/querySeoInfoByCategoryid',//category优化


  //商品
  'common_product_detail':`/api/product/search`,
  'common_product_description':`/api/product/getdescription`,
  'common_product_get_price':`/api/product/getprice`,
  'common_product_limit':`/api/product/productlimit`,
  'product_bad_review':`/api/product/scorerecord`,
  'product_to_buy':`/api/product/buy`,
  'product_review':`/api/shoporder/review`,//商品评价


  /*消息接口 end*/
  'login':`/login/check`,
  'register':`/register/1`,
  'sendCode':`/register/sms/pin/3`,//短信验证码
  'checksmspin':`/register/checksmspin`,//验证短信验证码
  'update':`/register/update`,//修改手机号或者邮箱
  'logout':`/logout`,//退出
  'register_verify_status':`/api/register/verifystatus`,//判断手机号是否需要验证
  'register_smsPin_cellphone':`/api/register/smspin/cellphone`,// 发送短信验证码
  'register_check_smsPin_cellphone':`/api/register/checksmspin/cellphone`,// 检查验证码
  'new_register':`/api/register`,//新版注册
  'register_update_email':`/api/register/update`,//更新注册信息
  'register_survey':`/api/register/survey`,//获取已填写的问卷答案
  'register_success':`/api/register/success`,//获取已填写的问卷答案
  'login_check':`/api/login/check`,//登录
  'logout_new':`/api/logout`,//登录
  'register_sms_pin':`/api/register/smspin`,//老版本发送短信验证码
  'register_check_sms_pin':`/api/register/checksmspin`,//老版本发送短信验证码
  'register_skip_page':`/api/register/skippage`,//老版本发送短信验证码
  'third_business_register':`/api/register/new/b`,//B端客户注册
  'third_person_register':`/api/register/new/c`,//B端客户注册 POST /api/register/new/c
  'third_register_send_cellphone':`/api/register/new/smspin/cellphone`,//B端客户注册 POST /api/register/new/c
  'third_register_send_email':`/api/register/new/smspin/email`,//B端客户注册 POST /api/register/new/c
  'third_login':`/api/login/new/check`,//B端客户注册 POST /api/register/new/c


  'home_banner':`/api/banner/list`,//home->banner
  'supplier_topSupplier':`/api/supplier/topSupplier`,//home->top100商品数据
  'shoppingMall_topicGoodsList':`/api/shoppingmall/topicGoodsList`,//home->商品全部列表
  'home_category_list':`/api/category/categories`,
  'home_user_bussiness':`/api/user/getbussiness`,

  'home_upload_image':`/api/search/uploadimage`,
  'home_query_products_by_category':`/api/shoppingmall/queryProductsByCategory`,

  'home_search_imagesearchlist':`/api/search/imagesearchlist`,
  'home_search_searchcount':`/api/search/searchcount`,//图片剩余搜索次数
  'home_search_hotkeyword':`/api/search/hotkeyword`,//7天热搜词
  'home_search_product_url':`/api/search/producturlSearch`,//产品url搜索
  'home_search_line':`/api/search/searchlink`,//关键词模糊搜索
  'home_search_keyword':`/api/search/keywordSearch`,//关键词搜索
  'home_search_keyword_list':`/api/search/keysearchlist`,//关键词搜索
  'home_search_get_allCategory':`/api/search/getallclassifies`,//关键词搜索
  'home_search_urlsearch':`/api/search/urlsearch`,//图片链接搜索
  'home_key_search_list1688':`/api/search/keysearchlist1688`,//图片链接搜索
  'home_key_search_big_tree':`/api/search/keysearchlistBigtree`,//关键字是big tree
  'home_share_init':`/api/share/init`,//分享初始化
  'home_share_info':`/api/share/info`,//分享信息
  'home_unread_message':`/api/message/unread`,//未读消息
  'activity_rules_snatch_coupon':`/api/activity/snatchcoupon/index`,//未读消息
  'activity_snatch_coupon':`/api/activity/snatchcoupon`,//抢卷
  'thematicactivities_categoryproduct':`/api/thematicactivities/categoryproduct`,//专题活动
  'thematicactivities_categorylist':`/api/thematicactivities/categorylist`,//专题活动
  'thematicactivities_hot_category_name_list':`/api/thematicactivities/hot/categorynamelist`,//专题活动
  'thematicactivities_hot_category_list':`/api/thematicactivities/hot/categorylist`,//专题活动
  'thematicactivities_new_product_list':`/api/thematicactivities/new/productlist`,//专题活动
  'thematicactivities_category_detail_list':`/api/thematicactivities/categorydetaillist`,//专题活动



  // 'home_popup':`${config.baseURL}/popupwindow/pop`,//获取是否有弹框
  'home_popup':`/api/popupwindow/pop`,//获取是否有弹框
  'home_popup_read':`/api/popupwindow/read`,//读取弹框信息
  'home_popup_handle':`/api/popupwindow/handle`,//弹框处理接口
  'home_popup_draft':`/api/popupwindow/draft`,//弹框处理接口
  'home_shop_order_other_shop':`/api/shoporder/othershop/index`,//转运单
  'home_shop_order_other_shop_save':`/api/shoporder/othershop/save`,//提交转运单
  'home_supplier_store':`/api/supplier/store`,//供应商页面
  'home_supplier_product_list':`/api/supplier/productlist`,//供应商商品
  'home_supplier_product_favorite_add':`/api/supplier/addfavorite`,//收藏店铺
  'home_supplier_product_favorite_cancel':`/api/supplier/removefavorite`,//取消收藏
  'home_abandon_list':`/api/shoporder/clearance/list`,//废弃包裹订单
  'home_abandon_order_detail':`/api/shoporder/clearance/detail`,//废弃包裹订单详情
  'home_abandon_order_pay':`/api/shoporder/clearance/pay`,//废弃包裹订单支付

//  top100
  'top100_supplier_product':`/api/supplier/top100SupplierProduct`,//top100商品列表
  'top100_supplier_brand':`/api/supplier/top100Supplier`,//top100商品列表
  'top_rank_child_category':`/api/category/childCategories`,//top100类目
  'top_rank_child_category_list':`/api/category/childCategoryList`,//top100类目

//  图片曝光
  'exposure_category':`/api/spm/exposure`,//
  'spm_log': `/api/spm/log`,
//  common-分享
  'common_share_init':`/api/s/init`,
  // 'common_upload_img':`/buffaloex-upload/upload`,
  // 'common_upload_img':`http://192.168.0.138:8081/buffaloex-upload/upload`,
  'common_upload_img':`${uploadImgURL}`,

  //(模块名)-(区域名)-(接口名)GET /api/deliveryorder/searchPostcode
  'help_cost_searchPostcode':`/api/deliveryorder/searchPostcode`,
  ///api/deliveryorder/calculationcost
  'help_cost_calculationcost':`/api/deliveryorder/calculationcost`,
//  recharge模块 /api/user/recharge
  'recharge_user_recharge':`/api/user/recharge`,
  'recharge_user_createPayOrder':`/api/user/createPayOrder`,
  'recharge_user_transfer':`/api/user/transfer`,
  'recharge_checkout_history':`/api/paymentvoucher/list`,
  'recharge_payment_voucher_index':`/api/paymentvoucher/index`,
  'recharge_payment_voucher_save':`/api/paymentvoucher/save`,
  'recharge_payment_voucher_withdraw':`/api/paymentvoucher/widthdraw`,
  'recharge_memberShip_priority':`/api/membership/getMembershipPriority`,
  'recharge_activity_info':`/api/activityrules/rechargeactivityinfo`,


  //GET /api/ProductCard/collectiongoods
  'goods_collect':`/api/product/collectiongoods`,


//  购物车
  'cart_basic_info':`/api/cart`,
  'cart_list':`/api/cart/list`,
  'cart_update_qty': `/api/cart/updateqty`,
  'cart_delete': `/api/cart/cancel`,
  'cart_checkout': `/api/cart/checkout`,
  'cart_coupon_available': `/api/coupon/all`,
  'cart_user_balance': `/api/user/balance`,
  'cart_confirm_pay': `/api/cart/confirmpay`,
  'cart_select_all': `/api/cart/selectall`,
  'cart_to_pay': `/api/cart/topay`,
  'cart_toPay_cancel': `/api/cart/topay/cancel`,
  'cart_toPay_check': `/api/cart/topay/check`,
  'cart_delivery_order_estimate_cost': `/api/deliveryorder/estimatecost`,
  'cart_edit_shopify_orderNo': `/api/shoporder/editshopifyorderno`,
  'cart_goods_share': `/api/cart/share`,
  'cart_goods_load_accept': `/api/cart/loadaccept`,
  'cart_goods_confirm_accept': `/api/cart/accept`,

  //orders页面接口
  'shop_order_list':`/api/shoporder/list`,
  'shop_order_count':`/api/shoporder/count`,
  'shop_order_confirm':`/api/shoporder/confirm`,
  'shop_order_remind':`/api/shoporder/remind`,
  'shop_order_edit_mark':`/api/shoporder/editremark2`,
  'shop_order_send_all':`/api/deliveryorder/sendall`,
  'shop_order_cancel':`/api/shoporder/cancel`,
  'shop_order_search_history':`/api/shoporder/searchhistory`,
  'shop_order_clear_history':`/api/shoporder/clearhistory`,
  'shop_order_group_ships':`/api/shoporder/groupships`,
  'shop_order_reject':`/api/shoporder/reject`,
  'shop_order_logistics':`/api/shoporder/logistics`,
  'shop_order_detail':`/api/shoporder/detail`,
  'shop_order_update_order':`/api/shoporder/updateorder`,
  'delivery_order':`/api/deliveryorder/index`,
  'shop_order_sign':`/api/shoporder/sign`,
  'delivery_order_combine':`/api/deliveryorder/combine`,
  'delivery_order_save':`/api/deliveryorder/save`,
  'order_express_work_order':`/api/shoporder/expressworkorder`,
  'order_delivery_way_transport':`/api/deliveryorder/transport`,
  'order_delivery_way_change':`/api/deliveryorder/deliveryway`,
  'order_delivery_detail':`/api/deliveryorder/detail`,
  'order_comment_evaluation_draft':`/api/popupwindow/evaluationdraft`,



  //client接口
  'client_address_list':`/api/client/address/list`,
  'client_address_set_Default':`/api/client/address/setDef`,
  'client_address_edit_page':`/api/client/address/editpage`,
  'client_address_edit':`/api/client/address/edit`,
  'client_address_del':`/api/client/address/del`,

  //account
  'account_basic_info':`/api/account/index`,
  'account_group_ship_info':`/api/groupship/info`,
  'account_group_ship_bind':`/api/groupship/bind`,
  'account_group_ship_member_list':`/api/groupship/memberlist`,
  'account_group_ship_bind_result':`/api/groupship/bindAmbassador`,
  'account_group_ship_bill_list':`/api/groupship/billlist`,
  'account_group_coming_list':`/api/groupship/cominglist`,
  'select_collection_detail_list':`/api/deletecollection/selectCollectionDetail`,
  'delete_collection_detail_list':`/api/deletecollection/deleteCollectionDetail`,
  'account_user_balance':`/api/user/balance`,
  'account_user_info':`/api/user/info`,
  'account_send_mobile_activation_code':`/api/user/sendMobileactivationcode`,//发送新手机验证码
  'account_send_email_activation_code':`/api/user/sendEmailactivationcode`,//发送新手机验证码
  'account_user_update_mobile':`/api/user/updateMobile`,//发送新手机验证码
  'account_user_update_email':`/api/user/updateEmail`,//发送新手机验证码
  'account_user_info_update':`/api/user/update`,//更改个人信息
  'account_user_invite_list':`/api/user/invitationlist`,//推广名单

  'account_bill_list':`/api/bill/getList`,//账单
  'account_user_to_transfer':`/api/user/toTransfer`,//transfer信息
  'account_user_update_password':`/api/updatepwd/updatepassword`,//transfer信息
  'account_user_coupon':`/api/coupon/allCoupon`,//transfer信息
  'account_coupon_use_detail':`/api/coupon/useddetails`,//transfer信息
  'account_customer_task_todo':`/api/customertask/todo`,//推广任务
  'account_task_todo_verify':`/api/customertask/todo/verifypage`,//推广任务验证
  'account_customer_task_promotion':`/api/customertask/promotion`,//推广任务验证
  'account_customer_task_promotion_list':`/api/customertask/getpromotionList`,//推广名单
  'account_scoin_index':`/api/scoin/index`,//积分信息
  'account_scoin_list':`/api/scoin/list`,//积分明细
  'account_change_member_status':`/api/groupship/changeFlag`,//积分明细
  'account_question_index':`/api/question/index`,//faq首页
  'account_question_search':`/api/question/search`,//faq首页
  'account_question_answer':`/api/question/answer`,//faq首页
  'account_question_operate':`/api/question/operation`,//faq首页
  'account_question_model':`/api/question/moudlequestion`,//faq首页
  'account_question_feeback':`/api/question/savefeedback`,//faq首页
  'account_feeback_index':`/api/questionFeedback/index`,//用户反馈首页
  'account_feeback_search':`/api/questionFeedback/searchlist`,//用户反馈搜索
  'account_feedback_operate':`/api/questionFeedback/operation`,//用户反馈搜索
  'account_feedback_plus':`/api/questionFeedback/plususeful`,//用户反馈搜索
  /*推广任务*/
  'account_customer_task_reward':'/api/customertask/promotiondetail',
  'account_customer_bill_list':'/api/customertask/getBillList',
  'account_customer_award_list':'/api/customertask/getawardsList',

  /*会员　开始*/
  'account_vip_info':`/api/membership/index`,//会员权益信息
  'account_memberShip_priority':`/api/membership/getMembershipPriority`,//会员权益
  'account_memberShip_checkout':`/api/membership/checkout`,//会员支付
  'account_memberShip_describe':`/api/membership/describe`,//会员套餐的权益描述
  'account_memberShip_plan':`/api/membership/plan`,//会员套餐的价格信息
  'account_memberShip_price_info':`/api/membership/priceinfo`,//会员套餐的价格信息
  'account_memberShip_pay':`/api/membership/pay`,//会员套餐的价格信息
  'account_memberShip_saving':`/api/account/saving`,//会员套餐的价格信息

  /*会员　结束*/

  /*售后开始*/
  'account_work_order_list':`/api/workorder/list`,//会员套餐的价格信息
  'account_work_order_detail':`/api/workorder/edit`,//会员套餐的价格信息
  'account_work_order_save':`/api/workorder/save`,//会员套餐的价格信息
  /*售后结束*/

//  商城
  'account_shopping_mall_set_remind_times':`/api/shoppingmall/settempremindtimes`,


//  shopify模块
  'shopify_product_list':'/api/shopify/productlist',
  'shopify_store_list':'/api/shopify/storelist',
  'shopify_listed_Archived_list':'/api/shopify/list',
  'shopify_person_info':'/api/shopify/personalinfo',
  'shopify_share_to_store':'/api/shopify/sharetoshopify',//商品上架
  'shopify_private_share_to_store':'/api/shopify/sharetoshopifyprivate',//商品上架
  'shopify_store_count':'/api/shopify/storecount',//
  'shopify_store_delete':'/api/shopify/store_del',//删除商品
  'shopify_archive':'/api/shopify/archive',//商品下架
  'shopify_archive_to_list':'/api/shopify/archivetolist',//商品重新上架
  'shopify_author_verify':'/api/shopify/authorization_verify',//添加商品
  'shopify_category_list':'/api/category/list',//添加商品
  'shopify_private_list':'/api/shopify/privateproductlist',//添加商品
  'shopify_private_remove':'/api/shopify/removeProductprivate',//添加商品

}
