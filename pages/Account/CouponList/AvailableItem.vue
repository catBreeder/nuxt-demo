<template>
  <div class="coupon-list-item" >
    <van-row v-if="item">
      <van-col :span="7">
        <div class="item-money item-money-active">R <span>{{item.money}}</span></div>
        <div class="item-use">
          <p>{{item.typename}}</p>
          <p>{{item.usetype}}</p>
        </div>
      </van-col>
      <van-col :span="16" class="text_align_r">
        <div class="item-time">{{item.dateinfo}}</div>
        <van-tag @click="useCouponHandle" color="#fcc900" size="large">Use immediately</van-tag>
      </van-col>
    </van-row>
  </div>
</template>

<script>
    export default {
        name: "available-item",
        props:{
          item:{type:Object,default:()=>{}},
          index:String | Number
        },
        methods:{
          useCouponHandle(){
            this.$router.replace('/shoporder/cart?tab=0')
          },
        }
    }
</script>

<style scoped lang="less">

  .coupon-list-item{
    border-radius: 8px;
    font-size:15px;
    background-color: #fff;
    padding:20px 15px;
    box-shadow: 0 2px 10px 0 rgb(190,190,190,0.1);
    color:#000;
    margin-bottom: 15px;
    .item-top{
      margin-bottom: 10px;
    }
    .item-money-active{
      color:#ecbd07;
    }
    .item-money-invalid{
      color:#999
    }
    .item-money{

      text-align: center;
      margin-bottom: 8px;
      span{
        font-weight: bold;
        font-size:28px;
      }
    }
    .item-use{
      font-size:15px;
      p{
        text-align: center;
        margin-bottom: 5px;
      }
    }
    .item-time{
      padding:10px 0 15px;
    }
  }
</style>
