<template>
  <div class="s3-home-rank-model-wrapper">
    <van-sticky>
      <van-nav-bar
        style="background-color: #fcc900"
        :title="dynamicTitle"
        @click-left="goBackHandle"
        @click-right="changeContentHandle"
      >
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989" slot="left" />
        </template>
        <template #right>
          <i class="icon iconfont icon-zhuanhuan1 color_normal"></i>
        </template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view @reachBottom="goBottomHandle" class="scrollCommonHeightView">
      <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
      <template v-else>
        <div v-if="brandList.length">
          <div class="s3_top100_banner" @click="goBannerOtherURL">
            <img height="56" src="~assets/images/top100/banner_from_home.png" alt="">
          </div>
          <div class="s3-top100-box"></div>
          <div class="s3-top-bank-brand-wrapper ">
            <div class="s3-top-bank-brand-content ">
              <div class="s3-top-bank-brand-list">
                <div class="g_mb_l" v-for="(item,index) in brandList" :key="index" >
                  <div class="inner-banner">
                    <div class="row">
                      <div class="banner-lg" @click="checkSupplierStoreHandle(item.id,item.homeproductid)">
                        <img  :src="item.homeimage?item.homeimage:wrongImg" />
                      </div>
                    </div>
                    <div class="row">
                      <div class="banner-lg" @click="checkSupplierStoreHandle(item.id,item.topproductid1)">
                        <img :src="item.topproductimage1?item.topproductimage1:wrongImg" alt="">
                      </div>
                      <div class="banner-lg" @click="checkSupplierStoreHandle(item.id,item.topproductid2)">
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
                      <van-tag plain type="primary" size="large" round color="#fcc900" @click="checkSupplierStoreHandle(item.id,0)">VISIT Store</van-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list_bottom" v-show="brandList.length>3">
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </div>
        <common-empty v-else/>
      </template>
    </scroll-view>

  </div>


</template>

<script>
  import { top100SupplierApi } from '@/api/top100';
  import wrongImg from '@/assets/images/wrong.png'
  import ScrollView from "@/components/common/ScrollView";
  import CommonEmpty from '@/components/common/CommonEmpty'
  import {getDynamicTitleApi} from '@/api/common'
  export default {
    head(){
      return {
        title:'Top 100 Suppliers - shopshipshake'
      }
    },
    name: "index",
    components:{ ScrollView ,CommonEmpty},
    props:['sellerID'],
    data(){
      return{
        brandPage:1,
        brandList:[],
        loading:false,
        wrongImg,
        isLoading:false,
        status:1,
        pageCount:0,
        dynamicTitle:''
      }
    },
    methods:{
      goBackHandle(){
        this.$router.replace('/')
      },
      changeContentHandle(){
        this.$router.replace({
          name:'supplierProductIndex',
          query:{productid:this.$route.query.productid,categoryID:0,sellerID:this.$route.query.sellerID}
        })
        localStorage.setItem('changeTab','product')
      },
      checkSupplierStoreHandle(storeID,goodID){
        this.$router.push(`/supplier/store/${storeID}/${goodID}`)
      },
      getBrandList(){
        this.isLoading = true;
        top100SupplierApi({page:this.brandPage,sellerid:this.$route.query.sellerID}).then(res=>{
          if(res.pageInfo.list.length){
            res.pageInfo.list.map(item=>{
              item.tagList = item.tags.split(',')
            })
          }
          this.brandList = res.pageInfo.list;
          this.pageCount = res.pageInfo.pageCount;
          this.isLoading = false;
        })
      },
      getDynamicTitleHandle(){
        getDynamicTitleApi('mobile_module_title').then(res=>{
          this.dynamicTitle = res.data;
          let metaList = document.getElementsByTagName("meta");
          document.title =`${res.data} - ShopShipShake`;
          for (let i = 0; i < metaList.length; i++) {
            if (metaList[i].getAttribute("property") == "og:title") {
              metaList[i].content =`${res.data} - ShopShipShake`;
            }
          }
        })
      },
      goBottomHandle(){
        if(this.status == this.$config.loadingType.FINISHED) return;
        if(this.brandPage <= this.pageCount){
          this.brandPage ++;
          top100SupplierApi({page:this.brandPage,sellerid:this.sellerID}).then(res=>{
            if(!res.pageInfo.list || !res.pageInfo.list.length){this.status=this.$config.loadingType.FINISHED};
            if(res.pageInfo.list.length){
              res.pageInfo.list.map(item=>{
                item.tagList = item.tags.split(',')
              })
            }
            this.brandList = [...this.brandList,...res.pageInfo.list];
          })
        }

      },

      goBannerOtherURL(){
        window.location.href="https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/"
      }
    },
    mounted() {
      this.getDynamicTitleHandle()
      this.getBrandList();
    }
  }
</script>

<style scoped lang="less">
  .list_bottom{
    padding: 0 0 15px;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
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
  .s3-top-bank-brand-wrapper{
    font-size:0;
    .s3-top-bank-brand-content{
      padding: 10px 0 0 ;
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
</style>
