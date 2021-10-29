<template>
  <div class="toPay-price">
    <div class="toPay-price-title" :class="{'border_left':isLeft}">Price Calculation</div>
    <div class="toPay-info">
      <div class="toPay-info-order ">
        <div class="info_order_item">
          <div class="toPay-info-order-left">
            <div class="g_mb_l">
              <div class="color_intro g_mb_m">Order Value</div>
              <div @click.stop="showPopupHandle('orderValue')"><strong>R{{priceInfo?priceInfo.ordervalue :''}}</strong>
                <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/>
              </div>
            </div>
            <div>
              <div class="color_intro g_mb_m">Remove Shoebox Fee</div>
              <div><strong v-if="priceInfo && priceInfo.removeshoeboxfee">R{{priceInfo.removeshoeboxfee}}</strong></div>
            </div>
          </div>
        </div>
        <div class="info_order_item">
          <div class="toPay-info-order-right">
            <div class="g_mb_l">
              <div class="color_intro g_mb_m">Chinese Freight</div>
              <div><strong>R{{priceInfo && priceInfo.chinesefreight ?priceInfo.chinesefreight:''}}</strong></div>
            </div>
          <div class="discount-area">
            <template v-if="!qtime">
              <div class="color_intro g_mb_m">Quality Inspection Fee :</div>
              <div class="d_flex">
                <strong :class="{'color_warning':oldqualitycost != qualityinspectioncostzar}">
                  {{(qualityinspectioncostzar/100) | moneyFormat}}
                </strong>
                <div v-if="oldqualitycost != qualityinspectioncostzar" class="g_ml_m color_intro">
                  <del>{{(oldqualitycost/100) | moneyFormat}}</del>
                  <div class="color_warning discount-tag" v-if="vipname">{{vipname}} Membership's discount</div>
                </div>
              </div>
              <div class="color_warning discount-tag" v-if="saveFee > 0"> if you are Platinum membership, Quality
                Inspection fee will save {{(saveFee/100) | moneyFormat}}
              </div>
            </template>
            <template v-else>
              <div class="color_intro g_mb_m">Quality Inspection Fee : </div>
              <div class="font_w">Free until {{qtime}}</div>
            </template>
          </div>
        </div>

      </div>
      <div class="info_order_item" v-if="priceInfo && priceInfo.groupservicefee>0">
        <div class="topay-group-buy">
          <div class="g_mb_l">
            <div class="color_intro g_mb_m">Group-buy Service Fee</div>
            <strong>{{priceInfo.groupservicefee/100 | moneyFormat }}</strong>
          </div>
        </div>
      </div>
      <div class="info_order_item" v-if="priceInfo && priceInfo.bigcustomerservicefee>0">
        <div class="topay-group-buy">
          <div class="g_mb_l">
            <div class="color_intro g_mb_m">Service Fee</div>
            <strong>{{priceInfo.bigcustomerservicefee/100 | moneyFormat }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "PriceCalculation",
    props: {
      isLeft: {type: Boolean, default: false},
      qtime: String,
      qualityinspectioncostzar:Number,
      //价格信息
      priceInfo: {
        type: Object, default: () => {
        },
      },
      vipname: String,
      saveFee: Number,
      couponsize: Number,//优惠卷个数
      maxcouponmoney: Number,//优惠最值
      //货币数量
      scoin: {
        type: Object, default: () => {
        }
      },
      chooseCounpon: {
        type: Object, default: () => {
        }
      },
      oldqualitycost: Number
    },
    data() {
      return {
        coinFlag: false,
        chooseItem: {},
        scoinInfo: {},
        useChooseCoupon: {},
        showCoupon: false
      }
    },
    methods: {
      showPopupHandle(type) {
        switch (type) {
          case 'orderValue':
            this.$emit('showPopupEmit', type)
            break;
        }

      },
      getScoinInfo() {
        let value = {}
        if (Number(this.priceInfo.totalcostzar) > Number(this.scoin.scoinsum)) {
          value = {
            useCoin: parseInt(this.scoin.totalcostzar),
            useMoney: parseInt(this.scoin.totalcostzar / 100)
          }
        } else {
          //如果积分大于总金额，使用总金额
          value = {
            useCoin: parseInt(this.priceInfo.totalcostzar),
            useMoney: parseInt(this.priceInfo.totalcostzar / 100)
          }
        }
        this.scoinInfo = value;
      }
    },
  }
</script>

<style scoped lang="less">
  .topay-group-buy {
    margin-top: 20px;
  }

  .border_left {
    border-left: 1px solid #FCC900;
  }

  .toPay-price {
    padding: 0 15px;

    .toPay-price-title {
      font-size: 16px;
      font-weight: 600;
      padding: 10px 0;
    }

    .toPay-info {
      border-bottom: 1px dashed #EEEEED;
      padding-bottom: 36px;

      .toPay-info-order {
        font-size: 13px;
        display: flex;
        flex-wrap: wrap;

        .info_order_item {
          width: 49%;
        }

        .toPay-info-order-right {
          padding-right: 10px;

          .discount-area {
            position: relative;

            .discount-tag {
              position: absolute;
              left: -30px;
              right: 0;
            }
          }
        }
      }
    }

    .toPay-coupon {
      padding: 5px 0;
      border-bottom: 1px solid #EEEEED;

      /deep/ .van-cell {
        padding-left: 0px;
      }

      .coupon-title {
        padding: 10px 8px;
        font-size: 14px;
      }
    }

    strong {
      font-size: 15px;
    }
  }

  /deep/ .van-cell__title, .van-cell__value {
    font-size: 15px;
    font-weight: bold;
    color: #3d4145
  }

  /deep/ .van-cell__value {
    color: #ed5565;
  }
</style>
