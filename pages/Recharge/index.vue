<template>
  <div class="s3-recharge-wrapper">
<!--    头部 start-->
    <van-sticky>
      <van-nav-bar>
        <template #title><div class="navbar-title">Recharge</div></template>
      </van-nav-bar>
    </van-sticky>
<!--    头部 end-->
<!--  tabs start  -->
    <div class="s3-recharge-content">
      <scroll-view class="scrollHeight">
        <!--      金额 start-->
        <van-row class="balance-box">
          <van-col span="12">
            <div class="balance-box-left"
                 @click="toBillHandle">
              <div class="title">Balance
                <!--              <i class="icon iconfont icon-chongzhizhong color_intro"></i>-->
              </div>
              <div class="money animate__animated animate__bounce" >{{rechargeInfo.balance | moneyFormat}}</div>
            </div>
          </van-col>
          <van-col span="12">
            <div class="balance-box-right"
                 @click="toPayHandle">
              <div class="title">To Pay</div>
              <div class="money color_warning " >
                <span v-if="needRecharge>=0">
                  {{ needRecharge | moneyFormat }}
                </span>
                <span v-else>R 0.00 </span>
              </div>
            </div>
          </van-col>
        </van-row>
<!--         -->
        <div class="recharge-banner-box animate__animated animate__fadeInRight"
             v-if="rechargeInfo.userfirstrecharge"
             @click="actionPopupHandle('priority')"
          >
          <img src="~assets/images/recharge/memberShip.png" alt="">
        </div>
        <div class="notice-recharge" v-if="firstActivityList.length">
          <div class="notice-recharge-box">
            <div class="notice-title ">Good News ! ! !</div>

            <div v-for="(item,index1) in firstActivityList" :key="index1">Recharge over {{item.money}}R,you can get {{item.couponmoney}}R coupon;</div>
            <template v-if="nextActivityList.length">
              <div v-for="(item,index2) in nextActivityList" :key="Math.random()">
                And over {{item.money}}R,you will get {{item.couponmoney}}R coupon;
              </div>
            </template>
            <div class="notice-title">Recharge now !</div>

            <div class="notice-time g_mt_m"  @click="actionPopupHandle('activity')"> From {{activity.starttime}} to
              {{activity.endtime}}<van-icon size="14" name="question-o" class="g_ml_s"/></div>
          </div>
        </div>
        <div class="space-area"></div>
        <van-tabs v-model="tabIndex"  @change="tabChangeHandle">
          <van-tab v-for="(item,index3) in tabList"
                   :title="item.name" :key="index3">
            <template v-if="tabIndex==0">
              <div class="online-box">
                <div class="online-box-input">
                  <van-row class="total-item">
                    <van-col span="8" class="total-item-intro">Total Amount :</van-col>
                    <van-col span="16">{{totalAmount | moneyFormat}}</van-col>
                  </van-row>
                  <van-row class="total-item">
                    <van-col span="8" class="total-item-intro">Process Fee :</van-col>
                    <van-col span="16">{{bankAmount | moneyFormat}}</van-col>
                  </van-row>
                  <div class="online-input-area">
                    <van-field v-model="actualAmount"
                               type="number"
                               :formatter="actualFormat"
                               @input="actualInputHandle"
                               :label-width="20">
                      <template #label><div class="online-input-icon">R</div></template>
                    </van-field>
                  </div>
                  <van-notice-bar v-show="!actualAmount || actualAmount<=0" color="#f00"
                                  background="#fff">
                    <span class="animate__animated animate_shakeX">Please input the amount</span>
                  </van-notice-bar>
                </div>
                <div class="online-box-radio">
                  <van-radio-group v-model="payType">
                    <van-cell-group>
                      <van-cell title="Credit Card" clickable @click="payType = '4'">
                        <template #right-icon>
                          <van-radio name="4" checked-color="#fcc900"/>
                        </template>
                        <template #label>
                          <div class="d_flex radio-item">
                            <div class="online-box-radio-label">Process Fee : {{rechargeInfo.fee}}% </div>
                            <div>time : immediate </div>
                          </div>
                        </template>
                      </van-cell>
                      <van-cell title="Instant  EFT" clickable @click="payType = '5'">
                        <template #right-icon>
                          <van-radio name="5"  checked-color="#fcc900"/>
                        </template>
                        <template #label>
                          <div class="d_flex radio-item">
                            <div class="online-box-radio-label">Process Fee : 2.50% </div>
                            <div>time : 0-6 hours </div>
                          </div>
                        </template>
                      </van-cell>
                    </van-cell-group>
                  </van-radio-group>

                </div>
                <div class="online-box-btn">
                  <van-button block class="confirm-btn"
                              @click="submitHandle">CONFIRM</van-button>
                </div>
              </div>
            </template>
            <template v-else-if="tabIndex==1">
              <div class="bank-transfer-box">
                <div class="bank-transfer-box-top">
                  <div class="bank-banner-box">
                    <img src="~assets/images/Recharge/NEDBANK.png" alt="">
                  </div>
                  <van-field value="MUSTANG FINANCIAL (PTY) LTD" readonly  label="Acc name " />
                  <van-field v-model="rechargeInfo.account" label="Account " />
                  <van-field v-model="rechargeInfo.branch" label="Branch  " />
                  <van-field value=" 2020 / 099114 / 07" label="Reg No  " />
                  <van-field value="Cheque Account." label="Acc Type  " />
                  <van-field  label="Ref. number  " >
                    <template #input>
                      <span class="color_warning">{{rechargeInfo.code}}</span>
                    </template>
                  </van-field>
                </div>
                <div class="back-transfer-tips">
                  <div class="tips-item">Tips</div>
                  <div class="tips-item">1.Once we receive your money, the same amount will be automatically recharged to your
                    <span
                          @click="goBillURL" class="link-tips">SSS account</span>.</div>
                  <div class="tips-item">
                    2.The bank processing time may take 0-2 days.
                    If the bank processing time exceeds 3 days, please use '
                    <span @click="rechargeCheckHandle"

                    class="link-tips">Recharge Check</span>' to check the processing progress.</div>
                  <div class="tips-item">3.If you did not fill in or fill in the wrong REF.NO., please contact your business Consultant for help.</div>
                  <div class="tips-item">4. We suggest that recharge via EFT. If you choose to recharge in cash, please keep the 'ATM receipt' as proof.</div>
                </div>
              </div>
            </template>
          </van-tab>
        </van-tabs>
      </scroll-view>
    </div>

<!--  tabs end  -->

<!--    充值成功-->
    <van-dialog v-model="successVisible">
      <common-dialog type="success"
                     okText="OK"
                     @okEmit="successHandle"
                     intro="Recharge request submitted successfully"/>
    </van-dialog>

<!--    遮罩层-->
    <van-overlay :show="isWaiting" @click="isWaiting = false">
      <van-loading type="spinner" color="#fcc900" size="50" vertical>Wait a minute......</van-loading>
    </van-overlay>

<!--    权益弹框 -->
    <van-action-sheet v-model="priorityVisible" :title="activeTitle" :style="{height:popupType==='priority'?'70%':'50%'}">
        <priority-popup :member-ship="memberShip" v-if="popupType==='priority'"/>
        <activity-recharge v-else :memo="activity.memo"/>
    </van-action-sheet>
  </div>

</template>
<script>
  import CommonDialog from '@/components/common/CommonDialog'
  import ScrollView from "@/components/common/ScrollView";
  import PriorityPopup from './childComponent/PriorityPopup'
  import ActivityRecharge from './childComponent/ActivityRecharge'
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import { rechargeApi ,createPayOrderApi ,getMembershipPriorityApi,activityRechargeInfoApi } from '@/api/recharge'
  import {trackTagFun} from '@/utils';
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm,setCurrentPage} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  export default {
    head(){
      return {
        title:'Recharge - shopshipshake'
      }
    },
    components:{CommonDialog ,ScrollView ,PriorityPopup ,ActivityRecharge},
    data(){
      return{
        tabIndex:0,
        tabList:[{name:'Online Payment'},{name:'Bank Transfer'}],
        numberKeyVisible:false,//数字键盘
        payType:'5',//支付方式
        successVisible:false,//充值成功
        isWaiting:false,
        rechargeInfo:{},
        needRecharge:null,
        actualAmount:null,//输入的数字
        priorityVisible:false,
        memberShip:{},
        popupType:'',
        activity:{},//充值送券时间
        firstActivityList:[],//充值送券列表第一个
        nextActivityList:[],//充值送券列表剩余的
        imgInfo:{}
      }
    },
    computed:{
      activeTitle(){
        return this.popupType == 'priority'?'Priorities you will enjoy':'Description'
      },
      bankAmount:{
        set(val){},
        get(){
          if(this.payType=='4'){
            return Number(Number(this.actualAmount) * this.rechargeInfo.fee /100).toFixed(2) || 0
          }else if(this.payType=='5'){
            return Number(Number(this.actualAmount) * 2.5 /100).toFixed(2) || 0
          }
        }

      },
      totalAmount:{
        set(val){},
        get(){
          return (Number(this.bankAmount) + Number(this.actualAmount)).toFixed(2) || 0;}
      }
    },
    methods:{
      //获取首充送券的信息
      getActivityRechargeInfo(){
        activityRechargeInfoApi().then(res=>{
          this.activity = res.activity || {};
          if(res.activityrulelist){
            this.firstActivityList = res.activityrulelist.splice(0,1);
            this.nextActivityList = res.activityrulelist || [];

          }
        })
      },
      actualFormat(value){
        return value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      },
      amountFormat(value){
        let reg2 = /(?!^)(?=(\d{3})+$)/g
        return value.replace(reg2,',')
      },
      showKeyHandle(){
        document.activeElement.blur();
        this.numberKeyVisible = true;
      },
      //显示底部弹出框
      actionPopupHandle(type){
        this.priorityVisible = true;
        this.popupType = type;
      },
      tabChangeHandle(event){
        //添加谷歌埋点
        if(event===0){
          gTagFun('Online_Payment','选择在线充值tab','Recharge')
        }else if(event===1){
          gTagFun('Bank_Transfer','选择银行转账tab','Recharge')
        }
        trackTagFun({fun:this.tabList[event].name})
      },
      //输入框输入
      actualInputHandle(event){
        if(event.indexOf('-')!==-1 ||( event[0]==='0'&& event['1']==='0')){this.actualAmount =null; return }
      },
      //topay
      toPayHandle(){
        gTagFun('To_pay','查看To_pay订单','Recharge')
        this.$router.replace({
          path:'/shoporder/cart',
          query:{tab:1}
        })
      },
      toBillHandle(){
        //添加谷歌埋点
        gTagFun('Blance','查看SSS_account','Recharge')
        this.$router.push('/bill/index')
      },
      //confirm提交
      submitHandle(){
        if(this.actualAmount<=0 || !this.actualAmount){
          return;
        }
        if(this.payType==='4'){
          //添加谷歌埋点
          gTagFun('Credit_Card','用信用卡支付','Recharge')
        }else if(this.payType==='5'){
          //添加谷歌埋点
          gTagFun('Instant_EFT','用EFT支付','Recharge')
        }
        this.isWaiting = true;
        this.$sensors.track('online_recharge_click',{
          recharge_type:this.payType==4?'Credit Card':'Instant  EFT',//充值方式
          service_fee:this.payType==4?this.rechargeInfo.fee:2.5,//服务费
          amount_pay:Number(this.actualAmount),//充值金额
          balance_before_recharge:this.rechargeInfo.balance,//充值前的账号余额
        })
        createPayOrderApi({
          money:Number(this.actualAmount),
          type:this.payType,
          returnurl:`${this.$config.jianweiDomain}/shop${this.$route.path}`
        }).then(res=>{
          if(Number(res.status)===500){
            this.$toast({message:res.message})
          }else{
            let params = res.data;
            let temp_form = document.createElement('form');
            temp_form.action=`${this.rechargeInfo.payUrl}doPay`;
            temp_form.method ='POST';
            for(let key in params){
              let opt = document.createElement('input');
              opt.name = key;
              opt.type='hidden';
              opt.value =params[key];
              temp_form.appendChild(opt)
            }
            temp_form.style.display='none';

            document.body.appendChild(temp_form);
            //提交表单
            temp_form.submit();
          }
        })
      },
      successHandle(){
        this.successVisible = false;
      },
      goCheckURL(){
        this.$router.push('/paymentvoucher/index');

      },
      //
      rechargeCheckHandle(){
        //添加谷歌埋点
        gTagFun('Recharge_Check','点击Recharge_Check','Banktransfer_tabpage')
        this.$router.push('/paymentvoucher/index')
      },
      goBillURL(){
        //添加谷歌埋点
        gTagFun('SSS_account','查看SSS_account','Banktransfer_tabpage')
        this.$router.push('/bill/index')
      },
      //获取recharge信息
      getRechargeInfo(){
        rechargeApi().then(res=>{
          if(res.userfirstrecharge){
            this.getMemberShipList()
          }

          /*
          * let shopTask = Number(res.shoptask.money) || 0;
          let expresses = res.expresses.reduce((prev,cur)=>{return Number(cur.coast) + Number(prev)},0)
          this.needRecharge = shopTask + expresses - Number(res.balance);
          * */
          this.needRecharge = res.shoptask.money;
          this.rechargeInfo = res;

        })
      },
      //获取弹出框内容
      getMemberShipList(){
        getMembershipPriorityApi().then(res=>{
          this.memberShip = res;
        })
      }
    },
    mounted() {
      this.getRechargeInfo();
      this.getActivityRechargeInfo()
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'recharge',
        operate:'close',
        spm:`a0001.recharge.close.${getCurrentPageSpmID()}`
      })
      next();
    },
    beforeRouteEnter(to,from,next){
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      setCurrentPage(to.name)
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      loginRegisterPageBury({
        p:'recharge',
        operate:'page',
        spm:`a0001.recharge.page.-1`
      })
      next();
    },
  }
</script>
<style scoped lang="less">
  /deep/.van-tab__text{
    font-size:15px;
  }
  .scrollHeight{
    height:calc(100vh - 50PX - 49PX);
  }
  /deep/.van-dialog__footer{
    display: none;
  }
.s3-recharge-wrapper{
  /deep/.van-nav-bar{
    background-color: #fcc900;
  }

  .navbar-title{
    color:#fff;
  }
  .balance-box{
    padding:14px;
    background-color: #FCC900;
     color:#fff;
    font-size:15px;
    .title{
      margin-bottom: 10px;

    }
    .money{
      font-size:18px;
      font-weight: 500;
    }
  }
  .recharge-banner-box{
    height:93px;
    padding:6px;
    img{
      height:100%;
      width:100%;
    }
  }
  .notice-recharge{
    background-color: #fffbe8;
    color:#ed6a0c;
    border-radius: 6px;
    padding:10px 12px;
    .notice-recharge-box{
      line-height:1.6;
      font-size:15px;
      .notice-title{
        font-size:18px;
        font-style:oblique;
      }
      .notice-time{
        display: flex;
        align-items: center;
        font-size: 13px;
        justify-content: flex-end;
      }
    }
  }
  .space-area{
    height:12px;
    background:#EEEEED;
    width:100%;
  }
  .s3-recharge-content{
    /deep/.van-tabs__line{
      width:90px;
    }
  }
}
  .online-box{
      .online-box-input{
        padding:10px  0;
        border-bottom:10px solid #EEEEED;
      }
    .total-item{
      padding:4px 15px;

      color:#2A2A2A;
      .total-item-intro{
        color:gray;
        font-size:15px;
      }
    }
      /deep/.van-cell::after{
        border-bottom:none;
      }
      /deep/.van-cell{
        padding: 5px 20px
      }
    .online-input-area{
      border-bottom:2px solid #8B8989;
      /deep/.van-cell{
        padding: 3px 0;
      }
      margin:0 20px;
      .online-input-icon{
        font-size:25px;
        font-weight: 600;
      }
      /deep/.van-field__body{
        font-size:25px;
        font-weight: 600;
      }
      /deep/.van-field__label{
        line-height:28px;
      }
      /deep/.van-notice-bar__wrap{
        justify-content: center;
      }
    }
    .online-box-radio{

      /deep/.van-cell{
        border-bottom:1px solid #EEEEED;
        padding: 10px 20px;
      }
      /deep/.van-cell__label{
        font-size:14px;
      }
      .online-box-radio-label{
        margin-right: 25px;

      }
    }
    .online-box-btn{
      padding:20px 20px 80px;
      .confirm-btn{
        font-size:20px;
        border-radius: 4px;
        color:#fff;
        background-color: #fcc900;
      }
      /deep/.van-button{
        height:42px !important;
        line-height:42px;
      }
    }
  }
  .bank-transfer-box{
    .bank-transfer-box-top{
      border-bottom:10px solid #EEEEED;
      padding-bottom:15px;
      /deep/.van-cell::after{
        border-bottom:none;
      }
      /deep/.van-field__control{
        font-weight: bold;
      }
      /deep/.van-cell{
        padding: 5px 20px
      }
      .bank-banner-box{
        padding:20px;
        height:127px;
        img{
          width:100%;
          height:auto;
        }
      }
    }
    .back-transfer-tips{
      padding:10px 20px 60px;
      font-size:14px;
      line-height:1.4;
      .tips-item{
        margin-bottom:15px;
      }
    }
    .link-tips{
      border-bottom:1px solid #FCC900;
      color:#FCC900;
    }

  }
</style>
