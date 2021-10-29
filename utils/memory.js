import JsCookie  from 'js-cookie'
const SEARCH_HISTORY ='search-history';
const USER_TICKET ='ticket';
const LOGIN_INFO ='login-info'
const USER_ID ='user-id'
const REGISTER_INFO ='register-info'
const CART_CHECK_OUT='cart_check_out';
const CATEGORY_SCROLL ='category-scroll';
const CATEGORY_ID = 'category-id'
const CHECKOUT_WRONG_INFO = 'check-out-wrong-info';
const HOME_TOP_SUPPLIER ='home-top-supplier';//首页top100数据
const HOME_HOT_SALE ='home-hot-sale';//热卖数据
const HOME_GOODS_LIST ='home-product-list';//商品列表数据
const COMBINE_PRODUCT_LIST='combine-product-list';//combine列表
const PAGE_REFER='page-refer';
const PAGE_REF_SPM ='page_ref_spm';
const CURRENT_PAGE_SPM_ID= 'current_page_spm_id'
const USER_TYPE='user-type'
const CURRENT_PAGE ='current-page';
const SENSOR_DATA='sensors-data';//神策数据
const CART_QUALITY_FLAG ='cart-quality-flag';//当用户是团购用户，保存弹框的次数
const CUSTOMER_IDENTITY ='customer-identity'
//获取搜索历史
export const setSearchHistory =(value)=>{JsCookie.set(SEARCH_HISTORY,JSON.stringify(value))}
export const getSearchHistory =()=>{
  //
  if(JsCookie.get(SEARCH_HISTORY)){
    return JSON.parse(JsCookie.get(SEARCH_HISTORY))
  }

}
export const removeSearchHistory =()=>{ JsCookie.remove(SEARCH_HISTORY)}
//获取用户ticket
export const setUserTicket =(value)=>{JsCookie.set(USER_TICKET,value)}
export const getUserTicket =()=>{return JsCookie.get(USER_TICKET)}
export const removeUserTicket =()=>{JsCookie.remove(USER_TICKET)}
//登录信息
export const setLoginInfo =(value)=>{JsCookie.set(LOGIN_INFO,JSON.stringify(value))};
export const getLoginInfo=()=>{
  // return JSON.parse(JsCookie.get(LOGIN_INFO))
  if(JsCookie.get(LOGIN_INFO)){
    return JSON.parse(JsCookie.get(LOGIN_INFO))
  }
}
export const removeLoginInfo=()=>{JsCookie.remove(LOGIN_INFO)}
//注册信息
export const setRegisterInfo =(value)=>{JsCookie.set(REGISTER_INFO,JSON.stringify(value))}
export const getRegisterInfo =()=>{

  if(JsCookie.get(REGISTER_INFO)){
    return JSON.parse(JsCookie.get(REGISTER_INFO))
  }
};
export const removeRegisterInfo =()=>{JsCookie.remove(REGISTER_INFO)}
//用户id
export const setUserID =(value)=>{JsCookie.set(USER_ID,value)}
export const getUserID =()=>{return JsCookie.get(USER_ID)}
export const removeUserID =()=>{JsCookie.remove(USER_ID)}
//保存category滚动位置
export const setCategoryScroll =(value)=>{JsCookie.set(CATEGORY_SCROLL,value)}
export const getCategoryScroll =()=>{return JsCookie.get(CATEGORY_SCROLL)}
export const removeCategoryScroll =()=>{JsCookie.remove(CATEGORY_SCROLL)}
//保存categoryid
export const setCategoryID =(value)=>{ JsCookie.set(CATEGORY_ID,JSON.stringify(value))}
export const getCategoryID =()=>{
  if(JsCookie.get(CATEGORY_ID)){
    return JSON.parse(JsCookie.get(CATEGORY_ID))
  }
}
export const removeCategoryID =()=>{JsCookie.remove(CATEGORY_ID)}


//order-ship中保存选中的address id
const ORDER_SHIP_ADDRESS_ID= 'order-ship-address-id'
export const setOrderShipAddressID =(value)=> {JsCookie.set(ORDER_SHIP_ADDRESS_ID,value)}
export const getOrderShipAddressID =()=> {return JsCookie.get(ORDER_SHIP_ADDRESS_ID)}
export const removeOrderShipAddressID =()=>{JsCookie.remove(ORDER_SHIP_ADDRESS_ID)}

export const setHomeTopSupplier =(value)=> { JsCookie.set(HOME_TOP_SUPPLIER,JSON.stringify(value))}
export const getHomeTopSupplier =()=>{
  setTimeout(()=>{
    removeHomeTopSupplier()
  },10* 60000);
  if(JsCookie.get(HOME_TOP_SUPPLIER)){
    return JSON.parse(JsCookie.get(HOME_TOP_SUPPLIER))
  }

}
export const removeHomeTopSupplier =()=> { JsCookie.remove(HOME_TOP_SUPPLIER)}

//const HOME_HOT_SALE ='home-hot-sale';//热卖数据
export const setHomeSale =(value)=> { JsCookie.set(HOME_HOT_SALE,JSON.stringify(value))}
export const getHomeSale =()=>{
  setTimeout(()=>{
    removeHomeSale()
  },10* 60000);
  if(JsCookie.get(HOME_HOT_SALE)){
    return JSON.parse(JsCookie.get(HOME_HOT_SALE))
  }

}
export const removeHomeSale =()=> { JsCookie.remove(HOME_HOT_SALE)}


export const setHomeGoodsList =(value)=> { JsCookie.set(HOME_GOODS_LIST,JSON.stringify(value))}
export const getHomeGoodsList =()=>{
  // setTimeout(()=>{
  //   removeHomeGoodsList();
  // },10* 60000);
  setTimeout(()=>{
    removeHomeGoodsList();
  },1* 60000);
  if(JsCookie.get(HOME_GOODS_LIST)){
    return JSON.parse(JsCookie.get(HOME_GOODS_LIST))
  }

}
export const removeHomeGoodsList =()=> { JsCookie.remove(HOME_GOODS_LIST)}

//const COMBINE_PRODUCT_LIST='combine-product-list';//combine列表
export const setCombineList =(value)=> {JsCookie.set(COMBINE_PRODUCT_LIST,JSON.stringify(value))};
export const getCombineList =()=> {
  if(JsCookie.get(COMBINE_PRODUCT_LIST)){
    return JSON.parse(JsCookie.get(COMBINE_PRODUCT_LIST))
  }
};
export const removeCombineList =()=> {JsCookie.remove(COMBINE_PRODUCT_LIST)}
export const setRefer =(value)=>{JsCookie.set(PAGE_REFER,value)}
export const getRefer =()=>{return JsCookie.get(PAGE_REFER)}
export const removeRefer =()=>{JsCookie.remove(PAGE_REFER)}

export const setRefSpm =(value)=> {JsCookie.set(PAGE_REF_SPM,value)}
export const getRefSpm =()=> {return JsCookie.get(PAGE_REF_SPM)}
export const removeRefSpm =()=>{JsCookie.remove(PAGE_REF_SPM)}
//current-page-spm-id
export const setCurrentPageSpmID=(value)=>{JsCookie.set(CURRENT_PAGE_SPM_ID,value)}
export const getCurrentPageSpmID =()=> {return JsCookie.get(CURRENT_PAGE_SPM_ID)}
export const removeCurrentPageSpmID =()=> {JsCookie.remove(CURRENT_PAGE_SPM_ID)}

//USER_TYPE
export const setUserType=(value)=>{JsCookie.set(USER_TYPE,value)}
export const getUserType =()=> {return JsCookie.get(USER_TYPE)}
export const removeUserType =()=> {JsCookie.remove(USER_TYPE)}

//const SENSOR_DATA='sensors-data'
export const setSensorData =(value)=>{JsCookie.set(SENSOR_DATA,JSON.stringify(value))}
export const getSensorData =()=>{
  if(JsCookie.get(SENSOR_DATA)){
    return JSON.parse(JsCookie.get(SENSOR_DATA))
  }
}
export const removeSensorData =()=>{ JsCookie.remove(SENSOR_DATA) }
// CART_QUALITY_FLAG
export const setCartQualityFlag =(value)=>{JsCookie.set(CART_QUALITY_FLAG,value)}
export const getCartQualityFlag =()=>{return JsCookie.get(CART_QUALITY_FLAG)}
export const removeCartQualityFlag =()=>{JsCookie.remove(CART_QUALITY_FLAG)}
// customeridentity
export const setCustomerIdentity =(value)=>{JsCookie.set(CUSTOMER_IDENTITY,value)}
export const getCustomerIdentity =()=>{return JsCookie.get(CUSTOMER_IDENTITY)}
export const removeCustomerIdentity =()=>{JsCookie.remove(CUSTOMER_IDENTITY)}
//CURRENT_PAGE
export const setCurrentPage =(value)=> {JsCookie.set(CURRENT_PAGE,value)}
export const getCurrentPage =()=> {return JsCookie.get(CURRENT_PAGE)}
export const removeCurrentPage =()=>{JsCookie.remove(CURRENT_PAGE)}



