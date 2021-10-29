<template>
    <div class="supplier-store-wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle" >
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title><div class="sticky_title_common">{{dynamicTitle}}</div></template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView" @reachBottom="loadMoreHandle">

        <div class="supplier-store-content">
          <div class="store-card">
            <div class="d_flex_between d_flex g_mb_l">
              <div class="store-title">{{sellerinfo.brandname}}</div>
<!--              <van-tag size="large" color="#ff001b" @click="collectionHandle" >-->
<!--                <van-icon :name="isCollected?'plus':'minus'" size="16" class="g_mr-s"  color="#fff"/>Favorite-->
<!--              </van-tag>-->
            </div>
            <div class="store-info d_flex">
              <div class="store-info-goods d_flex">
                &nbsp;<span class="font_size_20 color_orange_red g_mr-s">{{storeInfo.count}}</span> Items</div>
              <div class="d_flex"><span class="font_size_20 color_orange_red g_mr-s">{{sellerinfo.score}}</span> / 5.0&nbsp; Rating</div>
            </div>
          </div>
          <div class="product-card">
            <van-sticky :offset-top="45">
              <common-filter-area  :categoryNameList="categoryList"
                                   @categorySelectEmit="categorySelectHandle"
                                   @recommendSelectEmit="recommendSelectHandle"
                                   @showFilterEmit="showFilterHandle"/>
            </van-sticky>
            <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
            <template v-else>
              <div v-if="productList.length" class="product_list_content">
                <van-row gutter="6" >
                  <van-col span="12" v-for="(item,index) in productList" :key="index">
                    <common-product-detail
                      :item="item" :index="index"
                      @shareProductEmit="shareProductHandle"
                      @goDetailEmit="goOtherURLHandle"
                      :data-info='`productid@${item.platformproductid || null }^action@topsupplier^totalcount@${ recordTotal || null }^
                position@${index}^page@top100productlist^query@{"categoryid":${ categoryFilter>-1?categoryFilter:0 },
                "sortby":${ recommendFilter || null},"sellerid":${item.selllerid},"productid":${item.id},
                "minprice":${ minPrice || null},"maxprice":${ maxPrice || null}}`'
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
                  <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
                  <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
                </div>
              </div>
              <van-empty v-else
                         class="custom-image"
                         image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                         description="No data at present......"
              />
            </template>
          </div>
        </div>

      </scroll-view>
      <van-popup v-model="isFilterVisible" position="right"   :style="{ height: '100%',width:'70%' }" >
        <common-filter-drawer @doneEmit="doneHandle"/>
      </van-popup>
      <van-share-sheet
        v-model="shareVisible"
        cancel-text="close"
        :options="shareOptions"
        @select="selectShareHandle"
      >
        <template #title>
          <div class="share-title">
            Share to your friends
            <van-icon name="cross" class="share-close-tag" @click="shareVisible = false"/>
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



     const commonList =[{id:0,ename:'All'}]
    import ScrollView from "@/components/common/ScrollView";
    import CommonFilterArea from '@/components/common/CommonFilterArea'
    import CommonFilterDrawer from '@/components/common/CommonFilterDrawer'
    import ProductListItem from '@/components/content/product_list_item';
    import {getDynamicTitleApi} from '@/api/common';
    import config from '@/config'
     import {loginRegisterPageBury} from '@/utils/buryPoint/buryPoint';
     import {getCurrentPageSpmID, setRefer, setRefSpm,getUserID,setCurrentPage} from "@/utils/memory";
    import {supplierStoreApi ,supplierStoreProductListApi ,supplierStoreAddCollectionApi,supplierStoreCancelCollectionApi,shareInfoApi ,shareInitApi} from '@/api/home';
     import CommonProductDetail from '@/components/common/CommonProductDetail'
     import {trackTagFun } from '@/utils';
     import { gTagFun } from '@/utils/buryPoint/gTag'
    export default {
      head(){
        return {
          title:'Supplier Store - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView,CommonFilterArea,CommonFilterDrawer,ProductListItem,CommonProductDetail},
        data(){
          return{
            isLoading:false,
            isFilterVisible:false,
            productList:[],
            status:1,
            page:1,
            dynamicTitle:'',
            storeInfo:{},
            sellerinfo:{},
            categoryList:[],
            categoryFilter:-1,
            recommendFilter:5,
            minPrice:null,
            maxPrice:null,
            pageCount:0,
            recordTotal:0,
            favoriteseller:{},


            shareVisible:false,
            shareOptions:[
              { name: 'Download', icon: require('../../../assets/images/home/download.png') },
              { name: 'Facebook', icon: require('../../../assets/images/home/facebook.png') },
              { name: 'WhatsApp', icon: require('../../../assets/images/home/whatsapp.png') },
            ],
            imgIndex:0,//轮播图的位置
            shareItem:{},//分享产品信息
            shareInfo:{},//分享的内容
            productDescription:'',
            ambassor:0
          }
        },
        computed:{

          //是否被收藏
          isCollected(){
            return this.favoriteseller && this.favoriteseller.sellerid == this.$route.params.storeID;
          }
        },
        methods:{
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
          swiperChangeHandle(event){
            this.imgIndex = event;
          },
          changeDespHandle(event){
            this.shareInfo = event;
          },
          shareInitHandle(id){
            console.log(id);
            shareInitApi(id).then(res=>{
              if(res.status==0){
                this.shareItem = res.data;
                this.productDescription = this.shareItem.title
              }

            })
          },
//确定分享
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
          collectionHandle(){
            if(this.isCollected){
                //已经收藏
                supplierStoreCancelCollectionApi(this.$route.params.storeID).then(res=>{
                  if(res.status==0){
                    this.$toast({message:'Collection succeeded.'})
                    this.getSupplierStoreInfo()
                  }
                })
              }else{
                supplierStoreAddCollectionApi(this.$route.params.storeID).then(res=>{
                  if(res.status==0){
                    this.$toast({message:'Collection cancelled successfully.'})
                    this.getSupplierStoreInfo()
                  }
                })
              }
          },
          loadMoreHandle(){
            if(this.status == this.$config.loadingType.FINISHED) return;
            if(this.page <= this.pageCount){
              this.page ++;
              const {storeID,goodID} = this.$route.params;
              supplierStoreProductListApi({
                sellerid:storeID,
                productid:goodID,
                categoryid:this.categoryFilter>-1?this.categoryFilter:0,
                sortby:this.recommendFilter,
                minprice:this.minPrice,
                maxprice:this.maxPrice,
                page:this.page

              }).then(res=>{

                let {list} = res.pageinfo || {};
                if(!list || list.length==0){
                  this.status=this.$config.loadingType.FINISHED
                }else{
                  list = list.map(item=>{
                    if(item.images.indexOf(',')!==-1){
                      //如果有逗号
                      item.images = item.images.split(',')[0]
                    }
                    return item;
                  });
                  this.productList = [...this.productList,...list];
                }




              })
            }
          },
          categorySelectHandle(val){
            this.categoryFilter = val;
            this.update()
          },
          recommendSelectHandle(value){
            this.recommendFilter = value;
            this.update()
          },
          showFilterHandle(){this.isFilterVisible = true;},
          goBackHandle(){this.$router.back()},
          doneHandle(value){
            this.isFilterVisible = false;
            this.minPrice = value.minPrice;
            this.maxPrice  = value.maxPrice;
            this.update()
          },
          update(){
            this.page =1;
            this.getProductList();
          },
          shareProductHandle(item){
            this.shareVisible = true;
            this.shareInitHandle(item['platformproductid'])
          },
          goOtherURLHandle(item,index){
            window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.top100supplierproduct.offerlist.${index}.${getCurrentPageSpmID()}`,'online')
          },
          getDynamicTitleHandle(){
            getDynamicTitleApi('mobile_module_title').then(res=>{
              this.dynamicTitle = res.data;
              let metaList = document.getElementsByTagName("meta");
              document.title =`${res.data} - ShopShipShake`
              for (let i = 0; i < metaList.length; i++) {
                if (metaList[i].getAttribute("property") == "og:title") {
                  metaList[i].content =`${res.data} - ShopShipShake`;
                }
              }
            })
          },
          getSupplierStoreInfo(){
            const {storeID,goodID} = this.$route.params;
            supplierStoreApi(storeID,goodID).then(res=>{
               this.storeInfo = res || {};
               this.sellerinfo = res.sellerinfo || {};
               this.favoriteseller = res.favoriteseller || {};
              console.log(this.favoriteseller);
              res.categoryList=[...commonList,...res.categoryList || []];
              res.categoryList = res.categoryList.map(item=>{
                item.text =item.ename;
                item.value = item.id;
                return item;
              })
              this.categoryList =res.categoryList || []

            })
          },
          getProductList(){
            this.isLoading = true;
            const {storeID,goodID} = this.$route.params;
            supplierStoreProductListApi({
              sellerid:storeID,
              productid:goodID,
              categoryid:this.categoryFilter>-1?this.categoryFilter:0,
              sortby:this.recommendFilter,
              minprice:this.minPrice,
              maxprice:this.maxPrice,
              page:this.page

            }).then(res=>{
              let {list,pageCount,recordTotal} = res.pageinfo || {};
              this.productList = list || [];
              this.recordTotal = recordTotal;
              this.productList = this.productList.map(item=>{
                if(item.images.indexOf(',')!==-1){
                  //如果有逗号
                  item.images = item.images.split(',')[0]
                }
                return item;
              });
              this.pageCount = pageCount;
              setTimeout(()=>{ this.isLoading = false;},500)

            })
          },
        },
      mounted() {
        this.getDynamicTitleHandle();
        this.getSupplierStoreInfo();
        this.getProductList()
      },
      beforeRouteLeave(to,from,next){
        loginRegisterPageBury({
          p:'top100supplierproduct',
          operate:'close',
          spm:`a0001.top100supplierproduct.close.${getCurrentPageSpmID()}`
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
          p:'top100supplierproduct',
          operate:'page',
          spm:`a0001.top100supplierproduct.page.-1`
        })
        next();
      },
    }
</script>

<style scoped lang="less">


  /deep/ .van-share-sheet__icon{
    border-radius: 50%;
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
  /deep/.van-share-sheet__options{
    padding:5px 10px;
  }
  .share-title-description{
    color:#2A2A2A;
    /deep/.van-cell{
      padding:0 5px;
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
  /deep/.van-field__body{
    background:#EEEEED;
  }
  /deep/ .van-divider{
    margin:2px 0;
  }
  /deep/ .van-field__control{
    padding:2px 8px 0 8px;
    border-radius: 10px;
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
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  .tag_title{
    color:#FF4500;
  }
  .supplier-store-wrapper{
    /deep/.van-nav-bar{
      background-color: #fcc900;
    }
  }
  .supplier-store-content{
    background-color: #EDF0F9;
    .store-card{
      margin:8px;
      padding:15px 10px;
      background:#fcc900;
      border-radius: 6px;
      box-shadow: 0.13333rem 0 0.13333rem #eeeeed;
      .store-title{
        font-weight: bold;
        font-size:18px;
      }
      .store-info{
        margin-top: 6px;
        color:#333;
        font-size:16px;
      }
      .store-info-goods{
        margin-right: 30px;
      }
    }
    .product-card{
      margin:10px 1px;
      background-color: #EEEEED;
      border-radius: 6px 6px 0 0 ;
      .product_list_content{
        background-color: #EEEEED;
      }
    }
  }
</style>
