<template>
  <div class="exchange-detail-wrapper">
        <van-sticky>
      <van-nav-bar border @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <strong>S Coin Exchange</strong>
        </template>
      </van-nav-bar>
    </van-sticky>
      <template v-if="type==='memberShip'">
        <member-model :memberShipType="memberShipType" />
      </template>
      <template v-else-if="type==='coupon'">
        <coupon-model />
      </template>
      <template v-else-if="type==='goods'">
        <goods-model />
      </template>
      <div class="pay-bottom">
          <van-button block class="pay-btn">Exchange  <strong> R 3000 </strong>S Coin</van-button>
      </div>
  </div>
</template>

<script>
import MemberModel from './MemberModel';
import CouponModel from './CouponModel';
import GoodsModel from './GoodsModel'
export default {
  head(){
    return {
      title:'S coin exchange - shopshipshake'
    }
  },
  name: "index",
  components:{MemberModel ,CouponModel ,GoodsModel},
  computed:{
    type(){return this.$route.params.type},//memberShip(会员) coupon(优惠卷) good(商品)
    memberShipType(){return this.$route.params.param}
  },
  methods:{
    goBackHandle(){this.$router.go(-1)}
  },

}
</script>

<style scoped lang="less">
.exchange-detail-wrapper{
  height:100vh;
  padding-bottom: 80px;
  position: relative;
  /deep/.van-nav-bar__title{
    font-size:18px;
  }

  .pay-bottom{
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    padding:10px 20px 20px;
    background-color: #fff;
    .pay-btn{
      background-color: #FCC900;
      color:#333;
      strong{
        color:#f00;
        font-size:17px;
      }
    }
    /deep/.van-button{
      height:45px !important;
      line-height: 45px;
      border-radius: 20px;
      font-size:15px;
      font-weight: 550;
    }
  }
}
</style>
