<template>
  <div class="orderValue-popup">
    <div class="orderValue-content">
      <div class="order-value-info d_flex_between d_flex">
        <div class="order-value-info-left">
          <div class="g_mb_m">
            <div class="color_intro g_mb_m" >Product Value</div>
            <div >
              <strong>
                <template v-if="type==='order'">
                  <template v-if="priceCostInfo.productcostzar">
                    <span v-if="priceCostInfo.extrapricecostzar">{{(Number(priceCostInfo.productcostzar)+Number(priceCostInfo.extrapricecostzar))/100 | moneyFormat}}</span>
                    <span v-else> {{priceCostInfo.productcostzar/100 | moneyFormat}}</span>
                  </template>
                  <template v-else>R 0.00</template>
                </template>
                <template v-else>
                  <template v-if="priceCostInfo.productvalue">
                    <span v-if="priceCostInfo.extrapricecost">{{Number(priceCostInfo.productvalue) + Number(priceCostInfo.extrapricecost) | moneyFormat}}</span>
                    <span v-else>{{priceCostInfo.productvalue | moneyFormat}}</span>
                  </template>
                  <template v-else>R 0.00</template>
                </template>

              </strong>
            </div>
          </div>
          <div>
            <div class="color_intro g_mb_m" >Exchange Lose</div>
            <div><strong>
              <template v-if="type==='order'">
                <template v-if="priceCostInfo.exchangelosscostzar"> {{priceCostInfo.exchangelosscostzar/100 | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>
              <template v-else>
                <template v-if="priceCostInfo.exchangelose"> {{priceCostInfo.exchangelose | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>

            </strong></div>
          </div>
        </div>
        <div class="order-value-info-right">
          <div class="g_mb_m">
            <div class="color_intro g_mb_m" >Operation Fee</div>
            <div><strong>
              <template v-if="type==='order'">
                <template v-if="priceCostInfo.purchasecostzar"> {{priceCostInfo.purchasecostzar/100 | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>
              <template v-else>
                <template v-if="priceCostInfo.operationfee"> {{priceCostInfo.operationfee | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>

            </strong></div>
          </div>
          <div>
            <div class="color_intro g_mb_m" >Clearance Service Fee</div>
            <div><strong>
              <template v-if="type==='order'">
                <template v-if="priceCostInfo.taxpaymentcostzar"> {{priceCostInfo.taxpaymentcostzar/100 | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>
              <template v-else>
                <template v-if="priceCostInfo.clearanceservicefee"> {{priceCostInfo.clearanceservicefee | moneyFormat}}</template>
                <template v-else>R 0.00</template>
              </template>

            </strong></div>
          </div>
        </div>
      </div>
    </div>
    <div class="orderValue-btn">
      <van-row>
        <van-col span="20" offset="2">
          <van-button block @click="confirmHandle">Confirm</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OrderValuePopup",
    props:{
      priceCostInfo:{type:Object,default:()=>{}},
      type:String
    },
    methods:{
      confirmHandle(){
        this.$emit('confirmEmit')
      }
    },
  }
</script>

<style scoped lang="less">
  .orderValue-popup{
    font-size:15px;
    .orderValue-title{
      height:50px;
      line-height:50px;
      font-size:15px;
      text-align: center;
      border-bottom: 1px solid #EEEEED;
    }
    .orderValue-content{
      padding:10px 20px;
      strong{
        font-size:15px;
      }
      .order-value-info{
        .order-value-info-left{

        }
        .order-value-info-right{}
      }
    }
    .orderValue-btn{
      padding:10px 0 20px;
      /deep/ .van-button{
        background:#FCC900;
        color:#222222;
        font-size:18px;
        font-weight: 500;
        border-radius: 6px;
        height:38px !important;
        line-height:38px
      }
    }
  }
</style>
