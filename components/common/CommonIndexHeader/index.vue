<template>
  <van-nav-bar  border @click-left="clickLeftHandle" @click-right="clickRightHandle">
    <template #left>
      <slot name="left"></slot>
    </template>
    <template #title>
      <div class="home-navbar-input">
        <input type="text" class="navbar-input-area card-demo" readonly
               placeholder="paste keyword or 1688 link"
               v-click-track="{triggerType:'click',fun:'search'}"
               @click="goSearchHandle" >
        <van-uploader :after-read.stop="afterReadHandle"
                      v-img-upload="{triggerType:'click',p:'首页'}"
                      max-count="1" class="camera_search card-demo-2"  v-intro="'The content of tooltip'"
                      v-intro-step="2">
          <i class="icon iconfont icon-zhaoxiangji s3_header_input_camera"  ></i>
        </van-uploader>
      </div>
    </template>
    <template #right>
      <van-badge   :content="unReadCount || ''" max="99">
        <i class="icon iconfont icon-xiaoxi"
           v-click-track="{triggerType:'click',fun:'message'}"></i>
      </van-badge>
    </template>
  </van-nav-bar>
</template>

<script>
  import { uploadImageApi } from '@/api/common';
  import {unReadMessageApi} from '@/api/home'
  import {getUserID} from '@/utils/memory'
  export default {
    name: "index",
    props:{
      page:String,
    },
    data(){
      return{
        unReadCount:0
      }
    },
    methods:{
      clickLeftHandle(){
        this.$emit('clickLeftEmit')
      },
      clickRightHandle(){
        this.$emit('clickRightEmit')
      },
      //前往search页面
      goSearchHandle(){
        this.$router.push('/shoppingmall/search/index')
      },
      //  图片上传
      afterReadHandle(file){
        if(!getUserID()){
          this.$router.replace('/login')
        }else{
          uploadImageApi(file).then(res=>{
            if(res.data.status==="00000"){
              this.$router.push({
                path:'/shoppingmall/imagesearch',
                query:{
                  key:res.data.data.key,
                  picurl:res.data.data.picurl
                }
              })
            }else{
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
    },
      mounted() {
        this.getMessageCount()
      }

  }
</script>

<style scoped lang="less">

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
  .navbar-input-area{
    width:94%;
    height:32px;
    padding:0 6px;
    font-size:14px;
    border-radius: 20px;
    background-color: #FFFFFF;
    border:1px solid #e5e6e7;
  }
  .icon-xiaoxi{
    font-size:24px;
    color:#8B7E66;
  }
  /deep/ .van-nav-bar__title{
    min-width:270px;
  }
</style>
