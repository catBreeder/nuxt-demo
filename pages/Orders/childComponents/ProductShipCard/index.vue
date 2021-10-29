<template>
  <div class="cart-product-item">
    <div class="product-info">
      <van-card v-if="product">
        <!--                图片-->
        <template #thumb>
          <div class="product-img">
            <img  :src="product.images?product.images:OrderImg" :alt="product.productnameen" style="border-radius: 0">
          </div>
        </template>
        <!--                标题-->
        <template #title>
          <div class="product-name van-multi-ellipsis--l2"
               @click="checkDetailHandle">{{product.productnameen}}</div>
        </template>
        <!--                描述-->
        <template #desc>
          <div class="product-desc">
            <span v-if="order.ordertype== 10" class="g_mr-s color_lightBlue">Transfer number: {{order.waybillno}}</span>
            {{product.model}}
          </div>
        </template>
        <!--                价格-->
        <template #price>
          <div class="product-price">
            {{product.productcostzar |moneyFormat}}
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
        this.$router.push(`/shoporder/2/detail/${this.order.id}`)
      }
    }
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
        .tag-icon{
          width:30px;
          height:auto;
          position:absolute;
          top:-1px;
          left:-1px;
          border-radius: 0 0 10px 0;
        }
        img{
          width:100%;
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
        padding:4px 6px;
        border-radius: 10px;
        font-size:14px;
        color:#8F8E94;
        word-wrap: break-word;
        word-break: normal;
        max-height: 32px;
        overflow-y: scroll;
        margin-bottom: 8px;
      }
      .product-price{
        font-size:16px;
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
