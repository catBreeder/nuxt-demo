<template>
  <section>
    <scroll-view class="scrollHeight">

      <template v-if="isShowForm">
        <application-form @changeTabEmit="changeTabHandle"/>
      </template>
      <template v-else>
        <application-info  leftText="Withdraw" right-text="Remind"  v-if="voucherInfo.status=== $config.rechargeCheckOutStatus.UNDERREVIEW"
                           @clickLeftEmit="withdrawHandle" @clickRightEmit="remindHandle">
          <div slot="firstInfo">
            <div class="info-intro g_mb_l">Recharge Time</div>
            <div class="info-time">{{ voucherInfo.createtime | timeFormat('YMDHMS') }}</div>
          </div>
          <div slot="nextInfo">
            <div class="info-intro g_mb_l">Recharge Amount</div>
            <div class="info-time">R {{voucherInfo.amount / 100  }}</div>
          </div>
          <div slot="introInfo">
            <span class="color_active info-other-special">Only one Recharge Check can be submitted at a time</span>
            If you want to submit again, please wait for the review to complete or  withdraw the review
          </div>
          <van-button class="info-btn" slot="viewInfo" @click="viewProofHandle">View Proof</van-button>
        </application-info>
        <application-info
            leftText="Home Page"
            @clickLeftEmit="goHomeHandle"
            @clickRightEmit="continueHandle"
            v-if="voucherInfo.status=== $config.rechargeCheckOutStatus.UNAPPROVED"
            right-text="Continue to Submit">
          <div slot="firstInfo">
            <div class="info-pay"><strong class="color_orange">R {{voucherInfo.amount / 100 }}</strong> is not in the system!</div>
          </div>
          <div slot="nextInfo">
            <div class="info-pay">
              Connect with bank or check if Time and Amount are consistent with the proof</div>
          </div>
        </application-info>
        <application-info leftText="Home Page"
                          @clickLeftEmit="goHomeHandle"
                          @clickRightEmit="continueHandle"
                          v-if="voucherInfo.status === $config.rechargeCheckOutStatus.APPROVED"
                          right-text="Continue to Submit">
          <div slot="firstInfo">
            <div class="info-pay">
              <strong class="color_orange">R {{voucherInfo.amount / 100  }}</strong> had been recharged into your account.</div>
          </div>
          <div slot="nextInfo">
            <div class="info-pay">You can check it in Account Bill</div>
          </div>
        </application-info>
      </template>
    </scroll-view>
    <van-dialog v-model="isVisible">
      <common-dialog  :isShowImg="false" :hasTwoBtn="true" v-if="selectTab==='confirm'"
                      title="Are you sure ?"
                      cancelText="No"
                      confirmText="Yes"
                      confirmBg="#fcc900"
                      confirmBorder="#fcc900"
                      @cancelEmit="isVisible = false" @confirmEmit="confirmWithdrawHandle"/>
    </van-dialog>
  </section>

</template>

<script>
import ScrollView from "@/components/common/ScrollView";
import ApplicationForm from '../ApplicationForm'
import ApplicationInfo from '../ApplicationInfo'
import CommonDialog from '@/components/common/CommonDialog'
import { paymentVoucherIndexApi ,paymentVoucherWithdrawApi } from '@/api/recharge'
import {ImagePreview} from "vant";
export default {
  name: "index",
  components:{ScrollView ,ApplicationForm,CommonDialog ,ApplicationInfo},
  props:['referer','refspm'],
  data(){
    return{
      fileList:[],
      isVisible:false,
      isShowForm:true,
      voucherInfo:{},
      voucherStatus:null,
      selectTab:null
    }
  },
  methods:{
    goHomeHandle(){
      this.$router.replace('/')
    },
    continueHandle(){
      this.withdrawHandle()
    },
    //确定撤回
    confirmWithdrawHandle(){
      this.isVisible = false;
      paymentVoucherWithdrawApi(this.voucherInfo.id).then(res=>{
        this.isShowForm = true;
      })
    },
    withdrawHandle(){
      this.isVisible = true;
      this.selectTab = 'confirm'
    },
    remindHandle(){
      this.$toast({message:'Success'})
    },
    //充值查询
    paymentVoucherIndexHandle(){
      paymentVoucherIndexApi().then(res=>{
        if(res.voucher){
          this.voucherStatus = Number(res.voucher.status);
          this.voucherInfo= res.voucher;
          this.isShowForm= false;
        }else{
          this.isShowForm = true;
        }
      })
    },
    changeTabHandle(){
      this.$emit('changeTabEmit')
    },
    //查看凭证
    viewProofHandle(){
      ImagePreview([this.voucherInfo.image])
    }
  },
  mounted() {
    this.paymentVoucherIndexHandle()
  }
}
</script>

<style scoped lang="less">
.info-pay{
  line-height:1.8;
}
.scrollHeight{
  height:calc(100vh - 90PX - 50PX);
  background-color: #fff;
}
/deep/.van-dialog__footer{
  display: none !important;
}
</style>
