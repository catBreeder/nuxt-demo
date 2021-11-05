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
      <div class="s3_home_banner"  @click="goBannerOtherURL" >
        <img height="56" src="~assets/images/top100/banner_from_home.png" alt="">
      </div>
      <common-filter-area
        :categoryNameList="categoryNameList"
        @categorySelectEmit="categorySelectHandle"
        @recommendSelectEmit="recommendSelectHandle"
        @showFilterEmit="showFilterHandle"
      />
    </van-sticky>
    <scroll-view
      @reachBottom="goBottomHandle"
      class="rankSupplierScroll">
      <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
      <div v-else>
        <div v-if="productList.length">
          <van-row gutter="6" class="scrollContent" >
            <van-col span="12" v-for="(item,index) in productList" :key="index">
              <common-product-detail
                @shareProductEmit="shareProductHandle"
                @goDetailEmit="goDetailHandle"
                v-exp-dot
                :data-info='`productid@${item.platformproductid || null }^action@topsupplier^totalcount@${ pageCount || null }^
                position@${index}^page@top100productlist^query@{"categoryid":${ categoryFilter >-1 ? categoryFilter: $route.query.categoryID|| null },
                "thirdid":${$route.query.thirdid || null},"sortby":${ recommendFilter || null},"sellerid":0,"productid":${item.id},
                "minprice":${ minPrice || null},"maxprice":${ maxPrice || null}}`'
                :item="item" :index="index">
                <div slot="price" class="d_flex d_flex_between">
                  <p class="price-normal">
                    <template v-if="item.price">
                      {{item.price / 100 | moneyFormat}}
                    </template>
                    <template v-else>
                      {{item.finalprice/ 100 | moneyFormat}}
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
        <common-empty v-else/>
      </div>
    </scroll-view>
    <van-popup v-model="isFilter" position="right"   :style="{ height: '100%',width:'70%' }" >
      <common-filter-drawer @doneEmit="doneHandle"/>
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
  const commonList =[{id:0,ename:'All'}]
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  import CommonFilterArea from '@/components/common/CommonFilterArea';
  import CommonFilterDrawer from "@/components/common/CommonFilterDrawer";
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import ScrollView from "@/components/common/ScrollView";
  import ProductListItem from '@/components/content/product_list_item';
  import {top100SupplierProductApi} from '@/api/top100';
  import CommonEmpty from '@/components/common/CommonEmpty'
  import {trackTagFun} from '@/utils';
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm,getLoginInfo,setCurrentPage} from '@/utils/memory'
  import {
    categoryListApi,
    shareInfoApi,
    shareInitApi,
  } from '@/api/home'
  import {getDynamicTitleApi} from '@/api/common'
  export default {
    head(){
      return {
        title:'Top 100 Suppliers - shopshipshake'
      }
    },
    name: "index",
    components:{
      CommonFilterArea,
      CommonFilterDrawer,
      ScrollView,
      ProductListItem,
      CommonEmpty,
      CommonProductDetail
    },
    data(){
      return{
        isLoading:false,
        categoryFilter:-1,
        recommendFilter:5,
        minPrice:null,
        maxPrice:null,
        page:1,
        productList:[],
        isFilter:false,
        categoryNameList:[],
        dynamicTitle:'',
        shareOptions:[
          { name: 'Download', icon: require('../../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../../assets/images/home/whatsapp.png') },
        ],
        productDescription:null,
        showShare:false,
        shareItem:{},
        imgIndex:0,//轮播图的位置
        shareInfo:{},
        pageCount:0,
        ambassor:0,
        status:1
      }
    },
    methods:{
      getDynamicTitleHandle(){
        getDynamicTitleApi('mobile_module_title').then(res=>{
          let metaList = document.getElementsByTagName("meta");
          this.dynamicTitle= res.data;
          document.title =`${res.data} - ShopShipShake`
          for (let i = 0; i < metaList.length; i++) {
            if (metaList[i].getAttribute("property") == "og:title") {
              metaList[i].content =`${res.data} - ShopShipShake`;
            }
          }
        })
      },
      goBottomHandle(){
        if(this.status == this.$config.loadingType.FINISHED) return;
        if(this.page<=this.pageCount){
          this.page ++;
          top100SupplierProductApi({
            sortby:this.recommendFilter,
            page:this.page,
            minprice:this.minPrice,
            maxprice:this.maxPrice,
            categoryid:this.categoryFilter>-1?this.categoryFilter:0
          }).then(res=>{
            if(!res.list || res.list.length==0){this.status=this.$config.loadingType.FINISHED}
            res.list = res.list.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item;
            });
            this.productList =[...this.productList,...res.list];
          })
        }

        /*
        * switch (this.operateType){
          case 'homeRank':

            break;
          case 'brandItem':
            option={...common,...{categoryid:this.categoryFilter>-1?this.categoryFilter:0,productid:this.categoryFilter>-1?0:this.$route.query.productid}};
            top100SupplierProductApi(option).then(res=>{
              if(!res.list|| res.list.length==0){this.status=this.$config.loadingType.FINISHED}
              res.list = res.list.map(item=>{
                if(item.images.indexOf(',')!==-1){
                  //如果有逗号
                  item.images = item.images.split(',')[0]
                }
                return item;
              });
              this.productList = [...this.productList,...res.list];
            })
            break;
        }
        * */
      },
      goDetailHandle(item,index){
        //谷歌埋点
        gTagFun('商城品类名','商品详情','产品列表页面');
        loginRegisterPageBury({
          p:'供应商产品列表页',
          operate:'click',
          spm:`a0001.top100product.offerlist.${index}.${getCurrentPageSpmID()}`
        })
        window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.top100product.offerlist.${index}.${getCurrentPageSpmID()}`,'online')
      },
      shareProductHandle(item){
        this.shareProductID = item.platformproductid;

        this.shareInitHandle(this.shareProductID);      //获取图片信息
      },
      shareInitHandle(id){
        shareInitApi(id).then(res=>{
          if(res.status==0){
            this.showShare = true;
            this.shareItem = res.data;
            this.ambassor = res.data.isambassadorpromotion;
            this.productDescription = this.shareItem.title
          }else{
            this.$toast({message:'The product have been removed or expired'})
          }

        })
      },
      collectSuccessHandle(){
        this.getTopRankProductList()
      },
      changeDespHandle(event){
        this.shareInfo = event;
      },
      //确定分享
      swiperChangeHandle(event){
        this.imgIndex = event;
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
          this.$toast({message: 'Download succeeded....' });
        }
      },
      //确定分享
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

            value =`{"userid":${getLoginInfo()?getLoginInfo().id:''},"platform":${this.$config.platform.Facebook},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`;
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
      goMemberUrlHandle(){
        window.open(`${this.$config.jianweiDomain}/membership/index`,'online')
      },
      showFilterHandle(){
        this.isFilter = true;
      },
      categorySelectHandle(val){
        this.categoryFilter = val;
        this.update()
      },
      recommendSelectHandle(value){
        this.recommendFilter = value;
        this.update()
      },
      update(){
        this.page =1;
        this.productList=[];
        this.getTopRankProductList();
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
      goBannerOtherURL(){
        window.open("https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/")
      },
      changeContentHandle(){
        this.$router.replace({
          name:'supplierStoreIndex',
          query:{productid:this.$route.query.productid,categoryID:0,sellerID:this.$route.query.sellerID}
        })

        localStorage.setItem('changeTab','brand')
      },
      /*
      *
      * changeContentHandle(){
        this.showProduct = !this.showProduct;
        this.changeTab = this.showProduct ?'product' :'brand';
        localStorages.setItem('changeTab',this.changeTab)
      },
      * */
      getTopRankProductList(){
        this.isLoading = true;
        let option={};
        let common ={
          sortby:this.recommendFilter,
          page:this.page,
          minprice:this.minPrice,
          maxprice:this.maxPrice
        }
        option={
          ...{categoryid:this.categoryFilter>-1?this.categoryFilter:0,productid:this.categoryFilter>-1?0:this.$route.query.productid},
          ...common
        }
        top100SupplierProductApi(option).then(res=>{
          this.productList = res.list.map(item=>{
            if(item.images.indexOf(',')!==-1){
              //如果有逗号
              item.images = item.images.split(',')[0]
            }
            return item;
          });
          this.isLoading = false;
          this.pageCount = res.pageCount;
        })
       /*
       *
       *  switch (this.operateType){
          case 'homeRank':
            option={
              ...{categoryid:this.categoryFilter>-1?this.categoryFilter:0,},
              ...common
            }
            top100SupplierProductApi(option).then(res=>{
              this.productList = res.list.map(item=>{
                if(item.images.indexOf(',')!==-1){
                  //如果有逗号
                  item.images = item.images.split(',')[0]
                }
                return item;
              });
              setTimeout(()=>{
                this.isLoading = false;
              },this.$config.duringWait)
              this.pageCount = res.pageCount;
            })
            break;
          case 'brandItem':
            option={...common,...{categoryid:this.categoryFilter>-1?this.categoryFilter:0,productid:this.categoryFilter>-1?0:this.$route.query.productid}};
            top100SupplierProductApi(option).then(res=>{
              this.productList = res.list.map(item=>{
                if(item.images.indexOf(',')!==-1){
                  //如果有逗号
                  item.images = item.images.split(',')[0]
                }
                return item;
              });
              this.pageCount = res.pageCount;
              setTimeout(()=>{
                this.isLoading = false;
              },this.$config.duringWait)

            })
            break;
        }
       * */

      },
      getCategoryNameList(){
        categoryListApi().then(res=>{
          res=[...commonList,...res];
          res.map(item=>{
            item.text =item.ename;
            item.value = item.id;
            return item;
          })
          this.categoryNameList = res;
        })
       /*
       *  switch (this.operateType){
          case 'homeRank':
            categoryListApi().then(res=>{
              res=[...commonList,...res];
              res.map(item=>{
                item.text =item.ename;
                item.value = item.id;
                return item;
              })
              this.categoryNameList = res;
            })
            break;
          case 'brandItem':
            categoryListApi().then(res=>{
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
       * */
      }
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'supplierProduct',
        operate:'close',
        spm:`a0001.supplierProduct.close.${getCurrentPageSpmID()}`
      })
      next();
    },
    beforeRouteEnter(to,from,next){
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      loginRegisterPageBury({
        p:'supplierProduct',
        operate:'page',
        spm:`a0001.supplierProduct.page.-1`
      })
      next();
    },
    mounted() {
      this.getDynamicTitleHandle()
      this.getTopRankProductList();
      this.getCategoryNameList();

    }
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
  .rankSupplierScroll{
    height:calc(100vh - 142PX - 46PX);
    background-color: #EEEEED;
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

  .scroll_fixed{
    position:fixed;
    background:#eee;
    width:100%;
    height:98%;
    background-size:100% 100%;
  }
  .icon-zhuanhuan1{
    font-size:21px;
  }
  .s3-home-rank-model-wrapper{

  }
  .s3_home_banner{
    width:100%;
    height:50px;
    img{
      width:100%;
      height:auto;
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
  .share-title-description{
    color:#2A2A2A;
  }
  /deep/ .van-divider{
    margin:5px 0;
  }
  /deep/ .van-share-sheet__icon{
    border-radius: 50%;
  }
  /*/deep/.van-cell{*/
  /*  padding:0 5px;*/
  /*}*/
  /deep/ .van-field__control{
    padding:2px 8px 0 8px;
    border-radius: 10px;
    background:#eeeeee;
  }
</style>
