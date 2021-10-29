<template>
    <div class="group-ship-wrapper">
      <van-sticky z-index="10">
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon  name="arrow-left" size="24" color="#fff"/>
          </template>
          <template #title>
            <div class="navbar-title">Group-Buy</div>
          </template>
        </van-nav-bar>
        <div class="group-ship-top">
          <template v-if="groupShipInfo.isleader">
            <div class="group-ship-item d_flex d_flex_between">
              <div class="item-intro">My WA No.</div>
              <div class="item-name">{{groupShipInfo.cellphone}}</div>
              <van-tag color="#FE9123" size="large" text-color="#fff">Leader</van-tag>
            </div>
            <div class="group-ship-item d_flex d_flex_between">
              <div class="d_flex">
                <div class="item-intro g_mr_l"><span >{{new Date().getMonth() | monthFilter}}</span>  income</div>
                <div class="item-name  " style="color: #FF6A6A">{{totalmoney | moneyFormat}}</div>
              </div>
              <div class="service-info">
                <a href="@/assets/files/BUY_via_SSS_or_PA.pdf" download="BUY via SSS or PA.pdf"> Service details</a>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="group-ship-item d_flex d_flex_between">
              <div class="item-intro">My WhatsApp Number</div>
              <div class="item-name">{{groupShipInfo.cellphone}}</div>
            </div>
            <div class="group-ship-item d_flex d_flex_between">
              <div class="item-intro">Pro-Ambassador WA No.</div>
              <div class="item-name">{{groupShipInfo.ambassadorcellphone}}</div>
            </div>
          </template>
        </div>
      </van-sticky>
      <div class="group-ship-content">
        <template v-if="isLoading">
          <van-loading type="spinner" color="#fcc900" size="45px"/>
        </template>
        <template v-else>
          <template v-if="groupShipInfo.isleader">
            <manager-model :totalMoney="Number(groupShipInfo.totalmoney?groupShipInfo.totalmoney:0)"/>
          </template>
          <template v-else>
            <!--          不是团长-->
            <template v-if="groupShipInfo.ambassadorcellphone" >
              <!--            已参团-->
              <member-model :groupShipInfo="groupShipInfo"/>
            </template>
            <template v-else>
              <!--            未参团-->
              <normal-model @bindSuccessEmit="bindSuccessHandle"/>
            </template>
          </template>
        </template>
      </div>
    </div>
</template>

<script>

  import {accountGroupShipInfoApi ,groupShipBillListApi} from '@/api/account'
  import { timeFormatValidate } from '@/utils'
  import NormalModel from './NormalModel'
  import MemberModel from './MemberModel'
  import ManagerModel from './ManagerModel'
    export default {
      head(){
        return {
          title:'Join Group Success - shopshipshake'
        }
      },
        name: "index",
        components:{ManagerModel ,MemberModel,NormalModel},
        data(){
            return{
              groupShipInfo:{},
              isLoading:false,
              totalmoney:0,

            }
        },
      mounted() {
        this.getGroupShipInfo();

      },
      methods:{
        bindSuccessHandle(){
          this.getGroupShipInfo()
        },
        getGroupShipInfo(){
          this.isLoading = true;
          accountGroupShipInfoApi().then(res=>{
            this.groupShipInfo = res;
            if(res.isleader){
              this.getBillList()
            }
            setTimeout(()=>{
              this.isLoading = false;
            },this.$config.duringWait)
          })
        },
        goBackHandle(){
          this.$router.replace('/account/index')
        },
        getBillList(){
          groupShipBillListApi({startdate:timeFormatValidate(new Date(),'YM'),page:1}).then(res=>{
            this.totalmoney = res.income;
          })
        },
      }
    }
</script>

<style scoped lang="less">
.group-ship-wrapper{
  position: relative;
    /deep/.van-nav-bar{
      background-color: #FE9123;
    }
    .navbar-title{
    color:#fff;
  }
    .group-ship-top{
      padding:20px 15px 15px;
      border-bottom:12px solid #EEEEED;
      background: #fff;
      .group-ship-item{
        font-size:16px;
        margin-top: 8px;
        margin-bottom: 10px;
        .item-intro{
          color:gray;
          .month-tag{
            text-decoration: underline;
            color:#2A2A2A;
          }
        }
        .item-name{
          font-size:16px;
        }
        .service-info{
          font-size:15px;
          text-decoration: underline;
          a{
            color:#fcc900;
          }
        }
      }
    }

}

</style>
