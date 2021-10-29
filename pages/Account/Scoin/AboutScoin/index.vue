<template>
  <div class="about-s-coin-wrapper">
    <van-sticky>
      <van-nav-bar border @click-left="goBackHandle" >
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <strong>About S Coin</strong>
        </template>
      </van-nav-bar>
      <van-tabs v-model="tabIndex" animated>
        <van-tab v-for="(item,index) in tabList" :title="item.title" :key="index">
          <div class="about-content">
            <template v-if="tabIndex===0">
              <div class="about-content-title font_size_16">1. How to get S Coin?</div>
              <div class="about-content-intro">
                - When your parcel been signed in your destination country, you will get corresponding S Coin according to all the grand total nett amount that been spent on the parcel.
              </div>
              <div class="about-content-title g_mt_l">2. How many S Coin will I get?</div>
              <div class="about-content-intro">- S Coin quantity =  grand total nett amount been spent on the parcel, including but not limited to product purchasing fee/China domestic freight charge/int’l freight charge/clearance service fee, etc. E.g, if you spent R5000 for one parcel, when you signed the parcel, you will get 5000 S Coin.</div>
              <div class="about-content-title g_mt_l">3. One more thing?</div>
              <div class="about-content-intro">- If your paid amount is not integer for any parcel, the S Coin amount that you get will be rounded up. E.g, if you spent R99.2 for a parcel, then you will get 100 S Coin for this parcel.</div>
            </template>
            <template v-if="tabIndex===1">
              <div class="about-content-title"> When can I use S Coin?</div>
              <div class="about-content-intro">
                <p>- When you are purchasing, ready to pay for your product.</p>
                <p>- When you are ready to ship and pay for your int’l freight charge.</p>
                <p>- When you are buying/renewing your membership.</p>
              </div>
              <div class="about-content-title g_mt_l"> 2. How does S Coin work?</div>
              <div class="about-content-intro">
                - When you are paying the amount, you will can choose S Coin to deduct in Rand. The exchange is 100 S Coin = 1 Rand.
              </div>
              <div class="about-content-title g_mt_l">  Other provision.</div>
              <div class="about-content-intro">
                - When purchasing/paying for int’l freight charge, the maximum quantity  of S Coin can be used for each payment is 1% of total amount of payment in Rand. E.g, if your nett payment amount is R100, the maximum S Coin can be used is 100.
              </div>
            </template>
            <template v-if="tabIndex===2">
              <div class="about-content-intro">
                - Valid period is 1 year: from the time you get S Coin to the end of the same month in next year. E.g, if you got S Coin in 2020/10/18, these S Coin will be expired at 2021/10/31 24:00.
              </div>
              <div class="about-content-intro g_mt_l">
                - The earliest S Coin will be consumed first.
              </div>
            </template>
          </div>

        </van-tab>
      </van-tabs>
    </van-sticky>
  </div>
</template>

<script>
export default {
  head(){
    return {
      title:'S Coin Description - shopshipshake'
    }
  },
  name: "index",
  data(){
    return{
      tabIndex:0,
      tabList:[{title:'How to get'},{title:'How to use'},{title:'Lifespan'}]
    }
  },
  methods:{
    goBackHandle(){this.$router.go(-1)}
  }
}
</script>

<style scoped lang="less">
.about-s-coin-wrapper{
  /deep/.van-notice-bar{
    font-size:16px;
    font-weight: bold;
  }
  /deep/.van-tab--active{
    color:#FCC900;
    font-weight: bold;
    font-size:16px;
  }
  /deep/.van-tabs__line{
    width:70px;

    background-color:#FCC900;
  }
  .about-content{
    color:#6d6d72;
    padding:10px 30px;
    .about-content-title{
      margin:20px 0 15px;
      color:#2A2A2A;
      font-weight: bold;
    }
    .about-content-intro{
      font-size:14px;
      line-height:1.5;

    }
  }
}
</style>
