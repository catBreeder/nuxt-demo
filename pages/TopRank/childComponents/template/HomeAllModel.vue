<template>
  <div>
    <van-sticky>
      <navbar-from-category :title="title" @clickLeftEvent="goBackHandle"/>

      <filter-area
        :categoryNameList="categoryNameList"
        @categorySelectEmit="categorySelectHandle"
        @recommendSelectEmit="recommendSelectHandle"
        @showFilterEmit="showFilterHandle"
      />
    </van-sticky>
    <scroll-view @reachBottom="goBottomHandle" class="scroll_fixed">
      <template v-if="isLoading">
        <van-loading type="spinner" color="#fcc900"  size="50px"/>
      </template>
      <template v-else>
        <div v-if="productList.length">
          <van-row gutter="6" class="scrollContent" >
            <van-col span="12" v-for="(item,index) in productList" :key="index">
              <common-product-detail
              :item="item" :index="index"
              @shareProductEmit="shareProductHandle"
              @goDetailEmit="goDetailHandle"
              v-exp-dot
              :data-info='`productid@${ item.platformproductid || null }^action@offsetList^totalcount@${ pageCount || null }^
                position@${index}^page@categorylist^query@{"categoryid":${ categoryFilter >-1 ? categoryFilter: $route.params.categoryID|| null },
                "thirdid":${$route.query.thirdid || null},"sortby":${ recommendFilter || null},
                "minprice":${ minPrice || null},"maxprice":${ maxPrice || null},"sellerid":0}`'
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
            <van-loading size="20px" color="#fcc900" v-if="status==1"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==2"/>
          </div>
        </div>

        <common-empty v-else/>
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
              <van-swipe  @change="swiperChangeHandle" height="360" v-if="shareItem.images && shareItem.images.length">
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
import FilterArea from "../FilterArea";
import FilterDrawer from "@/components/content/FilterDrawer";
import ScrollView from "@/components/common/ScrollView";
import CommonEmpty from '@/components/common/CommonEmpty'
import {queryProductsByCategoryApi ,
  shareInfoApi,
  shareInitApi,
  childCategoriesApi
} from '@/api/home'
import { gTagFun } from '@/utils/buryPoint/gTag'
import {getLoginInfo} from '@/utils/memory'
import {clickPointFun ,trackTagFun} from '@/utils';
const commonList =[{id:0,ename:'All'}]
export default {
  name: "HomeAllModel",
  components:{CommonProductDetail,NavbarFromCategory ,FilterDrawer , FilterArea ,ScrollView ,ProductListItem ,CommonEmpty},
  props:{
    title:String,
    operateType:String
  },
  data(){
  return{
    isLoading:true,
    showShare:false,
    categoryNameList:[],
    categoryFilter:-1,
    recommendFilter:5,
    isFilter:false,
    productList:[],
    page:1,
    minPrice:null,

    maxPrice:null,
    shareOptions:[
      { name: 'Download', icon: require('../../../../assets/images/home/download.png') },
      { name: 'Facebook', icon: require('../../../../assets/images/home/facebook.png') },
      { name: 'WhatsApp', icon: require('../../../../assets/images/home/whatsapp.png') },
    ],
    productDescription:null,
    shareItem:{},
    imgIndex:0,//轮播图的位置
    shareInfo:{},
    shareProductID:'',
    ambassor:0,
    status:1
  }
  },
  methods:{
    goMemberUrlHandle(){
      window.open(`${this.$config.jianweiDomain}/membership/index`,'online')
    },
    goDetailHandle(item,index){
      //谷歌埋点
      gTagFun('商城品类名','商品详情','产品列表页面')
      clickPointFun({
        p:'产品列表页面',
        spm:`a0001.category_product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`})
      // this.$router.push(`/search?productid=${item.platformproductid}&spm=a0001.category_product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`)
      window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.category_product.offerlist.${index}.${JsCookie.get('currentPageSpmValue')}`,'online')
    },
    shareProductHandle(item){
      this.shareProductID = item.platformproductid;
      this.showShare = true;
      this.shareInitHandle(this.shareProductID);      //获取图片信息
    },
    shareInitHandle(id){
      shareInitApi(id).then(res=>{
        if(res.status==0){
          this.shareItem = res.data;
          this.ambassor = res.data.isambassadorpromotion;
          this.productDescription = this.shareItem.title
        }else{
          this.$toast({message:'The product have been removed or expired'})
        }

      })
    },
    collectSuccessHandle(){
      this.getHomeAllList()
    },
    goBottomHandle(){
      if(this.status==this.$config.loadingType.FINISHED) return;
      this.page++;
      let option={};
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice
      }
      option ={...{
          categoryid:this.$route.params.categoryID,
          thirdid:this.categoryFilter>0?this.categoryFilter:null
        },...common}
      queryProductsByCategoryApi(option).then(res=>{
        this.pageCount= res.pageCount;
        if( !res.shopproductlist ||res.shopproductlist.length==0){this.status=this.$config.loadingType.FINISHED}
        res.shopproductlist = res.shopproductlist.map(item=>{
          if(item.images.indexOf(',')!==-1){
            //如果有逗号
            item.images = item.images.split(',')[0]
          }
          return item;
        });
        this.productList = [...this.productList,...res.shopproductlist];
      })
    },
    changeDespHandle(event){
      this.shareInfo = event;
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
        console.log(this.shareItem.images[this.imgIndex]);
        this.$toast({message: 'Download succeeded....' });
      }
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

          value =`{"userid":${getLoginInfo()?getLoginInfo().id:''},"platform":${this.$config.platform.Facebook},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`;
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
    goBackHandle(){
      this.$router.replace('/')
    },
    categorySelectHandle(val){
      trackTagFun({fun:val})
      this.categoryFilter= val;
      this.update()
    },
    recommendSelectHandle(value){
      trackTagFun({fun:this.$config.sortBy[value]})
      this.recommendFilter = value;
      this.update()
    },
    update(){
      this.page =1;
      this.productList=[];
      this.getHomeAllList();
    },
    showFilterHandle(){
      this.isFilter = true;
    },
    getHomeAllList(){
      this.isLoading = true;
      let option={};
      let common ={
        sortby:this.recommendFilter,
        page:this.page,
        minprice:this.minPrice,
        maxprice:this.maxPrice
      }
      option ={...{
          categoryid:this.$route.params.categoryID,
          thirdid:this.categoryFilter>0?this.categoryFilter:null
        },...common}
      queryProductsByCategoryApi(option).then(res=>{
        this.pageCount= res.pageCount;
        let value =[]
        value = res.shopproductlist.map(item=>{
          if(item.images.indexOf(',')!==-1){
            //如果有逗号
            item.images = item.images.split(',')[0]
          }
          return item;
        });
        this.productList=value;
        if(this.productList.length<16){
          this.goBottomHandle()
        }
        setTimeout(()=>{
          this.isLoading = false;
        },this.$config.duringWait)
      })

    },
    getCategoryName(){
      childCategoriesApi(this.$route.params.categoryID).then(res=>{
        res=[...commonList,...res];
        res.map(item=>{
          item.text =item.ename;
          item.value = item.id;
          return item;
        })
        this.categoryNameList = res;
      })
    },
  },
  mounted() {
    this.getHomeAllList();
    this.getCategoryName()
  },

}
</script>

<style scoped lang="less">
  .adv-img{
    height:292px;
    background:url('~assets/images/advs/Membership_Mobile_Category_Search_Product_1_192x371.png') no-repeat center;
    background-size: cover;
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

.scroll_fixed{
  height:calc(100vh - 100px - 46px);
  background-color: #EEEEED;
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
