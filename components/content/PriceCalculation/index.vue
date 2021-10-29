<template>
  <div class="toPay-price">
    <div class="toPay-price-title" :class="{'border_left':isLeft,'title_padding':isLeft}">Price Calculation</div>
    <div class="toPay-info">
      <div class="toPay-info-order ">
        <van-row>
          <van-col span="12">
            <div class="toPay-info-order-left">
              <div class="g_mb_l">
                <div class="color_intro g_mb_m" >Order Value</div>
                <div @click.stop="showPopupHandle"><strong>R{{priceInfo.ordervalue }}</strong>
                  <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/></div>
              </div>
              <div @click.stop>
                <div class="color_intro g_mb_m" >Remove Shoebox Fee</div>
                <div><strong>R{{priceInfo.removeshoeboxfee}}</strong></div>
              </div>
            </div>
          </van-col>
          <van-col span="12">
            <div class="toPay-info-order-right" @click.stop>
              <div class="g_mb_l">
                <div class="color_intro g_mb_m" >Chinese Freight</div>
                <div><strong>R{{priceInfo.chinesefreight}}</strong></div>
              </div>
              <div class="discount-area">
                <div class="color_intro g_mb_m" >Quality Inspection Fee</div>
                <strong>R{{priceInfo.qualityfee}}</strong>
                <del class="color_intro" v-if="priceInfo.oldqualityfee != priceInfo.qualityfee">R{{priceInfo.oldqualityfee}}</del>
                <div class="color_warning discount-tag" v-if="priceInfo.oldqualityfee != priceInfo.qualityfee">{{vipname}}  Membership's discount </div>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props:{
      isLeft:{type:Boolean,default:false},
      //价格信息
      priceInfo:{
        type:Object,default:()=>{},
      },
      vipname:String,
    },
    data(){
      return{
        coinFlag:false,
        chooseItem:{},
        scoinInfo:{},
        useChooseCoupon:{},
        showCoupon:false
      }
    },
    methods:{
      showPopupHandle(){
        this.$router.push(`/shoporder/coupon/${this.priceInfo.totalcostzar}`)
      },

    },
  }
</script>

<style scoped lang="less">
  .border_left{
    border-left:1px solid #FCC900;
  }
  .title_padding{
    padding-left:10px;
  }
  .toPay-price{
    padding:0 15px;
    .toPay-price-title{
      font-size:16px;
      font-weight: 600;
      margin:10px 0;

    }
    .toPay-info{
      border-bottom:1px dashed #EEEEED;
      padding-bottom: 20px;
      .toPay-info-order{
        font-size:13px;
        .toPay-info-order-right{
          padding-right: 10px;
          .discount-area{
            position: relative;
            .discount-tag{
              position: absolute;
              left:-30px;
              right:0;
            }
          }
        }
      }
    }
    .toPay-coupon{
      padding:5px 0;
      border-bottom:1px solid #EEEEED;
      /deep/.van-cell{
        padding-left:0px;
      }
      .coupon-title{
        padding:10px 8px;
        font-size:14px;
      }
    }
    strong{
      font-size:15px;
    }
  }
  /deep/.van-cell__title, .van-cell__value{
    font-size:15px;
    font-weight: bold;
    color:#3d4145
  }
  /deep/.van-cell__value{
    color:#ed5565;
  }
</style>
