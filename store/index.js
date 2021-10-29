
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        checkoutInfo:null,
        checkoutErrorInfo:null,

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
        }
    }
})

export default store
