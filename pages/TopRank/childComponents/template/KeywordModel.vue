<template>
  <div>
    <van-sticky>
      <navbar-from-keyword
        :titleProp="getTitle"
                           @click-left="goBackHandle" />
      <filter-area
        :categoryNameList="categoryNameList"
        @categorySelectEmit="categorySelectHandle"
        @recommendSelectEmit="recommendSelectHandle"
        @showFilterEmit="showFilterHandle"
      />
    </van-sticky>
    <scroll-view @reachBottom="goBottomHandle" class="scroll_fixed">
      <div class="s3_top100_banner " @click="goBannerURL">
        <img  :src="imgInfo.image" alt="">
      </div>
      <template v-if="isLoading">
        <van-loading type="spinner" color="#fcc900"  size="50px"/>
      </template>
      <template v-else>
        <div v-if="productList.length">
          <van-row gutter="6"  >
            <van-col span="12" v-for="(item,index) in productList" :key="index">
              <template v-if="index==13 || index==27 || index==41">
<!--                :style="{height:isLoginOut?'366.88px':'324.33px'}"-->
                <div class="ads-img" :style="{height:isLoginOut?'377px':'337px'}">
                  <img :src="imgCategory14.image" alt=""  @click="goBannerHandle(imgCategory14,'source')"  v-if="index==13">
                  <img :src="imgCategory28.image" alt=""   @click="goBannerHandle(imgCategory28,'weight')"  v-if="index==27">
                  <img :src="imgCategory41.image" alt=""  @click="goBannerHandle(imgCategory41,'via')" v-if="index==41">
                </div>
              </template>
              <common-product-detail v-else
                :item="item" :index="index"
                @shareProductEmit="shareProductHandle"
                @goDetailEmit="goDetailHandle"
                v-exp-dot
                :data-info='`productid@${item.platformproductid || null }^action@offerlist^totalcount@${pageCount || null }^position@${index}^page@keysearch^query@{"keyword":"${$route.query.keyword}","categoryid":${$route.query.categoryID || null },"thirdid":${$route.query.thirdid || null},"sortby":${recommendFilter || null},"minprice":${minPrice || null},"maxprice":${maxPrice || null}}`'
              >
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
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </div>

        <section v-if="hasOwnerVisible">
          <div class="show-owner-container-title">Move To Love</div>
          <van-row gutter="6" >
            <van-col span="12" v-for="(item,index) in searchOwnerList" :key="index">
              <common-product-detail
                :item="item" :index="index"
                @shareProductEmit="shareProductHandle"
                @goDetailEmit="moveGoUrlHandle"
                v-exp-dot
                :data-info='`productid@${item.platformproductid || null }^action@offerlist^totalcount@${pageCount || null }^position@${index}^page@categorylist^query@{"keyword":"${$route.query.keyword}","categoryid":${$route.query.categoryID || null },"thirdid":${$route.query.thirdid || null},"sortby":${recommendFilter || null},"minprice":${minPrice || null},"maxprice":${maxPrice || null}}`'
              >
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
        </section>
      </template>

    </scroll-view>
    <van-popup v-model="isFilter" position="right"   :style="{ height: '100%',width:'70%' }" >
      <filter-drawer  @doneEmit="doneHandle"
                     />
    </van-popup>
    <!--    显示分享狂-->
    <van-share-sheet
      v-model="showShare"
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
              <van-swipe  @change="swiperChangeHandle" height="360" v-if="shareItem.images && shareItem.images.length">
                <van-swipe-item v-for="(item, index) in shareItem.images" :key="index">
                  <img :src="item" style="border-radius: 10px"/>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div class="share-product-info-img-description">
              <van-divider content-position="left">Commodity Description(you can edit it)</van-divider>
              <van-field
                class="textarea-area"
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
const commonList =[{id:0,ename:'All'}]
import FilterArea from "../FilterArea";
import NavbarFromKeyword from '../navbar/navbar-from-keyword';
import CommonProductDetail from '@/components/common/CommonProductDetail'
import ScrollView from "@/components/common/ScrollView";
import { gTagFun } from '@/utils/buryPoint/gTag'
import CommonEmpty from '@/components/common/CommonEmpty'
import ProductListItem from '@/components/content/product_list_item';
import FilterDrawer from "@/components/content/FilterDrawer";
import {getUserID} from '@/utils/memory'
import {commonBannerAdvListApi} from '@/api/common'
import {advPageFun} from '@/utils/goPage'
import {
  keySearchListApi,
  keySearchList1688Api,
  keywordSearchApi,
  shareInitApi,
  shareInfoApi
} from '@/api/home'
import {clickPointFun,trackTagFun} from '@/utils';
export default {
  name: "KeywordModel",
  components:{
    NavbarFromKeyword,
    FilterArea,
    ScrollView,
    FilterDrawer,
    ProductListItem,
    CommonEmpty,
    CommonProductDetail
  },
  computed:{
    isLoginOut(){return !getUserID()},
    getTitle(){
      return this.$route.query.url?this.$route.query.url:this.$route.query.keyword
    }
  },
  data(){
    return{
      isLoading:false,
      categoryNameList:[],
      categoryFilter:-1,
      recommendFilter:5,
      isFilter:false,
      hasOwnerVisible:false,
      pageCount:0,
      searchOwnerList:[],
      productList:[],
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
      minPrice:null,
      maxPrice:null,
      page:1,
      ambassor:0,
      status:1,
      imgInfo:{
        image:require('../../../../assets/images/advs/sale_banner.png'),
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
      },//广告位
      // <img src="~assets/images/advs/source.png" alt="" @click="goBannerHandle('source')" v-if="index==13">
      // <img src="~assets/images/advs/weight_ads.png" alt=""  @click="goBannerHandle('weight')" v-if="index==27">
      // <img src="~assets/images/advs/via.png" alt=""  @click="goBannerHandle('via')" v-if="index==41">

    }
  },
  methods:{
    goMemberUrlHandle(){
      this.$router.push('/membership/index')
    },
    goBannerURL(){
      if(!this.imgInfo.url) return;
      window.open(this.imgInfo.url,'online')

    },
    changeDespHandle(event){
      this.shareInfo = event;
    },
    //确定分享
    swiperChangeHandle(event){
      this.imgIndex = event;
    },
    selectShareHandle(option){
      const { name }= option;
      let value ={}
      switch (name){
        case 'Download':
          trackTagFun({fun:'home_share_download_click',index:this.imgIndex})
          //添加谷歌埋点 -Share Now点击后的弹出框，点击Download按钮
          gTagFun('Share to Download','Share to Download','首页')
          this.downloadHandle();
          break;
        case 'Facebook':
          trackTagFun({fun:'home_share_facebook_click',index:this.imgIndex})
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
          trackTagFun({fun:'home_share_whatsapp_click',index:this.imgIndex})
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


    doneHandle(value){
      this.isFilter = false;
      this.minPrice = value.minPrice;
      this.maxPrice  = value.maxPrice;
      this.update()
    },
    //收藏成功
    updateHandle(){
      this.getProductList()
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
        // console.log(this.shareItem.images[this.imgIndex]);
        this.$toast({message: 'Download succeeded....' });
      }
    },
    shareProductHandle(item){
      this.shareProductID = item.platformproductid;
      this.showShare = true;
      this.shareInitHandle(this.shareProductID);      //获取图片信息
    },
    moveGoUrlHandle(item,index){

      gTagFun('商城品类名','商品详情','产品列表页面')
      clickPointFun({
        p:'查询结果页面',
        spm:`a0001.p0003.MoreToLove.${index}.${JsCookie.get('currentPageSpmValue')}`
      })
      // this.$router.push(`/search?productid=${item.platformproductid}&spm=a0001.p0003.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`)
      window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.p0003.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`,'online')

    },
    goBannerHandle(item,type){
      if(item.url){
        window.open(item.url,'online')
      }else{
        advPageFun(type)
      }

    },
    goDetailHandle(item,index){
      //谷歌埋点
      gTagFun('商城品类名','商品详情','产品列表页面')
      //保存到缓存中
      clickPointFun({
        p:'查询结果页面',
        spm:`a0001.p0003.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`
      })
      window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.p0003.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`,'online')
    },
    shareInitHandle(id){
      shareInitApi(id).then(res=>{
        if(res.status==0){
          this.shareItem = res.data;
          this.ambassor = res.data.isambassadorpromotion;
          this.productDescription = this.shareItem.title;
          console.log(res);
        }else{
          this.$toast({message:'The product have been removed or expired'})
        }

      })
    },
    goBottomHandle(){
      if(this.status==this.$config.loadingType.FINISHED) return;
      this.page ++;
      this.status=this.$config.loadingType.LOADING;
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice,
        categoryid:this.categoryFilter>-1?this.categoryFilter:0
      }
      let option ={...common,...{keyword:this.$route.query.keyword}}
      keySearchListApi(option).then(res=>{
        if(!res.shopproductlist.length || !res.shopproductlist){
          this.status= this.$config.loadingType.FINISHED;
        }
        if(res.shopproductlist.length){
          res.shopproductlist=res.shopproductlist.map(item=>{
            if(item.images.indexOf(',')!==-1){
              //如果有逗号
              item.images = item.images.split(',')[0]
            }
            return item;
          });
          this.productList = [...this.productList,...res.shopproductlist];
          this.pageCount = res.pageCount;
        }else{
          this.hasOwnerVisible=true;
          keySearchList1688Api(this.$route.query.keyword).then(resp=>{
            resp.shopproductlist=resp.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item;
            });
            this.searchOwnerList = [...this.searchOwnerList,...resp.shopproductlist];
          })
        }
      })

    },
    goBackHandle(){this.$router.go(-1)},
    categorySelectHandle(val){
      this.categoryFilter = val;
      this.update()
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
    getProductList(){
      this.isLoading = true;
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice,
        categoryid:this.categoryFilter>-1?this.categoryFilter:0
      }
      let option ={...common,...{keyword:this.$route.query.keyword}}
      keySearchListApi(option).then(res=>{
        if(res.shopproductlist.length){
          this.productList = res.shopproductlist.map(item=>{
            if(item.images.indexOf(',')!==-1){
              //如果有逗号
              item.images = item.images.split(',')[0]
            }
            return item;
          });
          this.pageCount = res.pageCount || 1;
        }else{
          this.hasOwnerVisible=true;
          keySearchList1688Api(this.$route.query.keyword).then(resp=>{
            this.searchOwnerList = resp.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item;
            });
            this.searchOwnerList = resp.shopproductlist;

          })
        }
      }).catch(err=>{

      })
      setTimeout(()=>{
        this.isLoading = false;
      },this.$config.duringWait)
    },
    getCategoryList(){
      keywordSearchApi(this.$route.query.keyword).then(res=>{
        res  = [...commonList,...res.firstcategorylist];
        res.map(item=>{
          item.text =item.ename;
          item.value = item.id;
          return item;
        })
        this.categoryNameList = res;
      })

    },
    //获取banner图片
    getBannerAdv(){
      commonBannerAdvListApi('MOBILE_SEARCH').then(res=>{
        if(res){
          const {image,url} = res[0];
          this.imgInfo = {image,url}
        }
      })
      let code = `MOBILE_SEARCH_PRODUCT_14,MOBILE_SEARCH_PRODUCT_28,MOBILE_SEARCH_PRODUCT_42`
      commonBannerAdvListApi(code).then(res=>{
        if(res){
          let img14 = res.find(item=>item.code=='MOBILE_SEARCH_PRODUCT_14');
          this.imgCategory14 = {image:img14.image,url:img14.url}
          let img28 = res.find(item=>item.code=='MOBILE_SEARCH_PRODUCT_28');
          this.imgCategory28 = {image:img28.image,url:img28.url}
          let img41 = res.find(item=>item.code=='MOBILE_SEARCH_PRODUCT_42');
          this.imgCategory41 = {image:img41.image,url:img41.url}

        }

      })
    }
  },
  mounted() {
    this.getBannerAdv()
    this.getProductList();
    this.getCategoryList();
  }
}
</script>

<style scoped lang="less">
  .ads-img{
    overflow:hidden;
    margin-bottom: 12px;
    img{
      width:100%;

    }
  }
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
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
.show-owner-container-title{
  font-size:15px;
  font-weight: 500;
  padding:20px 10px 6px;
  color:#4C4C4C;
}
.scroll_fixed{
  height:calc(100vh - 100PX - 41PX);
  background-color: #EEEEED;
}
.s3_top100_banner{
  width:100%;
  margin:2px 0 8px;
  img{
    height:auto;
    width:100%
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
.share-title-description{
  color:#2A2A2A;
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
  margin:5px 0;
}
/deep/ .van-share-sheet__icon{
  border-radius: 50%;
}
/deep/ .van-field__control{
  padding:2px 8px 0 8px;
  border-radius: 10px;
  background:#eeeeee;
}

</style>
