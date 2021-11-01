<template>
    <div>
    <login-register-layout  @closeEmit="closeHandle" :isShopify="$route.meta.isShopify">
    <div class="login-form-content">
        <div class="login-form-title">Sign In</div>
        <div class="s3_user_tag" v-show="!$route.meta.isShopify" >
          <div class="s3_user_tag_content">
            <span> Affordable</span>
            and
            <span> Quality</span>
            Products for Business
          </div>
        </div>
        <div class="form-content" :class="{'form-content-shopify':$route.meta.isShopify}">
          <van-form  ref="loginForm" >
            <section class="input_area">
              <div class="username_input">
                <div class="intro">
                  Email
                  <span class="color_intro"> or </span>
                  Cellphone
                  <span class="color_warning">*</span>
                </div>
              </div>
              <van-field
                border
                v-model="user.email"
                name="email"
                autofocus
                autocomplete="username"
                placeholder="Email or Phone"

              />
            </section>
            <section class="input_area">
              <div class="username_input">
                <div class="intro">
                  Password
                  <span class="color_warning">*</span>
                </div>
              </div>
              <van-field
                autocomplete="current-password"
                border
                v-model="user.password"
                name="password"
                placeholder="Password"
                :type="showPwd?'text':'password'"
                :right-icon="showPwd?'eye-o':'closed-eye'"
                @click-right-icon="showPwdHandle"

              />
            </section>
            <div class="input_forget color_active"
                 v-login-register-track="{triggerType:'click',page:'login',operate:'forget password'}"
                 @click.stop="forgetPassHandle" v-show="!$route.meta.isShopify">
              Forget password
            </div>
            <van-button  class="login_btn" block native-type="submit"
                        :class="{'login_btn_shopify':$route.meta.isShopify}"
                        @click="submitHandle"> Sign in </van-button>
            <div class="input_forget" @click="toRegisterHandle">
              <span class="color_intro g_mr-s">New to ShopShipShake?</span> <span class="color_active"> Create Account</span>
            </div>
          </van-form>
          <template v-if="!$route.meta.isShopify">
            <div class="other_input" @click.stop="threeRegister"   v-login-register-track="{triggerType:'click',page:'login',operate:'facebook'}">
              Or Sign in With :  <img  src="~assets/images/user/facebook.png" alt="facebook" height="36" style="border-radius: 50%">
            </div>
            <div class="login_intro">
              binding with Facebook,you can login via Facebook next time
            </div>
          </template>
        </div>
      </div>
    </login-register-layout>
    <van-overlay :show="isLoading" @click="isLoading = false" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" />
      </div>

    </van-overlay>

    </div>
</template>
<script>
  import JsCookie  from 'js-cookie'
  import {thirdLoginApi} from '@/api/user';
  import config from '@/config'
  import {setUserTicket ,setLoginInfo ,setUserID,getCurrentPageSpmID, setCurrentPage,setRefer, setRefSpm,setUserType,setCustomerIdentity} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {setSensorData} from '@/utils/memory';
  import LoginRegisterLayout from '@/components/common/LoginRegisterLayout';
  import {getUserTicket} from "@/utils/memory";
  import {getUrlParamsFun,getOrigUrlOption} from '@/utils'
  export default {
    layout:'loginDefault',
    head(){
      return{
        title: `Sign in - shopshipshake`
      }
    },
    name: "index",
    components:{ LoginRegisterLayout},
    data(){
      return{
        isLoading:false,
        tabIndex:0,
        user:{
          email:'',
          password:''
        },
        showPwd:false,
        spmID:"",
        customerIdentity:0,
      }
    },
    /*

    * */

    methods:{

      goIndex(){
        let ticket = getUserTicket()|| '';
        window.open("https://shop.shopshipshake.com/shoppingmall/index" + "?ticket=" + ticket + "&spm=" + localStorage.getItem("spmClick"))
      },
      closeHandle(){
        if(this.$route.query.origUrl){
          window.location.href=this.$route.query.origUrl;
        }else{
          this.$router.replace('/shoppingmall/index')
        }
      },
      // goRegisterHandle(){
      //   this.$router.push(`/register?spm=a0001.login.register.0.${getCurrentPageSpmID()}`);
      // },
      threeRegister(){
        window.open(this.$config.productURL+ "/fb/oauth?state=login",'online')
      },
      //跳转到注册
      toRegisterHandle(){
        if(this.$route.meta.isShopify){
          this.$router.push(`/register/shopify?spm=a0001.login.register.0.${getCurrentPageSpmID()}`);
        }else{
          this.$router.push(`/register?spm=a0001.login.register.0.${getCurrentPageSpmID()}`);
        }

      },
      //  表单提交
      submitHandle(){
        if(!this.user.email){
          return this.$toast({message:'Email or mobile phone number is required'})
        }
        if(!this.user.password){
          return this.$toast({message:'password is required'})
        }
        this.isLoading = true;
        let option={
          timezone:new Date().getTimezoneOffset()/60,
          origUrl:this.$route.query.origUrl || window.localStorage.getItem('origUrl'),
          account:this.user.email,
          password: this.user.password
        }
        thirdLoginApi(option).then(res=>{
          if(res.status ==0){
            //  保存用户登录信息
            setUserTicket(res.data.ticket)
            setLoginInfo(res.data);
            setUserID(res.data.id)
            if(res.data.customeridentity){
              setCustomerIdentity(res.data.customeridentity)
            }
            setUserType(res.data.usertype)
            this.$sensors.login(res.data.id)
            JsCookie.remove('origUrl')
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
            this.isLoading = false;
            this.$toast({message:'Login success'});
            window.location.href=res.data.origUrl;
          }else{
            this.$toast({message:res.message})
            this.isLoading = false;
          }
        }).catch(err=>{
          this.isLoading = false;
        })
      },
      forgetPassHandle(){
        loginRegisterPageBury({
          p:'login',
          operate:'close',
          spm:`a0001.login.close.${getCurrentPageSpmID()}`
        })
        window.open("https://shop.shopshipshake.com/register/forgotpwd?spm=a0001.login.forget password",'online');

      },
      //  显示密码
      showPwdHandle(){
        this.showPwd = ! this.showPwd;
      },
      // 点击回车登录
      keyDown(e) {
        // 回车则执行注册方法 enter键的ASCII是13
        if (e.keyCode === 13) {
          this.submitHandle();
        }
      },
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'login',
        operate:'close',
        spm:`a0001.login.close.${getCurrentPageSpmID()}`
      })
      next();
    },
    beforeRouteEnter(to,from,next){

      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      if(from.path=='/register/shopify'){
        to.meta.hideNav =true;
      }else{
        to.meta.hideNav =false;
        JsCookie.remove('origUrl')
      }
      if(to.query.origUrl){
        let origUrl = getOrigUrlOption();
        // window.localStorages.setItem('origUrl',origUrl);
        JsCookie.set('origUrl',origUrl)
        if(to.query.origUrl.indexOf('shopify')!=-1){
          to.meta.isShopify = true;
        }else{
          to.meta.isShopify = false;
        }
      }

      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      loginRegisterPageBury({
        p:'login',
        operate:'page',
        spm:`a0001.login.page.-1`
      })
      next();
    },
    mounted() {
      fbq('track', '登陆页面');
      gtag('event', 'login', {
        'event_category' : '登录',
        'event_label' : '登录'
      });
      // 绑定监听事件
      window.addEventListener("keydown", this.keyDown);
      // if(this.$route.query.cellphone){
      //   this.user.email = this.$route.query.cellphone;
      // }

    },
  }
</script>
<style scoped lang="less">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .login-form-content{
    margin:4px 8px;
    .login-form-title{
      font-size:20px;
      font-weight: bold;
      text-align: center;

    }
    .form-content{
      padding:15px 10px ;
      margin-bottom: 10px;
    }
    .form-content-shopify{
      margin-top: 40px;
    }
    .username_input{
      font-size:15px;
      color:#2a2a2a;
    }
    .input_area{
      border-bottom:1px solid #eeeeed;
      margin-bottom:8px;
    }
    .input_forget{
      font-size:15px;
      padding:8px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .login_btn{
      margin:10px 0 ;
      background:#fcc900;
      border-radius: 4px;
      font-size:16PX;
      color:#fff;
    }
    .login_btn_shopify{
      margin-top: 50px;
    }
    .s3_user_tag{
      margin:15px 0 ;
      background-color: #ffeab2;
      padding:5px;
      font-size:14px;
      font-weight: 600;
      &_content{
        padding:8px;
        text-align: center;
        border:1px dashed #e6af6b;
        span{
          font-weight: bold;
          color:#f00
        }
      }
    }
    .other_input{
      color:gray;
      margin-top: 25px;
      display: flex;
      justify-content: flex-start;
      font-size:15px;
      align-items: center;
      img{
        vertical-align: middle;
        margin-left: 6px;
      }
    }
    .login_intro{
      color:#797979;
      text-align: center;
      margin-top: 25px;
      font-size:14px;
    }
  }


</style>
