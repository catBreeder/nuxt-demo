<template>
  <div class="transfer-box">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="sticky_title_common">Transfer</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-notice-bar :scrollable="false">
      <strong class="font_size_18">Balance:R {{basicInfo.balance}}</strong>
    </van-notice-bar>
    <scroll-view class="transferScroll">
      <div class="form-area">
        <van-form ref="registerForm">
          <div class="input_area input_area_m">
            <strong>Payer's cellphone(whatsapp) <span class="color_warning">*</span></strong>
            <van-field
              :border="true"
              :label="mobile.payer"
              label-width="4em"
              v-model="phone.payer"
              name="payer"
              placeholder="cellphone"
            >
              <template #label>
                <span @click="visible.payer = true">{{mobile.payer}}</span>
              </template>
            </van-field>
          </div>
          <div class="input_area g_mb_l">
            <strong>Payee cellphone(whatsapp) <span class="color_warning">*</span></strong>
            <van-field
              :disabled="isGroupMember"
              :border="true"
              :label="mobile.payee"
              label-width="4em"
              v-model="phone.payee"
              name="payer"
              placeholder="cellphone"
            >
              <template #label>
                <span @click="visible.payee = true">{{mobile.payee}}</span>
              </template>
            </van-field>
          </div>
          <div class="input_area g_mb_l">
            <strong>Amount <span class="color_warning">*</span></strong>
            <van-field
              v-model="amount"
              type="number"
              placeholder="Amount"
            >
              <template #right-icon>
                ZAR
              </template>
            </van-field>
          </div>
          <section>
            <strong>Remark : </strong>
            <div class="input_area g_mt_m">
              <van-field
                :border="true"
                v-model="summary"
                rows="2"
                style="border:1px solid #EEEEED;"
                autosize
                maxlength="100"
                type="textarea"
                show-word-limit
                placeholder="Remark"
              />
            </div>
          </section>
          <div class="submit-area">
            <van-button class="submit-btn" :loading="isLoading"  loading-text="loading..." @click="submitHandle">Submit</van-button>
          </div>
        </van-form>
      </div>

    </scroll-view>

    <van-popup v-model="visible.payee  || visible.payer" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        cancel-button-text="cancel"
        confirm-button-text="confirm"
        @cancel="closeModelHandle"
        @confirm="choseMobileTypeHandle"
      />
    </van-popup>
    <van-dialog v-model="dialogInfo.visible" :show-confirm-button="false" :show-cancel-button="false"
                theme="round-button" >
      <common-dialog :intro="dialogInfo.intro" @okEmit =hideDialogHandle  :type="dialogInfo.type" :title="dialogInfo.title"/>
    </van-dialog>
  </div>
</template>

<script>
import {getLoginInfo} from '@/utils/memory'
import {transferApi } from '@/api/recharge'
import CommonDialog from '@/components/common/CommonDialog';
import config from '@/config'
import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
import ScrollView from "@/components/common/ScrollView";
import { gTagFun } from '@/utils/buryPoint/gTag'
import {accountBasicInfoApi,accountUserToTransferApi} from '@/api/account'
import {setCurrentPage} from "../../../utils/memory";
export default {
  head(){
    return {
      title:'Balance Transfer - shopshipshake'
    }
  },
  name: "index",
  components:{CommonDialog ,ScrollView},
  data(){
    return{
      isLoading:false,
      mobile:{
        payer:'+27',
        payee:'+27'
      },
      phone:{
        payer:'',
        payee:''
      },
      visible:{
        payer:false,
        payee:false
      },
      amount:'',
      summary:'',
      dialogInfo:{
        visible:false,
        type:'',
        title:'',
        intro:''
      },
      basicInfo:{},
      isGroupMember:false
    }
  },
  computed:{
    columns(){
      let val =[],count = this.$config.areaCode;
      for(let k in count){
        val=[...val,count[k]]
      }
      return val;
    },

  },
  beforeRouteLeave(to,from,next){
    loginRegisterPageBury({
      p:'userTransfer',
      operate:'close',
      spm:`a0001.userTransfer.close.${getCurrentPageSpmID()}`
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
      p:'userTransfer',
      operate:'page',
      spm:`a0001.userTransfer.page.-1`
    })
    next();
  },
  methods:{
    goBackHandle(){
      this.$router.back()
    },
    submitHandle(){
      if(!this.phone.payer){
        this.$toast({message:'Payer\'s cellphone(whatsapp) is required'})
      }else if((this.mobile.payer==='+27' && this.phone.payer.length!==9) || (this.mobile.payee==='+27' && this.phone.payee.length!==9)){
        this.$toast({message:'Please input 9 digits number, ignore first 0'})
      }else if(!this.phone.payee){
        this.$toast({message:'Payee\'s cellphone(whatsapp) is required '})
      }else if(!this.amount ){
        this.$toast({message:'Amount is required'})
      }else if(this.amount<=0){

        this.$toast({message:' The amount must be greater than 0'})
      }else{
        gTagFun('Sumbit_Transfer','站内转账点击','Transfer');
        this.save()
      }
    },
    hideDialogHandle(){
      this.dialogInfo.visible = false;
    },
    save(){
      this.isLoading = true;
      let option={
        payeecellphone:this.phone.payee,
        payeecountrycode:this.mobile.payee.replaceAll('+',''),
        payercellphone:this.phone.payer,
        payercountrycode:this.mobile.payer.replaceAll('+',''),
        memo:this.summary,
        transfermoney:this.amount,
        userid:getLoginInfo().id,
      }
      transferApi(option).then(res=>{
        this.isLoading = false;
        if(res.status==200){
          if(res.data.status==0){
            this.dialogInfo={
              visible:  true,
              title:'Success',
              type:'success',
              intro:'Transfer Success'
            }
          }else{
            this.dialogInfo={
              visible:  true,
              type:'fail',
              title:'Fail',
              intro:res.data.message
            }
          }
        }
      })
    },
    //选择成功
    choseMobileTypeHandle(event){
      if(this.visible.payer){
        this.mobile.payer = event;
      }
      if(this.visible.payee){
        this.mobile.payee = event;
      }
      this.closeModelHandle()
    },
    closeModelHandle(){
      if(this.visible.payer){
        this.visible.payer = false;
      }
      if(this.visible.payee){
        this.visible.payee = false;
      }
    },
    getBasicInfo(){
      accountBasicInfoApi().then(res=>{
        this.basicInfo = res;
      })
      accountUserToTransferApi().then(res=>{
        if(res.status==0){
          this.isGroupMember = res.data.isGroupMember;
         if(res.data.isGroupMember){
           //是团员，payee绑定团长账号
           let trecode =  res.data.trecord || {};
           this.phone.payee = trecode.payeecellphone;
           this.mobile.payee = `+${trecode.payeecountrycode}`;
         }
          console.log(res.data);
        }
      })
    },
  },
  mounted() {
    this.getBasicInfo()
    const { cellphone ,countrycode } = getLoginInfo();
    this.phone.payer= cellphone?cellphone:'';
    this.mobile.payer =countrycode? `+${countrycode}` : '+27'
  }
}
</script>

<style scoped lang="less">
  .form-area{
    padding: 30px 15px;
  }
/deep/.van-cell{
  border-bottom:1px solid #eeeeed;
}
/deep/.van-field__label{
  border-right: 1px solid #EEEEED;
}
.transfer-box{
  strong{
    font-size:16px;
    padding-left:5px;
  }
  .input_area_m{
    margin-bottom:15px;
  }
}
.submit-area{
    padding-top: 20px;

    text-align: center;
  .submit-btn{
    background:#FCC900;
    border-radius: 6px;
    font-size:16px;
  }
}
.transferScroll{
  height:calc(100vh - 50PX - 50PX)
}
</style>
