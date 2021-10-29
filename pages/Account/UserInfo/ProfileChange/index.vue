<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="navbar-title">{{title}}</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <div class="profile-form-content">
     <van-notice-bar :scrollable="false"
                     wrapable
                     :text="noticeInfo" />
       <div class="profile-email-form">
         <template v-if="type==='email'">
             <van-field
           v-model="email"
           placeholder="E-mail"
         />
         </template>
         <template v-else-if="type==='cellphone'">
           <van-field
             border
             :label="mobile"
             label-width="4em"
             type="number"
             v-model="phone"
             name="mobile"
             placeholder="Mobile Number"
           >
             <template #label>
               <span @click="isVisible = true">{{mobile}}</span>
             </template>
           </van-field>
         </template>
         <van-field
           v-model="code"
           center
           clearable
           placeholder="Activation Code"
         >
           <template #button>
             <van-button class="send-btn"
                         :disabled="isSend" @click="resendHandle" v-prevent-re-click>
               <span v-if="isSend">{{count}}</span>
               <span v-else>{{recentCount==0?'Send Code':'Resend'}}</span>
             </van-button>
           </template>
         </van-field>
         <div class="profile-form-btn d_flex_around d_flex">
           <div class="send-btn operate-btn"
                @click="confirmHandle"
                >Confirm</div>
           <div class="send-btn operate-btn"
                @click="goBackHandle"
                >Cancel</div>
         </div>
       </div>

   </div>
   <!--    选择区号-->
   <van-popup v-model="isVisible" round position="bottom">
     <van-picker
       show-toolbar
       :columns="columns"
       cancel-button-text="cancel"
       confirm-button-text="confirm"
       @cancel="isVisible = false"
       @confirm="choseMobileTypeHandle"
     />
   </van-popup>
<!--   弹出框-->
   <van-dialog v-model="noticeVisible" :show-confirm-button="false">
     <common-dialog
       :type="noticeType"
       :fontSize="15"
       :isFont="false"
       :title="noticeContent"
       :isCenter="true"
       @okEmit ="updateSuccessHandle"
     />
   </van-dialog>
<!--   loading-->
   <van-overlay :show="isWaiting" >
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="45" />
     </div>
   </van-overlay>
 </div>
</template>
<script>
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {accountSendNewMobileCodeApi,accountUserUpdateMobileApi,accountSendNewEmailCodeApi,accountUserUpdateEmailApi} from '@/api/account'
  import CommonDialog from '@/components/common/CommonDialog';
  import {emailValidate} from '@/utils'
  import {setCurrentPage} from "../../../../utils/memory";
 export default {
   head(){
     return {
       title:'UserInfo Change - shopshipshake'
     }
   },
   data(){
     return{
       email:'',
       code:'',
       mobile:'+27',
       phone:'',
       isVisible:false,
       noticeVisible:false,
       isSend:false,
       count:120,
       isWaiting:false,
       noticeContent:'',
       noticeType:'',
       recentCount:0,
       noticeIntro:''

     }
   },
   components:{CommonDialog},
   beforeRouteLeave(to,from,next){
     loginRegisterPageBury({
       p:'userInfoChange',
       operate:'close',
       spm:`a0001.userInfoChange.close.${getCurrentPageSpmID()}`
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
       p:'userInfoChange',
       operate:'page',
       spm:`a0001.userInfoChange.page.-1`
     })
     next();
   },
    computed:{
      columns(){
        let val =[],count = config.areaCode;
        for(let k in count){
          val=[...val,count[k]]
        }
        return val;
      },
      title(){
        return this.$route.params.type==='email'?'Change Email':'Change Mobile Phone'
      },
      type(){
        return this.$route.params.type
      },
      noticeInfo(){
        return this.$route.params.type==='email'?
          'Enter the new E-mail and input the Activation Code to change your email':
          'Enter the new Mobile Number and input the Activation Code to change your cellphone.'
      }
    },
    methods:{
      updateSuccessHandle(){
        this.noticeVisible = false;
        if(this.noticeIntro=='updateSuccess'){
          this.$router.back()
        }

      },
        //选择成功
        choseMobileTypeHandle(event){
          this.isVisible = false;
          this.mobile = event;
        },
        goBackHandle(){
          this.$router.back()
        },
      //发送验证码
      resendHandle(){
          this.recentCount++;
          if(this.type=='email' ) {
            if(!this.email){
              this.$toast({message: 'E-mail is required'})
              return false
            }else{
              this.email = this.email.replace(/\s*/g,"");
              if(!emailValidate(this.email)){
                this.$toast({message:'Invalid Email!'})
                return false;
              }
            }
            this.isWaiting = true;
            accountSendNewEmailCodeApi({
              newemail:this.email
            }).then(res=>{
              this.isWaiting = false;
              if(res.status==0){
                this.isSend = true;
                setInterval(()=>{
                  if(this.count>0){
                    this.count--;
                  }else{
                    this.isSend = false;
                    this.count=120;
                  }
                },1000)
                this.noticeVisible = true;
                this.noticeContent =`Activation Code has been sent to <span class='color_orange_red'>${this.email}</span>`
                this.noticeType = 'success';

              }else{
                this.noticeVisible = true;
                this.noticeContent =`${res.message}`
                this.noticeType = 'info'
              }
            })
          }
        if(this.type=='cellphone'){
            if(!this.phone){
              this.$toast({message:'Mobile Number is required'})
              return false
            }else if(this.mobile ==='+27'&& this.phone.length!==9){
              this.$toast({message:'Wrong Mobile number format,It has to be 9 digits'})
              return false;
            }
            this.isWaiting = true;
            accountSendNewMobileCodeApi({
              countrycode:this.mobile.substring(1),
              newmobile:this.phone
            }).then(res=>{
              this.isWaiting = false;
              if(res.status==0){
                this.isSend = true;
                setInterval(()=>{
                  if(this.count>0){
                    this.count--;
                  }else{
                    this.isSend = false;
                    this.count=120;
                  }
                },1000)
                this.noticeVisible = true;
                this.noticeContent =`Activation Code has been sent to <span class='color_orange_red'>${this.phone}</span>`
                this.noticeType = 'success';

              }else{
                this.noticeVisible = true;
                this.noticeContent =`${res.message}`
                this.noticeType = 'info'
              }
            })
          }
      },
      checkCellphoneValidate(){
          if(!this.phone){
             this.$toast({message:'Mobile Number is required'});
             return false;
          }else if(this.mobile ==='+27'&& this.phone.length!==9){
             this.$toast({message:'Wrong Mobile number format,It has to be 9 digits'});
             return false;
          }
        if(!this.code){
           this.$toast({message:'Activation Code is required'})
          return false;
        }
        return true;
      },
      checkEmailValidate(){
        if(!this.email){
          this.$toast({message: 'E-mail is required'})
          return false
        }else{
          this.email = this.email.replace(/\s*/g,"");
          if(!emailValidate(this.email)){
            this.$toast({message:'Invalid Email!'})
            return false;
          }
        }
        return true;
      },
      confirmHandle(){
          switch (this.type) {
            case 'cellphone':
              if(this.checkCellphoneValidate()){
                this.isWaiting = true;
                accountUserUpdateMobileApi({
                  countrycode:this.mobile.substring(1),
                  newmobile:this.phone,
                  mobilecode:this.code
                }).then(res=>{
                  this.isWaiting = false;
                  if(res.status!=0){
                    this.noticeVisible = true;
                    this.noticeType='error';
                    this.noticeContent = res.message

                  }else{
                    this.noticeVisible = true;
                    this.noticeIntro = 'updateSuccess'
                    this.noticeType='success';
                    this.noticeContent = `Change Mobile Success !`
                  }
                })
              }
              break;
            case 'email':
              if(this.checkEmailValidate()){
                this.isWaiting = true;
                this.email = this.email.replace(/\s*/g,"");
                accountUserUpdateEmailApi({
                  newemail:this.email,
                  emailcode:this.code
                }).then(res=>{
                  this.isWaiting = false;
                  if(res.status!=0){
                    this.noticeVisible = true;
                    this.noticeType='error';
                    this.noticeContent = res.message

                  }else{
                    this.noticeVisible = true;
                    this.noticeIntro = 'updateSuccess'
                    this.noticeType='success';
                    this.noticeContent = `Change Email Success !`
                  }
                })
              }
              break;
          }

      }
    },

    mounted(){

    }

 }
</script>

<style scoped lang="less">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
/deep/.van-notice-bar__content{
  font-size:16px;
}
/deep/.van-cell::after{
  border-bottom:1px solid lightgray;
}
  .profile-email-form{
    padding:20px 10px;
  }
  .send-btn{
    background-color: #fcc900;
    color:#2A2A2A;
    border-radius: 4px;
  }
  .profile-form-btn{
    padding:20px 10px;
    .operate-btn{
      width:30%;
      padding:10px;
      font-size:15px;
      text-align: center;
    }
  }
</style>
