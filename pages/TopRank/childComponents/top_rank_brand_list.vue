<template>
  <scroll-view @reachBottom="goBottomHandle" class="rankBankScroll">
    <div class="s3_top100_banner" @click="goBannerOtherURL">
      <img height="56" src="~assets/images/top100/banner_from_home.png" alt="">
    </div>
    <div class="s3-top100-box"></div>
    <div class="s3-top-bank-brand-wrapper ">
      <!--    banner -->
      <div class="s3-top-bank-brand-content ">
        <div class="s3-top-bank-brand-list">
          <div class="g_mb_l" v-for="(item,index) in brandList" :key="index" @click="goOtherURL(item)">
            <div class="inner-banner">
              <div class="row">
                <div class="banner-lg" @click="homePageURL(item)">
                  <img  :src="item.homeimage?item.homeimage:wrongImg" />
                </div>
              </div>
              <div class="row">
                <div class="banner-lg" @click="rightTopURL(item)">
                  <img :src="item.topproductimage1?item.topproductimage1:wrongImg" alt="">
                </div>
                <div class="banner-lg" @click="rightBottomURL(item)">
                  <img :src="item.topproductimage2?item.topproductimage2:wrongImg" alt="">
                </div>
              </div>
            </div>
            <div class="brand_info">
              <div class="brand-info-brand">{{item.brandname}}</div>
              <div class="brand-info-store d_flex d_flex_between">
                <div>
                  <van-tag size="medium" color="#fbefe3" text-color="#f4a07b" class="g_mr_l" v-for="(item,index) in item.tagList" :key="index">{{ item }}</van-tag>
                </div>
                <van-tag plain type="primary" size="large" round color="#fcc900">VISIT Store</van-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </scroll-view>

</template>

<script>
import { top100SupplierApi } from '@/api/top100';
import wrongImg from '@/assets/images/wrong.png'
import ScrollView from "@/components/common/ScrollView";
export default {
  name: "top_rank_brand_list",
  components:{ ScrollView },
  props:['sellerID'],
  data(){
    return{
      brandPage:1,
      brandList:[],
      loading:false,
      wrongImg
    }
  },
  methods:{
    homePageURL(item){

      window.open(`${this.$config.jianweiDomain}/supplier/store/${item.id}/${item.homeproductid}`,'online');
    },
    rightTopURL(item){
      window.open(`${this.$config.jianweiDomain}/supplier/store/${item.id}/${item.topproductid1}`,'online');
    },
    rightBottomURL(item){
      window.open(`${this.$config.jianweiDomain}/supplier/store/${item.id}/${item.topproductid2}`,'online');
    },
    getBrandList(){
      top100SupplierApi({page:this.brandPage,sellerid:this.sellerID}).then(res=>{
        if(res.pageInfo.list.length){
          res.pageInfo.list.map(item=>{
            item.tagList = item.tags.split(',')
          })
        }
        this.brandList = res.pageInfo.list;
      })
    },
    goBottomHandle(){
      this.brandPage ++;
      top100SupplierApi({page:this.brandPage,sellerid:this.sellerID}).then(res=>{
        if(res.pageInfo.list.length){
          res.pageInfo.list.map(item=>{
            item.tagList = item.tags.split(',')
          })
        }
        this.brandList = [...this.brandList,...res.pageInfo.list];
        this.loading = false;
      })
    },
    goOtherURL(item){
      window.open(`${this.$config.jianweiDomain}/supplier/store/${item.id}/0`,'online')
    },
    goBannerOtherURL(){
      window.location.href="https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/"
    }
  },
  mounted() {
    this.getBrandList();
  }
}
</script>

<style scoped lang="less">
.inner-banner{
  display: flex;
  flex-wrap:wrap;
  height:61vw;
  overflow:hidden;
  background-color: #EEEEED;
  border:1px solid #EEEEED;
}
.inner-banner .row{
  display: flex;
  flex-wrap: wrap;

}
.inner-banner .row:first-child{
  width:60%;
  border-right:1px solid #fff;
}
.inner-banner .row:nth-child(2){
  width:39%;
  border-bottom:1px solid #fff;
}
.inner-banner .row:first-child .banner-lg{
  height:61.3333vw;
  img{
    height:61.3333vw;
  }
}
.inner-banner .row a{
  display: block;
}
.inner-banner .row img{
  width:100%;
}
.inner-banner .row:nth-child(2) .banner-lg{
  height: 30.6666vw;
}
.s3-top100-box{
  height:80px;
  border-radius:0 0 80px 80px;
  width:100%;
  background-color: #FCC900;
}
.s3_top100_banner{
  font-size:0;
  img{
    width:100%;
    height:100%;
  }
}
/*.scroll_fixed{*/
/*  position:fixed;*/
/*  background:#eee;*/
/*  width:98%;*/
/*  height:98%;*/
/*  background-size:100% 100%;*/
/*}*/
//.index-banner{
//  display: flex;
//  flex-wrap: wrap;
//  height: 224px;
//  overflow: hidden;
//  border-bottom:1px solid #EEEEED;
//
//}
//.row_left{
//  width: 60%;
//}
//.row_right{
//  width:40%;
//}
//.row{
//  display: flex;
//  flex-wrap: wrap;
//
//  img{
//    width:100%;
//  }
//  a{
//    display:block;
//  }
//}
//.row:first-child .banner-lg{
//  height: 224px;
//
//}
//.lg_a{
//  height: 224px;
//  img{
//    width:100%;
//    height: 224px;
//  }
//}
//.row:nth-child(2) .banner-lg{
//  height:121px;
//  img{
//    width:100%;
//    height:100%;
//  }
//}
.s3-top-bank-brand-wrapper{
        font-size:0;
      .s3-top-bank-brand-content{
        padding: 10px 0 ;
        position: relative;
        background:#eee;
        .top-rank-brand-banner{
            width:100%;
            img{
              width:100%;
            }
        }
        .top-rank-brand-banner-bottom{
          height:80px;
          width:100%;
          background-color: #FCC900;
          border-radius: 0 0 80px 80px;
        }
        .s3-top-bank-brand-list{
          padding:10px 8px;
          margin-top: -90px;
          .brand-img-left{
            height:260px;
            img{
              width:100%
            }
          }
          .brand_img_right{
            display: flex;
            flex-direction: column;
            align-items: center;
            div{
              img{
                width:100%;
              }
            }

          }
          .brand_info{
            border-top:1px solid #EEEEED;
            background-color: #fff;
            padding:8px 14px;
            .brand-info-brand{
              font-size:16px;
              font-weight: bold;
              padding-bottom: 10px;
            }

          }
        }

      }

}
/deep/ .van-tag--large{
  font-size:10px;
}
.scroll_fixed{
  position:fixed;
  width:100%;
  height:100%;
  background-size:100% 100%;
}
.rankBankScroll{
  height:calc(100vh - 50px - 48px);
  background-color: #EEEEED;
}
</style>
