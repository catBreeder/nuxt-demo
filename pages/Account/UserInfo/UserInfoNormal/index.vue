<template>
  <div class="profile-card-content" v-if="userInfo">
    <div class="info-item d_flex d_flex_between">
      <div class="info-item-intro">Name:</div>
      <div class="info-item-title d_flex">
        <div >{{userInfo.name||userInfo.cellphone}}</div>
        <div v-if="customervip!=null&&customervip.vipgradeid > 0" class="d_flex">
          <img  :src="vipImg" class="vip-img"/>
          <span class="font_size_14 color_blue">(Valid until {{expiredtime}})</span>
        </div>

      </div>
    </div>
    <div class="info-item d_flex d_flex_between">
      <div class="info-item-intro">Mobile Number:</div>
      <div class="info-item-title">
        {{userInfo.countrycode?userInfo.countrycode:''}}-{{userInfo.cellphone?userInfo.cellphone:''}}
      </div>
    </div>
    <div class="info-item d_flex_between d_flex">
      <div class="info-item-intro">Email:</div>
      <div class="info-item-title">{{userInfo?userInfo.email:''}}</div>
    </div>
    <div class="info-item d_flex_between d_flex">
      <div class="info-item-intro">Ref No.：</div>
      <div class="info-item-title">{{userInfo?userInfo.paycode:''}}</div>
    </div>
    <div class="info-item d_flex_between d_flex">
      <div class="info-item-intro ">Balance：</div>
      <div class="info-item-title " v-if="userInfo">{{userInfo.balance /100}}&nbsp;{{currency}}</div>
    </div>
  </div>
</template>
<script>
  import {getUserID} from "@/utils/memory";

  export default {
    name:'index',
    props:{
      userInfo:{type:Object,default:()=>{}},
      customervip:{type:Object,default:()=>{}},
      currency:{type:String},
      expiredtime:{type:String},
      surveyCount:{type:Number},
    },
    computed:{
      vipImg(){
        if(this.customervip!=null&&this.customervip.vipgradeid > 0){
          return require(`../../../../assets/images/vip/vip${this.customervip.vipgradeid}.png`)
        }

      }
    },
    methods:{
      //验证手机号
      verifyHandle(){
        let url = `${this.$config.jianweiDomain}/customertask/todo/verifypage?id=${getUserID()}&verifytype=0&fromtype=0&origUrl=/user/info`;
        window.open(url,'online')
      }
    },
  }
</script>
<style scoped lang="less">
  .profile-card-content{
    padding:10px;
    border:1px solid #EEEEEE;
    margin:6px;
    border-radius: 4px;
    .info-item{
      font-size:15px;
      border-bottom:1px solid #EEEEEE;
      .info-item-intro{
        padding:10px;
        color:gray;
      }
      .info-item-title{
        padding:10px 15px;
      }
      .vip-img{
        width: 20PX;
        height: 20PX;
        margin:0 4px 0 10px;
        img{
          width:100%;
        }
      }
    }
  }
</style>
