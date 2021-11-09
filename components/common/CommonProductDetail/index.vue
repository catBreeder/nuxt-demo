<template>
    <div class="common-product-detail-box" style="margin-bottom:12px;"  @click="goDetailHandle">
      <div class="common-product-detail-inner" >
        <div class="product-item-inner" :style="{height:isLoginOut?'377px':'337px'}">
          <div class="product-img-box">
            <img src="~assets/images/top100/tag.png" v-if="item.type==1"
                 alt="" class="supplier-img" @click.stop="goSupplierHandle">
            <img :src="item.images.split(',')[0]" class="product-img" >
            <div class="tag_new"><slot name="new"></slot></div>
            <van-tag type="warning" size="medium" v-if="item.specialgoods==2" class="sea-tag animate__animated animate__fadeInRight"
                    >Sea Shipping</van-tag>
            <van-tag color="#FFFBE7"
                     text-color="orange"
                     size="large"
                     v-if="isShowWeight"
                     class="weight-tag animate__animated animate__fadeInRight" >
              {{item.weightinfo}}
            </van-tag>
          </div>
          <div class="product-name-box" v-if="item.nameen">
              {{item.nameen}}
          </div>
          <div class="product-price-box d_flex_between d_flex">
            <div><slot name="price"></slot></div>
            <p class="d_flex d_flex_center">
              <van-icon :name="item.like?'like':'like-o'"
                        :color="item.like?'#f00':''"
                        @click.stop="collectProductHandle"
                        :class="{'animate__animated':isHeart,'animate__heartBeat':isHeart,'animate__bounce':isHeart}"
                        v-if="isShowLike"
                        size="20"
                        class="color_intro good_like "/>
            </p>
          </div>

          <van-notice-bar v-if="isLoginOut"
            :scrollable="false"
            text="Wholesale price   ???"
          />
          <div class="product-operate-box" v-if="isShowOperate">
            <template v-if="isIndexPage">
              <div class="d_flex d_flex_center">
                <div class="item-share-btn"
                     @click.stop="shareProductHandle(item)">
                  <i class="icon iconfont icon-fenxiang"></i>
                  <span> SHARE NOW</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="d_flex d_flex_between product-operate-box_inner">
                <div class="p_start d_flex" >
                  <div v-if="isShowStart && item.platformstarlevel>0">
                    <van-rate v-model="startCount" color="#ffd21e" :count="1" size="14"/>
                    <span class="g_mr-s ">&nbsp;{{item.platformstarlevel /10 }}&nbsp;</span>
                  </div>

                </div>
                <div class="share-btn"
                     :style="{fontSize:shareSize+'px'}"
                     @click.stop="shareProductHandle" v-if="isShowShare" >
                  <span>{{shareText}}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getUserID,getCurrentPageSpmID} from "@/utils/memory";
    import {clickPointFun} from '@/utils';
    import {collectGoodsApi} from '@/api/home'

    export default {
        name: "index",
        data(){
          return{
            isHeart:false,
            startCount:1,
          }
        },
        props:{
          item:{type:Object,default:()=>{}},
          index:String | Number,
          category:Number | String,
          isIndexPage:{type:Boolean,default:false},//判断是不是首页，首页底部只有一个分享
          isShowLike:{type:Boolean,default:true},//是否显示收藏
          isShowStart:{type:Boolean,default:true},//是否显示评价
          isShowShare:{type:Boolean,default:true},//是否显示分享按钮
          isShowOperate:{type:Boolean,default:true},//是否显示分享按钮
          isShowWeight:{type:Boolean,default:false},//是否显示重量
          shareText:{type:String,default:'Share Now'},
          shareSize:{type:Number,default:14}
        },
        computed:{
            isLoginOut(){return !getUserID()}
        },
        methods:{
          goSupplierHandle(){
            window.open('https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/')
          },
          shareProductHandle(){
            this.$emit('shareProductEmit',this.item)
          },
          goDetailHandle(){
            if(this.$route.path=='/shoppingmall/index'){
              clickPointFun({p:'首页', spm:`a0001.index.${this.category}.${this.index}.${getCurrentPageSpmID()}`});
              let url =`${this.$config.jianweiDomain}/search?productid=${this.item.platformproductid}&categoryid=${this.category}&spm=a0001.index.${this.category}.${this.index}.${getCurrentPageSpmID()}`
              window.open(url)
            }else{
              this.$emit('goDetailEmit',this.item,this.index)
            }

          },
          //收藏商品
          collectProductHandle(){
            if(!this.isLoginOut){
              /*神策埋点*/
              this.item.like=this.item.like==1?0:1;
              this.isHeart =this.item.like==1;
              collectGoodsApi(this.item.platformproductid).then(res=>{
                this.$toast({message:this.item.like?'Collection succeeded !':'Cancel collection successfully !'})
              })
            }else{
              this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
            }
          }
        }
    }
</script>

<style scoped lang="less">
.common-product-detail-box{
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  /deep/.van-notice-bar{
    height:40PX;
  }
  .common-product-detail-inner {
    width: 183px;
    position: relative;
    .product-item-inner {
      overflow: hidden;
      background: #fff;
      position: relative;
      .product-img-box {
        position: relative;
        width: 100%;
        height: 189PX;
        box-sizing: border-box;
        .product-img {
          display: block;
          width:100%;
          height: 189PX;

        }
        .supplier-img{
          position: absolute;
          top:-2px;
          left:0;
          width:40px;
          height:40px;
          border-radius: 0  0 8px 0;
          box-shadow:2px 2px 4px gray;
        }
        .tag_new{
          position:absolute;
          right:0;
          top:0;
          font-size:15px;
          color:red;
          z-index:1;
          box-shadow:2px 2px 4px gray;
        }
        .sea-tag{
          position: absolute;
          bottom:0;
          right:1px;
        }
        .weight-tag{
          position:absolute;
          bottom:0;
          padding:6px;
          font-size:16px;
          right:0;
          left:0;
        }
      }
      .product-name-box{
        padding: 4PX 6PX;
        width: 93%;
        height: 44PX;
        line-height:1.6;
        font-size: 14PX;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .product-price-box{
        height:44PX;
        line-height:44PX;
        padding:0 6PX;
      }
      .product-operate-box{
        /*padding: 8px 4px 10px;*/
        /*padding:8px 6px 10px;*/
        height:44PX;
        line-height: 44PX;
        padding: 6PX;
        box-sizing: border-box;
        .product-operate-box_inner{
          height:25px;
          line-height:25px;
        }
      }
    }
  }
}
  /deep/.van-notice-bar{
    font-size:16px;
    color:orangered;
    text-shadow: 0 0 1px #f7a54a,0 0 1px #fcc900;

  }

.icon-fenxiang{
  font-size:10px;
}
.item-share-btn{
  width:65%;
  font-size:11px;
  height:30px;
  line-height:30px;
  text-align: center;
  background:#FCC900;
  color:#333;
  border-radius: 4px;
}
.share-btn{
  height:22px;
  line-height:22px;
  padding:2px 10px;
  background:#FCC900;
  border-radius: 4px;
}
</style>
