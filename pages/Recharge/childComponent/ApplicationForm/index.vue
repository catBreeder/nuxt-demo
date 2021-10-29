<template>
  <div class="application-content">
    <form-template label="Recharge Time ">
      <input type="text" v-model="rechargetimestr"
             @focus="forbid"
             @click="showTimePopHandle" placeholder="Recharge Time" slot="content" class="recharge-input">
    </form-template>
    <form-template label="Recharge Amount">
      <div class="input-area d_flex" slot="content">
        <div class="tag">R</div>
        <input type="number" v-model="amountstr" placeholder="Recharge Amount" >
      </div>
    </form-template>
    <form-template label="proof of payment" >
      <van-tag color="#fcc900" slot="extra" text-color="#2a2a2a" size="medium"
               @click="checkExampleHandle">Sample</van-tag>
      <van-uploader :after-read.stop="afterReadHandle" v-model="fileList"  :max-count="1" slot="content" class="g_mt_l"/>
    </form-template>
    <form-template label="Payer" :isRequired="false">
      <input type="text" placeholder="Payer" v-model="remitter" slot="content" class="recharge-input">
    </form-template>
    <form-template label="Note" :isRequired="false">
      <van-field slot="content"
                 rows="2" class="note-input"
                 autosize
                 v-model="memo"
                 type="textarea"
                 maxlength="100"
                 placeholder="Note"
                 show-word-limit
      />
    </form-template>
    <div class="commit-area">
      <van-button class="commit-btn" :disabled="isDisable"

                  @click="commitHandle">Commit</van-button>
    </div>
    <van-popup v-model="isShowTime" round  position="bottom"  :style="{ height: '30%' }" >
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        confirm-button-text="Confirm"
        cancel-button-text="Cancel"
        title="Select full time"
        @confirm="chooseTimeHandle"
        @cancel="isShowTime = false"
      />
    </van-popup>
    <van-dialog v-model="showInfoPop">
      <common-dialog type="info" v-if="dialogType === $config.rechargeSaveStatus.CLOSE"
                     title="No data in the system！"
                     okText="Do it later"
                     @okEmit="hidePopHandle"
                     intro="Try again after <span class='color_orange'>24 hours from recharge time</span> or Check if Time and Amount are <span class='color_orange'>consistent with the proof</span>."/>
      <common-dialog type="success" v-if="dialogType=== $config.rechargeSaveStatus.SUCCESS"
                     okText="OK"
                     @okEmit="successHandle"
                     intro="Application has been submitted Feedback in 1 work day"/>

      <common-dialog type="info" v-if="dialogType=== $config.rechargeSaveStatus.STILL"
                     :hasTwoBtn="true"
                     title="No data in the system！"
                     cancelText="Still Submit"
                     confirmText="Do it later"
                     @cancelEmit="stillSubmitHandle"
                     @confirmEmit="hidePopHandle"
                     confirmBorder="#fcc900"
                     confirmBg="#fcc900"
                     cancelBg="#fff"
                     cancelColor="#2a2a2a"
                     intro="Check if Time and Amount are <span class='color_orange'>consistent with the proof </span> and your <span class='color_orange'>Account Bill</span> .Money may have been recharged into your account."/>
    </van-dialog>

  </div>
</template>

<script>
import FormTemplate from "@/components/content/FormTemplate";
import CommonDialog from '@/components/common/CommonDialog'

import {paymentVoucherSaveApi} from '@/api/recharge'
import { timeFormatValidate  } from '@/utils'

let year = new Date().getFullYear();
let month = new Date().getMonth();
let day = new Date().getDate();
let hour = new Date().getHours() - 6;
let min = new Date().getMinutes();

export default {
  name: "index",
  components:{FormTemplate ,CommonDialog},
  props:['referer','refspm'],
  data(){
    return{
      fileList:[],
      currentDate:new Date(year,month,day,hour,min),
      minDate:new Date(year,month,day,hour,min),
      isShowTime:false,
      rechargetimestr:null,
      amountstr:null,
      image:null,
      remitter:null,
      memo:null,
      isDisable:false,
      forced:0,//是否强制提交 0(否) 1(是)
      showInfoPop:false,
      dialogType:null
    }
  },

  methods:{
    forbid(){
      //禁止软键盘弹出
      document.activeElement.blur();
    },
    //依然提交
    stillSubmitHandle(){
      const { rechargetimestr,amountstr,image,remitter,memo }  = this;
      paymentVoucherSaveApi({rechargetimestr,amountstr,image,remitter,memo ,forced:this.$config.rechargeForce.YES}).then(res=>{
        this.dialogType = Number(res.status);
        this.showInfoPop = true;
      })
    },
    successHandle(){
      this.hidePopHandle();
      this.$emit('changeTabEmit')
    },
    //关闭弹出框
    hidePopHandle(){
      this.showInfoPop = false;
    },
    commitHandle(){
      if(!this.rechargetimestr){
         return this.$toast({message:'Recharge Time is Required'})
      }
      if(!this.amountstr){
        return this.$toast({message:'Please fill in only digits'})
      }
      if(!this.image){
        return this.$toast({message:'Please upload the Proof'})
      }
      const { rechargetimestr,amountstr,image,remitter,memo ,forced}  = this;
      paymentVoucherSaveApi({rechargetimestr,amountstr,image,remitter,memo ,forced}).then(res=>{

        this.dialogType = Number(res.status);
        this.showInfoPop = true;
      })
    },
    //  图片上传
    afterReadHandle(file){

      let _upload = new XCUPload({
         file:file.file,
         savePath:'3simgs',
         onComplete:(info)=>{
           file.status = 'uploading';
           file.message = 'uploading...';
           if(info.code===1){
             this.$toast({message:'Image uploaded successfully'});
             setTimeout(()=>{
               file.status = 'success';
             },500)
           }
           this.image = this.$config.onlineImgURL + info.path;
         }
       })
      _upload.upload()
    },
    checkExampleHandle(){
        this.$router.push('/paymentvoucher/sample');

    },
    //显示时间选择
    showTimePopHandle(){
        this.isShowTime = true;
    },
    chooseTimeHandle(event){
      if(event){
        this.rechargetimestr = timeFormatValidate(event,'YMDHMS')
      }
      this.isShowTime = false;
    },
  },

}
</script>

<style scoped lang="less">
.application-content{
  padding:30px 15px 70px;
}
.recharge-input{
  width:93%;
  height:32px;
  border-radius: 4px;
  border:1px solid lightgrey;
  padding:2px 10px;
}
.input-area{
  border:1px solid lightgrey;
  border-radius: 4px;
  input{
    width:100%;
    height:32px;
    padding:2px 10px;
    border:none;
  }
  .tag{
    width:30px;
    padding:2px 10px;
    text-align: center;
    border-right: none;
    height:32px;
    border-right:1px solid lightgrey;
    line-height: 32px;
  }
}
.note-input{
  background-color: #EEEEED;
  border-radius: 4px;
}
.commit-area{
  margin-top: 30px;
  text-align: center;
  .commit-btn{
    background-color:#FCC900;
    border-radius: 4px;
  }
}
/deep/.van-uploader__upload{
  border:1px dashed lightgrey;
}
</style>
