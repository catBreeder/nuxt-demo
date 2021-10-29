<template>
  <div class="s3_home_shoes">
    <div
      @click="goTopRankHandle" class="s3_home_shoes_title d_flex d_flex_between">
      <div class="home_index_title van-ellipsis" v-if="itemInfo && itemInfo.title">
        {{itemInfo.title}}
      </div>
      <div class="home_index_transf"  v-if="isShowAll">
        All <i class="icon iconfont icon-tiaozhuan"></i>
      </div>
    </div>
    <!--        轮播图-->
    <div class="s3_home_shoes_swiper_content">
      <swiper :style="{height:isLoginOut?'400':'350px'}" :options="showSwiperOption" v-if="itemInfo && itemInfo.list.length>0">
        <swiper-slide v-for="(item,index) in itemInfo.list" :key="index">
          <common-product-detail
            :isShowLike="false"
            :isShowStart="false"
            :isShowShare="false"
            v-exp-dot
            :data-info="`productid@${item.platformproductid}^action@homecategory^page@index^categoryid@${itemInfo.category}^position@${index}`"
            :item="item" :index="index"
                                 @shareProductEmit="shareProductHandle"
                                 :category="itemInfo.category" :isIndexPage="true">
            <div class="product-price" slot="price">
              <div class="price-normal">{{item.price /100 | moneyFormat}}</div>
            </div>

          </common-product-detail>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" />
      </swiper>
    </div>
  </div>
</template>

<script>
import { clickPointFun } from '@/utils';
import CommonProductDetail from '@/components/common/CommonProductDetail'
import {getCurrentPageSpmID,getUserID} from "@/utils/memory";
export default {
  name: "home_goods_model",
  components:{CommonProductDetail},
  props:{
    //传入的model内容{title:'',list:[],category:'',id:';}
    itemInfo:{
      type:Object,
      default:()=>{}
    },
    index:Number,
    isShowAll:{
      type:Boolean,
      default:true
    },
    isLinkProp:{
      type:Boolean,
      default:true
    }
  },
  data(){
    return{
      showSwiperOption:{
        slidesPerView: 2,  //一行显示2个
        spaceBetween: 10,  //间隔30
        speed: 1000,   //滑动速度
        pagination:'.swiper-pagination',

      }
    }
  },
  computed:{
    isLoginOut(){return !getUserID()}
  },
  methods:{
    goTopRankHandle(){
        if(this.isLinkProp){
          clickPointFun({
            p:'首页',
            spam:`a0001.index.category-all.${this.index}.${getCurrentPageSpmID()}`
          })
          this.$router.push({
            path:`/shoppingmall/categoryproduct`,
            query:{
              categoryID:this.itemInfo.category,
              operate:'homeModel',
              name:this.itemInfo.title,
              index:this.index
            }
          })
        }
    },
    shareProductHandle(item){
      this.$emit('shareProductEmit',item)
    },
  },


}
</script>

<style scoped lang="less">

.s3_home_shoes{
  //padding:15px 0;
  &_title{
    padding:14px 6px;
    &_left{
      font-size: 15px;
      font-weight: bold;
      color: #222;
    }
  }
  .s3_home_shoes_swiper_content{
    .s3_home_shoes_swiper{
      &_list{
        &_item{
          flex:1
        }
      }
    }
  }
}
/* /deep/.swiper-wrapper{*/
/*  height:380px !important;*/
/*}*/
.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets{
  bottom:-2px;
}

//-----------home页索引主标题
.home_index_title{
  font-size:18px;
  flex:1;
  font-weight: bold;
  color:#2a2a2a;
}
//-----------home页转到全部
.home_index_transf{
  height:20px;
  width:80px;
  text-align: right;
  font-size:16px;
  color:gray;
  .icon-tiaozhuan{
    font-size:16px;

  }
}

</style>
