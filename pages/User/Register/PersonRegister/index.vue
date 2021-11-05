<template>
  <div>
    <login-register-layout @closeEmit ="closeHandle">
      <div class="register-wrapper">
        <div class="register-form-title">Registration</div>
        <div class="register-link">
          <strong  :class="{'color_warning':$route.path=='/register'}" >
            Personal Account
          </strong> <strong class="color_warning g_ml_m g_mr_m">/</strong>
          <strong >
            <router-link :class="{'color_warning':$route.path=='/register/business'}" to="/register/business">Business Account</router-link></strong>
        </div>
        <div class="form-content">
          <div class="form-content-intro font_size_15">The following items with an * are required：</div>
          <div class="form-input-content">

            <div class="form-input-item">
              <div class="form-input-item-label">WhatsApp<span class="color_warning">*</span>:</div>
              <div class="choose-item d_flex">
                <div class="choose-item-mobile d_flex_center d_flex"  @click.stop="showPopupHandle('countryCode')">
                  +{{mobile}} <van-icon class="g_ml_m" :name="isVisible  && visibleType=='countryCode'?'arrow':'arrow-down'"  size="16"/></div>
                <div class="w_70">
                  <input type="text" class="g_ml_m w_90"
                         :class="{
                            'input-error':cellphoneError.visible,
                            'input-normal':!cellphoneError.visible
                           }"
                         v-model="personForm.cellphone" placeholder="whatsapp no.">
                </div>
              </div>
              <div class="error_tag g_mb_m g_mt_m" v-if="cellphoneError.visible">{{cellphoneError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Password<span class="color_warning">*</span>:</div>
              <form style="position: relative">
                <input autocomplete="current-password"  :type="showPwd?'text':'password'" class="input-normal w_90"
                       :class="{'input-error':passwordError.visible,'input-normal':!passwordError.visible}"
                       v-model="personForm.password" placeholder="Please input a password">

              </form>
              <van-icon :name="showPwd?'eye-o':'closed-eye'"
                        :class="{'pwd-tag-no-error':!passwordError.visible,'pwd-tag-error':passwordError.visible}"
                        @click="showPwdHandle" class="pwd-tag" size="18" color="gray"/>
              <div class="error_tag g_mt_m" v-if="passwordError.visible">{{passwordError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Confirm Password<span class="color_warning">*</span>:</div>
              <form>
                <input autocomplete="current-password" :type="confirmPwdEye?'text':'password'" class="input-normal w_90"
                       :class="{'input-error':confirmPwdError.visible,'input-normal':!confirmPwdError.visible}"
                       v-model="personForm.confirmPwd" placeholder="Confirm password again">
              </form>

              <van-icon :name="confirmPwdEye?'eye-o':'closed-eye'" @click="showConfirmPwdHandle"
                        :class="{'pwd-tag-no-error':!confirmPwdError.visible,'pwd-tag-error-confirm':confirmPwdError.visible}"
                        class="pwd-tag" size="18" color="gray"/>
              <div class="error_tag g_mt_m" v-if="confirmPwdError.visible">{{confirmPwdError.content}}</div>
            </div>
            <div class="form-input-item">
              <div class="form-input-item-label">Name</div>
              <input type="text" class=" w_90"
                     :class="{'input-error':nameError.visible,'input-normal':!nameError.visible}"
                     v-model="personForm.name" placeholder="Please fill in name.">
              <div class="error_tag g_mt_m" v-if="nameError.visible">{{nameError.content}}</div>
            </div>
            <div class="form-input-item" @click.stop="showPopupHandle('country')">
              <div class="form-input-item-label">Delivery Country<span class="color_warning">*</span>:</div>
              <input type="text" class="input-normal w_90" placeholder="Country" v-model="personForm.countryName"   readonly>
              <van-icon :name="isVisible && visibleType=='country'?'arrow-down':'arrow'" color="gray"  size="18"
                        class="from-input-arrow" />
              <div class="error_tag g_mb_m g_mt_m" v-if="countryError.visible">{{countryError.content}}</div>
            </div>
            <div class="form-input-item" v-if="personForm.countryNameID=='27'">
              <div class="form-input-item-label">Suburb<span class="color_warning">*</span>:</div>
              <input type="text" class="input-normal w_90" readonly @click="showPostCodeHandle"
                     :class="{'input-error':addressError.visible,'input-normal':!addressError.visible}"
                     v-model="personForm.address" placeholder="Please choose suburb.">
              <div class="error_tag g_mt_m" v-if="addressError.visible">{{addressError.content}}</div>
            </div>
            <van-button block class="submit-btn" v-prevent-re-click @click="submitHandle"> Register and Sign in </van-button>
            <div class="login-link">Already have an account ? <router-link class="color_active font_size_15"  to="/login">Sign in</router-link></div>
            <div class="other_input" >
              Or Join With : <img @click="threeRegister"
                                  src="~assets/images/user/facebook.png" alt="facebook" height="36" style="border-radius: 50%">
            </div>
            <div class="intro-bottom g_mt_l">
              Once you are qualified as our Business Clients,  you will have one-to-one Chinese Consultant, quick response,  favorable price...
            </div>
          </div>
        </div>
      </div>
    </login-register-layout>
    <!--    选择区号-->
    <van-popup v-model="isVisible" round position="bottom">
      <van-picker
        title="Choose"
        show-toolbar
        :columns="columns"
        :value-key="visibleType=='country'?'name':'countryCode'"
        cancel-button-text="cancel"
        confirm-button-text="confirm"
        @cancel="isVisible = false"
        @confirm="visibleConfirmHandle"
      />
    </van-popup>
    <van-popup v-model="postVisible" round  position="bottom" :style="{ height: '50%' }" >
      <div class="postal-popup-content">
        <div class="postal-popup-search">
          <van-search  shape="round" @input="searchInputPostalHandle" v-model="postCodeInput" placeholder="Suburb" />
        </div>
        <div class="postal-popup-list">
          <template v-if="postalList.length">
            <scroll-view class="cellScrollHeight" @reachBottom="loadMorePostalHandle">
              <van-cell v-for="(item,index) in postalList"
                        @click="choosePostalItem(item)"
                        :key="index" :title="item.text" />
            </scroll-view>
          </template>
          <van-empty description="No results round" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </div>

        <!--          列表数据-->
      </div>
    </van-popup>
    <van-dialog v-model="resultVisible" :show-confirm-button="false" :show-cancel-button="false">
      <common-dialog v-if="resultType=='error'"
                     title="Registration failed"
                     :intro="errorMsg"
                     introColor="#f00"
                     :isFont="false"
                     :isShowImg="false"
                     okText="Confirm"
                     @okEmit="resultVisible = false "
      />
      <common-dialog-operate v-else-if="resultType=='success'" :isShowImg="false" :isTitleMarge="false">
        <div slot="title" class="font_size_16" style="font-style: italic">Welcome to ShopShipShake!</div>
        <div slot="intro" class="assistant_user">
          <div>{{teamLeader.teamleadername}}</div>
          <div class="assistant_user_tel" @click="contactHandle"><span >+{{teamLeader.teamleadercountrycode}}{{teamLeader.teamleadercellphone}}</span></div>
        </div>
        <div slot="footer">
          <div class="assistant_user_intro">
            Please keep your Whatsapp/phone number available. Your Ambassador will guide you how to shop on SSS.
          </div>
          <div class="assistant_user_btn">
            <van-button block class="contact_btn" @click="contactHandle">Contact Ambassador Now!</van-button>
            <van-button block class="contact_btn" @click="goShoppingHandle">Contact later</van-button>
          </div>
        </div>
      </common-dialog-operate>
    </van-dialog>
    <van-overlay :show="isLoading" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import LoginRegisterLayout from '@/components/common/LoginRegisterLayout';
  import CommonDialog from '@/components/common/CommonDialog'
  import CommonDialogOperate from '@/components/common/CommonDialogOperate'
  import ScrollView from "@/components/common/ScrollView";
  import { searchPostcodeApi} from '@/api/help';
  import {personRegisterApi,thirdLoginApi} from '@/api/user'
  import {pwdValidate ,removeAllSpace} from '@/utils'
  import {isPureNumberValidate} from '@/utils/validate'
  import {setUserTicket,setLoginInfo,setUserID,setUserType,setSensorData,setCustomerIdentity} from '@/utils/memory'
  export default {
    head(){
      return{
        title: `Customer Register - ShopShipShake`,
        meta:[
          {hid:'description',name:'description',content: 'Create account'},
          {hid:'keywords',name:'keywords',content: 'Shopshipshake, Shopshipshake.com, China Supplies, South Africa Wholesale, 1688 Agent, Dropshipping, China to South Africa Shipping,  Deliver South Africa, Create account, Customer Register'}
        ]
      }
    },
    layout:'loginDefault',
    name: "index",
    components:{LoginRegisterLayout,ScrollView,CommonDialog,CommonDialogOperate},
    computed:{
      columns(){
        return this.visibleType=='country'? this.$config.litterCountryList:this.$config.commonCountryList;
      },
    },
    data(){
      return{
        countryCount:9,//选中的区号位数
        showPwd:false,
        confirmPwdEye:false,
        mobile:'27',
        postVisible:false,
        personForm:{
          cellphone:null,
          cellphoneConfirm:null,
          smscode:'',
          password:'',
          confirmPwd:'',
          name:'',
          address:'',
          postcode:'',
          suburb:'',
          countryID:1,
          countryName:'South Africa',
          countryNameID:'27'
        },
        countryError:{
          visible:false,
          content:''
        },
        cellphoneError:{
          visible:false,
          content:''
        },
        passwordError:{
          visible:false,
          content:''
        },
        confirmPwdError:{
          visible:false,
          content:''
        },
        nameError:{
          visible:false,
          content:''
        },
        addressError:{
          visible:false,
          content:''
        },
        postalPage:1,
        postCodeInput:'',
        postalList:[],
        successVisible:false,
        resultVisible:false,
        teamLeader:{},
        resultType:'',
        errorMsg:'',
        isLoading:false,
        isVisible:false,
        visibleType:''
      }
    },
    beforeRouteEnter(to,from,next){
      if(to.query.invitecode || to.query.inc){
        let inviteCode = to.query.invitecode || to.query.inc
        window.localStorage.setItem('inviteCode',inviteCode)
      }
      next()
    },
    methods:{
      contactHandle(){
        window.location.href ="https://api.whatsapp.com/send?phone="+ this.teamLeader.teamleadercellphone+"&text=&source=&data=";
        this.successVisible = false;
      },
      showPwdHandle(){
        this.showPwd = !this.showPwd;
      },
      showConfirmPwdHandle(){
        this.confirmPwdEye = !this.confirmPwdEye;
      },
      goShoppingHandle(){
        this.successVisible = false;
        this.isLoading = true;
        let option={
          timezone:new Date().getTimezoneOffset()/60,
          account:this.personForm.cellphoneConfirm,
          password: this.personForm.password
        }
        thirdLoginApi(option).then(res=>{
          if(res.status ==0){
            //  保存用户登录信息
            window.localStorage.removeItem('inviteCode')
            setUserTicket(res.data.ticket)
            setLoginInfo(res.data);
            setUserID(res.data.id)
            setUserType(res.data.usertype);
            setCustomerIdentity(res.data.setCustomerIdentity)
            if(process.client){
              this.$sensors.login(res.data.id)
            }

            //将数据保存到localStorage中
            setSensorData({
              platform_type: 'WAP',
              is_member: res.data.vip>0,
              is_login: true,
              vip_level:res.data.vip || '',
              sales: res.data.businessname || '',
            })
            //神策事件埋点
            /*
            * let option ={}
            if(getLoginInfo()){
              option={
                is_member:getLoginInfo().vip>0,
                is_login:true,
                vip_level:getLoginInfo().vip,
                sales:false
              }
            }else{
              option={
                is_member:false,
                is_login:false,
                vip_level:0,
                sales:false
              }
            }
            this.$sensors.registerPage(option)
            this.$sensors.track('click_watsapp')
            *
            * */
            //用户登录成功，获取id
            window.location.href = res.data.origUrl;
            this.isLoading = false;
          }else{
            this.$router.replace('/login');
            this.isLoading  = false;
          }
        }).catch(err=>{

        })

      },
      choosePostalItem(item){
        let value = item.text.split(',');
        this.personForm.address = `${value[1]}/${value[0]}`;
        this.personForm.postcode =value[1] ;
        this.personForm.suburb = value[0]
        this.postVisible = false;

      },
      loadMorePostalHandle(){
        this.postalPage++;
        searchPostcodeApi({
          search:this.postCodeInput,
          type:'suburb',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = [...this.postalList,...res.list];
        })
      },
      searchInputPostalHandle(){
        this.postalPage =1;
        this.getPostalList()
      },
      getPostalList(){
        searchPostcodeApi({
          search:this.postCodeInput,
          type:'suburb',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = res.list;
        })
      },
      showPostCodeHandle(){
        this.postVisible = true;
        this.getPostalList()
      },
      threeRegister(){
        let inc =  window.localStorage.getItem('inviteCode') || ''
        window.location.href =this.$config.productURL + "/fb/oauth?state=register" + (inc);
      },
      visibleConfirmHandle(event){
        const {name,countryCode,count} = event;
        switch (this.visibleType) {
          case 'country':
            this.personForm.countryName = name;
            this.personForm.countryNameID = countryCode;
            break;
          case 'countryCode':
            this.mobile = countryCode;
            this.countryCount =count;

            break;
        }
        this.isVisible = false;
      },
      closeHandle(){
        this.$router.replace('/login')
      },
      showPopupHandle(type){
        this.visibleType = type;
        this.isVisible = true;
      },
      submitHandle(){
        if(this.checkPersonForm()){
          this.isLoading = true;
          personRegisterApi({
            countrycode:this.mobile,
            cellphone:this.personForm.cellphoneConfirm,
            // smscode:this.personForm.smscode,
            password:this.personForm.password,
            name:this.personForm.name,
            postcode:this.personForm.postcode,
            suburb:this.personForm.suburb,
            country:this.personForm.countryNameID,
            inviter: window.localStorage.getItem('inviteCode') || ''
          }).then(res=>{
            if(res.status!=0){
              this.isLoading = false;
              this.cellphoneError.visible = false;
              this.passwordError.visible = false;
              this.confirmPwdError.visible = false;
              this.addressError.visible = false;
              let errorcode = res.data.errorcode;
              if(errorcode==41){
                this.nameError = {visible: true,content:res.message};
                this.$toast({message:res.message})
              }else if(errorcode==20 || errorcode==21){
                this.addressError ={visible: true,content:res.message}
                this.$toast({message:res.message})
              }else if(errorcode==31 || errorcode==32 ||errorcode==201){
                this.cellphoneError ={visible: true,content: res.message};
                this.$toast({message:res.message})
              }else if(errorcode==34){
                this.passwordError={visible: true,content:res.message};
                this.$toast({message:res.message})
              }else if(errorcode==47){
                this.countryError ={visible: true,content:res.message};
                this.$toast({message:res.message})
              }else{
                //ip只能注册5次，或者不能分配
                this.resultVisible = true;
                this.resultType='error';
                this.errorMsg = res.message;
              }
            }else{
              fbq('track', '注册成功');
              gtag('event', 'register', {'event_category' : '注册完成', 'event_label' : '注册完成'});
              this.isLoading = false;
              this.resultVisible = true;
              this.resultType='success';
              this.teamLeader = res.data;
            }
          })
        }
      },
      checkPersonForm(){
        this.countryError.visible = false;
        this.cellphoneError.visible = false;
        this.passwordError.visible = false;
        this.confirmPwdError.visible = false;
        this.addressError.visible = false;
        if(!this.personForm.countryName){
          this.countryError={
            visible: true,
            content:'Please Choose Country'
          }
          this.$toast({message:'Please Choose Country'})
          return false;
        }
        if(!this.personForm.cellphone){
          this.cellphoneError={
            visible: true,
            content:'Please fill in whatsapp no.'
          }
          this.$toast({message:'Please fill in whatsapp no.'})
          return false;
        }
        //1.去除空格
        this.personForm.cellphone = removeAllSpace(this.personForm.cellphone);
        this.personForm.cellphoneConfirm = this.personForm.cellphone;
        //2.判断是否是纯数字
        if(!isPureNumberValidate(this.personForm.cellphone)){
          this.cellphoneError={
            visible: true,
            content:'Please enter digital numbers.'
          }
          this.$toast({message:'Please enter digital numbers.'})
          return false;
        }
        //3.判断是否以区号开头
        if(this.personForm.cellphone.indexOf(this.mobile)!=0){
          //不以区号开头
          //3.1判断是否以0 开头
          if(this.personForm.cellphone.indexOf(0)==0){
            this.cellphoneError={
              visible: true,
              content:`${this.personForm.cellphone} The number cannot start with "0". `
            }
            this.$toast({message:`${this.personForm.cellphone} The number cannot start with "0". `})
            return false;
          }
          //3.2 不以为0开头，判断位数
          if(this.personForm.cellphone.length != this.countryCount){
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
          this.personForm.cellphoneConfirm = this.personForm.cellphoneConfirm.substring(this.mobile.toString().length);
          //2.判断是否以0 开头
          if(this.personForm.cellphoneConfirm.indexOf(0)==0){
            this.cellphoneError={
              visible: true,
              content:`${this.personForm.cellphoneConfirm} The number cannot start with "0". `
            }
            this.$toast({message:`${this.personForm.cellphoneConfirm} The number cannot start with "0". `})
            return false;
          }
          //3不是0开头，判断位数
          if(this.personForm.cellphoneConfirm.length != this.countryCount){
            this.cellphoneError={
              visible: true,
              content:'Digits of number don\'t match. '
            }
            this.$toast({message:'Digits of number don\'t match. '})
            return false;
          }
        }
        if(!this.personForm.password){
          this.passwordError={
            visible: true,
            content:'Please enter 6-20 digits passwords. Numbers or letters only.'
          }
          this.$toast({message:'Please enter 6-20 digits passwords. Numbers or letters only.'})
          return false;
        }
        if(!pwdValidate(this.personForm.password)){
          let errorType="Please enter 6-20 digits passwords. Numbers or letters only.";
          this.passwordError={
            visible: true,
            content:errorType
          }
          this.$toast({message:errorType})
          return false;
        }
        if(!this.personForm.confirmPwd){
          this.confirmPwdError={
            visible: true,
            content:'Please enter 6-20 digits passwords. Numbers or letters only.'
          }
          this.$toast({message:'Please enter 6-20 digits passwords. Numbers or letters only.'})
          return false;
        }
        if(this.personForm.password.trim() != this.personForm.confirmPwd.trim()){
          this.confirmPwdError={
            visible: true,
            content:'The password is not the same as before. '
          }
          this.$toast({message:'The password is not the same as before. '})
          return false;
        }
        if(this.personForm.countryNameID=='27' && !this.personForm.address){
          this.addressError ={
            visible: true,
            content:'Please fill in correct suburb.'
          }
          this.$toast({message:'Please fill in correct suburb.'})
          return false;
        }
        return true;

      }
    },
    mounted() {
      fbq('track', '注册页面');
      gtag('event', 'registerpage', {
        'event_category' : '注册页面',
        'event_label' : '注册页面'
      });
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
  /*注册成功弹出框开始*/
  .assistant_user{
    width:100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding:15px 0 0;
    .assistant_user_tel{
      color:#FFA54F;
      span{ border-bottom:1px solid #FFA54F;}
    }
  }
  .assistant_user_intro{
    color:gray;
    font-size:14px;
    line-height:1.5;
    text-align: center;
  }
  .assistant_user_btn{
    margin-top:25px;
    .contact_btn{
      border-radius: 6px;
      background:#F7AE18;
      margin-top:15px;
      color:#fff;
      font-size:15px;
    }

  }
  /*注册成功弹出框结束*/
  /*弹出框开始*/
  /deep/.van-icon-search::before{
    content:''
  }
  .postal-popup-content{
    padding:0 10px 10px;
    position: relative;
    .postal-popup-search{
      background:#fff;
      padding-top:10px;
      padding-bottom: 8px;
      border-bottom:1px solid #EEEEED;
      position: fixed;
      left:10px;
      right:10px;
      z-index: 10;

    }
    .postal-popup-list{
      padding-top: 50px;
    }
    .cellScrollHeight{
      max-height:350px;
    }
    /deep/.van-empty{
      padding:30px 0;
    }
  }
  /*弹出框结束*/
  /deep/.van-field__label{
    border-bottom:1px solid lightgray;
  }
  /deep/.van-cell{
    padding:8px 0;
  }
  .other_input{
    margin-top: 20px;
    display: flex;
    padding:0 20px;
    justify-content: flex-start;
    font-size:14px;
    align-items: center;
    img{
      vertical-align: middle;
      margin-left: 6px;
    }
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
        position: relative;
        margin-bottom: 20px;
        .from-input-arrow{
          position: absolute;
          right:25px;
          bottom:8px;
        }
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
          height:34PX !important;
          line-height: 34PX !important;
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
    .input-error{
      border:1px solid #f00;
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
      border-bottom:1px solid lightgray;
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
      margin-top:20px;
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
