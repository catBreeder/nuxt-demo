<template>
  <div class="order-list-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>Commodity list</template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollHeight">
      <div class="order-list">
        <div class="order-list-item" v-for="(item,index) in orderList" :key="index">
          <div class="order-account">{{item.orderno}}</div>
          <good-item v-for="(good,goodId) in item.dlist" line-type="checkout" :key="goodId" :product="good">
               <div slot="price" class="good-price">{{good.pricezar | moneyFormat}}</div>
                <div  slot="count" class="color_normal"> x <span class="good-count">{{good.qty}}</span></div>
          </good-item>
        </div>
      </div>

    </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import GoodItem from '../../childComponent/GoodItem'
    export default {
      head(){
        return {
          title:'Check out - shopshipshake'
        }
      },
        name: "index",
       components:{ScrollView ,GoodItem},
      computed:{
          orderList(){
            if(this.$store.state.checkoutInfo){
              return this.$store.state.checkoutInfo.resultMap.list || [];
            }

          }
      },
        methods:{
          goBackHandle(){
            this.$router.go(-1);
          }
        },
    }
</script>

<style scoped lang="less">
.order-list-wrapper{
  /deep/.van-nav-bar__title{
    font-size:18px;
    font-weight: bold;
  }
  .scrollHeight{
    height:calc(100vh - 40PX);
    background-color:#EEEEED;
  }
  .order-list-item{
    border-radius: 4px;
    margin: 8px;
    padding:10px;
    background: #fff;
    .order-account{
      padding-bottom:10px;
      font-size:15px;
      border-bottom:1px solid #EEEEED;
    }
    .cart-product-item{
      padding:0;
    }
    /deep/.van-card{
      padding:4px 6px;
    }
    .good-price ,.good-count{
      font-size: 15px;
      color:#2A2A2A;
    }

  }
}
</style>
