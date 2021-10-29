<template>
  <div>
    <scroll-view class="scrollViewHeight">
      <modal-title :title="title"/>
      <template v-if="type==='search'">
        <modal-paragraph content=" 1.SSS provides key words search to get your products quickly and accurately. When you log in SSS website, typing the key words about products, some relative products will be shown on the screen."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_1_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_1_2.jpg" alt="">
        </div>
        <modal-paragraph content="2.You can use image search to find your products by downloading products pictures when browsing the website after registration. Click the camera icon and choose the pictures from your computer that you downloaded before. You can find many suppliers on our website and choose one to place your order."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_2_2.jpg" alt="">
        </div>
        <modal-paragraph content="3.Another way for search is by copying the link from 1688 and paste it in SSS search box. It will skip to the order page."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_3_1.png" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_3_3.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/search_3_4.jpg" alt="">
        </div>
      </template>
      <template v-else-if="type==='placeyourorder'">
        <modal-paragraph content="
										1.The information of products will be shown on order page, then you can add your products into cart. Note that there will be quantity demands.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_1_1.jpg" alt="">
        </div>
        <modal-paragraph content="
										2.When you are adding products to cart, you need to set your receiver information. It can be yourself, or other receivers, even you can ship to your customers directly. Please fill out their information correctly. There are added values for you to choose: quantity inspection or shoebox removal. If you need our staff to check your products quantity when collected, please tick it. If you need remove shoebox to reduce the volumetric weight, you can tick “Remove shoebox” but there will be the risk of abrasion, such as high-heel shoes.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_2_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_2_2.jpg" alt="">
        </div>
        <modal-paragraph content="3.Under the “orders – cart” page, please tick the products you want to pay in the cart and click “pay selected” button. Then you will go to payment page. If your account is insufficient, please recharge before pay. For the details of recharge, please look at “Recharge“ part. After recharging, you can go on for paying on recharge page or go to the cart page for paying. If you have enough money, please pay directly."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_3_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_3_2.jpg" alt="">
        </div>
        <modal-paragraph content="(If your account is insufficient, please recharge before pay.)"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/placeorder_3_3.jpg" alt="">
        </div>
      </template>
      <tempalte v-else-if="type==='recharge'">
        <modal-paragraph content="1.Please recharge your account under the recharge page. Here is our bank account number and branch,please fill out your ref. number correctly. Usually it takes 0-2 days for bank processing. Please contact your business Consultant if it takes more than 3 days."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/recharge_1_1.jpg" alt="">
        </div>
        <modal-paragraph content="2.After you recharge money into the account, you can check your account bill under the account. Here is your balance, income and expenditure.
"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/recharge_2_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/recharge_2_2.jpg" alt="">
        </div>
      </tempalte>
      <template v-else-if="type==='payfororder'">
        <modal-paragraph content=" 1.When your account is charged with money, you can pay for goods under the “orders - cart” page. Please click “confirm and pay”. After you pay successfully, you can check your order details under the “orders” page."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/payfororder_1_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/payfororder_1_2.jpg" alt="">
        </div>
        <modal-paragraph content="2.Under the collected page, you can check which products have been collected in Chinese warehouses."/>
        <div class="help-detail-img">
          <img src="~assets/images/help/payfororder_2_1.jpg" alt="">
        </div>
      </template>
      <template v-else-if="type==='internationallogistics'">
        <modal-paragraph content="
										1.Select the products you want to ship after collecting. Click “ship selected”, then please fill out the receiver information and save. You can choose the address saved before or use a new one.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/international_logistics_1_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/international_logistics_1_2.jpg" alt="">
        </div>
        <modal-paragraph content="
										2.Then skip to choose transport service: 1/8000 economical air freight or fast air freight When you submit, the freight charge will show on screen. If your balance is insufficient, the system will let you recharge. Go to recharge page and charge money into your account before payment.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/international_logistics_2_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/international_logistics_2_2.jpg" alt="">
        </div>
        <modal-paragraph content="
										3.After you submit and recharge, please pay the shipping fee. When we receive the freight and your shipping fee, we will arrange international logistics within 2 days
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/international_logistics_3_1.jpg" alt="">
        </div>
      </template>
      <template v-else-if="type==='trackyourorder'">
        <modal-paragraph content="
										1.Track your logistics in China You can find the status of your products which have been paid under the “Orders – Purchase” page. Under the “Orders – collected” page, you can track which parcel has been collected in Chinese warehouse.
									"/>
        <div class="table-content">
          <van-row class="font_w b_border g_pb_m">
            <van-col span="6">Chinese logistics status</van-col>
            <van-col span="6">Where to find it</van-col>
            <van-col span="11" offset="1">Explanation</van-col>
          </van-row>
          <van-row class=" b_border g_pb_m g_pt_m" >
            <van-col  span="6">Seller shipped</van-col>
            <van-col  span="6">“Orders-purchase” page</van-col>
            <van-col span="11" offset="1">Products have been shipped and are on the way to the collection warehouse.</van-col>
          </van-row>
          <van-row class=" b_border g_pb_m g_pt_m" >
            <van-col  span="6">Purchased status</van-col>
            <van-col  span="6">“Orders-purchase” page</van-col>
            <van-col span="11" offset="1">Products have been paid but have not been shipped.</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m" >
            <van-col  span="6">Collected</van-col>
            <van-col  span="6">“Orders-collected” page</van-col>
            <van-col span="11" offset="1">Your parcel has been collected in Chinese warehouse.</van-col>
          </van-row>
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/track_your_ order_1_1.jpg" alt="">
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/track_your_ order_1_2.jpg" alt="">
        </div>
        <modal-paragraph content="
										2.Overseas logistics Under the “Orders – Shipping” page, you can track your international parcel, and you will know where it is. Click the order number, and the detail of your parcel will be shown. From order confirmed to client received, you can follow up the whole process.
									"/>
        <div class="table-content">
          <van-row class="font_w b_border g_pb_m">
            <van-col span="4" >International logistics status</van-col>
            <van-col span="18" offset="2">Explanation</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >Order confirmed</van-col>
            <van-col span="18" offset="2">International shipping order has been paid successfully and are waiting for picking</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4">Packaging completed</van-col>
            <van-col span="18" offset="2">Finishing your parcels package</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4">Enter warehouse</van-col>
            <van-col span="18" offset="2">Your parcels enter the China transit warehouse</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4">Out of warehouse</van-col>
            <van-col span="18" offset="2">Your parcels have been shipped out of China transit warehouse</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4">Clearance （CN）</van-col>
            <van-col span="18" offset="2">Customs clearance in China successfully</van-col>
          </van-row>

          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4">Air shipping</van-col>
            <van-col span="18" offset="2">Your parcels are being shipped by air</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >At the destination</van-col>
            <van-col span="18" offset="2">Your parcels have arrived at destination country</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >Dispatching</van-col>
            <van-col span="18" offset="2">Your parcels are on the way to your door by local courier</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >Client received</van-col>
            <van-col span="18" offset="2">Your parcels have been received</van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >Cancelled</van-col>
            <van-col span="18" offset="2">You cancelled the International logistics to destination when your products arrived in collection warehouse. </van-col>
          </van-row>
          <van-row class=" g_pb_m g_pt_m b_border">
            <van-col span="4" >Closed</van-col>
            <van-col span="18" offset="2">If your parcels lost after shipping to destination or have any problems, the international shipping order will be shut out.</van-col>
          </van-row>
        </div>
        <div class="help-detail-img">
          <img src="~assets/images/help/track_your_ order_2_1.jpg" alt="">
        </div>
      </template>
      <template v-else-if="type==='forwardingagency'">
        <modal-paragraph content="
										1.If you need forwarding agency service, please fill out your information under the “S³ forwarding agency page” and remember to click confirm. Please do not fill out any Chinese character in logistics number, otherwise, it will affect collected process.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/forwarding_agency_1_1.jpg" alt="">
        </div>
        <modal-paragraph content="
										2.Under the “Orders – Purchase” page, you can find your forwarding orders, when it is collected by warehouse, please pay for the shipping fee. After you recharge the account successfully, we will deliver your parcel to South Africa, you can track your parcel under the shipping page.
									"/>
        <div class="help-detail-img">
          <img src="~assets/images/help/forwarding_agency_2_1.jpg" alt="">
        </div>
      </template>
    </scroll-view>

  </div>
</template>

<script>
import ModalTitle  from "./Modal/ModalTitle";
import ModalParagraph from "./Modal/ModalParagraph";
import ScrollView from "@/components/common/ScrollView";
export default {
  name: "Search",
  components:{ModalTitle,ModalParagraph,ScrollView},
  props:['title','type']
}
</script>

<style scoped lang="less">
@import "~assets/less/help.less";
.table-content{
  font-size:12px;
  padding-bottom: 15px;
  color:#3d4145
}
.scrollViewHeight{
  height:calc(100vh - 50px - 50px)
}
</style>
