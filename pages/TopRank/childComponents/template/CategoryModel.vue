<template>
  <div>
<!--    头部 start-->
    <van-sticky class="bg_white">
      <navbar-from-category :title="title" @clickLeftEvent="goBackHandle" />
      <filter-area
        :categoryNameList="categoryNameList"
        @categorySelectEmit="categorySelectHandle"
        @recommendSelectEmit="recommendSelectHandle"
        @showFilterEmit="showFilterHandle"
      />
    </van-sticky>
    <scroll-view @reachBottom="goBottomHandle" class="categoryScroll">
      <!--            图片区域-->
      <div class="s3_top100_banner g_mt_m"
           v-click-track="{triggerType:'click',fun:'categoryBanner'}"
           @click="goBannerURLHandle">
        <img  :src="imgInfo.image" alt="shopshipshake">
      </div>
      <!--          列表区域-->
      <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
      <template v-else>
        <div v-if="productList.length">
          <van-row gutter="6" class="scrollContent" >
            <van-col span="12" v-for="(item,index) in productList" :key="index">
              <template v-if="index==13 || index==27 || index==41">
                <div class="ads-img" :style="{height:isLoginOut?'377px':'337px'}" style=" margin-bottom: 12px;">
                  <img :src="imgCategory14.image"  alt="shopshipshake"   @click="goBannerHandle(imgCategory14,'source')"  v-if="index==13">
                  <img :src="imgCategory28.image"  alt="shopshipshake"   @click="goBannerHandle(imgCategory28,'weight')"  v-if="index==27">
                  <img :src="imgCategory41.image"  alt="shopshipshake"  @click="goBannerHandle(imgCategory41,'via')" v-if="index==41">
                </div>
              </template>
              <template v-else>
                <common-product-detail
                  @shareProductEmit="shareProductHandle"
                  @goDetailEmit="goDetailHandle"
                  v-exp-dot
                  :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@${ pageCount || null }^
                  position@${index}^page@categorylist^query@{"categoryid":${ categoryFilter >-1 ? categoryFilter: $route.query.categoryID|| null },
                "thirdid":${$route.query.thirdid || null},"sortby":${ recommendFilter || null},
                "minprice":${ minPrice || null},"maxprice":${ maxPrice || null}}`'
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
              </template>

            </van-col>
          </van-row>
          <div class="list_bottom" v-show="productList.length>8">
            <van-loading size="20px" color="#fcc900" v-if="status==1"><span class="font_size_loading"> in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==2"/>
          </div>
        </div>
      </template>

    </scroll-view>
    <van-popup v-model="isFilter" position="right"   :style="{ height: '100%',width:'70%' }" >
          <filter-drawer
                         @doneEmit="doneHandle"
                         />
    </van-popup>
<!--    显示分享狂-->
    <van-share-sheet
      v-model="showShare"
      cancel-text="close"
      :options="shareOptions"
      @select="selectShareHandle"
    >
      <template #title>
        <div class="share-title">
          Share to your friends
          <van-icon name="cross" class="share-close-tag" @click="showShare = false"/>
        </div>
      </template>
      <template #description>
        <div class="share-title-description b_border">
          <div class="g_mb_s"><span class="color_blue">Tip : </span>
            <template v-if="ambassor==1">
              <!--              大使-->
              You can choose download the picture or share the product link by fackbook or whatsapp.
            </template>
            <template v-else>
              Just share pictures and descriptions,your friends won't see the actual price of the goods and shipshopshake's website
            </template>
          </div>
          <div class="share-product-info">
            <div class="share-product-info-img">
              <van-swipe  @change="swiperChangeHandle" height="360px" v-if="shareItem.images && shareItem.images.length">
                <van-swipe-item v-for="(item, index) in shareItem.images" :key="index">
                  <img :src="item" style="border-radius: 10px"/>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div class="share-product-info-img-description">
              <van-divider content-position="left">Commodity Description(you can edit it)</van-divider>
              <van-field
                v-model="productDescription"
                rows="2"
                ref="inputRef"
                @blur="changeDespHandle"
                type="textarea"
                :placeholder="productDescription"
              />
            </div>
          </div>
        </div>
      </template>
    </van-share-sheet>
  </div>
</template>

<script>
  import JsCookie from 'js-cookie'
import ProductListItem from '@/components/content/product_list_item';
import CommonProductDetail from '@/components/common/CommonProductDetail'
import NavbarFromCategory from '../navbar/navbar_from_category';
import {shareInfoApi ,shareInitApi,childCategoryListApi,queryProductsByCategoryApi } from '@/api/home';
import FilterArea from "../FilterArea";
import {commonBannerAdvListApi} from '@/api/common'
import FilterDrawer from "@/components/content/FilterDrawer";
import { gTagFun } from '@/utils/buryPoint/gTag'
import { getUserID } from '@/utils/memory'
import ScrollView from "@/components/common/ScrollView";
import CommonEmpty from '@/components/common/CommonEmpty'
import { trackTagFun } from '@/utils';
import {loginRegisterPageBury} from "@/utils/buryPoint/buryPoint";
const commonList =[{id:0,ename:'All'}]
import {advPageFun} from '@/utils/goPage';
export default {
  name: "CategoryModel",
  components:{CommonProductDetail, NavbarFromCategory ,FilterArea ,FilterDrawer ,ProductListItem,ScrollView ,CommonEmpty},
  props:{
    title:String,
    operateType:String,
    categoryIDProp:String || Number,
    thirdIDProp:String || Number
  },
  computed:{
    isLoginOut(){return !getUserID()}
  },
  data(){
    return{
      isLoading:false,
      recommendFilter:5,
      page:1,
      minPrice:null,
      maxPrice: null,
      pageCount:0,
      categoryNameList:[],
      isFilter:false,
      productList:[],
      categoryFilter:-1,
      shareProductID:null,
      showShare:false,
      shareItem:{},
      productDescription:null,
      shareOptions:[
        { name: 'Download', icon: require('../../../../assets/images/home/download.png') },
        { name: 'Facebook', icon: require('../../../../assets/images/home/facebook.png') },
        { name: 'WhatsApp', icon: require('../../../../assets/images/home/whatsapp.png') },
        // { name: 'Close', icon: require('../../../../assets/images/home/close.png') },
      ],
      imgIndex:0,//轮播图的位置
      shareInfo:{},
      scrollTop:0,
      ambassor:0,//1是大使，0 不是大使
      status:1,
      imgInfo:{
        image:require('../../../../assets/images/advs/season_banner.png'),
        url:''
      },//广告位
      imgCategory14:{
        image:require('../../../../assets/images/advs/source.png'),
        url:''
      },//广告位
      imgCategory28:{
        image:require('../../../../assets/images/advs/weight_ads.png'),
        url:''
      },//广告位
      imgCategory41:{
        image:require('../../../../assets/images/advs/via.png'),
        url:''
      }

    }
  },
  methods:{
    goBannerHandle(item,type){
      if(item.url){
        window.open(item.url,'online')
      }else{
        advPageFun(type)
      }
    },
    goMemberUrlHandle(){
      window.open(`${this.$config.jianweiDomain}/membership/index`,'online')
    },
    goBottomHandle(){
      if(this.status==this.$config.loadingType.FINISHED) return;
      if(this.page >this.pageCount) return;
      this.page ++;
      let option ={};
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice
      }
      switch (this.operateType){
        case 'category':
          option ={
            ...{
              categoryid:this.categoryIDProp,
              thirdid:this.categoryFilter>0?this.categoryFilter:this.thirdIDProp,
            },...common
          }
          queryProductsByCategoryApi(option).then(res=>{
            if(res.shopproductlist.length==0){this.status=this.$config.loadingType.FINISHED}
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item
            })
            this.productList =[...this.productList,...res.shopproductlist];


          })

          break;
        case 'categoryItem':
          option={...{
              categoryid:this.$route.query.firstID,
              thirdid:this.categoryFilter>0?this.categoryFilter:this.$route.query.thirdid,
            },...common}
          queryProductsByCategoryApi(option).then(res=>{
            if(res.shopproductlist.length==0){this.status=2}
            this.pageCount= res.pageCount;
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item
            })
            this.productList = [...this.productList,...res.shopproductlist];
          })
          break;
      }
    },
    changeDespHandle(event){
      this.shareInfo = event;
    },
    //确定分享
    swiperChangeHandle(event){
      this.imgIndex = event;
    },

    trackTagHandle(page,fun,index){
      trackTagFun({page,fun,index})
    },
    selectShareHandle(option){
      const { name }= option;
      let value ={}
      switch (name){
        case 'Download':
          this.trackTagHandle(this.$route.name,'download',this.imgIndex)
          //添加谷歌埋点 -Share Now点击后的弹出框，点击Download按钮
          gTagFun('Share to Download','Share to Download','首页')
          this.downloadHandle();
          break;
        case 'Facebook':
          this.trackTagHandle(this.$route.name,'facebook',this.imgIndex)
          //添加谷歌埋点 --Share Now点击后的弹出框，点击Facebook按钮
          gTagFun('Share to  FB','Share to  FB','首页')

          value =`{"userid":${getUserID()?getUserID():''},"platform":${this.$config.platform.Facebook},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`;
          shareInfoApi(value).then(res=>{
            let url = this.$config.shareURL + res.data.data;
            let producturl =`http://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(producturl,'_blank')
          })
          break;
        case 'WhatsApp':
          this.trackTagHandle(this.$route.name,'whatsapp',this.imgIndex)
          //添加谷歌埋点 -Share Now点击后的弹出框，点击Whatsapp按钮
          gTagFun('Share to Whatsapp','Share to Whatsapp','首页')
          value =`{"platform":${this.$config.platform.WhatsApp},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`   ;
          shareInfoApi(value).then(res=>{
            let producturl = this.$config.shareURL + res.data.data;
            var content = (res.description || "") + "\n"+producturl+"\n";
            location.href="whatsapp://send?text="+ encodeURIComponent(content);
          })
          break;
      }
    },
    shareProductHandle(item){
      this.shareProductID = item.platformproductid;
      this.showShare = true;
      this.shareInitHandle(this.shareProductID);      //获取图片信息
    },
    //图片下载
    downloadHandle(){
      if(!this.shareItem||!this.shareItem.images||!this.shareItem.images[this.imgIndex]){
        return
      }
      if(this.ambassor==1){
        //是大使，全部下载
        for(let i =0;i<this.shareItem.images.length;i++){
          let image = new Image();
          image.setAttribute('crossOrigin','anonymous');
          image.onload = function(){
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image,0,0,image.width,image.height);
            let url = canvas.toDataURL('image/png');
            let a =document.createElement('a');
            let event = new MouseEvent('click');
            a.download = Math.random()*1000+'.jpg'||'photo';
            a.href=url;
            a.dispatchEvent(event)
          }
          image.src=this.shareItem.images[i];
        }
        this.$toast({message: 'Download succeeded....' });
      }else{
        //不是大使，只下载一张
        let image = new Image();
        image.setAttribute('crossOrigin','anonymous');
        let _this=this;
        image.onload = function(){
          let canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image,0,0,image.width,image.height);
          let url = canvas.toDataURL('image/png');
          let a =document.createElement('a');
          let event = new MouseEvent('click');
          a.download = Math.random()*1000+'.jpg'||'photo';
          a.href=url;
          a.dispatchEvent(event)
        }
        image.src=this.shareItem.images[this.imgIndex];
        this.$toast({message: 'Download succeeded....' });
      }
    },
    shareInitHandle(id){
      shareInitApi(id).then(res=>{
        if(res.status==0){
          this.shareItem = res.data;
          this.ambassor = res.data.isambassadorpromotion;
          this.productDescription = this.shareItem.title;
        }else{
          this.$toast({message:'The product have been removed or expired'})
        }

      })
    },
    goDetailHandle(item,index){
      //谷歌埋点
      gTagFun('商城品类名','商品详情','产品列表页面')
      loginRegisterPageBury({
        p:'产品列表页面',
        operate:'click',
        spm:`a0001.category_product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`
      })


      window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.category_product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`,'online')
    },
    goBannerURLHandle(){
      if(!this.imgInfo.url) return;
      window.open(this.imgInfo.url,'online')

    },
    doneHandle(value){
      this.isFilter = false;
      this.minPrice = value.minPrice;
      this.maxPrice  = value.maxPrice;
      this.update()
    },
    categorySelectHandle(value){
      this.categoryFilter= value;
      this.$emit('selectCategoryEmit',value)
      this.update();
    },
    recommendSelectHandle(value){
        this.recommendFilter = value;
        this.update()
    },
    showFilterHandle(){
      this.isFilter = true;
    },
    update(){
      this.page =1;
      this.productList=[];
      this.getProductList();
    },
    goBackHandle(){
      this.$router.go(-1)
    },
    //获取类别列表
    getCategoryNameList(){
      switch (this.operateType){
        case 'category':
          childCategoryListApi(this.$route.query.thirdid).then(res=>{
            res=[...commonList,...res];
            res.map(item=>{
              item.text =item.ename;
              item.value = item.id;
              return item;
            })
            this.categoryNameList = res;
          })
          break;
        case 'categoryItem':
          childCategoryListApi(this.$route.query.categoryID).then(res=>{
            res=[...commonList,...res];
            res.map(item=>{
              item.text =item.ename;
              item.value = item.id;
              return item;
            })
            this.categoryNameList = res;
          })
          break;
      }
    },
    //获取商品列表
    getProductList(){
      this.isLoading = true;
      let newValue =[]
      let option ={};
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice
      }
      switch (this.operateType){
        case 'category':
          option ={
            ...{
              categoryid:this.categoryIDProp,
              thirdid:this.categoryFilter>0?this.categoryFilter:this.thirdIDProp,
            },...common
          }
          queryProductsByCategoryApi(option).then(res=>{
            this.pageCount= res.pageCount;
            newValue= res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              item.isShow = false;
              return item
            });
            this.productList = newValue;
            setTimeout(()=>{
              this.isLoading = false;
            },this.$config.duringWait)
          })
          break;
        case 'categoryItem':
          option={...{
              categoryid:this.$route.query.firstID,
              thirdid:this.categoryFilter>0?this.categoryFilter:this.$route.query.thirdid,
            },...common}
          queryProductsByCategoryApi(option).then(res=>{
            this.pageCount= res.pageCount;
            this.productList = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              item.isShow = false;
              return item
            });
            setTimeout(()=>{
              this.isLoading = false;
            },this.$config.duringWait)
          })
          break;
      }

    },
    //获取banner图片
    getBannerAdv(){
      commonBannerAdvListApi('MOBILE_CATEGORY').then(res=>{
        if(res){
          const {image,url} = res[0];
          this.imgInfo = {image,url}
        }
      })
      let code = `MOBILE_CATEGORY_PRODUCT_14,MOBILE_CATEGORY_PRODUCT_28,MOBILE_CATEGORY_PRODUCT_42`
      commonBannerAdvListApi(code).then(res=>{
        if(res){
          let img14 = res.find(item=>item.code=='MOBILE_CATEGORY_PRODUCT_14');
          this.imgCategory14 = {image:img14.image,url:img14.url}
          let img28 = res.find(item=>item.code=='MOBILE_CATEGORY_PRODUCT_28');
          this.imgCategory28 = {image:img28.image,url:img28.url}
          let img41 = res.find(item=>item.code=='MOBILE_CATEGORY_PRODUCT_42');
          this.imgCategory41 = {image:img41.image,url:img41.url}
        }

      })
    },
    // /*seo优化*/
    // optimizeHandle(id){
    //   commonCategorySEOApi(id).then(res=>{
    //     // console.log(res);
    //     optimizeUtils(res);
    //   })
    // }
  },
  mounted() {
    this.getBannerAdv();
    this.getProductList()
    this.getCategoryNameList();

  },
  created(){
    // this.optimizeHandle(this.$route.query.thirdid)
  }
}
</script>

<style scoped lang="less">
  .ads-img{

    overflow:hidden;

    img{
      width:100%;
      height:100%

    }
  }
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
.categoryScroll{
  height:calc(100vh - 100PX - 41PX);
  background-color: #EEEEED;
}

.s3_top100_banner{
  text-align: center;
  margin-bottom: 6px;
  img{
    height:auto;
    width:100%;
  }
}
.share-title{
  position:relative;
  .share-close-tag{
    position:absolute;
    right:10px ;
    font-size:20px;
    color:gray;
  }
}
.show-owner-container{
  .show-owner-container-title{
    font-size:15px;
    font-weight: 500;
    padding:20px 10px 6px;
    color:#4C4C4C;
  }
}
/deep/.van-share-sheet__cancel{
  display: none;
}
/deep/.van-share-sheet__header{
  padding:10px 5px 0px
}
/deep/.van-share-sheet__title{
  font-size:16px;
  margin-bottom: 6px;
}
/deep/ .van-swipe{
  border-radius: 10px;
  max-height:360px;
}
/deep/.van-swipe-item{
  max-height:360px;
  img{
    object-fit: fill;
    width:100%;
    height:100%;
  }
}
/deep/.van-share-sheet__options{
  padding:5px 10px;
}
/*/deep/.van-cell{*/
/*  padding: 0 5px;*/
/*}*/
/deep/ .van-divider{
  margin:2px 0;
}
/deep/ .van-share-sheet__icon{
  border-radius: 50%;
}

.scroll_fixed{
  position:fixed;
  background:#eee;
  width:100%;
  height:98%;
  background-size:100% 100%;
}
/*.scrollContent{*/
/*  margin-bottom:50px;*/
/*}*/
.share-title-description{
    color:#2A2A2A;
  .share-product-info{
    /deep/.van-field__control{
      padding:2px 8px 0 8px;
      border-radius: 10px;

      background:#eeeeee;

    }
  }

  }
</style>
