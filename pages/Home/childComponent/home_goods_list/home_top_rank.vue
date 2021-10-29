<template>
  <div class="s3_home_shoes" v-if="top100Info">
    <div @click="goTopSupplierHandle"
      class="s3_home_shoes_title d_flex d_flex_between">
      <div class="home_index_title">
        {{top100Info.module_title}}
      </div>
      <div  class="home_index_transf" v-if=" top100Info.module_title">
        All <i class="icon iconfont icon-tiaozhuan"></i>
      </div>

    </div>
    <!--        轮播图-->
    <div class="s3_home_shoes_swiper_content">
      <swiper class="home_swiper " :options="top100SwiperOption" v-if="top100Info.list">
        <swiper-slide v-for="(item,index) in top100Info.list" :key="index" >
          <div class="swiper_product_item"
               @click="chooseBrandItem(item)">
            <!--                  图片-->
            <div class="swiper_product_item_img">
              <img :src="item.homeimage" :alt="item.brandname" >
            </div>
            <div class="swiper_product_name van-ellipsis">{{item.brandname}}</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>

export default {
  name: "home_top_rank",
  props:{
    top100Info:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      top100SwiperOption:{
        slidesPerView: 4,  //一行显示3个
        spaceBetween: 12,  //间隔30
        speed: 5000,   //滑动速度
        pagination:'.swiper-pagination',
      },
    }
  },
  methods:{
    chooseBrandItem(item){
      if(window.localStorage.getItem('changeTab')=='brand'){
        this.$router.push({
          path:'/supplier/store/index',
          query:{productid:item.homeproductid,categoryID:0,sellerID:item.id}
        })
      }else{
        this.$router.push({
          path:'/supplier/product/index',
          query:{productid:item.homeproductid,categoryID:0,sellerID:item.id}
        })
      }
    },
    goTopSupplierHandle(){
      if(window.localStorage.getItem('changeTab')=='brand'){
        this.$router.push('/supplier/store/index')
      }else{
        this.$router.push('/supplier/product/index')
      }
    },
  },

}
</script>

<style scoped lang="less">
/deep/.swiper-wrapper{
  height:114px;
}
//shoes
.s3_home_shoes{
  &_title{
    padding:14px 6px;
    &_left{
      font-size: 0.53333rem;
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
//-----------home页索引主标题
.home_index_title{
  font-size:20px;
  font-weight: bold;
  color:#2A2A2A;
}
//-----------home页转到全部
.home_index_transf{
  height:20px;
  font-size:16px;
  color:gray;
  .icon-tiaozhuan{
    font-size:16px;

  }
}
.s3_home_shoes_swiper_content{
  .home_swiper{
    .swiper_product_item{
      font-size:0;
      border-radius: 4px;
      .swiper_product_img{
        height:179px;
        border:1px solid #EEEEED;
        border-bottom:none;
        img{
          height:100%;
          width:100%
        }
      }
      .swiper_product_info{
        background-color: #fff;
        font-size:14px;
        padding:12px 4px;
        &_title{
          height:38px;
          font-size:15px;
          font-weight: bold;
          color:#2A2A2A;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        &_price{
          padding:12px 4px ;
          font-size:18px;
          color:#f00;
          font-weight: bold;
        }
        &_btn{
          text-align:center;
          .van-button{
            background-color: #fcc900;
          }
        }
      }
      .swiper_product_item_img{
        height:80px;
        img{
          width:100%;
          height:100%;
        }
      }
      .swiper_product_name{
        font-size:10px;
        height:14px;
        border-top:1px solid #EEEEED;
        background-color: #fff;
        text-align: center;
        padding:4px 0;
        font-weight: 500;
      }
    }
  }
}
.swiper-pagination {
  position: relative;
  width: 90%;
  left: 5%;
  bottom:0;
}
.swiper-pagination-bullet{
  margin-right: 8px;
}
/deep/ .swiper-pagination-bullet-active{
  background-color: #fcc900;
}
</style>
