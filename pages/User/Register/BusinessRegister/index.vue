<template>
  <div>
    <login-register-layout @closeEmit="closeHandle">
      <div class="register-wrapper">
        <div class="register-form-title">Registration</div>
        <div class="register-link">
          <strong >
            <router-link :class="{'color_warning':$route.path=='/register'}" to="/register">Personal Account</router-link>
          </strong> <strong class="color_warning g_ml_m g_mr_m">/</strong>
          <strong  :class="{'color_warning':$route.path=='/register/business'}">
            Business Account</strong>
        </div>
        <div class="form-content">
          <div class="form-content-intro font_size_15">The following items with an * are required：</div>
          <div class="form-input-content">
            <div class="form-input-item   ">
              <div class="form-input-item-label">E-mail <span class="color_warning">*</span>:</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':emailError.visible,'input-normal':!emailError.visible}"
                     v-model="businessForm.email"  placeholder="Please enter email address">
              <div class="error_tag g_mt_m" v-if="emailError.visible">{{emailError.content}}</div>
            </div>
            <div class="form-input-item   ">
              <div class="form-input-item-label">Verification Code<span class="color_warning">*</span>:</div>
              <div class="form-input-item-input d_flex ">
                <input type="text" v-model="businessForm.emailcode"
                       :class="{'input-error':codeError.visible,'input-normal':!codeError.visible}"
                       class=" w_30" >
                <van-button class="send-btn" :disabled="isSend" @click="sendHandle">
                  <span v-if="isSend">{{count}}</span>
                  <span v-else>Send email verification Code</span>
                </van-button>
              </div>
              <div class="error_tag g_mt_m" v-if="codeError.visible">{{codeError.content}}</div>
            </div>
            <div class="form-input-item" v-if="formType!='update'">
              <div class="form-input-item-label">Password<span class="color_warning">*</span>:</div>
              <input  :type="showPwd?'text':'password'" class=" w_90"
                      :class="{'input-error':passwordError.visible,'input-normal':!passwordError.visible}"
                      v-model="businessForm.password"  placeholder="Please input a password">
              <van-icon :name="showPwd?'eye-o':'closed-eye'"
                        :class="{'pwd-tag-no-error':!passwordError.visible,'pwd-tag-error':passwordError.visible}"
                        @click="showPwdHandle" class="pwd-tag" size="18" color="gray"/>
              <div class="error_tag g_mt_m" v-if="passwordError.visible">{{passwordError.content}}</div>
            </div>
            <div class="form-input-item" v-if="formType!='update'">
              <div class="form-input-item-label">Confirm Password<span class="color_warning">*</span>:</div>
              <input :type="confirmPwdEye?'text':'password'"  class=" w_90"
                     :class="{'input-error':confirmPwdError.visible,'input-normal':!confirmPwdError.visible}"
                     v-model="businessForm.confirmPwd"  placeholder="Confirm password again">
              <van-icon :name="confirmPwdEye?'eye-o':'closed-eye'"
                        :class="{'pwd-tag-no-error':!confirmPwdError.visible,'pwd-tag-error-confirm':confirmPwdError.visible}"
                        @click="showConfirmPwdHandle" class="pwd-tag" size="18" color="gray"/>
              <div class="error_tag g_mt_m" v-if="confirmPwdError.visible">{{confirmPwdError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Name<span class="color_warning">*</span>:</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':nameError.visible,'input-normal':!nameError.visible}"
                     v-model="businessForm.name"  placeholder="Please fill in name.">
              <div class="error_tag g_mt_m" v-if="nameError.visible">{{nameError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Residential Address<span class="color_warning">*</span>:</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':addressError.visible,'input-normal':!addressError.visible}"
                     v-model="businessForm.address" placeholder=" Residential address">
              <div class="error_tag g_mt_m" v-if="addressError.visible">{{addressError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Occupation<span class="color_warning">*</span>:</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':occupationError.visible,'input-normal':!occupationError.visible}"
                     v-model="businessForm.occupation" placeholder="For example:businessmen">
              <div class="error_tag g_mt_m" v-if="occupationError.visible">{{occupationError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Business Scope<span class="color_warning">*</span>:</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':businessError.visible,'input-normal':!businessError.visible}"
                     v-model="businessForm.businessscope" placeholder="For example:clothes">
              <div class="error_tag g_mt_m" v-if="businessError.visible">{{businessError.content}}</div>
            </div>
            <div class="form-input-item" v-if="formType!='update'">
              <div class="form-input-item-label">WhatsApp<span class="color_warning">*</span>:</div>
              <div class="choose-item d_flex">
                <div class="choose-item-mobile d_flex_center d_flex" @click="showPopupHandle('countryCode')">
                  +{{mobile}} <van-icon class="g_ml_m" :name="isVisible && visibleType=='countryCode'?'arrow':'arrow-down'" size="16"/></div>
                <div class="w_70">
                  <input type="text" class="  g_ml_m w_90"
                         :class="{'input-error':cellphoneError.visible,'input-normal':!cellphoneError.visible}"
                         v-model="businessForm.cellphone" placeholder="whatsapp no.">
                </div>
              </div>
              <div class="error_tag g_mb_m g_mt_m" v-if="cellphoneError.visible">{{cellphoneError.content}}</div>
              <div class="form-content-intro g_mt_l color_intro font_size_13">To offer you better service, please fill in the correct WhatsApp No. </div>
            </div>
            <div class="form-input-item">
              <div class="d_flex choose-item">
                <div class="form-input-item-label">Business Experiences&nbsp;:&nbsp;</div>
                <div class="choose-item-mobile" @click.stop="showPopupHandle('experience')">{{businessForm.exprienceNum}}</div>
                <div>years</div>
              </div>
            </div>
            <div class="form-input-item" @click.stop="showPopupHandle('worker')">
              <div class="form-input-item-label">Business Size<span class="color_warning">*</span>:</div>
              <input type="text" class="input-normal w_90" placeholder="Monthly Sales" v-model="businessForm.worker"   readonly>
              <van-icon :name="isVisible && visibleType=='sales'?'arrow-down':'arrow'" color="gray"  size="18"
                        class="from-input-arrow" />
              <div class="error_tag g_mb_m g_mt_m" v-if="workerError.visible">{{workerError.content}}</div>
            </div>
            <van-checkbox v-model="checked" icon-size="15" shape="square">
                <span class="font_size_12" style="color: #ff4f19" @click="checkAgreeHandle"> I have confirmed that I have read and agree to the
                  《EXPRESS TERMS AND CONDITIONS OF CRRIACE》</span>
            </van-checkbox>
            <div class="check-link d_flex d_flex_center g_mt_m " v-if="checkVisible"><span>Please check the Agreement</span></div>
            <van-button block class="submit-btn" @click="submitHandle" v-prevent-re-click> Agree and Register</van-button>
            <div class="login-link">Already have an account ? <router-link class="color_active font_size_15"  to="/login">Sign in</router-link></div>
            <div class="intro-bottom">
              After submitting, your personal Consultant will contact you via WhatsApp. If it is unavailable, we will contact you via email.
            </div>
          </div>
        </div>
      </div>
    </login-register-layout>
    <van-overlay :show="isLoading" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" />
      </div>
    </van-overlay>
    <van-dialog v-model="successVisible"  :show-cancel-button="false" :show-confirm-button="false">
      <div class="success-register-dialog">
        <template v-if="successType=='audit'">
          <div class="d_flex d_flex_center g_pt_m g_pb_m">
            <h3>{{checkMessage}}</h3>
          </div>
        </template>

        <div class="title" v-else>Submit successfully, please wait patiently...</div>
        <div class="user-info d_flex">
          <van-image
            round
            width="1.5rem"
            height="1.5rem"
            :src="assistantInfo.businessimage"
          />
          <div class="user-name">
            <p>{{assistantInfo.businessname}}</p>
            <p class="user-cell">+{{assistantInfo.businessusercountrycode?assistantInfo.businessusercountrycode:''}}{{assistantInfo.businessusercellphone}}</p>
          </div>
        </div>
        <div class="user-intro">
          Please keep your Whatsapp/phone number available. Your Consualtant  will contact you within 72 hours.
        </div>
        <div class="user-btn">
          <van-button block class="contact_btn" @click="contactHandle">Contact your business Consultant.</van-button>
          <van-button block class="contact_btn" @click="contactLaterHandle">Contact later</van-button>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="auditVisible"  :show-cancel-button="false" :show-confirm-button="false">
      <common-dialog type="info"
                     title="Error"
                     :intro="checkMessage"
                     :isShowImg="false"
                     cancelText="OK"
                     @okEmit="auditVisible = false"
      />
    </van-dialog>
    <!--    单选框  2.经验 3.区号-->
    <van-popup v-model="isVisible" round position="bottom">
      <van-picker
        confirm-button-text="Confirm"
        cancel-button-text="Cancel"
        :title="getTitle"
        show-toolbar
        :value-key="visibleType=='countryCode'?'countryCode':'name'"
        :columns="columns"
        @confirm="popupConfirmHandle"
        @cancel="popupCancelHandle"
      />
    </van-popup>
    <!--    雇员-->
    <van-popup v-model="workerVisible" round position="bottom" >
      <van-picker refs=""
                  confirm-button-text="Confirm"
                  cancel-button-text="Cancel"
                  title="Business Size"
                  show-toolbar
                  value-key="name"
                  :columns="workerColumns"
                  @confirm="salePopupConfirmHandle"
                  @cancel="salePopupCancelHandle"
      />
    </van-popup>
  </div>
</template>

<script>
  import JsCookie  from 'js-cookie'
  import LoginRegisterLayout from '@/components/common/LoginRegisterLayout';
  import CommonDialog from '@/components/common/CommonDialog'
  import {thirdEmailSendCodeApi,businessRegisterApi} from '@/api/user'
  import {emailValidate,pwdValidate,objectTranToArray,removeAllSpace} from '@/utils';
  import {getLoginInfo,getUserID,setCurrentPage} from "@/utils/memory";
  import {isPureNumberValidate} from '@/utils/validate'
  export default {
    layout:'loginDefault',
    head(){
      return{
        title: `Bussines Client Register - ShopShipShake`,
        meta:[
          {hid:'description',name:'description',content: 'Create bussines account'},
          {hid:'keywords',name:'keywords',content: 'Shopshipshake, Shopshipshake.com, China Supplies, South Africa Wholesale, 1688 Agent, Dropshipping, China to South Africa Shipping,  Deliver South Africa, Create bussines account, Bussines Client Register'}
        ]
      }
    },
    name: "index",
    components:{LoginRegisterLayout,CommonDialog},
    computed:{
      columns(){
        switch (this.visibleType) {
          case 'experience':
            return  objectTranToArray(this.$config.experienceEnumerate)
          case 'countryCode':
            return this.$config.commonCountryList;
        }

      },

      workerColumns(){
        // let value = objectTranToArray(this.$config.timeJobEnumerate);
        // let children = objectTranToArray(this.$config.workerEnumerate)
        // value = value.map(item=>{
        //   item.children = children;
        //   return item;
        // })
        return objectTranToArray(this.$config.workerEnumerate);
      },
      formType(){
        return this.$route.query.formType
      },
      getTitle(){
        switch (this.visibleType) {
          case 'experience':return 'Business Experiences';
          case 'countryCode': return 'Area Code'
        }
      }
    },
    data(){
      return{
        showPwd:false,
        confirmPwdEye:false,
        isLoading:false,
        mobile:'27',
        checked:false,
        isSend:false,
        workerVisible:false,
        emailError:{visible:false,content:''},
        codeError:{visible:false,content:''},
        passwordError:{visible:false,content:''},
        confirmPwdError:{visible:false,content:''},
        nameError:{visible:false,content:''},
        addressError:{visible:false,content:''},
        occupationError:{visible:false,content:''},
        businessError:{visible:false,content:''},
        cellphoneError:{visible:false,content:''},
        workerError:{visible:false,content:''},
        businessForm:{
          email:'',
          emailcode:'',
          countrycode:'',
          cellphone:'',
          cellphoneConfirm:'',
          password:'',
          confirmPwd:'',
          name:'',
          address:'',
          occupation:'',
          businessscope:'',
          businessexperiences:"1",
          exprienceNum:'0-2',
          workID:'0',
          worker:'Own-Account (no workers)'
        },
        count:60,
        successVisible:false,
        successType:'',
        assistantInfo:{},
        checkMessage:'',
        checkVisible:false,//协议
        auditVisible:false,
        isVisible:false,
        visibleType:'',
        countryCount:9
      }
    },
    beforeRouteEnter(to,from,next){
      if(to.query.invitecode || to.query.inc){
        let inviteCode =to.query.invitecode || to.query.inc
        // window.localStorages.setItem('inviteCode',inviteCode)
        JsCookie.set('inviteCode',inviteCode)
      }
      setCurrentPage(to.name)
      next()
    },
    methods:{
      showPwdHandle(){
        this.showPwd = !this.showPwd;
      },
      showConfirmPwdHandle(){
        this.confirmPwdEye = !this.confirmPwdEye;
      },
      checkAgreeHandle(){
        window.open(this.$config.jianweiDomain + "/helpcenter/index/termsconditions",'online');
      },
      closeHandle(){
        this.$router.replace('/login')
      },
      contactHandle(){
        window.location.href ="https://api.whatsapp.com/send?phone="+ this.assistantInfo.businessusercellphone+"&text=&source=&data=";
        this.successVisible = false;
      },
      contactLaterHandle(){
        this.successVisible = false;
        this.$router.replace('/')
      },
      sendHandle(){
        this.emailError.visible = false;
        if(!this.businessForm.email){
          this.emailError={visible: true,content:'Please fill in correct Emaill.'}
          return false;
        }
        this.businessForm.email = this.businessForm.email.replace(/\s*/g,"");
        if(!emailValidate(this.businessForm.email )){
          this.emailError={visible: true,content:'Please fill in correct Emaill.'}
          return false;
        }

        this.isSend = true;

        thirdEmailSendCodeApi({email:this.businessForm.email,inviter:JsCookie.get('inviteCode') || '',} ).then(res=>{
          this.count = 60;
          setInterval(()=>{
            if(this.count>0){
              this.count--;
            }else{
              this.isSend = false;
              this.count=60;
            }
          },1000)
          if(res.status==0){
            this.$toast({message:'The Verification Code has been sent. Please active it via email.'})
          }else{
            this.isSend = false;
            this.count=60;
            this.auditVisible = true;
            this.checkMessage = res.message;
          }
        })
      },
      salePopupCancelHandle(){
        this.workerVisible = false;
      },
      salePopupConfirmHandle(value,index){
        console.log(value);
        // this.businessForm.worker = `${value[0]}/${value[1]}`
        // this.businessForm.workID =`${Number(index[0]+1)}${Number(index[1]+1)}`;
        // this.workerVisible = false;
        this.businessForm.workID = value.id;
        this.businessForm.worker = value.name;
        this.workerVisible = false;
      },
      popupConfirmHandle(event){
        let { name } = event;
        switch (this.visibleType) {
          case 'experience':
            let {id} = event;
            this.businessForm.businessexperiences = id;
            this.businessForm.exprienceNum=name;
            break;
          case 'countryCode':
            let {countryCode,count} = event;
            this.mobile = countryCode;
            this.countryCount = count;
            break;
        }
        this.popupCancelHandle()
      },
      //打开单选
      showPopupHandle(type){
        if(type=='worker'){
          this.workerVisible = true;
        }else{
          this.isVisible = true;
          this.visibleType = type;
        }

      },
      popupCancelHandle(){
        this.isVisible = false;
        this.visibleType =''
      },

      checkInputValue(){
        this.emailError.visible =false;
        this.workerError.visible = false;
        this.codeError.visible = false;
        this.passwordError.visible = false;
        this.confirmPwdError.visible = false;
        this.cellphoneError.visible = false;
        this.nameError.visible = false;
        this.occupationError.visible = false;
        this.businessError.visible = false;
        this.addressError.visible = false;
        this.checkVisible= false;
        if(!this.checked){
          this.$toast({message:'Please agree to the agreement first'})
          this.checkVisible= true;
          return false;
        }
        if(!this.businessForm.email){
          this.emailError={visible: true,content:'Please fill in correct Emaill.'}
          this.$toast({message:'Please fill in correct Emaill.'})
          return false;
        }
        this.businessForm.email = this.businessForm.email.replace(/\s*/g,"");
        if(!emailValidate(this.businessForm.email )){
          this.emailError={visible: true,content:'Please fill in correct Emaill.'}
          this.$toast({message:'Please fill in correct Emaill.'})
          return false;
        }
        if(!this.businessForm.emailcode){
          this.codeError ={visible: true,content:'Please activate email.'}
          this.$toast({message:'Please activate email.'})
          return false;
        }
        if(this.$route.query.formType!='update'){
          if(!this.businessForm.password){
            this.passwordError={
              visible: true,
              content:'Please enter 6-20 digits passwords. Numbers or letters only.'
            }
            this.$toast({message:'Please enter 6-20 digits passwords. Numbers or letters only.'})
            return false;
          }
          if(!pwdValidate(this.businessForm.password)){
            let errorType="Please enter 6-20 digits passwords. Numbers or letters only.";
            this.passwordError={
              visible: true,
              content:errorType
            }
            this.$toast({message:errorType});
            return false;
          }
          if(!this.businessForm.confirmPwd){
            this.confirmPwdError={
              visible: true,
              content:'Please enter 6-20 digits passwords. Numbers or letters only. '
            }
            this.$toast({message:'Please enter 6-20 digits passwords. Numbers or letters only.'});
            return false;
          }
          if(this.businessForm.password.trim() != this.businessForm.confirmPwd.trim()){
            this.confirmPwdError={
              visible: true,
              content:'The password is not the same as before. '
            }
            this.$toast({message:'The password is not the same as before.'});
            return false;
          }
          if(!this.businessForm.cellphone){
            this.cellphoneError={
              visible: true,
              content:'Please fill in whatsapp no.'
            }
            this.$toast({message:'Please fill in whatsapp no.'})
            return false;
          }

          //1.去除空格
          this.businessForm.cellphone = removeAllSpace(this.businessForm.cellphone);
          this.businessForm.cellphoneConfirm = this.businessForm.cellphone;

          //2.判断是否是纯数字
          if(!isPureNumberValidate(this.businessForm.cellphone)){
            this.cellphoneError={
              visible: true,
              content:'Please enter digital numbers.'
            }
            this.$toast({message:'Please enter digital numbers.'})
            return false;
          }
          //3.判断是否以区号开头
          if(this.businessForm.cellphone.indexOf(this.mobile)!=0){
            //不以区号开头
            //3.1判断是否以0 开头
            if(this.businessForm.cellphone.indexOf(0)==0){
              this.cellphoneError={
                visible: true,
                content:`${this.businessForm.cellphone} The number cannot start with "0". `
              }
              this.$toast({message:`${this.businessForm.cellphone} The number cannot start with "0". `})
              return false;
            }
            //3.2 不以为0开头，判断位数
            if(this.businessForm.cellphone.length != this.countryCount){
              this.cellphoneError={
                visible: true,
                content:'Digits of number don\'t match. '
              }
              this.$toast({message:'Digits of number don\'t match.'})
              return false;
            }
          }else{
            //以区号开头
            //1.去除区号
            this.businessForm.cellphoneConfirm = this.businessForm.cellphoneConfirm.substring(this.mobile.toString().length);
            //2.判断是否以0 开头
            if(this.businessForm.cellphoneConfirm.indexOf(0)==0){
              this.cellphoneError={
                visible: true,
                content:`${this.businessForm.cellphoneConfirm} The number cannot start with "0". `
              }
              this.$toast({message:`${this.businessForm.cellphoneConfirm} The number cannot start with "0". `})
              return false;
            }
            //3不是0开头，判断位数
            if(this.businessForm.cellphoneConfirm.length != this.countryCount){
              this.cellphoneError={
                visible: true,
                content:'Digits of number don\'t match. '
              }
              this.$toast({message:'Digits of number don\'t match. '})
              return false;
            }
          }

        }
        if(!this.businessForm.address){
          this.addressError={visible: true,content:'Please fill in address.'}
          this.$toast({message:'Please fill in address.'});
          return false;
        }
        if(!this.businessForm.name){
          this.nameError={visible: true,content:'Please fill in name.'}
          this.$toast({message:'Please fill in name.'});
          return false;
        }
        if(!this.businessForm.occupation){
          this.occupationError={visible: true,content:'Please fill in occupation.'}
          this.$toast({message:'Please fill in occupation.'});
          return false;
        }
        if(!this.businessForm.businessscope){
          this.businessError={visible: true,content: 'Please fill in business Scope.'}
          this.$toast({message:'Please fill in business Scope.'});
          return false;
        }
        if(!this.businessForm.worker){
          this.workerError={visible: true,content: 'Please fill in Own-Account.'}
          this.$toast({message:'Please fill in  Own-Account.'});
          return false;
        }
        return true;
      },
      submitHandle(){
        if(this.checkInputValue()){
          this.isLoading = true;
          businessRegisterApi({
            email:this.businessForm.email,
            emailcode:this.businessForm.emailcode,
            countrycode:this.mobile,
            cellphone:this.businessForm.cellphoneConfirm,
            password:this.businessForm.password,
            name:this.businessForm.name,
            address:this.businessForm.address,
            occupation:this.businessForm.occupation,
            businessscope:this.businessForm.businessscope,
            businessexperiences:this.businessForm.businessexperiences,
            ownaccount:`2${this.businessForm.workID}`,
            // inviter:window.localStorages.getItem('inviteCode') || '',
            inviter:JsCookie.get('inviteCode') || '',
          }).then(res=>{
            if(res.status!=0){
              this.emailError.visible =false;
              this.codeError.visible = false;
              this.passwordError.visible = false;
              this.confirmPwdError.visible = false;
              this.cellphoneError.visible = false;
              this.nameError.visible = false;
              this.occupationError.visible = false;
              this.businessError.visible = false;
              this.addressError.visible = false;
              this.isLoading = false;
              this.$toast({message:res.message});
              let errorcode = res.data.errorcode;
              if( errorcode==33){
                this.emailError={visible: true, content:res.message}
              }else if(errorcode==31 || errorcode==32){
                this.cellphoneError={visible: true,content:res.message}
              }else if(errorcode == 34){
                this.passwordError ={visible: true,content:res.message}
              }else if(errorcode==41){
                this.nameError={visible: true,content:res.message}
              }else if(errorcode==11){
                this.codeError={visible: true,content:res.message}
              }else if(errorcode==42){
                this.addressError={visible: true,content:res.message}
              }else if(errorcode==43){
                this.occupationError={visible: true,content:res.message}
              }else if(errorcode==44){
                this.businessError={visible: true,content:res.message}
              }else  if(errorcode==101 || errorcode==102){
                //手机号正在审核
                this.successVisible = true;
                this.successType = 'audit'
                this.checkMessage = res.message;
                this.assistantInfo = res.data;
              }
            }else{
              fbq('track', '注册成功');
              gtag('event', 'register', {'event_category' : '注册完成', 'event_label' : '注册完成'});
              this.isLoading = false;
              this.successVisible = true;
              this.successType = 'success'
              this.assistantInfo = res.data;
              // window.localStorages.removeItem('inviteCode')
              JsCookie.remove('inviteCode')
            }
          })
        }
      },
    },
    mounted() {
      fbq('track', '注册页面');
      gtag('event', 'registerpage', {
        'event_category' : '注册页面',
        'event_label' : '注册页面'
      });
      if(this.$route.query.formType=='update'){
        this.businessForm.name =getUserID()? getLoginInfo().name :'';
        this.businessForm.countrycode = getUserID()?`${getLoginInfo().countrycode}` :'27'
        this.businessForm.cellphoneConfirm= getUserID()?getLoginInfo().cellphone:'';
        JsCookie.remove('inviteCode')
      }

    }
  }
</script>


<style scoped lang="less">
  /deep/.van-picker-column{
    font-size:14px;
  }

  .success-register-dialog{

    padding:20px 10px;
    .title{font-size:15px;font-style: italic;text-align: center}
    .user-info{
      padding:15px 20px;
      .user-name{
        margin-left: 25px;
        p{
          font-size:15px;
          margin-bottom: 8px;
        }
        .user-cell{
          border-bottom:1px solid #fcc900;
          color:#fcc900;
        }
      }
    }
    .user-intro{
      color: rgba(51, 51, 51, 0.82);
      text-align: center;
      font-size:14px;
      padding:10px 0;
    }
    .user-btn{
      margin:10px ;
      .contact_btn{
        margin-bottom: 10px;
        background-color: rgba(245, 154, 35, 0.82);
        color:#fff;
        border-radius: 6px;
      }
    }
  }
  .input-normal{
    border:0.5px solid lightgray;
  }
  .input-error{
    border:1px solid #f00;
  }
  /deep/.van-field__label{
    border-bottom:1px solid gray;
  }
  /deep/.van-cell{
    padding:8px 0;
  }
  .register-wrapper{
    margin:4px 8px;
    font-size:14px;
    .register-form-title{
      font-size:20px;
      font-weight: bold;
      text-align: center;
    }
    .register-link{
      font-size:16px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding:15px 0;
    }
    .form-content{
      padding:15px 10px ;
      margin-bottom: 10px;
    }
    .form-input-content{
      padding:15px 0;
      .error_tag{
        color:#f00;
      }
      .form-input-item{
        margin-top: 8px;
        margin-bottom: 15px;
        position: relative;
        .pwd-tag{
          position: absolute;
          right:25px;
        }
        .pwd-tag-error{
          bottom:47px;
        }
        .pwd-tag-error-confirm{
          bottom:34px;
        }
        .pwd-tag-no-error{
          bottom:5px;
        }
        .from-input-arrow{
          position: absolute;
          right:25px;
          bottom:8px;
        }
        input{
          height:32PX;
          line-height:32PX;
          padding:0 8px;
          border-radius: 4px;
        }
        .form-input-item-label{
          color:#333333;
          margin-bottom: 6px;
        }
        .send-btn{
          height:32PX !important;
          line-height: 32PX !important;
          background-color:  #f59a23;
          color:#fff;
          font-size:13px;
          padding:0 8px;
          border-radius: 4px;
          margin-left: 15px;
        }
      }

    }
    .input-normal{
      border:0.5px solid lightgray;
    }
    .w_90{
      width:90%;
    }
    .w_60{
      width:65%;
    }
    .w_40{
      width:40%;
    }
    .w_30{
      width:30%;
    }
    .w_60{
      width:60%;
    }
    .w_70{
      width:70%;
    }
    .choose-item{
      height:32PX;
      line-height:32PX;

    }
    .choose-item-mobile{
      font-size:14px;
      border-bottom:1px solid gray;
      width:80px;
      text-align: center;
    }
    .check-link{
      span{
        color: #d9001b;
        font-size:14px;
        border-bottom:1px solid  #d9001b;
      }
    }
    .submit-btn{
      background:  rgba(245, 154, 35, 0.82);
      color:#fff;
      border-radius: 6px;
      margin:20px 0 15px;
      font-size:15px;
    }
    .login-link{
      text-align: right;
      color:gray;
      padding:10px 0
    }
    .intro-bottom{
      color:gray;
      text-align: center;
      line-height:1.5;
    }
  }
</style>
