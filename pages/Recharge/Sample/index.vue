<template>
  <div>
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle" color="#fcc900">
        <template #left>
          <van-icon name="arrow-left"
                    size="30" color="#8B8989"/>
        </template>
        <template #title>
          <div class="navbar-title">Sample</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollViewHeight">
      <div class="s3-sample-box">
        <img src="~assets/images/Recharge/pay_sample1.png" alt="">
        <img src="~assets/images/Recharge/pay_sample2.png" alt="">
        <img src="~assets/images/Recharge/pay_sample3.png" alt="">
      </div>
    </scroll-view>
  </div>
</template>

<script>

import ScrollView from "@/components/common/ScrollView";
export default {
  head(){
    return {
      title:'Client Management - shopshipshake'
    }
  },
  name: "index",
  components:{ScrollView},
  methods:{

    goBackHandle(){this.$router.go(-1)}
  },

}
</script>

<style scoped lang="less">
.scrollViewHeight{
  height:calc(100vh - 46PX);
  .s3-sample-box{
    padding:20px 0;
    font-size:0;
  }
}
</style>
