<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <div class="d_flex">
           <van-icon name="arrow-left"  size="24" color="#fff"/>
         </div>
       </template>
       <template #title>
         <div class="navbar">Time Limited Coupon Snatching</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="specialScroll">
     <div class="container swiper_container g_mb_l">
       <img src="~assets/images/home/special.png" alt="">
     </div>
     <div class="special-content">
       <div class="special-content-top" v-if="couponlist.length">
         <van-notice-bar  text=" Today's Special"/>
         <div class="special-list" v-for="(item,index) in couponlist" :key="index">
           <avaliable-coupon v-if="item.currentqty >0 && specialInfo.now >= item.starttime &&  specialInfo.now <item.endtime" >
             <div slot="money"><span>R</span>{{item.coupon.money}}</div>
             <div slot="leftBottomSlot">
               <span v-if="item.coupon.minmoney>0">Use on order over  {{item.coupon.minmoney}}R</span>
               <span v-else>No limit</span>
             </div>
             <div slot="rightTopSlot">{{item.coupon.usetype | activityCouponFilter}}</div>
             <div slot="rightBottomSlot" class="color_intro period-tag">In {{item.coupon.period}} days after collection</div>
           </avaliable-coupon>
<!--           不可用-->
           <un-avaliable-coupon v-else>
             <div slot="money"><span>R</span>{{item.coupon.money}}</div>
             <div slot="leftBottomSlot">
               <span v-if="item.coupon.minmoney>0">Use on order over  {{item.coupon.minmoney}}R</span>
               <span v-else>No limit</span>
             </div>
             <div slot="rightTopSlot">{{item.coupon.usetype | activityCouponFilter}}</div>
             <div slot="rightBottomSlot" class="color_intro period-tag">In {{item.coupon.period}} days after collection</div>
           </un-avaliable-coupon>
<!--           还未到期-->
           <div class="d_flex d_flex_end" v-if="item.currentqty<=0 || specialInfo.now > item.endtime">
             <div class="time-btn time-btn-disable">
               Run Out
             </div>
           </div>
           <template v-else>
             <div class="d_flex d_flex_end" v-if="item.starttime - specialInfo.now >= 0">
               <div class="time-btn time-btn-waiting d_flex">
                 <van-count-down :time="item.starttime -  specialInfo.now" />&nbsp; <span class="togo-intro">to go</span>
               </div>
             </div>
             <div class="d_flex d_flex_end g_mt_l g_mb_l " v-else>
               <div class="time-btn time-btn-during" v-login-register-track="{triggerType:'click',page:'todaySpecial',operate:'get it now'}"  @click="catchCouponHandle(item)">
                 Get it now
               </div>
             </div>
           </template>
         </div>
       </div>
       <div class="special-content-bottom" v-if="specialInfo.num==0 && specialInfo.nextSnatchCouponTime" >
         <van-notice-bar  text=" Tomorrow's Special"/>
         <div class="tomorrow-box d_flex d_flex_between">
           <div class="tomorrow-left">
             <img src="~assets/images/common/timeup.gif" alt="">
           </div>
           <div class="tomorrow-right">
             <div class="title"> We will see you in tomorrow</div>
             <van-tag type="warning" size="large">{{specialInfo.nextSnatchCouponTime}}</van-tag>
           </div>
         </div>
       </div>

       <div class="tomorrow-rules">
         <van-notice-bar  text="Rules"/>
         <div class="tomorrow-rules-list">
           <div class="g_mb_m">1. The game starts at {{specialInfo.rules_starttime?specialInfo.rules_starttime : '11 AM'}} everyday and the coupon quantity is limitied. Don't forget to set an alarm.</div>

           <div class="g_mb_m">2. One person can only get one coupon in this game.</div>

           <div class="g_mb_m"> 3. The coupon's period of validity is {{specialInfo.rules_period?specialInfo.rules_period :'30'}} days.</div>

           <div class="g_mb_m"> 4. All SSS users can take part in.</div>
         </div>

       </div>
     </div>
   </scroll-view>
 </div>
</template>
<script>
import AvaliableCoupon from '@/components/content/avaliableCoupon';
import unAvaliableCoupon from '@/components/content/unAvaliableCoupon'
import ScrollView from "@/components/common/ScrollView";
import {activityRulesApi ,activitySnatchApi } from '@/api/home'
import {getCurrentPageSpmID, setRefer, setRefSpm,setCurrentPage} from '@/utils/memory'
import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
import config from '@/config'
 export default {
   head(){
     return {
       title:'Today\'s Coupons - shopshipshake'
     }
   },
   beforeRouteLeave(to,from,next){
     loginRegisterPageBury({
       p:'todaySpecial',
       operate:'close',
       spm:`a0001.todaySpecial.close.${getCurrentPageSpmID()}`
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
       p:'todaySpecial',
       operate:'page',
       spm:`a0001.todaySpecial.page.-1`
     })
     next();
   },
   data(){
      return{
        specialInfo:{},
        couponlist:[]
      }
   },
   components:{ScrollView ,AvaliableCoupon ,unAvaliableCoupon},
    methods:{
      //点击优惠卷
      catchCouponHandle(item){
        activitySnatchApi(item.id).then(res=>{
          if(res.status==400){
            this.$toast.fail({message:res.message})
          }else if(res.status ==0){
            this.$toast.success({message:'Congrats!'})
          }else if(res.status==403){
            this.$router.replace(`/login?origUrl=${res.data}`)
          }
          this.getActivityRules()
        })

      },
      goBackHandle(){
        this.$router.replace('/')
      },
      getActivityRules(){
        activityRulesApi().then(res=>{
         this.specialInfo = res;
         this.couponlist = res.couponlist || [];
         if(this.specialInfo.minstarttime - this.specialInfo.now >0){
           setTimeout(()=>{
              this.getActivityRules()
           },this.specialInfo.minstarttime - this.specialInfo.now)
         }

        })
      }

    },
    mounted(){
        this.getActivityRules();
    }

 }
</script>

<style scoped lang="less">
  .togo-intro{
    color:#323233;
  }
  .period-tag{
    font-size:15px;
  }
  /deep/.van-nav-bar__content{
    background-color:#FFA54F;
  }
  /deep/.van-hairline--bottom::after{
    border-bottom:none;
  }
  /deep/.van-nav-bar{
    box-shadow: none;
  }
  .tomorrow-rules{
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 70px;
    .tomorrow-rules-list{
      padding:15px 10px;
      line-height:1.4;
      font-size:15px;
    }
  }
  .special-content{
    padding:0 6px;
    .special-content-top,.special-content-bottom{
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
    }

  }
  .navbar{
    color:#fff;
    font-size:14px;
  }
  .tomorrow-box{
    padding:10px;
    background-color: #fff;
      .tomorrow-left{
        width:100px;
        height:100px;
        img{
          width: 100%;
          height:100%;
        }
      }
      .tomorrow-right{
        .title{
          font-size:16px;
          line-height: 1.5;
          font-weight: bold;
          margin-bottom: 10px;
        }
      }
  }
  .time-btn{
    margin-right:15px;
    border-radius: 10px;
    padding:10px 20px;
    font-size:16px;
  }
  .rest-num{
    font-size:18px;
    color:cornflowerblue;
    padding-left:15px;

  }
  .time-btn-disable{
    background: #9e9e9e;
  }
  .time-btn-during{
    background-color: #fcc900;
  }
  .time-btn-waiting{
    background-color: lightskyblue;
  }
  .colon {
    display: inline-block;
    margin: 0 4px;
    color: #ee0a24;
  }
  .block {
    display: inline-block;
    width: 22px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background-color: #ee0a24;
  }
  /deep/.van-notice-bar__content{
    font-size:18px;
    font-weight: bold;
  }
  .special-list{
    padding:20px 10px 10px;
  }
  .swiper_container{
    padding:15px 6px 20px;
    background-color: #FFA54F;
    border-radius: 0 0 20px 20px;
    img{
      width: 100%;
      height:auto;
      border-radius: 6px;
    }
  }
  .special-title{
    font-weight: bold;
    font-size:14px;
  }
.specialScroll{
  height:calc(100vh - 50PX - 50PX);
  background-color: #EEEEED;
}
</style>
