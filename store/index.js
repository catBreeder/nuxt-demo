
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        checkoutInfo:null,
        checkoutErrorInfo:null,
        categoryInfo:null

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
        }
    }
})

export default store
