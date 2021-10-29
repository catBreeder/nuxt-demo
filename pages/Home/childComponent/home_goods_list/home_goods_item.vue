<template>
  <div class="band-item" @click="goDetailHandle" v-if="itemInfo"
       v-exp-dot
       :data-info="`productid@${itemInfo && itemInfo.platformproductid}^action@homecategory^page@index^categoryid@${category}^position@${index}`">
    <div class="inner-container">
      <div class="brand-item-inner">
        <div class="brand-img-box">
          <img :src="itemInfo.images" class="brand-img" >
        </div>
        <div class="item-info-inner">
          <span>{{itemInfo.nameen}}</span>
        </div>
        <div class="info-price">
          <div class="price">{{ itemInfo.finalprice /100 | moneyFormat}}</div>
          <div></div>
        </div>
        <div class="item-btn">
          <div class="item-share-btn"
               @click.stop="shareProductHandle">
            <i class="icon iconfont icon-fenxiang"></i>
            <span> SHARE NOW</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {clickPointFun} from '@/utils';
  import {getCurrentPageSpmID} from "../../../../utils/memory";
export default {
  name: "home_goods_item",
  props:{
    itemInfo:{
      type:Object,
      default:()=>{}
    },
    index:Number,
    category:Number | String
  },
  methods:{
    //分享操作
    shareProductHandle(){
      this.$emit('shareProductEvent',this.itemInfo)
    },
    goDetailHandle(){
      clickPointFun({p:'首页', spm:`a0001.index.${this.category}.${this.index}.${getCurrentPageSpmID()}`});
      let url =`${this.$config.jianweiDomain}/search?productid=${this.itemInfo.platformproductid}&categoryid=${this.category}&spm=a0001.index.${this.category}.${this.index}`
      window.open(url,'online')
    }

  },
}
</script>

<style scoped lang="less">
.item-share-btn{
  width:65%;
  font-size:11px;
  height:30px;
  line-height:30px;
  text-align: center;
  background:#fcc900;
  color:#333;
  border-radius: 4px;
}
.band-item {
  //padding: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  .inner-container {
    width: 183px;
    position: relative;
    .brand-item-inner {
      height: 315px;
      overflow: hidden;
      background: #fff;
      position: relative;
      .brand-img-box {
        position: relative;
        width: 100%;
        height: 179px;
        box-sizing: border-box;
        .brand-img {
          display: block;
          width:100%;
          height: 179px;

        }
      }
      .item-info-inner{
        border: 0px solid black;
        position: relative;
        box-sizing: border-box;
        display: flex;
        -webkit-box-orient: vertical;
        flex-direction: column;
        align-content: flex-start;
        flex-shrink: 0;
        padding: 8px 4px 0;
        span{
          white-space: pre-wrap;
          border: 0 solid black;
          position: relative;
          box-sizing: border-box;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          flex-direction: column;
          align-content: flex-start;
          flex-shrink: 0;
          font-size: 13px;
          text-align: left;
          line-height: 19.872px;
          height: 39.744px;
          margin-top: 2.208px;
          margin-bottom: 2.208px;
          color: rgb(62, 62, 62);
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .info-price{
        border: 0 solid black;
        position: relative;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        -webkit-box-orient: horizontal;
        flex-direction: row;
        align-content: flex-start;
        flex-shrink: 0;
        margin:6px 0;
        -webkit-box-align: center;
        align-items: center;
        height: 33.12px;
        width:96%;
        .price{
          white-space: pre-wrap;
          border: 0px solid black;
          position: relative;
          box-sizing: border-box;
          display: block;
          -webkit-box-orient: vertical;
          flex-direction: column;
          align-content: flex-start;
          flex-shrink: 0;
          font-size: 17.664px;
          text-align: left;
          font-weight: 600;
          color: rgb(255, 0, 0);
          line-height: 30.912px;
          margin-left: 4px;
        }
      }
      .item-btn{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
.icon-fenxiang{
  font-size:10px;
}
</style>
