<template>
  <div class="pay-dialog-content">
    <div class="pay-balance">
     <div>
       <img src="~/assets/images/Cart/icon_3scard.png" alt="">
       Balance :
     </div>
      <div class="money-count">{{balanceInfo.balance | moneyFormat}}</div>
    </div>
    <div class="btn-area">
      <van-button block class="btn" @click="confirmPayHandle">Pay {{total | moneyFormat}}</van-button>
    </div>
  </div>
</template>

<script>
  import {confirmPayApi} from '@/api/cart'
  export default {
    name: "PayDialog",
    props:{
      balanceInfo:{
        type:Object,
        default:()=>{}
      },
      total:String | Number
    },
    methods:{
      confirmPayHandle(){
        this.$emit('confirmPayEmit')
      }
    },

  }
</script>

<style scoped lang="less">

  .pay-dialog-content{
    padding: 20px 30px 20px;
    .pay-balance{
      color:#2a2a2a;

      img{
        vertical-align: bottom;
        margin-right: 10px;
      }
      .money-count{
        margin-top: 10px;
        font-weight: bold;
        font-size:18px;
      }
    }
    .btn-area{
      margin-top:20px;
      .btn{
        background-color: #FCC900;
        border-radius: 4px;
        font-size: 16px;
      }
    }
  }

</style>
