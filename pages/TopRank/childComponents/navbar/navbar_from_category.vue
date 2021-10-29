<template>
  <common-nav-bar @clickLeftEvent="clickLeftEvent" :jc_width="56" >
    <div slot="left">
      <van-icon name="arrow-left"
                size="24" color="#8B8989" slot="left" />
    </div>
    <div slot="content">
      <div class="top-rank-nav-bar-content d_flex_between d_flex">
        <div class="top-rank-nav-bar-content-title van-ellipsis">{{ title }}</div>
      </div>
    </div>
    <div slot="right">
      <i class="icon iconfont icon-sousuo"
         @click="goSearchHandle" />
    </div>
  </common-nav-bar>
</template>

<script>
import { gTagFun } from '@/utils/buryPoint/gTag'
import CommonNavBar from '@/components/common/CommonNavBar';
export default {
  name: "navbar_from_category",
  components:{CommonNavBar},
  props:['title'],
  data(){
    return{
      introIndex:null
    }
  },
  methods:{
    clickLeftEvent(){
      this.$emit('clickLeftEvent');
    },
    goSearchHandle(){
      //谷歌埋点
      gTagFun('Search-Enter','Search-Enter','产品列表页面')
      this.$router.push('/shoppingmall/search/category')
    },
  }
}
</script>

<style scoped lang="less">
/deep/.van-dropdown-menu__title::after{
  display: none !important;
}
/deep/.van-dropdown-menu__bar{
  height:46px !important;
  border-bottom:1px solid #EEEEED;
  box-shadow: none;
  background-color: transparent;
}
/deep/.van-dropdown-menu__title{
  padding:0;
  line-height:1;
  color:#2A2A2A;
}
/deep/.van-popup--top{
  left:50% !important;
}
.icon-sousuo{
  font-size:24px;
  color:lightgrey;
}
.top-rank-nav-bar-content{
  display: flex;
  min-width: 280px;
  justify-content: space-between;
  align-items: center;
}
.top-rank-nav-bar-content-title{
  flex:1;
  width:240px;
  font-size:16px;
  font-weight: 550;
  text-align: center;
}
.top-rank-nav-bar-content-search{
  width:30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-shenglvehao{
  font-size:24px;
  color:#FCC900;
}
/deep/.van-popover__action{
  padding:0 0 0 4px !important;
  font-size:12px !important;
}
</style>
