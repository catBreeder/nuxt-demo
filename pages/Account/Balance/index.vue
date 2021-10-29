<template>
 <div class="bill-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="navbar-title">Balance</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="billScrollHeight">
     <div class="bill-content">
        <balance-header :balance="balanceNum"/>
         <div class="bill-list-content g_mb_m">
           <div class="bill-list-title">
             <van-row>
               <van-col span="12">
                 <div class="bill-title-left">My Bills</div>
               </van-col>
               <van-col span="12">
                 <div class="bill-title-right" @click="showDateHandle">
                   {{currentDate | timeFormat('YM')}}
                   <van-icon name="arrow-down" size="15" color="gray" class="g_ml_m"/>
                 </div>
               </van-col>
             </van-row>
           </div>
           <div class="bill-list-grid">
            <div class="bill-item">
              <van-row>
                <van-col span="4">
                  <div class="bill-left d_flex">
                     Balance
                  </div>
                </van-col>
                <van-col span="20">
                  <div class="bill-right">
                    {{balanceInfo.balance/100 | moneyFormat}}
                  </div>
                </van-col>
              </van-row>
            </div>
             <div class="bill-item">
               <van-row>
                 <van-col span="4">
                   <div class="bill-left d_flex">
                     Income
                   </div>
                 </van-col>
                 <van-col span="20">
                   <div class="bill-right">
                     {{balanceInfo.income/100 | moneyFormat}}
                   </div>
                 </van-col>
               </van-row>
             </div>
             <div class="bill-item">
               <van-row>
                 <van-col span="4">
                   <div class="bill-left d_flex">
                     Expenditure
                   </div>
                 </van-col>
                 <van-col span="20">
                   <div class="bill-right">
                     {{balanceInfo.outexpense/100 | moneyFormat}}
                   </div>
                 </van-col>
               </van-row>
             </div>
           </div>
         </div>
          <div>
            <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
            <template v-else>
              <template v-if="billList.length">
                <div class="bill-detail-list-content g_mb_l">
                  <div class="bill-list-item" v-for="(item,index) in billList" :key="index">
                    <div class="bill-list-title">
                      <strong>{{item.date}}</strong>
                    </div>
                    <div class="bill-detail-list">
                      <div class="bill-detail-list-item" v-for="(bill ,billIndex) in item.dlist" :key="`bill_${billIndex}`">
                        <van-row type="flex" align="center" >
                          <van-col span="12">
                            <div class="detail-name g_mb_m">{{bill.changetypename}}</div>
                            <div class="detail-intro font_size_14" @click="checkOrderDetailHandle(bill)">{{bill.orderno}}</div>
                          </van-col>
                          <van-col span="12" >
                            <div class="detail-right-box">
                              <span class="detail-money g_mb_m">
                                {{bill.zf}}
                                <template v-if="bill.zf=='-'">
                                  {{(bill.amount*-1)/100 | moneyFormat}}
                                </template>
                                <template v-else>
                                   {{(bill.amount)/100 | moneyFormat}}
                                </template>
                                </span>
                              <div class="detail-balance">Balance : {{bill.balance/100 | moneyFormat}}</div>
                            </div>
                          </van-col>
                        </van-row>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <van-empty description="No Bill are available" v-else>
                <img src="~assets/images/common/empty.png" alt="" slot="image">
              </van-empty>
            </template>

          </div>

     </div>

   </scroll-view>
<!--   选择年月-->
   <van-action-sheet v-model="dateVisible" :closeable="false">
     <van-datetime-picker
       v-model="currentDate"
       type="year-month"
       confirm-button-text="Confirm"
       cancel-button-text="Cancel"
       @confirm="chooseDateHandle"
       @cancel="dateVisible = false"
     />
   </van-action-sheet>
 </div>
</template>

<script>
import {accountUserBalanceApi,accountBillListApi} from '@/api/account'
import BalanceHeader from './BalanceHeader'
import ScrollView from "@/components/common/ScrollView";
import { timeFormatValidate  } from '@/utils'
 export default {
   head(){
     return {
       title:'Balance - shopshipshake'
     }
   },
   data(){
      return{
        currentDate: new Date(),
        dateVisible:false,
        rechargetimestr:'',
        balanceInfo:{},
        balanceNum:0,
        billList:[],
        isLoading:false
      }
   },
   components:{ScrollView,BalanceHeader},
    methods:{
      checkOrderDetailHandle(item){
        console.log(item);
        if(item.dflg==1){
          this.$router.push(`/shoporder/2/detail/${item.expressid}`)
        }else if(item.dflg==0){
          this.$router.push(`/deliveryorder/detail/${item.expressid}`)
          // window.open(`${this.$config.jianweiDomain}/deliveryorder/detail/${item.expressid}`,'online')
        }

      },
      goBackHandle(){
        this.$router.back()
      },
      //显示时间选择
      showDateHandle(){
        this.dateVisible = true;
      },
      //确定时间
      chooseDateHandle(event){
        this.dateVisible = false;
        this.isLoading = true;
        this.getBillList()
      },
      getBillInfo(){
        accountUserBalanceApi().then(res=>{
          this.balanceNum = Number(res.balance)
        })
      },
      getBillList(){
        this.isLoading = true;
        accountBillListApi({
          startdate:timeFormatValidate(this.currentDate,'YM')
        }).then(res=>{
          if(res.status==0){
            this.balanceInfo = res.data;
            this.billList = res.data.list;
            this.isLoading = false;
          }
        })
      }
    },
    mounted() {
      this.getBillInfo();
      this.getBillList()
    }

 }
</script>

<style scoped lang="less">

  /deep/.van-picker__cancel{
    font-size:15px;
  }
  /deep/.van-picker__confirm{
    color:#2A2A2A;
    font-size:15px;
  }
  .billScrollHeight{
    height:calc(100vh - 50px - 46px);
    background-color: #EEE;
    /deep/ .van-loading{
      margin:80px auto ;
    }
  }
  .bill-list-title{
    border-bottom:1px solid #EEEEED;
    padding-bottom: 10px;
    .bill-title-left{
      font-weight: bold;
    }
    .bill-title-right{
      display: flex;
      justify-content: flex-end;
      align-items: center;

    }
  }
  .bill-detail-list-content{
    .bill-list-item{
      padding:10px 10px;
      margin:12px 6px;
      background-color: #fff;
      .detail-intro{
        color:#FCA400;
      }

      .detail-money{
        display: inline-block;
        background:#ecbd07;
        border-radius: 10px;
        padding:2px 10px;
      }
      .detail-balance{
        font-size:13px;
        color:gray;
        background:lightgray;
        display: inline-block;
        border-radius: 10px;
        padding:2px 10px;
      }
      .bill-detail-list-item{
        padding: 8px;
        border-bottom:1px solid #EEEEED;
        .detail-right-box{
          text-align: right;
        }

      }
    }
  }

  .bill-content{
  /*  bill list 开始*/
    .bill-list-content{
      background-color: #fff;
      padding:10px 10px;
      font-size:16px;
      .bill-list-grid{
        .bill-item{
          padding:10px 0;
        }
        .bill-left{}
        .bill-right{
          text-align: right;
          font-size:16px;
        }
      }
    }

  /*  bill list 结束*/
  }
</style>
