<template>
    <div class="estimate-popup-content">
       <div class="popup-title font_size_18"></div>
        <div class="popup-intro-content">
          <div class="font_size_14 g_mb_l">At the first，you should add items to cart. Then follow the 4 steps below.</div>
          <div class="font_size_14 g_mb_l">1.Choose the items in cart</div>
          <div class="font_size_14 g_mb_l">2.Click "Pay"</div>
          <div class="intro-img g_mb_l"><img src="~assets/images/productDetail/mobile_estimation_cost_1.png" alt=""></div>
          <div class="font_size_14 g_mb_l">3.Input Postal code and Suburb,then click "Estimate"</div>
          <div class="font_size_14 g_mb_l">4.Get the estimate international Freight</div>
          <div class="intro-img g_mb_l"><img src="~assets/images/productDetail/mobile_estimation_cost_2.png" alt=""></div>
          <div class="font_size_18 g_mb_l">What's the international shipping?</div>
          <div class="font_size_13 g_mb_l">At ShopShipShake we assist you to import directly from China, the purchasing experience is quite different from other e-commerce platforms.</div>
          <div class="font_size_13 g_mb_l">Kindly note that at SSS payments, there are TWO steps for payment. In the FIRST step, you pay for the products,
            and separately, in the SECOND step you pay for the international shipping cost.
            The exact shipping cost will be calculated according to the actual weight and volume of the parcel (purchased products) when we collect it at our warehouse.</div>
          <router-link active-class="#fcc900" class="color_blue" to="/helpcenter/userguidance" replace>
            Click here to understand SSS operation process >
          </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped lang="less">
.estimate-popup-content{
  padding:10px 0 30px;
  .popup-intro-content{
    padding:15px 10px;
    font-size:14px;
    line-height:1.7;
    color:#000;
  }
  .intro-img{
    padding:10px 8px;
    img{
      width:100%;
    }
  }
}
</style>
