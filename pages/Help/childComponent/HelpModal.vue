<template>
  <div class="help-wrapper">
    <scroll-view class="scrollViewHeight">
      <template v-if="type=='refundpolicy'">
        <div class="help-title-big">Refund Policy</div>
        <div class="help-intro">
          <p>
            To guarantee the benefits of clients, we publish compensation standards for solving the parcel problems when clients are under our services. We give following situations of parcel problems and our solutions.
          </p>
          <p>
            If clients cancel the order before outbound, we will help you to cancel the order online, but the service fee is not refundable. Products that have been outbound cannot be canceled. Please refer to option A in the Compensation Standards table below for specific compensation policies.
          </p>
          <p>
            If you find your whole parcel missing several items, please take pictures with the weight number and send them to your Consultant. Your assistant will help you check which process went wrong. Weight shortage of products can be the sellers’ problems or logistics problems, so please provide information as much as possible to your assistant. If the problems are caused by the sellers, we will communicate with the sellers on your behalf. However, we cannot promise that you will get 100% compensation from sellers and in time. For specific details, please refer to option B in the table below. Therefore, we suggest that you tick quality inspection when placing your order to reduce the risk of shortage. In this case, if the problems still appear, the sellers and SSS will take responsibilities. For detail, please refer to the option C in the table below.
          </p>
          <p>
            If your whole parcel was lost during the shipping, the logistics suppliers will take responsibilities. We can help you communicate with them, but the time of the completion of the compensation cannot be guaranteed. Different logistics companies have different compensation standards. Generally, they refund the freight, but the compensation for the value of goods is very limited. You need to wait for 1-3 months to finish compensation. To improve the efficiency of your compensation, we provide SSS compensation Terms & Condition. We compensate for 80% of your shipping fee and 15% of products value and Chinese freight. Besides, we give refund of purchasing fee and foreign exchange fee. The specific added value can be referred to as option D in the table below.
          </p>
        </div>
        <div>
          <img src="~assets/images/help/refund_policy .jpg" alt="">
        </div>
      </template>
      <template v-else-if="type=='paymentprotection'">
        <div class="help-title-big">
          Payment Protection
        </div>
        <div class="help-intro">
          <p>
            - If you don't receive the item that you ordered,
            you may qualify for Purchase Protection, and we'll reimburse you for the full purchase price plus any original shipping costs
            subject to terms and limitations.</p>
          <p>
            * Notice:If you are charged for a transaction that you didn't make,let us know ASAP, and we've got you covered.</p>
        </div>
      </template>
      <template v-else-if="type=='faq'">
        <div class="help-title">
          SSS Advanced guidance：
        </div>
        <div class="help-intro">
          <p>
            Congratulations on your registration! You can start your purchase journey for now! This guidance will help you to placing orders from searching, payment and shipping. After you recharge your first order successfully, you can ask for the SSS professional guidance from your exclusive Consultant. I believe you will make your business better after you using SSS!
          </p>
          Link for advanced guidance： <a href="https://bit.ly/2Pca497" target="_blank">download(.pdf)</a>
          <div>
            <img src="~assets/images/help/advanced.jpg" alt="">
          </div>
        </div>
      </template>
    </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
export default {
  name: "HelpModal",
  props:['type'],
  components:{ScrollView}
}
</script>

<style scoped lang="less">
.help-wrapper{
  padding-bottom:20px;
  .help-title-big{
    font-size:25px;
    font-weight: 500;
    line-height:1.5;
    margin-bottom: 15px;
  }
  .help-title{
    font-size:18px;
    font-weight: bold;
  }
  img{
    display: block;
    max-width: 100%;
    height: auto
  }
  .help-intro{
    font-size:13px;
    line-height:1.8;
    p{
      margin-bottom: 15px;
      font-size:14PX;
    }

  }
}
.scrollViewHeight{
  height:calc(100vh - 50px - 50px)
}
</style>
