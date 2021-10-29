<template>
    <div class="s3-recharge-check-wrapper">
        <van-sticky>
        <van-nav-bar @click-left="goBackHandle" color="#fcc900">
          <template #left>
            <van-icon name="arrow-left" size="24" color="#8B8989"/>
          </template>
          <template #title>
            <div class="navbar-title">Recharge Check</div>
          </template>
        </van-nav-bar>
        <van-tabs v-model="tabIndex">
          <van-tab v-for="(item,index) in tabList" :title="item.title" :key="index"/>
        </van-tabs>
      </van-sticky>
        <div class="recharge-check-content">
          <application-model v-if="tabIndex ===0" @changeTabEmit="changeTabHandle"/>
          <history-model v-if="tabIndex ===1"/>
        </div>
    </div>
</template>

<script>
import ApplicationModel from '../childComponent/ApplicationModel';
import HistoryModel from '../childComponent/HistoryModel'
export default {
  head(){
    return {
      title:'Client Management - shopshipshake'
    }
  },
  name: "index",
  components:{
    ApplicationModel,
    HistoryModel
  },
  data(){
    return{
      tabIndex:0,
      tabList:[{title:'Application'},{title:'History'}]
    }
  },
  methods:{
    goBackHandle(){this.$router.go(-1)},
    changeTabHandle(){
      this.tabIndex = 1;
    }
  },

}
</script>

<style scoped lang="less">
/deep/.van-tabs__line{
  background-color: #fcc900;
}
</style>
