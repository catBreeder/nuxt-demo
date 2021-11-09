<template>
  <div class="goods_item" >
    <div class="goods_img loading_bg_120 " >
      <img class="J_dynamic_img fill_img" :src="item.images" alt="" @click.stop="goOtherURLHandle">
      <img src="~assets/images/top100/tag.png" v-if="item.type==1" alt="" class="tag-img" @click.stop="goSupplierHandle">
      <div class="tag_new"><slot name="new"></slot></div>
      <van-tag type="warning" size="medium" class="sea-tag animate__animated animate__fadeInRight" v-if="item.specialgoods==2">Sea Shipping</van-tag>
      <van-tag color="#FFFBE7"
               text-color="orange"
               size="large"
               v-if="isShowWeight"
               class="weight-tag animate__animated animate__fadeInRight" >
        {{item.weightinfo}}
      </van-tag>
    </div>
    <div class="goods_info">
      <div class="name_box" @click.stop="goOtherURLHandle">
        <div class="name_tags">
          <div class="goods_name twoline" >{{item.nameen}}</div>
        </div>
      </div>
      <div class="bot_box d_flex_between d_flex">
        <p class="p_price">
          <template v-if="item.finalprice">
            {{item.finalprice / 100 | moneyFormat}}
          </template>
          <template v-else>
            {{item.price / 100 | moneyFormat}}
          </template>
          <span class="discount_tag" v-if="item.oprice>0"> R{{item.oprice}}</span>
        </p>
        <p class="p_feed">
          <van-icon :name="item.like?'like':'like-o'"
                    :color="item.like?'#f00':''"
                    @click.stop="collectHandle"
                    :class="{'animate__animated':isHeart,'animate__heartBeat':isHeart,'animate__bounce':isHeart}"
                    v-if="islike"
                    size="20"
                    class="color_intro good_like "/>
        </p>
      </div>
      <div class="btn_box d_flex_between d_flex">
        <div class="p_start d_flex" v-if="isStart">
          <template v-if="item.platformstarlevel>0">
            <van-rate v-model="startCount" color="#ffd21e" :count="1" size="14"/>
            <span class="g_mr-s ">&nbsp;{{item.platformstarlevel /10 }}&nbsp;</span>
          </template>
        </div>
        <div class="p_btn">
          <div class="item-share-btn"
               @click.stop="shareProductHandle" v-if="isShare" ><span>Share Now</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top100Img from '@/assets/images/top100/tag.png';
import {collectGoodsApi} from '@/api/home'
import { getUserTicket } from '@/utils/memory'
import {advPageFun} from '@/utils/goPage'
export default {
  name: "product_list-item",
  props:{
    isShowTop100:{
      type:Boolean,
      default:false
    },
    isShowWeight:{
      type:Boolean,
      default:false
    },
    isShare:{
      type:Boolean,
      default:true
    },
    isStart:{
      type:Boolean,
      default:true
    },
    islike:{
      type:Boolean,
      default:true
    },
    //单个详情
    item:{
      type:Object,
      default:()=>{}
    },
    //使用finialPrice还是originalPrice
    isFinialPrice:{type:Boolean,default:false},
    index:Number,
  },
  data(){
    return {
      top100Img,
      startCount:1,
      isHeart:false
    }
  },

  methods:{
    goSupplierHandle(){
      window.open('https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/')
    },
    collectHandle(){
      if(getUserTicket()){
        /*神策埋点*/
        this.item.like=this.item.like==1?0:1;
        this.isHeart =this.item.like==1;
        collectGoodsApi(this.item.platformproductid).then(res=>{
          this.$toast({message:this.item.like?'Collection succeeded !':'Cancel collection successfully !'})
        })
      }else{
        this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
      }

    },
    shareProductHandle(){
      this.$emit('shareProductEvent',this.item)
    },
    goBannerHandle(type){
      advPageFun(type);
    },
    goOtherURLHandle(){
      this.$emit('goOtherURLEmit',this.item,this.index)
    },

  },
}
</script>

<style scoped lang="less">
  /deep/.van-tag{
    border-radius: 0;
  }
.good_like{
  font-size:15px;
}
.intro-content{
  background: #ecf9ff;
  color:#1989fa;
  font-size:12px;
  border-radius: 10px;
  padding:4px 6px;
  position:absolute;
  z-index:10;
  right:4px;
  top:35px;
}
.intro-content:after{
  content:'';position:absolute;
  bottom:100%;right:8px;
  width:0;height:0;
  border-width:8px;
  border-style:solid;
  border-color:transparent;
  border-bottom-width:8px;
  border-bottom-color:#ecf9ff;
  color:#1989fa;}
.icon-haiyunchukouzhengxiang{
  font-size:20px;
  color:#1989fa;
  position:absolute;
  right:10px;
  top:10px;
}
.isScale{
  transform: scale(1.5);
}
.ads-img{
  height:292px;
  img{
    width:100%;
    height:auto;
  }
}
.goods_item{
  overflow: hidden;
  display: block;
  margin-bottom: 8px;
  background: #fff;
  position: relative;
}
.sea-tag{
  position: absolute;
  bottom:2px;
  right:2px;
}
.weight-tag{
  position:absolute;
  bottom:0;
  padding:6px;
  font-size:16px;
  right:0;
  left:0;
}
.goods_item .goods_img{
  position:relative;
  width:100%;
  height:176px;
  overflow:hidden;
}
.goods_item .goods_img .tag-img{
  position: absolute;
  width:40px;
  height:40px;
  border-radius: 0  0 8px 0;
}
.goods_item .goods_img .tag_new{
  position:absolute;
  right:0;
  top:0;
  font-size:15px;
  color:red;
  z-index:1;
}
.loading_bg_120{
  background: #e5e5e5!important
}
.goods_img .J_dynamic_img{
  display: block;
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 100%;
  transform: translateX(-50%);
}
.goods_item .goods_info{
  padding:10px 8px;
}
.goods_item .goods_info .name_box{
  height:40px;
}
.goods_item .goods_info .name_box .name_tags{
  height:40px;
  width: 100%;
  overflow: hidden;
}
.goods_name.twoline{
  height:40px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.goods_item .goods_name{
  width: 100%;
  max-height: 40px;
  line-height:1.5;
  font-size: 14px;
  color: #333;
  overflow: hidden;
}
.bot_box{
  //margin:8px 0;
  height:30px;
  padding:2px 0;
}
.bot_box .p_price{
  font-size: 16px;
  font-weight: bold;
  color: #ff2900;
  line-height: 14px;
}
.bot_box .p_feed{
  max-width: 45%;
  //height: 14px;
  //line-height: 14px;
  //margin-top: 2px;
  padding-right: 5px;
  //font-size: 10px;
  color: #999;
  //overflow: hidden;
}
.btn_box .p_start{
  font-size: 12px;
  font-weight: 400;
  color: #8F8E94FF;
  height: 22px;
  /*line-height: 22px;*/
}
.p_btn {
  font-size:10px;
  .item-share-btn{
    height:22px;
    line-height:22px;
    padding:0 8px;
    background:#FCC900;
    border-radius: 4px;
  }
}
/deep/ .van-button{
  background-color: #fcc900;
  border-color: #fcc900;
  color: #222222;
  font-size:9px;
  height:22px !important;
  line-height: 22px !important;
}
</style>
