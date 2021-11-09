<template>
  <div class="cart-product-item">
    <div class="product-info">
      <van-card>
        <!--                图片-->
        <template #thumb>
          <div class="product-img">
            <img @click="checkDetailHandle" :src="product && product.images?product.images:OrderImg"  style="border-radius: 0">
            <div class="product_change" v-if="product && product.priceold>0 && order.status == $config.orderStatus.AwaitingPayment">( Price Changed )</div>
          </div>
        </template>
        <!--                标题-->
        <template #title>
          <div class="product-name van-multi-ellipsis--l2"
               @click="checkDetailHandle">{{product && product.productnameen?product.productnameen:''}}</div>
        </template>
        <!--                描述-->
        <template #desc>
          <div class="product-desc">
            <div v-if="order && order.ordertype== 10" class="color_lightBlue">
              Transfer number: {{order.waybillno}}</div>
            {{ product && product.model}}
          </div>
        </template>
        <!--                价格-->
        <template #price>
          <div class="product-price" v-if="product">
            <template v-if="product.productcostzar"> {{product.productcostzar |moneyFormat}}</template>
            <template v-else-if="product.pricezar">{{product.pricezar |moneyFormat}}</template>
            <span v-show="product.unit >= 30">
                 {{$config.orderUnit[product.unit]}}
             </span>

          </div>
        </template>
        <template #origin-price>
          <slot name="origin"></slot>
        </template>
        <template #tags>
          <slot name="tags"></slot>
        </template>
        <!--                数量-->
        <template #num>
          <slot name="count"></slot>
        </template>
        <!--                底部-->
        <template #footer>
          <slot name="footer"></slot>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script>
  import OrderImg from '@/assets/images/orders/order_img.jpg';
  import {getCurrentPageSpmID} from "@/utils/memory";
export default {
  name: "index",
  props:{
    product:{type:Object,default:()=>{}},
    order:{type:Object,default:()=>{}},//订单
    type:String,//当type=detail，是从详情点击的
    productID:'',//从订单详情中传入的productid
  },
  data(){
    return{
      OrderImg
    }
  },

  methods:{
    checkDetailHandle(){

      if(this.type =='detail'){
        let url = `${this.$config.jianweiDomain}/search?spm=a0001.detail.buyagain.0.${getCurrentPageSpmID()}&productid=${this.productID}`
        window.open(url)
      }else if(this.type=='comment'){
        this.$router.push(`/shoporder/2/detail/${this.order.shoporderid}`)
      }else{
        this.$router.push(`/shoporder/2/detail/${this.order.id}`)
      }

    }
  },
}
</script>

<style scoped lang="less">
/deep/.van-card{
  padding:0 4px 0 0;
  background-color: #fff;
}
/deep/.van-card__thumb{
  width:99px;
  height:99px;
  overflow:hidden;
}
.color_lightBlue{
  color:#87CEFA;
}
.cart-product-item{
  padding:0 10px;
  background-color: #fff;
  .product-info{
    padding:10px 0;
    position: relative;
    .product-img{
      position: relative;
      .product_change{
        position: absolute;
        color:#fcc900;
        bottom:0;
        left:0;
        right:0;
        z-index: 10;
      }
      .tag-icon{
        width:30px;
        height:auto;
        position:absolute;
        top:-1px;
        left:-1px;
        border-radius: 0 0 10px 0;
      }
      img{
        width:95%;
        height:auto;
      }
    }
    .product-name{
      font-size:13px;
      padding-top:2px;
      color:#0D0D0D;
      line-height:1.5;
      margin-bottom: 4px;
      cursor: pointer;
    }
    .product-desc{
      background-color: #eee;
      padding:6px 4px;
      border-radius: 4px;
      font-size:13px;
      color:#8F8E94;
      line-height: 1.5;
      word-wrap: break-word;
      word-break: normal;
      max-height: 32px;
      overflow-y: scroll;
      margin-bottom: 8px;
    }
    .product-price{
      font-size:15px;
      font-weight: bold;
    }
  }
  .price-exchange{
    font-size:12px;
    font-weight: 400;
    color:#FFCC00;
  }
}
/deep/.van-stepper--round .van-stepper__minus{
  color: #fff;
  border:1px solid #EEEEED;
  background-color: #333;
}
/deep/.van-stepper--round .van-stepper__plus{
  color: #fff;
  border:1px solid #EEEEED;
  background-color: rgba(0,0,0,0.2);
}
</style>
