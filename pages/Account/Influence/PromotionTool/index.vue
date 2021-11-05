<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Marketing Tools</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView">
        <div class="promotion-tool-content">
          <van-notice-bar
            :scrollable="false"
            wrapable
            color="#2a2a2a"
            background="#fff"
          >
           <van-row type="flex" align="middle">
             <van-col :span="4">
               <div class="item-img">
                 <img src="@/assets/images/influence/promotion_5.png" alt="">
               </div>
             </van-col>
             <van-col :span="20">
               The article what helps you to increase your sales
             </van-col>
           </van-row>
            <div class="item-intro">Get it from your business consultant</div>
          </van-notice-bar>
          <van-notice-bar
            :scrollable="false"
            wrapable
            color="#2a2a2a"
            background="#fff"
          >
            <van-row type="flex" align="middle">
              <van-col :span="4">
                <div class="item-img">
                  <img src="@/assets/images/influence/promotion_4.png" alt="">
                </div>
              </van-col>
              <van-col :span="20">
                The users register via your link get 300 more keyword searches per month
              </van-col>
            </van-row>

          </van-notice-bar>
          <van-notice-bar
            :scrollable="false"
            wrapable
            color="#2a2a2a"
            background="#fff"
          >
            <van-row type="flex" align="middle">
              <van-col :span="4">
                <div class="item-img">
                  <img src="@/assets/images/influence/promotion_3.png" alt="">
                </div>
              </van-col>
              <van-col :span="20">
                The users register via your link get 2 coupons immediately
              </van-col>
            </van-row>

          </van-notice-bar>
          <van-notice-bar
            :scrollable="false"
            wrapable
            color="#2a2a2a"
            background="#fff"
          >
            <van-row type="flex" align="middle">
              <van-col :span="4">
                <div class="item-img">
                  <img src="@/assets/images/influence/promotion_2.png" alt="">
                </div>
              </van-col>
              <van-col :span="20">
                The users register via your link get 200 more image searches per month
              </van-col>
            </van-row>

          </van-notice-bar>
          <van-notice-bar
            :scrollable="false"
            wrapable
            color="#2a2a2a"
            background="#fff"
          >
            <van-row type="flex" align="middle">
              <van-col :span="4">
                <div class="item-img">
                  <img src="@/assets/images/influence/promotion_1.png" alt="">
                </div>
              </van-col>
              <van-col :span="18" :offset="1">
                <div style="min-width: 220px">Stay tuned for more...</div>
              </van-col>
            </van-row>

          </van-notice-bar>
        </div>
      </scroll-view>

    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    export default {
        name: "index",
        components:{ScrollView},
        data(){
          return{
            isShow:false
          }
        },
        methods:{
          goBackHandle(){
            this.$router.back()
          }
        }
    }
</script>

<style scoped lang="less">
.promotion-tool-content{
  border-radius: 4px;
  margin:10px 15px;
  .item-img{
    width:38px;
    height:38px;
    img{
      width:100%;
      height:100%;
    }
  }
  .item-intro{
    color:gray;
    font-size:13px;
  }
}
</style>
