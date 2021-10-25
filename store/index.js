const state =()=>({
    userInfo:null,
    accessToken:null,
    refreshToken:null
})

//改变状态值
const mutations ={
    //状态置空
    RESET_USER_STATE(state){
        state.userInfo = null;
        state.accessToken = null;
        state.refreshToken = null;
    }
}

const actions ={
    KoginPage({commit}){
        commit('RESET_USER_STATE')
    }
}
export default {
    state,
    mutations,
    actions
}