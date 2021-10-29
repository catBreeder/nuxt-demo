<template>
  <common-nav-bar @clickLeftEvent="clickLeftEvent" jc_right="center" :jc_width="50" jc_center="center">
    <div slot="left">
      <van-icon name="arrow-left" size="24" color="#8B8989" slot="left" />
    </div>
    <div slot="content" class="navbar-input-warpper">
      <input type="text" v-model="titleProp" readonly class="navbar-input" @click="toSearchHandle">
      <van-uploader :after-read.stop="afterReadHandle"
                    v-img-upload="{triggerType:'click',p:'查询结果页面',position:'category_product'}"
                    max-count="1" class="camera_search">
        <i class="icon iconfont icon-zhaoxiangji s3_header_input_camera"    />
      </van-uploader>

    </div>
    <div slot="right">
      <i class="icon iconfont icon-sousuo" @click="goSearchHandle" />
    </div>
  </common-nav-bar>
</template>

<script>
import CommonNavBar from '@/components/common/CommonNavBar';
import { uploadImageApi } from '@/api/common'
import {getUserTicket } from '@/utils/memory'
export default {
  name: "navbar-from-keyword",
  components:{CommonNavBar},
  props:['titleProp'],
  data(){
    return{
      isVisible:false,

      introIndex:null
    }
  },
  methods:{
    toSearchHandle(){
      this.$router.push(`/shoppingmall/search/category?spm=a0001.p0003.searchkey.0`)
    },
    clickLeftEvent(){
      this.$emit('click-left')
    },
    //前往search页面
    goSearchHandle(){
      this.$router.push('/shoppingmall/search/category')
    },
    //  图片上传
    afterReadHandle(file){
      if(!getUserTicket()){
        this.$router.replace('/login')
      }else{
        uploadImageApi(file).then(res=>{
          if(res.data.status==0){
            this.$router.push({
              path:'/shoppingmall/imagesearch',
              query:{
                key:res.data.data.key,
                picurl:res.data.data.picurl,
                fromType:'keyword',
                spm:'a0001.p0003.imgsearch.r0'
              }
            })
          }else{
            return this.$toast({message:res.data.message})
          }
        })
      }
    },
  }
}
</script>

<style scoped lang="less">
  .icon-sousuo{
    font-size:24px;
    color:lightgrey;
  }
/deep/.van-dropdown-menu__title::after{
  display: none !important;
}
/deep/.van-dropdown-menu__bar{
  height:46px !important;
  border-bottom:1px solid #EEEEED;
  box-shadow: none;
  background-color: transparent;
}
/deep/.van-dropdown-menu__title{
  padding:0;
  line-height:1;
  color:#2A2A2A;
}
/deep/.van-popup--top{
  left:50% !important;
}
.navbar-container{
  display: flex;
  align-items: center;
  .nav-left{}
  .nav-center{}
  .nav-right{}
}
.icon-shenglvehao{
  font-size:29px;
  color:#FCC900;
}
.s3-search-content{
  background-color: green;
}

/deep/ .van-search__content{
  padding:0 8px ;
  border-radius: 6px;
  width:270px;
  height:32px;
}
/deep/ .van-search__content{
  border-radius: 20px;
  background: #fff;
  border: 1px solid #eeeeed
}
/deep/.van-icon-search{
  display: none !important;
}
.navbar-input-warpper{
  position:relative;
  .navbar-input{
    width: 270px;
    height:32px;
    line-height:32px;
    padding:0 8px;
    border:1px solid #EEEEED;
    border-radius: 15px;
  }
  .camera_search{
    position:absolute;
    top:50%;
    right:10px;
    transform:translateY(-50%);
    .s3_header_input_camera{
      font-size:24px;
      color:gray;
    }
  }
}
</style>
