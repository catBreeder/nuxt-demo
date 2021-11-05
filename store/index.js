
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        checkoutInfo:null,
        checkoutErrorInfo:null,
        categoryInfo:null,
        productBuyInfo:null

    },
    mutations: {
        setCheckoutInfo(state,value){
          state.checkoutInfo = value;
        },
        removeCheckoutInfo(state){
          state.checkoutInfo =null
        },
        //设置checkout信息
        setCheckoutErrorInfo(state,value){
          state.checkoutErrorInfo = value;
        },
        removeCheckoutErrorInfo(state){
          state.checkoutErrorInfo = null
        },

        //设置类目列表
        setCategory(state,value){
          state.categoryInfo = value;
        },
        removeCategory(state){
          state.categoryInfo=null
        },
      //设置加购商品信息
       setProductBuyInfo(state,value){
          state.productBuyInfo = value;
       },
      //删除加购商品信息
       removeProductBuyInfo(state){
          state.productBuyInfo = null;
       }
    }
})

export default store
