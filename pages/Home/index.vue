
<template>
  <section class="g_bg s3-home-wrapper" id="s3-home-wrapper">
    <van-nav-bar  border  @click-left="introBtn" @click-right="urlOperateHandle('back')">
      <template #left>
        <i class="icon iconfont icon-kaitongxuzhi demo-intro" />
      </template>
      <template #title>
        <div class="home-navbar-input">
          <input type="text" class="navbar-input-area card-demo" readonly
                 placeholder="paste keyword or 1688 link" @click="urlOperateHandle('search')" >
          <van-uploader :after-read.stop="afterReadHandle"
                        accept="image/gif, image/jpeg ,image/png"
                        v-img-upload="{triggerType:'click',p:'首页'}"
                        max-count="1" class="camera_search card-demo-2"  v-intro="'The content of tooltip'"
                        v-intro-step="2">
            <i class="icon iconfont icon-zhaoxiangji s3_header_input_camera"  ></i>
          </van-uploader>
        </div>
      </template>
      <template #right>
        <van-badge  :content="unReadCount || ''" max="99">
          <i class="icon iconfont icon-xiaoxi" />
        </van-badge>

      </template>
    </van-nav-bar>
    <div class="scroll-container">
      <home-head-content :banner-list="bannerList" />
      <div class="s3_index_container">
        <!--        滞留商品banner-->
        <div class="home_banner" @click="urlOperateHandle('detain')" v-if="detainImgInfo.image!=''">
          <img  :src="detainImgInfo.image" >
        </div>
        <!--      前100名-->
        <home-top-rank  :top100Info="top100ListInfo"/>
        <!--      banner-->
        <div class="home_banner"
             @click="urlOperateHandle('activity')">
          <img  :src="imgInfo.image" alt="shopshipshake">
        </div>


        <template v-if="hotSaleInfo.list.length || goodsList.length">
          <!--    热卖-->
          <home-goods-model :isLinkProp="false"
                            @shareProductEmit="showProductHandle"
                            :is-show-all="false"
                            :item-info="hotSaleInfo" />
          <!--      各模块列表-->
          <home-goods-model  @shareProductEmit="showProductHandle" v-for="(item,index) in goodsList"
                             :index="Number(index)+2" :key="index"
                             :item-info="item"
                             v-if="item.list.length>0" />

          <!--      底部-->
          <div class="s3_home_end"><i class="icon iconfont icon-end"></i></div>
        </template>
        <template v-else>
          <div class="list-empty">
            <van-loading text-color="#fcc900" size="35" color="#fcc900" type="spinner"   />
          </div>
        </template>
      </div>
    </div>
    <!--    分享弹出框-->
    <van-share-sheet
      v-model="showShare"
      cancel-text="close"
      :options="shareOptions"
      @select="selectShareHandle"
      @cancel="showShare = false"
    >
      <template #title>
        <div class="share-title">
          Share to your friends
          <van-icon name="cross" class="share-close-tag" @click="showShare = false"/>
        </div>
      </template>
      <template #description>
        <div class="share-title-description b_border">
          <div class="g_mb_s">
            <span class="color_blue">Tip :</span>
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
              <van-swipe  @change="swiperChangeHandle"  v-if="shareItem && shareItem.images && shareItem.images.length">
                <van-swipe-item v-for="(item, index) in shareItem.images" :key="index">
                  <img v-lazy="item" style="border-radius: 10px"/>
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
                autosize
                type="textarea"
                :placeholder="productDescription"
                show-word-limit
              />
            </div>
          </div>
        </div>
      </template>
    </van-share-sheet>
    <van-overlay :show="isLoading" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" />
      </div>
    </van-overlay>
  </section>


</template>

<script>

  import ShareProductModal  from "@/components/common/ShareProductModal";
  import  Header from '@/components/common/Header';
  import HomeGoodsModel from './childComponent/home_goods_list/home_goods_model';
  import HomeTopRank from './childComponent/home_goods_list/home_top_rank';
  import HomeHeadContent from './childComponent/home_head_content'
  import { homeBannerListApi ,topSupplierApi ,topicGoodsListApi  ,shareInfoApi,shareInitApi ,
    unReadMessageApi} from '@/api/home';
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import { uploadImageApi ,remindTimesApi ,commonBannerAdvListApi} from '@/api/common'
  import ScrollView from "@/components/common/ScrollView";
  import {getUserID ,getLoginInfo } from '@/utils/memory'
  import {trackTagFun } from '@/utils';
  import { loginRegisterPageBury} from '@/utils/buryPoint/buryPoint'
  import {getCurrentPageSpmID, setRefer, setRefSpm,setCurrentPage} from '@/utils/memory';
  import config from '@/config'
  export default {
    head(){
      return{
        title:'Home - shopshipshake'
      }
    },
    name: "index",
    components:{
      Header,
      HomeGoodsModel,
      HomeTopRank,
      HomeHeadContent,
      ShareProductModal,
      ScrollView,
    },
    beforeRouteEnter(to,from,next){
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      loginRegisterPageBury({
        p:'index',
        operate:'page',
        spm:`a0001.index.page.-1`
      })
      next();
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'index',
        operate:'close',
        spm:`a0001.index.close.${getCurrentPageSpmID()}`
      })
      next();
    },
    data(){
      return {
        bannerList:[],//banner数据
        top100ListInfo:{},//top100商品列表
        groupsBuyingList:[],//自有列表（暂无）
        hotSaleInfo:{
          title:'',//标题
          list:'',//列表
        },//热卖列表
        goodsList:[],//商品列表
        showShare:false,
        shareOptions:[
          { name: 'Download', icon: require('../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../assets/images/home/whatsapp.png') }
        ],
        description:'',//分享产品描述
        shareProductID:{},//分享的产品信息
        shareInfo:{},//分享的内容
        imgIndex:0,//轮播图的位置
        shareItem:{},//分享产品信息
        productDescription:'',
        ambassor:0,//1是大使，0 不是大使
        selectOrder:{},//选中上传的商品
        imageIndex:0,
        isLoading:false,
        imgInfo:{
          image:require('../../assets/images/advs/sale_banner.png'),
          url:''
        },
        unReadCount:0,
        detainImgInfo:{image:'',url:''}
      }
    },
    methods:{
      urlOperateHandle(type){
        switch (type) {
          case 'activity':
            if(!this.imgInfo.url) return;
            window.open(this.imgInfo.url,'online')
            break;
          case 'detain' :
            //滞留商品页面
            this.$router.push('/clearance/index')
            break;
          case 'back':
            this.$router.push('/message/index')
            break;
          case 'search':
            this.$router.push(`/shoppingmall/search/index?spm=a0001.index.search.0`)
            break;
        }
      },
      introBtnForPop(){
        let introJS = require('intro.js')
        introJS().setOptions({
          highlightClass:'intro-content',
          showStepNumbers: false,
          showProgress:false,
          showBullets:false,
          nextLabel:"<div >Next</div>", //下一步骤按钮的文字
          doneLabel:"<div>Done</div>", //下一步骤按钮的文字
          prevLabel:"<div>Back</div>", //下一步骤按钮的文字
          steps: [
            {
              intro:'<p >Hello!</p>' +
                '<p>Welcome to <span style="color:#fcc900">ShopShipShake</span></p>' +
                '<p>I will introduce new functions to you here</p>',
              position:'center'
            },
            {
              element: document.querySelector('.card-demo'),
              position:'bottom',
              intro:'<div class="intro-content"> <p>You could search keyword here,such like</p><img src="https://shop.shopshipshake.com/resources/images/searchimg.png" alt="" style="width:100%"/>' +
                '<p>Or paste item link from www.1688.com</p><p>Step 1：Enter <span style="color:#fcc900;">www.1688.com in Chrome</span> (Browser)</p>' +
                '<img src="https://shop.shopshipshake.com/resources/images/help_search.png" alt="" style="width:100%"/> <p>Step 2：Choose the item you want to buy and copy its link.</p><p style="font-size:13px;padding:10px 0;">Step 3：Back to ShopShipShake and paste link to search</p></div>'
            },
            {
              element: document.querySelector('.card-demo-2'),
              intro: '<p>Search by picture:<span style="color:#FCC900">Uploading picture</span>  of the ProductCard you want to buy</p>'
            },{
              element:document.querySelector('.card-demo-3'),
              intro:'<p>Contact with your bussiness Consultant，check his/her WhatsApp Number here.</p>',
              position: 'left'
            },{
              element: document.querySelector('.demo-intro'),
              intro:'<p>Click here to see <span style="font-size:14px;">GUIDANCE</span> again</p>'
            }]
        }).onbeforeexit(()=>{
          this.remindTimesHandle()
        }).start()
      },
      remindTimesHandle(){
        remindTimesApi(this.$config.noticeReadType.shop).then(res=>{
          this.$EventBus.$emit('popupEmit')
        })
      },
      introBtn(){
        this.$nextTick(()=>{
          let introJS = require('intro.js')
          introJS().setOptions({
            showStepNumbers: false,
            showBullets:false,
            showProgress:false,
            nextLabel:"<div  style='    margin: -9px -15px'>Next</div>", //下一步骤按钮的文字
            doneLabel:"<div style='    margin: -9px -15px'>Done</div>", //下一步骤按钮的文字
            prevLabel:"<div style='    margin: -9px -15px'>Back</div>", //下一步骤按钮的文字
            steps: [
              {
                element:document.querySelector('.demo-intro'),
                intro:'<p style="margin-bottom:15px;">Hello!</p>' +
                  '<p  style="margin-bottom:15px;">Welcome to <span style="color:#fcc900">ShopShipShake</span></p>' +
                  '<p>I will introduce new functions to you here</p>'
              },
              {
                element: document.querySelector('.card-demo'),
                intro:'<div class="intro-content"> ' +
                  '<p style="margin-bottom:10px;">You could search keyword here,such like</p><img src="https://shop.shopshipshake.com/resources/images/searchimg.png" alt="" style="width:100%"/>' +
                  '<p>Or paste item link from www.1688.com</p><p style="margin:8px 0;">Step 1：Enter <span style="color:#fcc900;">www.1688.com in Chrome</span> (Browser)</p>' +
                  '<img src="https://shop.shopshipshake.com/resources/images/help_search.png" alt="" style="width:100%"/> <p style="margin:8px 0;">Step 2：Choose the item you want to buy and copy its link.</p><p style="font-size:13px;padding:10px 0;">Step 3：Back to ShopShipShake and paste link to search</p></div>'
              },
              {
                element: document.querySelector('.card-demo-2'),
                intro: '<p >Search by picture:<span style="color:#FCC900">Uploading picture</span>  of the ProductCard you want to buy</p>'
              },{
                element:document.querySelector('.card-demo-3'),
                intro:'<p>Contact with your bussiness Consultant，check his/her WhatsApp Number here.</p>',
                position: 'left'
              }]
          }).start()
        })

      },
      shareInitHandle(id){
        shareInitApi(id).then(res=>{
          if(res.status==0){
            this.shareItem = res.data;
            this.ambassor = res.data.isambassadorpromotion || 0;
            this.productDescription = this.shareItem.title
          }else{
            this.$toast({message:'The product have been removed or expired'})
          }

        })
      },
      swiperChangeHandle(event){
        this.imgIndex = event;
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
          this.$toast({message: 'Download succeeded....' });
        }

      },
      showProductHandle(item){

        this.shareProductID = item.platformproductid ;
        this.showShare = true;
        this.shareInitHandle(this.shareProductID);      //获取图片信息
      },
      trackTagHandle(page,fun,index){
        trackTagFun({page,fun,index})
      },
      //确定分享
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
      //获取banner数据
      getBannerList(){
        homeBannerListApi().then(res=>{
          //保存banner数据
          this.bannerList = res;
        })
      },
      //获取top100数据
      getTopSupplier(){
        topSupplierApi().then(res=>{
          res.list = res.list.map(item=>{
            if(item.homeimage.indexOf(',')){
              item.homeimage = item.homeimage.split(',')[0]
            }
            return item;
          })
          this.top100ListInfo = res;
          /*添加到缓存中*/
          localStorage.setItem('top100Info',JSON.stringify({
            time:new Date().getTime(),
            list:this.top100ListInfo
          }))
        })
      },
      //获取全部商品列表
      getTopicGoodsList(){
        let newValue =[];
        this.goodsList =[];
        topicGoodsListApi().then(res=>{
          const { hotSale ,goodsList} = res;
          hotSale.productlist = hotSale.productlist.map(item=>{
            if(item.images.indexOf(',')){
              item.images = item.images.split(',')[0]
            }
            return item;
          })
          this.hotSaleInfo = {
            category:hotSale.category.id,
            title:hotSale.category.ename,
            list:hotSale.productlist
          };
          let value = goodsList.filter(item=>item.recordTotal!==0)
          value.forEach(item=>{
            item.productlist = item.productlist.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            newValue.push({
              title:item.category.ename,
              category:item.category.id,
              list:item.productlist
            })
          })
          this.goodsList = newValue;
          if(getUserID()){
            localStorage.removeItem('HomeProductModal_noLogin')
            localStorage.setItem('HomeProductModal',JSON.stringify({
              time:new Date().getTime(),
              hotSaleInfo:this.hotSaleInfo,
              topicGoodList:newValue
            }))
          }else{
            localStorage.setItem('HomeProductModal_noLogin',JSON.stringify({
              time:new Date().getTime(),
              hotSaleInfo:this.hotSaleInfo,
              topicGoodList:newValue
            }))
          }

        })

      },
      //  图片上传
      afterReadHandle(file){
        if(!getUserID()){
          this.$router.replace('/login')
        }else{
          this.isLoading = true;
          uploadImageApi(file).then(res=>{
            if(res.data.status==0){
              this.isLoading = false;
              this.$router.push({
                path:'/shoppingmall/imagesearch',
                query:{
                  key:res.data.data.key,
                  picurl:res.data.data.picurl,
                  fromType:'index',
                  spm:'a0001.p0001.imgsearch.r0'
                }
              })
            }else{
              this.isLoading = false;
              return this.$toast({message:res.data.message})
            }
          })
        }
      },
      getMessageCount(){
        if(getUserID()){
          unReadMessageApi().then(res=>{
            this.unReadCount =res? res.count:0
          })
        }
      },
      getModelProductList(){
        let homeProductModalObj ={}
        if(getUserID()){
          homeProductModalObj = JSON.parse(localStorage.getItem('HomeProductModal')) || {};
        }else{
          homeProductModalObj = JSON.parse(localStorage.getItem('HomeProductModal_noLogin')) || {}
        }
        let newTime = new Date().getTime();
        let homeProductModalTime = homeProductModalObj.time || 0;
        if(newTime - homeProductModalTime >60*10*1000){
          this.getTopicGoodsList();
        }else{
          this.hotSaleInfo = homeProductModalObj.hotSaleInfo;
          this. goodsList= homeProductModalObj.topicGoodList
        }

      },
      getBasicInfo(){
        this.getBannerList();
        this.getMessageCount();
        this.getTopicGoodsList();
        /*获取top100数据*/
        let newTime = new Date().getTime();
        let top100Obj = JSON.parse(localStorage.getItem('top100Info')) || {};
        let top100Time = top100Obj.time || 0;
        if(newTime - top100Time > 60*10*1000){
          this.getTopSupplier()
        }else{
          this.top100ListInfo = top100Obj.list || []
        }
        /*获取模块数据*/
        this.getModelProductList()
      },
      //获取banner图片
      getBannerAdv(){
        commonBannerAdvListApi('MOBILE_HOME').then(res=>{
          if(res){
            const {image,url} = res[0];
            this.imgInfo  = {image,url};
          }
        })
        //  滞留订单
        commonBannerAdvListApi('MOBILE_UNDER_SUPPLIER').then(res=>{
          if(res){
            const {image,url} = res[0];
            this.detainImgInfo  = {image,url};
          }
        })
      },
    },
    mounted() {
      //删除origurl
      this.getBasicInfo()
      this.getBannerAdv();
    },
    created() {
      this.$EventBus.$on('introBtnEmit',(result)=>{
        if(result==1){
          this.introBtnForPop()
        }
      })
    }
  }
</script>
<style scoped>

</style>
<style scoped lang="less">
  /deep/.introjs-button{
    padding:10px 15px;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .header-wrapper{
    position:relative;
    .close-tag{
      position: absolute;
      right:5px;
      top:10px;
      color:gray;
      font-size:18px;
      cursor: pointer;
    }
  }
  .content-title{
    font-size:15px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    margin-right:20px;
  }
  .text_l{
    justify-content: flex-start !important;
  }
  .content-time{
    font-size:13px;
    color:gray;
    text-align: left;
    padding-bottom:10px;
    padding-left: 8px;
  }
  .icon-xiaoxi{
    font-size:24px;
    color:gray;
  }
  .navbar-input-area{
    width:94%;
    height:32px;
    padding:0 6px;
    font-size:14px;
    border-radius: 20px;
    background-color: #FFFFFF;
    border:1px solid #e5e6e7;
  }
  .icon-kaitongxuzhi{
    font-size:24px;
    color:#FCC900;
  }


  .s3_index_container{
    padding:0 0 60px;
    .s3_home_end{
      text-align: center;
      color:#fcc900;
      padding-top: 10px;
    }
  }
  //banner
  .home_banner{
    margin-top:10px;
    img{
      width:100%;
      height:auto;
    }
  }
  /deep/ .van-nav-bar__title{
    min-width:270px;
  }
  /deep/ .van-nav-bar .van-icon{
    color:#fcc900;
  }
  .list-empty{
    display: flex;
    justify-content: center;
    align-items: center;
    margin:50px;
  }
  .scroll-container{
    width: 100%;
    height:calc(100vh - 46px);
    overflow-x:hidden;
    overflow-y:scroll
  }
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
  /deep/ .van-divider{
    margin:2px 0;
  }
  /deep/ .van-field__control{
    padding:2px 8px 0 8px;
    border-radius: 2px;
    margin-bottom: 4px;
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
  .home-navbar-input{
    position: relative;
    .camera_search{
      position:absolute;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      .s3_header_input_camera{
        font-size:22px;
      }
    }
  }
  /deep/.van-nav-bar .van-icon{
    display: none;
  }
  /deep/.van-field__control{
    height:34px;
    background-color: #eeeeed;
  }
  /deep/ .introjs-tooltiptext.intro-content{
    box-shadow: none !important;
    p{
      font-size:12px;
      padding:6px 0;
    }
  }
</style>
