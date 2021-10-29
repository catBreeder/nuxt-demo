<template>
  <div class="s3-shop-store-wrapper">
<!--    头部开始-->
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle" border>
      <template #left>
        <van-icon name="arrow-left" size="24" color="#8B8989" slot="left" />
      </template>
      <template #title>
        <div class="navbar-title d_flex">
          <van-icon name="shop-o" color="#fcc900" size="24"/>
          <strong class="g_ml_m">Big Tree Shoes</strong>
        </div>
      </template>
    </van-nav-bar>
    </van-sticky>
<!--    头部结束-->
<!--    列表开始-->

    <scroll-view class="scrollHeight" @reachBottom="loadMoreHandle" >
      <van-loading v-if="loading" vertical type="spinner" color="#fcc900" class="loading-tag">in Loading</van-loading>
      <div class="s3-shop-store-product-list" v-else>
        <template v-if="productList.length">
          <van-row gutter="6">
            <van-col span="12" v-for="(item,index) in productList" :key="index">
              <common-product-detail
                :isShowLike="false"
                :isShowOperate="false"
                @goDetailEmit="goOtherURLHandle"
                v-exp-dot
                :data-info="`productid@${item.id}^action@bigtree^totalcount@${pageCount}^position@${index}^page@keysearch`"
                :item="item" :index="index">
                <div slot="price" class="d_flex d_flex_between">
                  <p class="price-normal">
                    <template v-if="item.price">
                      {{item.price / 100 | moneyFormat}}
                    </template>
                    <template v-else>
                      {{item.finalprice / 100 | moneyFormat}}
                    </template>
                    <del class="discount_price" v-if="item.oprice>0"> R{{item.oprice}}</del>
                  </p>

                </div>
              </common-product-detail>
            </van-col>
          </van-row>
          <div class="list_bottom" v-show="productList.length>8">
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </template>
        <template v-else>
          <van-empty
                     class="custom-image"
                     image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                     description="No data at present......"
          />
        </template>
      </div>
    </scroll-view>

<!--    列表结束-->
  </div>
</template>

<script>
import ScrollView from "@/components/common/ScrollView";
import ProductListItem from '@/components/content/product_list_item';
import CommonProductDetail from '@/components/common/CommonProductDetail'
import { keysearchlistBigtreeApi } from '@/api/home'
import { gTagFun } from '@/utils/buryPoint/gTag'
import JsCookie from 'js-cookie'
import {setRefer,setRefSpm,setCurrentPage} from '@/utils/memory'
import {keywordOption} from '@/utils'
import {spmLogApi} from '@/api/common';
export default {
  head(){
    return {
      title:'Search Result - shopshipshake'
    }
  },
  name: "index",
  components:{ScrollView,ProductListItem,CommonProductDetail},
  data(){
    return{
      productList:[],
      page:1,
      loading:false,
      finished:false,
      refreshing:false,
      isWaiting:false,
      pageCount:1,
      status:1,
    }
  },

  methods:{
    goOtherURLHandle(item,index){
      //谷歌埋点
      gTagFun('商城品类名','商品详情','产品列表页面')
      window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.top100product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`,'online')
    },
    goBackHandle(){
      this.$router.back()
    },
    loadMoreHandle(){
      if(this.page <= this.pageCount){
        if(this.status==this.$config.loadingType.FINISHED) return;
        this.page++;
        keysearchlistBigtreeApi(this.page).then(res=>{
          if(!res.productlist || res.productlist.length==0){console.log('no');this.status=this.$config.loadingType.FINISHED}
          this.productList = [...this.productList,...res.productlist];
        })
      }

    },
    getProductList(){
      this.loading = true;
      keysearchlistBigtreeApi(this.page).then(res=>{
        this.productList = res.productlist;
        this.pageCount = res.pageCount;
        this.loading = false;
      })
    }
  },
  beforeRouteEnter(to,from,next){
    if(from.path!='/'){
      setRefer(config.jianweiDomain +from.path)
    }
    if(to.query.spm){
      setRefSpm(to.query.spm);
    }
    setCurrentPage(to.name)
    let option =keywordOption({
      p:'Big Tree',
      spm:`a0001.p0001.searchkey.0.-1`
    })
    spmLogApi(option).then(res=>{
      JsCookie.set('currentPageSpmValue',res.spmid)
    })
  },
  mounted() {
    this.getProductList();
  }
}
</script>

<style scoped lang="less">
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  .s3-shop-store-wrapper{
      position: fixed;
      width:100%;
      height:100%;
      background:#eee;
      background-size:100% 100%;
    .s3-shop-store-product-list{
       padding:10px 0;
    }

  }
.scrollHeight{
  height:calc(100vh - 50px)
}
</style>
