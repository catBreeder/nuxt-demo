<template>
  <div>
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>User Guidance</template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollHeightNoBar" style="background-color: #fff;">
      <div class="user-guidance-content">
        <div class="g_mb_m">Dear SSSers, welcome to ShopShipShake.</div>
        <div class="g_mb_m">Here we will briefly show you how to buy form our website.</div>
        <div class="g_mb_m">If you still need more information or enquiries, you can go to our home page and click
          ‘Consultant’ or ‘Ambassador’ to contact them on WhatsApp.</div>
        <div><span class="g_mr-s font_size_18">➢</span>Consultant is Chinese Business Consultant for SSS Business Account.</div>
        <div><span class="g_mr-s font_size_18">➢</span>Ambassador is South African Group-Buy Leader for SSS Personal Account.</div>
        <div class="g_mb_l"><span class="g_mr-s font_size_18">➢</span>If you want to upgrade your Personal Account to Business Account, you can click the
          ‘Business’ and apply, we will certify and inform you in 2 Chinese workdays.</div>
        <div class="font_size_16">Enjoy your ShopShipShake tour.</div>
        <div class="g_mb_l">
          <img src="~assets/images/userGuidance/main1.png" alt="" class="normal-img">
        </div>
        <div class="font_w font_size_18 user-title">1.Selecting Goods</div>
        <div class="g_mb_m">1. Directly select from our website homepage catalog</div>
        <div class="g_mb_m">2. Picture searching (click the little camera--upload the image)</div>
        <div class="g_mb_l">3. Keyword searching</div>
        <div class="g_mb_l">
          <img src="~assets/images/userGuidance/main2.png" alt="" class="normal-img">
        </div>
        <div class="font_w font_size_18 user-title">2.Placing the order</div>
        <div class="g_mb_l">Select item's colour, size, and quantity, then add to shopping cart</div>
        <div class="g_mb_m">
          <img src="~assets/images/userGuidance/main3.png" alt="" class="normal-img">
        </div>
        <div class="g_mb_m g_mt_m color_intro">*Top Supplier is ShopShipShake Cooperated Supplier</div>
        <div class="g_mb_m color_intro">*You can click the Size Guide to check the general size reference. And in the suppliers'
          detailed page, you may get the original data about the size.</div>
        <div class="g_mb_m color_intro">*Few items are reminded as restricted for international delivery, for example, powder/liquid
          can only be shipped by sea.</div>
        <div class="font_w font_size_18 user-title">3.Order Payment</div>
        <div class="g_mb_m">When you done adding cart, you can checkout them in your cart.</div>
        <div class="g_mb_m color_intro">*Since we purchased from the Chinese Supplier, we recommend you to add quality
          inspections.</div>
        <div class="g_mb_m color_intro">*You can estimate the shipping fee on checkout page.</div>
        <div class="g_mb_m">
          <img src="~assets/images/userGuidance/main4.png" alt="" class="normal-img">
        </div>
        <div class="g_mb_m">
          Click ‘Checkout - Pay&Recharge’. The page will lead you to the account that you need to
          deposit. You can choose the transfer way and make the transaction. After it reflects in
          your account, you can go back to the To Pay to proceed the process.
        </div>
        <div class="g_mb_m">
          <img src="~assets/images/userGuidance/main5.png" alt="" class="normal-img">
        </div>
        <div class="font_w font_size_18 user-title">4.ShopShipShake Purchasing and Collecting</div>
        <div class="g_mb_m">
          ShopShipShake will contact the supplier and purchase your ordered items
          During the purchase process, you can visit 'My Orders -Purchase' to check
          details.
          The supplier deals the ordered items and ship them to ShopShipShake
          warehouse in China
        </div>
        <div>
          <van-row>
            <van-col :span="12">
              <div>
                <img src="~assets/images/userGuidance/main6.png" alt="" class="normal-img">
              </div>
            </van-col>
            <van-col :span="12">
              <div>
                <img src="~assets/images/userGuidance/main7.png" alt="" class="normal-img">
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="font_w font_size_18 user-title">5.International Shipping Order Payment</div>
        <div class="g_mb_m">
          You can visit 'My Orders - To ship' to view the items once they are collected by
          CN warehouse.
        </div>
        <strong class="g_mb_m">How to pay?</strong>
        <div class="g_mb_m">Select all the orders - Click pay, then you need to Fill in your delivery address
          and also pay the according shipping fee.</div>
        <div class="g_mb_m">
          *If your balance is not enough, you may need to recharge again.
        </div>
        <div class="g_mb_m">
          *International delivery fee is calculated based on the weight and volume,
          delivery method and destination.
        </div>
        <div class="g_mb_m">
          After you submit the shipping order payment, the order will get into the next
          stage – In Transit.
        </div>
        <div>
          <img src="~assets/images/userGuidance/main8.png" alt="" class="normal-img">
        </div>
        <div class="font_w font_size_18 user-title">6.Waiting for your package to arrive</div>
        <div class="g_mb_m">ShopShakeShake will arrange the shipment. During this time you can track the
          parcel and follow its shipping progress via ‘My Orders - In transit - Track Parcel’.</div>
        <div>
          <img src="~assets/images/userGuidance/main9.png" alt="" class="normal-img">
        </div>
        <div class="font_w font_size_18 user-title">7.Delivered & Review</div>
        <div class="g_mb_m">Once you have received the parcel, you can confirm the delivery via ‘My Orders - Review'. If
          you have any question regarding to the parcel, you can also apply for after- sales service.</div>
        <div class="g_mb_m">
          <img src="~assets/images/userGuidance/main10.png" alt="" class="normal-img">
        </div>
        <div>Thanks for your reading. Start your shopping now!</div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
  import CommonIndexHeader  from "@/components/common/CommonIndexHeader";
  import ScrollView from "@/components/common/ScrollView";
  export default {
    head(){
      return {
        title:'User Guidance - shopshipshake'
      }
    },
    components:{CommonIndexHeader,ScrollView},
    methods:{
      goBackHandle(){this.$router.back()},
      goMessageHandle(){this.$router.push('/message/index')}
    }
  }
</script>
<style scoped lang="less">
  .user-guidance-content{
    padding:15px;
    font-size:15PX;
    line-height:1.7;
  }
  .user-title{
    padding:15px 0;
  }
  .normal-img{
    width:100%;
    height:auto;
  }
</style>
