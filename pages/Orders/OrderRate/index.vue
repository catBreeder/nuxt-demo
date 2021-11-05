<template>
 <div class="order-share-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="navbarOperateHandle('index')" @click-right="navbarOperateHandle('share')">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989" v-click-track="{triggerType:'click',fun:'intro'}"/>
         <span class="order-share-title">Rate your order</span>
       </template>
       <template #right>
         <van-tag round class="submit-tag" size="large">Submit</van-tag>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="orderShareScroll">
    <div class="order-share-content">
<!--      产品额外积分 start-->
      <div class="order-share-coin">
        <span> Tips : Get R1 by rating your purchase order</span>
        <span class="color_warning">with a order related picture</span>
        ; and extra R5 for sharing after you making the review.
      </div>
<!--      产品额外积分 end-->
<!--      产品描述 start-->
      <div class="order-info-box order-share-box-common">
          <van-row>
            <van-col span="4">
              <div class="order-info-img">
                <img src="https://cbu01.alicdn.com/img/ibank/O1CN01o55NNn1ZzPoiwRXdU_!!2207545813265-0-cib.jpg" alt="">
              </div>
            </van-col>
            <van-col span="19" offset="1">
              <div class="order-info-title">
                Sweater Letter Printing Fashion Casual Plus Size Women's Dress
              </div>
              <div>
                描述内容
              </div>
            </van-col>
          </van-row>
      </div>
<!--      产品描述 end-->
<!--      商品评价 start-->
      <div class="order-share-rate order-share-box-common">
        <div class="order-share-rate-title">
          Rate your Order
        </div>
        <van-row type="flex" align="center" class="g_mb_m">
          <van-col span="10">Overall Rating</van-col>
          <van-col span="14" ><van-rate v-model="rate.overall"  color="#fcc900"/></van-col>
        </van-row>
        <van-row type="flex" align="center" class="g_mb_m">
          <van-col span="10">International Logistic</van-col>
          <van-col span="14" ><van-rate v-model="rate.logistic"  color="#fcc900"/></van-col>
        </van-row>
        <van-row type="flex" align="center" class="g_mb_m">
          <van-col span="10">Client Service</van-col>
          <van-col span="14" ><van-rate v-model="rate.service"  color="#fcc900"/></van-col>
        </van-row>
      </div>
<!--      商品评价 end-->
<!--      商品评价 start-->
      <div class="order-share-input-box ">
        <div class="order-share-input">
          <van-field v-model="summary" class="g_mb_l" rows="4" type="textarea" maxlength="500" placeholder="Further comments are appreciated" show-word-limit/>
        </div>

<!--        上传图片-->
        <div class="order-share-upload">
          <van-uploader v-model="fileList" multiple :max-count="6" />
        </div>

      </div>
<!--      商品评价 end-->
    </div>
   </scroll-view>
 </div>
</template>

<script>
import CommonIndexHeader from "@/components/common/CommonIndexHeader";
import ScrollView from "@/components/common/ScrollView";
 export default {
   head(){
     return {
       title:'Orders Rate - shopshipshake'
     }
   },
   components:{CommonIndexHeader,ScrollView},
   data(){
     return{
       summary:'',
       fileList:[],//上传图片
       rate:{
         overall:3,
         logistic:4,
         service:5,
       }
     }
   },
    computed:{

      orderID(){return this.$route.params.id}

    },
    methods:{

      //获取订单详情
      getOrderInfo(){

      },
      //导航栏操作
      navbarOperateHandle(type){
        switch (type) {
            case 'index':
              this.$router.replace('/');
              break;
            case 'message':
              this.$router.push('/message/index')
        }
      }
    },

    mounted(){
      this.getOrderInfo()
    },


 }
</script>

<style scoped lang="less">

.order-share-wrapper{
  /deep/.van-nav-bar__content{
    background-color: #eee;
  }
  .order-share-title{
    font-size:15px;
    margin-left: 6px;
    color:#2A2A2A;
  }
  .submit-tag{
    background-color: darkorange;
    font-size:15px;
    font-weight: normal;
  }
/*  */
  .orderShareScroll{
    height:calc(100vh - 50PX - 46PX);
    background-color: #eee;
  }
  .order-share-content{
    margin:10px 8px;
    .order-share-coin{
      color:gray;
      font-size:13px;
      border-radius: 6px;
      margin-bottom: 8px;
      background-color: #fff;
      padding:10px;
      line-height: 1.6;
    }
    .order-share-rate{
      .order-share-rate-title{
        margin-bottom: 10px;
        color:grey;
        font-size:15px;
      }
    }
    .order-share-box-common{
      border-radius: 6px;
      margin-bottom: 8px;
      background-color: #fff;
      padding:10px;
    }
    .order-info-box{
      .order-info-img{
          img{
            width:100%;
            height:auto;
          }
      }
    }
    /*商品输入 开始*/
    .order-share-input-box{
      padding:10px 2px ;
      .order-share-input{
          padding:0 10px;
      }
      .order-share-upload{
        padding: 0 2px 0 8px;
      }
      /deep/.van-uploader__preview{
        margin: 0 5px 5px 0;
      }
      border-radius: 6px;
      margin-bottom: 8px;
      background-color: #fff;

      /deep/.van-cell{
        padding:6px;
        border-radius: 6px;
        background:#f0f0f0;
      }
      /deep/.van-cell::after{
        border-bottom:none;
      }
    }

    /*商品输入结束*/
  }
}
</style>
