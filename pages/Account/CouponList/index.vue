<template>
 <div class="coupon-list-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title><div class="navbar-title">Coupons</div></template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="scrollCommonHeightView" @reachBottom="loadMoreHandle">
     <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
     <template v-else>
       <div class="coupon-list-content">
         <div v-for="(item,index) in couponList" :key="index">
           <un-available-item v-if="item.useflg==1" :item="item" :index="index"/>
            <available-item v-else  :item="item" :index="index"/>
         </div>
         <div class="s3_home_end"><i class="icon iconfont icon-end"></i></div>
       </div>
     </template>

   </scroll-view>
 </div>
</template>
<script>
import {accountCouponApi} from '@/api/account'
import ScrollView from "@/components/common/ScrollView";
import AvailableItem from "./AvailableItem";
import UnAvailableItem from "./UnAvailableItem";
 export default {
   head(){
     return {
       title:'Coupons - shopshipshake'
     }
   },
   data(){
      return{
        tabIndex:0,
        couponList:[],
        isLoading:false,
        page:1,
        pageCount:1
      }
   },
   components:{
     ScrollView,
     AvailableItem,
     UnAvailableItem
   },
    methods:{
      loadMoreHandle(){
        if(this.page> this.pageCount) return;
        this.page++;
        accountCouponApi(this.page).then(res=>{
          if(res.status==0){
            this.couponList = [...this.couponList,...res.data.list];
          }
        })
      },

      goBackHandle(){
        this.$router.back()
      },
      goOtherUrlHandle(type){
        switch (type) {
          case 'index':
            this.$router.replace('/');
            this.$EventBus.$emit('toIndex')
            break
          case 'message':
            this.$router.push('/message/index')
            break;
        }

      },
      getCouponList(){
        this.isLoading = true;
        accountCouponApi(this.page).then(res=>{
          if(res.status==0){
            this.couponList = res.data.list || [];
            this.pageCount = res.data.pageCount;
          }
          console.log(this.couponList);
          this.isLoading = false;
        })
      }
    },
    mounted() {
       this.getCouponList();
     },


 }
</script>

<style scoped lang="less">

  /deep/.van-tab__text{
    font-size:16px;
  }
  /deep/.van-nav-bar{
    box-shadow: none;
  }
  /deep/.van-tag--large{
    font-size:15px;
    padding:8px 12px;
  }
  .s3_home_end{
    margin: 30px auto;
    text-align: center;
    color:#9e9e9e;
  }
  .status-name {
    font-size: 28px;
    color: #999;
    font-style: italic;
    text-align: center;
  }
  .coupon-list-content{
    padding:20px 15px;

  }

</style>
