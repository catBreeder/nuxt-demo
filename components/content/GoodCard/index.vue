<template>
  <div class="cart-product-item">
    <div class="product-info" v-if="product" @click="goDetailHandle">
      <van-card
        currency="R "
        :title="product.productnameen"
        :thumb="product.images">
        <template #tag>
          <slot name="tag"></slot>
        </template>
        <!--                描述-->
        <template #desc>
          <div class="product-desc" :class="{'g_mb_m':isMargin}">{{product.model}}</div>
        </template>
        <!--                价格-->
        <template #origin-price>
          <span v-if="product.priceoldzar > 0" class="discount-price">{{product.priceoldzar |moneyFormat }}</span>
        </template>
        <template #price>
          <slot name="price"></slot>
        </template>
        <!--        标签-->
        <template #tags>
          <div class="product-tags">
            <slot name="tags"></slot>
          </div>
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
  export default {
    name: "GoodItem",
    props:{
      product:{type:Object,default:()=>{}},
      order:{type:Object,default:()=>{}},
      isShowTop:{type:Boolean,default:false},
      isMargin:{type:Boolean,default:false},
      lineType:String,
    },
    data(){
      return{
        itemRadio:0,
        count:1,
      }
    },
    methods:{
      goDetailHandle(){
        let URL=''
        switch (this.lineType) {
          case 'cart':
            URL = `${this.$config.jianweiDomain}/shoporder/2/detail/${ this.order.id}`
            break;
          case 'checkout':
            URL = `${this.$config.jianweiDomain}/shoporder/2/detail/${ this.product.shoporderid}`
            break;
          case "toPay":
            URL = `${this.$config.jianweiDomain}/shoporder/2/detail/${ this.order.id}`
            break;
          case 'error':
            URL = `${this.$config.jianweiDomain}/shoporder/2/detail/${ this.product.shoporderid}`
            break;

        }
        window.open(URL)

      }
    },
    mounted() {
      console.log(this.product)
    }

  }
</script>

<style scoped lang="less">
  /deep/.van-card__thumb img{
    border-radius: 0 0 10px 0 ;
  }
  .cart-product-item{
    padding:0 10px;
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
        font-size:15px;
        line-height:1.5;
      }
      .product-desc{
        background-color: #eee;
        padding:4px 6px;
        border-radius: 4px;
        font-size:13px;
        margin:4px 0 8px;
        font-weight: 400;
        word-wrap: break-word;
        word-break: normal;
        max-height: 28px;
        overflow-y: scroll;
        color:#8F8E94FF
      }
      .product-price{
        font-size:15px;
        .discount-price{
          color:gray;
          font-weight: 400;
          text-decoration:line-through;
          font-size:13px;
        }
      }

    }
  }
  /deep/.van-stepper--round .van-stepper__minus{
    color: #fff;
    border:1px solid #EEEEED;
    background-color: rgba(0,0,0,0.2) !important;
  }
  /deep/.van-stepper--round .van-stepper__plus{
    color: #fff;
    border:1px solid #EEEEED;
    background-color: rgba(0,0,0,0.2) !important;
  }
  /deep/.van-card__footer{
    margin-top: 8px;
  }
</style>
