<template>
  <div class="account-scoin-wrapper">
    <van-sticky>
      <van-nav-bar border @click-left="goBackHandle" @click-right="checkInfoHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <strong>S Coin</strong>
        </template>
        <template #right>
          <van-icon name="question-o"  size="23" color="#2a2a2a"/>
        </template>
      </van-nav-bar>

    </van-sticky>
    <div>
      <div class="account-scoin-box">
        <div class="account-scoin-money">💰&nbsp;&nbsp;{{totalScoin }}</div>
        <div class="account-scoin-details"><router-link to="/scoin/detail">View details</router-link></div>
        <div class="account-scoin-expired">To be expired this month: {{scoin.expiredscoin?scoin.expiredscoin:0}}</div>
      </div>
      <van-notice-bar
        :scrollable="false"
        text="Exchange S coin to membership:"
      />
      <div class="vip-content">
        <van-row :gutter="10">
          <van-col :span="8" v-for="(item,index) in vipList" :key="index" @click="checkMemberShipHandle(item)">
            <div class="vip-item-card">
              <div class="vip-item-title font_size_18 g_mb_l">{{item.vipgradename}}</div>
              <div class="vip-item-title-intro font_size_15 g_mb_m">As low as</div>
              <template v-if="item.hasDiscount">
                <div class="vip-item-money-discount">{{item.scoin}} S Coin</div>
                <div class="vip-item-money">{{item.specialscoin}} S Coin</div>
              </template>
              <div class="vip-item-money  " :class="{ 'g_mt_l':!item.hasDiscount}" v-else>{{item.scoin}} S Coin</div>
              <div class=" font_size_15 g_mb_m " :class="{
                'g_mt_l':!item.hasDiscount,
                'g_mt_s':item.hasDiscount
                }">pre month</div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {accountScoinIndexApi} from '@/api/account'
export default {
  head(){
    return {
      title:'Points - shopshipshake'
    }
  },
  name: "index",
  data(){
    return{
      scoin:{},
      vipList:[]
    }
  },
  computed:{
    totalScoin(){
      return this.scoin.scoinsum?this.scoin.scoinsum:0
    }
  },
  methods:{
    goBackHandle(){
     this.$router.back()
    },
    checkInfoHandle(){
      this.$router.push('/scoin/description')
    },
    getScoinInfo(){
      accountScoinIndexApi().then(res=>{
        const {scoin,viplist}  = res;
        this.scoin = scoin || {};
        this.vipList = viplist || [];
      })
    },
    checkMemberShipHandle(item){
      window.open(`${this.$config.jianweiDomain}/membership/checkout?vipgradeid=${item.vipgradeid}`)
    }

  },
  mounted() {
    this.getScoinInfo()
  }
}
</script>

<style scoped lang="less">
.account-scoin-wrapper{
  height:100%;
  /deep/.van-nav-bar__content{
    background:#FCC900;
  }
  .account-scoin-box{
    display: flex;
    padding:30px 0 15px;
    background-image: linear-gradient(to bottom , #fcc900, #FDF400);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .account-scoin-money{
      font-size:21PX;
      font-weight: bold;

    }
    .account-scoin-details{
      font-size:16px;
      text-decoration: underline;
      margin:30px 0 15px;
      color:rgb(127, 127, 127);
      cursor: pointer;
    }
    .account-scoin-expired{
      font-size:16px;
      color:red;
    }
  }
  /deep/.van-notice-bar{
    font-size:16px;
  }
  .vip-content{
    margin:20px 8px;
    .vip-item-card{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border: 1px solid #deb349;
      background-color:#fbf2d9;
      padding:10px 0;
      border-radius: 4px;
      .vip-item-money{
        font-size:16px;
        font-weight: bold;
        color:#deb349;
      }
      .vip-item-money-discount{
        font-size:16px;
        font-weight: bold;
        text-decoration: line-through;
        color:#9e9e9e;
      }
      .vip-item-month{
        margin-top: 22PX;
      }
    }
  }

}

</style>
