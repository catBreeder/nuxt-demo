<template>
  <div class="product-item"
       v-exp-dot
       :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@1^position@${index}^page@${$route.params.type}^query@{"categoryid":${categoryid?categoryid:null }}`'
       @click="goOtherURLHandle(item,index)">
    <van-row >
      <van-col span="8">
        <div class="product-img">
          <van-tag color="#f00" size="medium"  v-if="isShowTop"  class="tag-img" text-color="#fff"><strong>TOP{{index+1}}</strong></van-tag>
          <i class="icon iconfont icon-new" v-if="item.isnewproduct" />

          <img :src="!item.images?noImage:item.images" >
          <van-tag type="primary" size="medium" class="sea-tag animate__animated animate__fadeInRight" v-if="item.specialgoods===2">Sea Shipping</van-tag>
        </div>
      </van-col>
      <van-col span="16">
        <div class="product-info">
          <div class="product-name">
            {{item.productname}}</div>
          <div class="product-intro" >
            <van-row>
              <van-col span="14">
                <slot name="price"></slot>
              </van-col>
              <van-col span="10">
                <slot name="rank"></slot>
              </van-col>
            </van-row>
          </div>
          <div class="add-btn-area">
            <van-row type="flex" justify="end">
              <van-col span="14" >
                <div class="cart-btn">{{btnText}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  import noImage from '@/assets/images/common/no_image.jpg'
    export default {
        name: "index",
        data(){
          return {
            noImage
          }
        },
        props:{
          item:{type:Object,default:()=>{}},
          index:String | Number,
          categoryid:String | Number,
          isShowTop:{type:Boolean,default:false},
          btnText:{type:String,default:'Add to cart'}
        },
        methods:{
          goOtherURLHandle(item,index){
            this.$emit('goOtherURLEmit',item,index)
          },
        }
    }
</script>

<style scoped lang="less">
  /deep/ .van-swipe{
    border-radius: 10px;
    max-height:360px;
    background-color: #fff;
  }
  /deep/.van-swipe-item{
    max-height:360px;
    img{
      object-fit: fill;
      width:100%;
      height:100%;
    }
  }
  .product-item{
    padding:10px 8px;
    border-bottom:1px solid #EEEEED;
  }
  .product-img{
    position: relative;
    .tag-img{
      position: absolute;

      border-radius: 0  0 15px 0;
    }
    .icon-new{
      position:absolute;
      right:0;
      top:0;
      font-size:15px;
      color:red;
      z-index:1;
    }
    .sea-tag{
      position: absolute;
      bottom:2px;
      right:2px;
    }
    width:100px;
    height:100px;
    border-radius: 10px;
    img{
      width:100%;
      height:100%;
      border-radius: 10px;
    }
  }
  .product-info{

    .product-name{

      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 100%;
      max-height: 40px;
      line-height:1.2;
      font-size: 14px;
      color: #333;
      overflow: hidden;
    }
    .product-intro{
      height:30px;
      line-height: 30px;
      font-size:16px;
      .price-tag{
        color:lightgrey;
        font-size:13px;
        margin-left:5px;
      }
    }
    .add-btn-area{
      padding-top:4px;
      .cart-btn{
        text-align: center;
        border-radius: 4px;
        padding:8px 10px;
        font-size:15px;
        background-color: #fcc900;
        color:#FFF;
      }
    }
  }
</style>
