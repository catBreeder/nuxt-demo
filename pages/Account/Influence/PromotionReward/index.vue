<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Rewards</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView">
        <div class="reward-content">
          <div class="reward-total-inner d_flex d_flex_between">
            <div>
              <span>Total reward  </span>
              <span class="total-money">{{totalMoney | moneyFormat}}</span>
            </div>
            <div class="history-link" @click="checkHistoryHandle"> Rewards history <i class="icon iconfont icon-shandian"></i></div>
          </div>
        </div>
        <div class="reward-list-content">
          <div class="reward-list-title">
            <van-row >
              <van-col span="12">
                <div class="font_size_15">Details</div>
              </van-col>
              <van-col span="12">
                <div class="text_align_r font_size_15" @click="showDateHandle">
                  {{currentDate | timeFormat('YM')}}
                  <van-icon name="arrow-down" size="15" color="gray" class="g_ml_m"/>
                </div>
              </van-col>
            </van-row>
          </div>
          <template v-if="rewardInfo.type==1">
            <van-cell >
              <template #title><div class="detail-title">Full time：<span class="color_active">{{rewardInfo.d2}}</span>&nbsp; person</div></template>
              <template #label>
                <van-empty v-if="!rewardInfo.dlist2"></van-empty>
                <template v-else>
                  <div class="detail-list-item" v-for="(item,index) in rewardInfo.dlist2" :key="index">
                    Reward from {{item.cellphone}}
                  </div>
                </template>


              </template>
            </van-cell>
          </template>
          <template v-else-if="rewardInfo.type==0">
            <van-cell >
              <template #title><div class="detail-title">Part time：<span class="color_active">{{rewardInfo.d1}}</span>&nbsp; person</div></template>
              <template #label>
                <van-empty v-if="!rewardInfo.dlist1"></van-empty>
                <template v-else>
                  <div class="detail-list-item" v-for="(item,index) in rewardInfo.dlist2" :key="index">
                    Reward from {{item.cellphone}}
                  </div>
                </template>
              </template>
            </van-cell>
            <van-cell >
              <template #title><div class="detail-title">Recharge more than R300：<span class="color_active">{{rewardInfo.c }}</span>&nbsp; person</div></template>
              <template #label>
                <van-empty v-if="!rewardInfo.clist || rewardInfo.clist.length==0"></van-empty>
                <template v-else>
                  <div class="detail-list-item" v-for="(item,index) in rewardInfo.clist" :key="index">
                    Reward from {{item}}
                  </div>
                </template>
              </template>
            </van-cell>
          </template>
        </div>
      </scroll-view>
      <van-popup v-model="isVisible" round  position="bottom"  :style="{ height: '50%' }" >
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          confirm-button-text="Confirm"
          cancel-button-text="Cancel"
          title="Select Month"
          :min-date="minDate"
          @confirm="chooseTimeHandle"
          @cancel="isVisible = false"
        />
      </van-popup>
    </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {accountCustomerTaskRewardApi,accountCustomerBillListApi} from '@/api/account'
  import { timeFormatValidate  } from '@/utils'
    export default {
        name: "index",
      components:{ScrollView},
      head(){
        return {
          title:'Bonus - shopshipshake'
        }
      },
      data(){
          return{
            totalMoney:0,
            isVisible:false,
            currentDate:new Date(),
            minDate: new Date(new Date().getFullYear(), 0, 1),
            rewardInfo:{}

          }
      },
      methods:{
        checkHistoryHandle(){
          this.$router.push('/customertask/awards')
        },
        showDateHandle(){
          this.isVisible = true;
        },
        chooseTimeHandle(event){
          this.isVisible = false;
          this.getCustomerBillListHandle()
        },
        goBackHandle(){
          this.$router.back()
        },
        getPromotionRewardHandle(){
          accountCustomerTaskRewardApi().then(res=>{
             if(res.status==0){
               this.totalMoney = res.data.money/100;
             }
          })
        },
        getCustomerBillListHandle(){
          accountCustomerBillListApi(timeFormatValidate(this.currentDate,'YM')).then(res=>{
            if(res.status==0){
              this.rewardInfo = res.data || {}
            }
          })
        }

      },
      mounted() {
          this.getPromotionRewardHandle();
          this.getCustomerBillListHandle()
      }
    }
</script>

<style scoped lang="less">
  /deep/.van-empty{
    padding:20px 0;
  }
.scrollCommonHeightView{
  background-color: #eee;
}
  .reward-content{
    margin:10px 15px;
  }
  .reward-list-content{
    margin:10px 15px;
    background-color: #fff;
    padding:15px 10px;
    border-radius: 4px;
    .reward-list-title{
      border-bottom:1px solid #EEEEED;
      padding-bottom: 10px;
    }
    /deep/.van-cell{
      padding:10px 4px;
    }
  }
  .reward-total-inner{
    padding:8px 15px;
    border-radius: 6px;
    background-color: #fff;
    font-size:16px;
    .history-link{
      font-size:14px;
      color:#FCC900;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .total-money{
    font-size: 18px;
    margin-left: 6px;
    color:#FCC900;
  }
  .icon-shandian{
    color: #FCC900;
    font-size:15px;
  }
  .detail-title{
    font-size:16px;
  }
  .detail-list-item{
    font-size:14px;
    border-bottom:1px solid #EEEEED;
    color:#2a2a2a;
    padding:6px 0;
  }
</style>
