<template>
  <div class="exchange-detail-content-goods">
    <van-cell title="commodity information"  >
      <template #label>
        <van-card
          title="European And American Popular Spring New Long Sleeve Round Neck Back Hollow Print Temperament Slim Dress"
          thumb="https://cbu01.alicdn.com/img/ibank/2020/458/704/23294407854_1963300012.460x460xz.jpg"
        >
          <template #desc>
              <div class="g_mb_m g_mt_m goods_size" >Size:
                <van-tag color="#eeeeed" size="medium" text-color="#4c4c4c">220*240</van-tag>
                <van-tag color="#eeeeed" size="medium" text-color="#4c4c4c">230*220</van-tag>
              </div>
            <div class="g_mb_m g_mt_m goods_size" >Color:
              <van-tag color="#eeeeed" size="medium" text-color="#4c4c4c">Black</van-tag>
              <van-tag color="#eeeeed" size="medium" text-color="#4c4c4c">Red</van-tag>
            </div>
          </template>
          <template #price>Quantity</template>
          <template #num>
            <van-stepper v-model="value" integer />
          </template>
        </van-card>
      </template>
    </van-cell>
    <van-cell title="S Coin Exchange"  class="g_mt_l">
      <template #label>
        <van-grid>
          <van-grid-item>
            <template #icon>
              <img src="~assets/images/Account/vip0.jpg" alt="" class="grid-img">
            </template>
            <template #text>
              <p class="grid-title">Platinum</p>
              <p class="grid-title">100 S Coin</p>
            </template>
          </van-grid-item>
          <van-grid-item>
            <template #icon>
              <img src="~assets/images/Account/vip1.png" alt="" class="grid-img">
            </template>
            <template #text>
              <p class="grid-title">Golden</p>
              <p class="grid-title">200 S Coin</p>
            </template>
          </van-grid-item>
          <van-grid-item>
            <template #icon>
              <img src="~assets/images/Account/vip2.png" alt="" class="grid-img">
            </template>
            <template #text>
              <p class="grid-title">Sliver</p>
              <p class="grid-title">300 S Coin</p>
            </template>
          </van-grid-item>
          <van-grid-item>
            <template #icon>
<!--              <img src="~assets/images/Account/bojin.png" alt="" class="grid-img">-->
            </template>
            <template #text>
              <p class="grid-title">Platinum</p>
              <p class="grid-title">400 S Coin</p>
            </template>
          </van-grid-item>
        </van-grid>
      </template>
    </van-cell>
    <van-cell title="Goods Information" class="g_mt_l"  >
      <template #label>
        Details page is the embodiment of product content.



        Because customers can't really experience products, we should use the features, functions, details, physical display, product qualifications, etc. to stimulate buyers' desire, establish buyers' trust in suppliers, dispel buyers' doubts, and then prompt buyers to send out inquiries.



        Its functions can be summarized as: attracting browsing, grasping pain points, dispelling worries, making up your mind to buy, and guiding consultation. Details can greatly improve the conversion rate, so we should optimize the details page to attract buyers to browse, and let buyers stay on the details page with pain points, so as to reassure buyers of their final determination to send out inquiries.



        So what are the contents of the details page? What exactly does it contain?
        Details page is the embodiment of product content.



        Because customers can't really experience products, we should use the features, functions, details, physical display, product qualifications, etc. to stimulate buyers' desire, establish buyers' trust in suppliers, dispel buyers' doubts, and then prompt buyers to send out inquiries.



        Its functions can be summarized as: attracting browsing, grasping pain points, dispelling worries, making up your mind to buy, and guiding consultation. Details can greatly improve the conversion rate, so we should optimize the details page to attract buyers to browse, and let buyers stay on the details page with pain points, so as to reassure buyers of their final determination to send out inquiries.



        So what are the contents of the details page? What exactly does it contain?
        Details page is the embodiment of product content.



        Because customers can't really experience products, we should use the features, functions, details, physical display, product qualifications, etc. to stimulate buyers' desire, establish buyers' trust in suppliers, dispel buyers' doubts, and then prompt buyers to send out inquiries.



        Its functions can be summarized as: attracting browsing, grasping pain points, dispelling worries, making up your mind to buy, and guiding consultation. Details can greatly improve the conversion rate, so we should optimize the details page to attract buyers to browse, and let buyers stay on the details page with pain points, so as to reassure buyers of their final determination to send out inquiries.



        So what are the contents of the details page? What exactly does it contain?
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return{
      value:1
    }
  },
  methods:{

  }
}
</script>

<style scoped lang="less">

.exchange-detail-content-goods {
  padding: 10px 6px 90px;
  background-color: #EEEEED;
  /deep/.van-cell{
    border-radius: 10px;
  }
  /deep/.van-cell__title{
    font-size:16px;
    font-weight: bold;
  }
  /deep/.van-tag{
    font-weight: 400;
    border-radius: 4px;
  }
  /deep/.van-card__thumb{
    width:120px;
    height:120px;
  }
  .goods_size{
    font-weight: 400;
  }
  .grid-img{
    width:30px;
    height:30px;

  }
  .grid-title{
    font-weight: 400;
    font-size:13px;
    margin-bottom: 6px;
  }
}
</style>
