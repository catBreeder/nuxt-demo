<template>
  <div class="pay-dialog-content">
    <div class="pay-balance">
      <img src="~/assets/images/Cart/icon_3scard.png" alt="">
      Balance : {{balanceInfo.balance | moneyFormat}}
    </div>
    <div class="btn-area">
      <van-button block class="btn" @click="confirmPayHandle">Pay {{total | moneyFormat}}</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
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
      font-weight: bold;
      font-size:18px;
      img{
        vertical-align: bottom;
        margin-right: 10px;
      }
    }
    .btn-area{
      margin-top:20px;
      .btn{
        background-color:#FCC900;
        border-radius: 4px;
        font-size: 16px;
      }
    }
  }

</style>
