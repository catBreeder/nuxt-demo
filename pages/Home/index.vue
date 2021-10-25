<template>
  <div class="g_bg s3-home-wrapper" id="s3-home-wrapper">
    <van-nav-bar  border  @click-left="introBtn" @click-right="urlOperateHandle('back')">
      <template #left>
        <i class="icon iconfont icon-kaitongxuzhi demo-intro" />
      </template>
      <template #title>
        <div class="home-navbar-input">
          <input type="text" class="navbar-input-area card-demo" readonly
                 placeholder="paste keyword or 1688 link" @click="urlOperateHandle('search')" >
          <van-uploader :after-read="afterReadHandle"
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
  </div>
</template>

<script>
export default {
  head(){
    return{
      
    }
  },
  data(){
    return{
    unReadCount:0,
    }
  },
  asyncData() {
    
  },
  methods:{
    //获取消息数量

      //  图片上传
    afterReadHandle(file){
      // if(!getUserID()){
      //   this.$router.replace('/login')
      // }else{
      //   this.isLoading = true;
      //   uploadImageApi(file).then(res=>{
      //     if(res.data.status==0){
      //       this.isLoading = false;
      //       this.$router.push({
      //         path:'/shoppingmall/imagesearch',
      //         query:{
      //           key:res.data.data.key,
      //           picurl:res.data.data.picurl,
      //           fromType:'index',
      //           spm:'a0001.p0001.imgsearch.r0'
      //         }
      //       })
      //     }else{
      //       this.isLoading = false;
      //       return this.$toast({message:res.data.message})
      //     }
      //   })
      // }
    },
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
      introBtn(){
      this.$nextTick(()=>{
        let introJS = require('intro.js')
        introJS().setOptions({
          showStepNumbers: false,
          showBullets:false,
          showProgress:false,
          nextLabel:"<div >Next</div>", //下一步骤按钮的文字
          doneLabel:"<div>Done</div>", //下一步骤按钮的文字
          prevLabel:"<div>Back</div>", //下一步骤按钮的文字
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
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="less">
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
