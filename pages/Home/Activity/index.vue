<template>
 <div class="activity_wrapper">
   <van-sticky z-index="1">
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>{{activityTitle}}</template>
     </van-nav-bar>
   </van-sticky>
   <template v-if="fromType=='source' || fromType=='via' ||  fromType=='kilo' || fromType=='season'">
      <normal-model
        @shareProductEmit="shareProductHandle"
        @activityTitleEmit="activityTitleHandle"
        :fromType="fromType"
        @goOtherURLEmit="goOtherURLHandle"/>
   </template>
  <template v-else-if="fromType=='updated'">
    <update-model @shareProductEmit="shareProductHandle"  @activityTitleEmit="activityTitleHandle"  @goOtherURLEmit="goOtherURLHandle"/>
  </template>
  <template v-else-if="fromType=='sale'">
    <sale-model  @activityTitleEmit="activityTitleHandle" @shareProductEmit="shareProductHandle"  @likeDetailEmit="likeDetailHandle" @goOtherURLEmit="goOtherURLHandle"/>
  </template>
   <!--    显示分享狂-->
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
               show-word-limit
             />
           </div>
         </div>
       </div>
     </template>
   </van-share-sheet>
 </div>
</template>
<script>
  /*
  * 当前页面fromType类型：source(源头工程) via（运输方式） updated(上新榜) kilo(各公斤段) sale(爆款热销)
  * */

import {shareInitApi ,shareInfoApi } from '@/api/home'
import NormalModel from "./Model/NormalModel";
import UpdateModel from './Model/UpdateModel'
import { getLoginInfo } from '@/utils/memory'
import SaleModel from './Model/SaleModel'
import { trackTagFun} from '@/utils';
import { gTagFun } from '@/utils/buryPoint/gTag'
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm,setCurrentPage} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import seoSetting from '@/config/seoSetting'
 export default {
   head(){
     return {
       title:`${this.title}-shopshipshake`,
       meta:[
         {
           hid:'description',
           name:'description',
           content:this.description
         },
         {
           hid:'keywords',
           name:'keywords',
           content:this.keywords
         }
       ]
     }
   },
  components:{ NormalModel,UpdateModel ,SaleModel},
   data(){
      return{
        shareOptions:[
          { name: 'Download', icon: require('../../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../../assets/images/home/whatsapp.png') },
        ],
        shareProductID:'',
        showShare:false,
        shareItem:{},
        ambassor:'',
        productDescription:'',
        shareInfo:{},
        activityTitle:''

      }
   },
    computed:{
      fromType(){return this.$route.params.type},
    },
     beforeRouteLeave(to,from,next){
       loginRegisterPageBury({
         p:getCurrentPageSpmID(),
         operate:'close',
         spm:`a0001.${this.$route.params.type}.close.${getCurrentPageSpmID()}`
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
           p:to.params.type,
           operate:'page',
           spm:`a0001.${to.params.type}.page.-1`
         })
         next();
     },
    methods:{

      likeDetailHandle(result){
        loginRegisterPageBury({
          p:`专题活动_${this.$route.params.type}`,
          spm:`a0001.${this.$route.params.type}.offerlist.hot_${result.index}.${getCurrentPageSpmID()}`,
          operate:'click'
        })
        window.open(`${this.$config.jianweiDomain}/search?productid=${result.item.platformproductid}&spm=a0001.${this.$route.params.type}.offerlist.${result.index}.${getCurrentPageSpmID()}`,'online')
      },
      goOtherURLHandle(result){
        //谷歌埋点
        loginRegisterPageBury({
          p:`专题活动_${this.$route.params.type}`,
          spm:`a0001.${this.$route.params.type}.offerlist.${result.index}.${getCurrentPageSpmID()}`,
          operate:'click'
        })

        window.open(`${this.$config.jianweiDomain}/search?productid=${result.item.platformproductid}&spm=a0001.${this.$route.params.type}.offerlist.${result.index}.${getCurrentPageSpmID()}`,'online')
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
      changeDespHandle(event){
        this.shareInfo = event;
      },
      swiperChangeHandle(event){
        this.imgIndex = event;
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
      //确定分享
      trackTagHandle(page,fun,index){
        trackTagFun({page,fun,index})
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
      shareProductHandle(item){
        this.shareProductID = item.platformproductid;
        this.showShare = true;
        this.shareInitHandle(this.shareProductID);
      },
        //获取专题标题
      activityTitleHandle(result){
        this.activityTitle = result;
      },
      goBackHandle(){
        this.$router.replace('/')
      },
    },
    asyncData({route}){
      let currentPageSeoSetting = seoSetting.find(item=>item.path == route.path);
      if(currentPageSeoSetting){
        return currentPageSeoSetting
      }

    },
    mounted(){
        this.activityRef = this.$refs.activityRef;
        this.$sensors.track("pageview",{title:config.analysisTitleType[this.$route.params.type]});
    },
   created() {

   }


 }
</script>

<style scoped lang="less">
  .share-product-info{
    .share-product-info-img-description{
      /deep/.van-cell__value{
        display: block;
      }
    }
  }
  /deep/.van-dropdown-item__option{
    height:46px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    overflow:hidden;
    font-size: 15px;
    padding:0 5px;
  }
  /deep/.van-dropdown-menu__bar{
    height:37px;
    box-shadow: none;
    border-right:0.5px solid #EEEEED;
    border-top:0.5px solid #EEEEED;
  }
  /deep/.van-popup--top{
    width:50%;
  }
  /deep/.van-nav-bar{
    background: #fcc900;
    box-shadow: none;
  }

  /deep/.van-field__body{
    background:#EEEEED;
    border-radius: 6px;
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


</style>
