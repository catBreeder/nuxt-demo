<template>
  <div class="comment-model-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="navbar-title">{{$route.params.type==='comments'?'Comments':'Photos'}}</div>
        </template>
      </van-nav-bar>
      <filter-area
        :categoryNameList="categoryNameList"
        @categorySelectEmit="categorySelectHandle"
        @recommendSelectEmit="recommendSelectHandle"
        @showFilterEmit="showFilterHandle"
      />
    </van-sticky>
    <scroll-view class="commentScrollHeight" @reachBottom="loadMoreHandle">
      <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
      <div v-else>
        <div v-if="shopproductlist.length">
          <van-row gutter="6" class="scrollContent" >
            <van-col span="12" v-for="(item,index) in shopproductlist" :key="index">

                <common-product-detail
                  :item="item" :index="index"
                  @shareProductEmit="shareProductHandle"
                  @goDetailEmit="goDetailHandle"
                  v-exp-dot
                  :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@${ pageCount || null }^
                position@${index}^page@categorylist^query@{"categoryid":${ categoryFilter >-1 ? categoryFilter : 0 },
                "sortby":${ recommendFilter || null},
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
          <div class="list_bottom" v-show="shopproductlist.length>8">
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </div>
        <common-empty v-else/>
      </div>
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
  import ProductListItem from '@/components/content/product_list_item';
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  import ScrollView from "@/components/common/ScrollView";
  import CommonEmpty from '@/components/common/CommonEmpty'
  import {keySearchListApi ,collectGoodsApi ,childCategoriesApi ,shareInitApi ,shareInfoApi} from '@/api/home'
  import { getUserTicket } from '@/utils/memory'
  import { gTagFun } from '@/utils/buryPoint/gTag';
  import FilterArea from "../childComponents/FilterArea";
  import FilterDrawer from "@/components/content/FilterDrawer";
  import {getLoginInfo} from '@/utils/memory'
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm,setCurrentPage} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {trackTagFun} from '@/utils';
  const commonList =[{id:0,ename:'All'}]
  export default {
    head(){
      return {
        title:'Search Result - shopshipshake'
      }
    },
    name: "CommentModel",
    components:{ScrollView ,CommonEmpty,FilterArea,FilterDrawer ,ProductListItem,CommonProductDetail},
    props:{
      type:String
    },
    data(){
      return{
        isLoading:true,
        page:1,
        pageCount:1,
        shopproductlist:[],
        categoryNameList:[],
        categoryFilter:-1,
        recommendFilter:5,
        isFilter:false,
        minPrice:null,
        maxPrice: null,
        shareProductID:'',
        showShare:false,
        shareItem:{},
        productDescription:null,
        imgIndex:0,//轮播图的位置
        shareOptions:[
          { name: 'Download', icon: require('../../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../../assets/images/home/whatsapp.png') },
        ],
        ambassor:0,
        status:1
      }
    },
    mounted() {
      this.getCategoryNameList()
      this.getSearchList();
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'comment',
        operate:'close',
        spm:`a0001.comment.close.${getCurrentPageSpmID()}`
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
        p:'comment',
        operate:'page',
        spm:`a0001.comment.page.-1`
      })
      next();
    },
    methods:{
      goMemberUrlHandle(){
        window.open(`${this.$config.jianweiDomain}/membership/index`)
      },
      changeDespHandle(event){
        this.shareInfo = event;
      },
      //确定分享
      swiperChangeHandle(event){
        this.imgIndex = event;
      },
      //图片下载
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
      shareInitHandle(id){
        shareInitApi(id).then(res=>{
          this.shareItem = res.data;
          this.ambassor = res.data.isambassadorpromotion;
          this.productDescription = this.shareItem.title
        })
      },
      doneHandle(value){
        this.isFilter = false;
        this.minPrice = value.minPrice;
        this.maxPrice  = value.maxPrice;
        this.update()
      },
      showFilterHandle(){
        this.isFilter = true;
      },
      update(){
        this.page =1;
        this.shopproductlist=[];
        this.getSearchList();
      },
      recommendSelectHandle(value){
        this.recommendFilter = value;
        this.update()
      },
      categorySelectHandle(value){
        this.categoryFilter= value;
        this.update();
      },
      loadMoreHandle(){
        if(this.page <= this.pageCount){
          if(this.status==this.$config.loadingType.FINISHED) return;
          this.page++;
          let common ={
            sortby:this.recommendFilter,
            page:this.page,
            minprice:this.minPrice,
            maxprice:this.maxPrice,
            goodreviewsearch:this.$route.params.type==='comments'?1:2,
            categoryid:this.categoryFilter
          }
          keySearchListApi(common).then(res=>{
            if(res.shopproductlist.length==0 || !res.shopproductlist) {
              this.status=this.$config.loadingType.FINISHED;
            }
            this.pageCount = res.pageCount;
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')!==-1){
                //如果有逗号
                item.images = item.images.split(',')[0]
              }
              return item;
            });
            this.shopproductlist = [...this.shopproductlist,...res.shopproductlist];
          })
        }
      },
      collectHandle(item){
        if(getUserTicket()){
          item.like = item.like===1?0:1;
          collectGoodsApi(item.platformproductid).then(res=>{
            this.$toast({message:item.like?'Collection succeeded !':'Cancel collection successfully !'})
          })
        }else{
          this.$router.replace('/login')
        }

      },
      goBackHandle(){
        this.$router.go(-1)
      },
      collectSuccessHandle(){

      },
      shareProductHandle(item){
        this.shareProductID = item.platformproductid;
        this.showShare = true;
        this.shareInitHandle(this.shareProductID);      //获取图片信息
      },
      goDetailHandle(item,index){
        gTagFun('商城品类名','商品详情','产品列表页面');
        window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}&spm=a0001.${this.$route.params.type}.offerlist.${index}.${getCurrentPageSpmID()}`,'online')
      },
      getSearchList(){
        this.isLoading = true;
        let common ={
          sortby:this.recommendFilter,
          page:this.page,
          minprice:this.minPrice,
          maxprice:this.maxPrice,
          goodreviewsearch:this.$route.params.type==='comments'?1:2,
          categoryid:this.categoryFilter
        }
        keySearchListApi(common).then(res=>{
          this.shopproductlist = res.shopproductlist.map(item=>{
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
      },
      //获取类别列表
      getCategoryNameList(){
        childCategoriesApi(0).then(res=>{
          res=[...commonList,...res];
          res.map(item=>{
            item.text =item.ename;
            item.value = item.id;
            return item;
          })
          this.categoryNameList = res;
        })
      },
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
  .share-title{
    position:relative;
    .share-close-tag{
      position:absolute;
      right:10px ;
      font-size:20px;
      color:gray;
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
  .comment-model-wrapper{
    .commentScrollHeight{
      height:calc(100vh - 100PX - 46PX );
      background-color: #EEEEED;
    }
  }

  .good_like{
    font-size:15px;
  }

  /*/deep/ .van-button{*/
  /*  background-color: #fcc900;*/
  /*  border-color: #fcc900;*/
  /*  color: #222222;*/
  /*  font-size:9px;*/
  /*  height:22px !important;*/
  /*  line-height: 22px !important;*/
  /*}*/
</style>
