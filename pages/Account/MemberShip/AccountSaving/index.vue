<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Money-saving Bills</template>
        </van-nav-bar>
      </van-sticky>
      <div class="saving-content">
        <div class="saving-user">{{savingInfo.customername}}</div>
        <div class="saving-intro">From {{savingInfo.firsttime}}, you have been enjoying {{savingInfo.vipgradename}} membership for {{savingInfo.days}} days.</div>
        <div class="circle-content">
          <div class="circle-inner">
            <div class="font_size_18">Saving</div>
            <div class="saving-count">R{{savingInfo.total}}</div>
          </div>
        </div>
        <div class="saving-detail font_size_18">
          <van-row class="g_mb_l">
            <van-col :span="10" :offset="1">Discount</van-col>
            <van-col :span="10" :offset="1">Saving R{{savingInfo.discount}}</van-col>
          </van-row>
          <van-row class="g_mb_l">
            <van-col :span="10" :offset="1">Coupon</van-col>
            <van-col :span="10" :offset="1">Saving R{{savingInfo.coupon}}</van-col>
          </van-row>
          <van-row class="g_mb_l">
            <van-col :span="10" :offset="1">Quality inspection</van-col>
            <van-col :span="10" :offset="1">Saving R{{savingInfo.qualityinspection}}</van-col>
          </van-row>
          <van-row class="g_mb_l">
            <van-col :span="10" :offset="1">Refund</van-col>
            <van-col :span="10" :offset="1">Saving R{{savingInfo.refund}}</van-col>
          </van-row>
        </div>
      </div>
    </div>
</template>

<script>
    import {accountMemberShipSavingApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Money-saving Bills - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            savingInfo:{}
          }
        },
        methods:{
          goBackHandle(){
            this.$router.back()
          },
          getSavingHandle(){
            accountMemberShipSavingApi().then(res=>{
              this.savingInfo = res || {}
            })
          }
        },
      mounted() {
          this.getSavingHandle()
      }
    }
</script>

<style scoped lang="less">
.saving-content{
  padding:20px 15px;
  .saving-user{
    text-align: center;
    font-size:22px;
    margin-bottom: 15px;
  }
  .saving-intro{
    font-size:14px;
    line-height:1.7;
    text-align: center;
    margin-bottom: 25px;
  }
  .circle-content{
    height: 210px;
    width: 210px;
    border-radius: 50%;
    border: 1px solid;
    margin: 0 auto;
    background: #000;
    color: #f8ac59;
  }
  .circle-inner{
    height: 210px;
    width: 210px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    color: #f8ac59;
    .saving-count{
      font-size:40PX;
      margin-top: 10px;
    }
  }
  .saving-detail{
    margin-top: 25px;
  }
}
</style>
