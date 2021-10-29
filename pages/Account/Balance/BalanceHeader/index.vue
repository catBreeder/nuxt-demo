<template>
  <div>
    <div class="bill_balance_box">
      <van-row type="flex" align="center">
        <van-col span="20">
          <div class="d_flex">
            <div>
            </div>
            <div class="bill_balance_left">
              <div class="bill-balance-intro ">Balance</div><h2>{{balance | moneyFormat}}</h2>

            </div>
          </div>
        </van-col>
        <van-col span="4">
          <!--              <img src="~assets/images/Account/during.svg" alt="">-->
        </van-col>
      </van-row>
    </div>
    <div class="bill-operate-box">

      <van-button class="recharge-btn"
           @click="operateHandle('recharge')">Recharge</van-button>
      <van-button class="transfer-btn" :disabled="isBusiness"
                  @click="operateHandle('transfer')">Transfer</van-button>
    </div>
  </div>
</template>

<script>
  import { gTagFun } from '@/utils/buryPoint/gTag';
  import {getCustomerIdentity,getUserID} from '@/utils/memory'
    export default {
        name: "index",
        props:{
          balance:Number
        },
      methods:{
        operateHandle(type){
          switch (type) {
            case 'transfer':
              gTagFun('Account_Balance_Transfer','打开站内转账页','Account_Balance')
              this.$router.push('/user/toTransfer')
              break;
            case 'recharge' :
              this.$EventBus.$emit('toRecharge')
              this.$router.replace('/user/recharge')
              gTagFun('Account_Balance_Recharge','从Account_Balance打开Recharge','Account_Balance')
              break;
          }
        },
      },
      computed:{
          isBusiness(){
            if(getUserID()){
              return getCustomerIdentity() == this.$config.customerIdentityType.business;
            }
          }
      },
    }
</script>

<style scoped lang="less">
  .bill_balance_box{
    color:#fff;
    padding:20px;
    background-color:#F4A460;
    margin:8px;
    border-radius: 4px;
    .bill_balance_left{
      display: flex;
      margin-left: 10px;
      justify-content: center;
      flex-direction: column;
      .bill-balance-intro{
        font-size:17px;
        color:#fff;
        margin-bottom: 5px;
      }
    }
  }
  .bill-operate-box{
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size:16px;
    font-weight: 500;
    padding:6px 0 10px;
    .transfer-btn{
      width:35%;
      border-radius: 4px;
      padding:10px ;
      background:#fff;
      text-align: center;
      font-size:15px;
    }
    .recharge-btn{
      padding:10px ;
      width:35%;
      font-size:15px;
      border-radius: 4px;
      background-color: #fcc900;
      text-align: center;
      color:#fff;
    }
  }
</style>
