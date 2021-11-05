<template>
  <div>
    <scroll-view class="scrollViewHeight">
      <template v-if="type==='advancedguidance'">
        <div class="help-detail-title g_mb_l">{{title}}：</div>
        <div class="help-detail-parage g_mb_l">
          Congratulations on your registration! You can start your purchase journey for now! This guidance will help you to placing orders from searching, payment and shipping. After you recharge your first order successfully, you can ask for the SSS professional guidance from your exclusive Consultant. I believe you will make your business better after you using SSS!
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/advanced.jpg" alt="">
        </div>
      </template>
      <template v-if="type==='beginnerguidance'">
        <div class="help-detail-title g_mb_l">{{title}}：</div>
        <div class="help-detail-parage g_mb_l">
          Thank you for choosing ShopShipShake, we will take you into a brand new purchase platform! If you are curious of SSS and want to know what it is and how it works, please click this link and get the information of SSS. We believe you cannot help to register after reading our beginner’s guidance!
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/beginner.jpg" alt="">
        </div>
      </template>
    </scroll-view>

  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
export default {
  name: "Advance",
  components:{ScrollView},
  props:['type','title']
}
</script>

<style scoped lang="less">
@import "~assets/less/help.less";
  .scrollViewHeight{
    height:calc(100vh - 50PX - 50PX)
  }
</style>
