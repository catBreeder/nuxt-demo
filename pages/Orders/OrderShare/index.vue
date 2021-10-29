<template>
 <div class="share-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle" >
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title>
           <div class="navbar-title">Share</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="shareScrollView">
     <van-notice-bar wrapable :scrollable="false" background="#23c6c8" text="Step1:  Share"/>
     <div class="share-operate-box">
       <div class="operate-item">
         <div class="operate-img">
           <img src="~assets/images/orders/facebook.svg" alt="">
         </div>
        <div class="operate-title">facebook</div>
       </div>
       <div class="operate-item">
         <div class="operate-img">
           <img src="~/assets/images/orders/Whatsapp.svg" alt="">
         </div>
         <div class="operate-title">whatsapp</div>
       </div>
     </div>
     <van-notice-bar wrapable :scrollable="false" background="#23c6c8" text="Step2: Upload the screenshot about your sharing"/>
     <div class="share-upload-box">
       <div class="show-img-box">
          <div>
            <img src="https://i01piccdn.sogoucdn.com/cbc9ce798c371441" alt="">
          </div>
         <van-uploader :after-read="afterReadHandle">
           <van-button class="upload-btn">Select Image</van-button>
         </van-uploader>
         <div class="g_mt_l">Requirement: in any related WtsApp/FB group(50 members) or your Facebook (200 followers) </div>
         <div class="commit-btn-area">
           <van-button class="commit-btn">Apply</van-button>
         </div>
       </div>

     </div>
     <van-notice-bar wrapable :scrollable="false" background="#23c6c8" text="Step3: Wait for validation"/>
      <div class="validate-box">

        R5 will be awarded after validation

      </div>
   </scroll-view>
 </div>
</template>

<script>


import ScrollView from "@/components/common/ScrollView";

 export default {
   head(){
     return {
       title:'Orders Share - shopshipshake'
     }
   },
   components:{ScrollView},
    methods:{
      //返回上一页
      goBackHandle(){
        this.$router.go(-1)



      },
      //s上传图片
      afterReadHandle(file){

      }
    },

 }
</script>

<style scoped lang="less">
  .share-wrapper{
    .shareScrollView{
      height:calc(100vh - 50px - 48px);
      background-color: #eee;
    }
    /deep/.van-notice-bar{
      font-weight: bold;
      color:#2A2A2A;
    }
    .share-operate-box{
      background-color: #fff;
      padding:20px;
      display: flex;
      align-items: center;
      .operate-item{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 20px;
        .operate-img{
          width:50px;
          height:50px;
          border-radius: 50%;
          box-shadow: 0 2px 5px grey;

        }
        .operate-title{
          margin-top:6px;
          color:#333;
        }
      }
    }
    .share-upload-box{
      padding:20px;
      font-size:13px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .show-img-box{
        line-height: 36px;
        color:#333;
        width: 80%;
        margin: 0 auto;
        margin-bottom: 10px;
        img{
          width:100%;
        }
      }
      .upload-btn{
        border:1px solid #1c84c6;
        color:#1c84c6;
        border-radius: 4px;
        width:100%;
        font-size:16px;
      }
      /deep/.van-uploader{
        width:100%;
      }
      .commit-btn-area{
        padding:20px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .commit-btn{
          background-color: #fcc900;
          font-size:16px;
          border-radius: 4px;
        }
      }

    }
    .validate-box{
      background-color: #ffffff;
      padding: 20px;
    }
  }
</style>
