<template>
  <div class="s3_header_content">
    <div class="container swiper_container g_mb_l">
      <van-swipe :autoplay="8000"  indicator-color="#fcc900" >
        <van-swipe-item v-for="(item, index) in bannerList" :key="index" >
          <div @click="swiperUrlHandle(item)" class="img-swiper">
            <img :src="item.imgage"  />
          </div>

        </van-swipe-item>
      </van-swipe>
    </div>
    <van-button color="#fcc900" block
                @click="goUserGuidanceHandle"

                class="guidance_btn g_mb_l" >
      <span>New user guidance</span>
    </van-button>

    <!--      tab区域-->
    <div class="home_tab_content">
      <div class="home_tab_item"
           @click="tabOperateHandle('category')">
        <img src="@/assets/images/home/cagegories.png" alt="">
        <span class="tan_title">Categories</span>
      </div>
      <div class="home_tab_item" v-if="userType != $config.orderUserType.MEMBER"
           @click="tabOperateHandle('forwarding')">
        <img src="@/assets/images/home/forwarding.png" alt="">
        <span class="tan_title">Forwarding</span>
      </div>
      <div class="home_tab_item card-demo-3"
           @click="tabOperateHandle('assistant')">
        <img src="@/assets/images/home/assistant.png" alt="">
        <span class="tan_title">{{customerIdentity==2?'Consultant':'Ambassador'}}</span>
      </div>
      <div class="home_tab_item"
           @click="tabOperateHandle('business')">
        <img src="@/assets/images/home/bussiness.png" alt="">
        <span class="tan_title">Business</span>
      </div>
      <div class="home_tab_item"
           @click="tabOperateHandle('help')">
        <img src="@/assets/images/home/help.png" alt="">
        <span class="tan_title">Help</span>
      </div>
    </div>
    <van-dialog v-model="show" :showConfirmButton="false" width="90%">
      <div class="assistant-content">
            <div class="assistant-title">Contact</div>
        <div class="assistant-intro">
          <div class="assistant-email">Email: <a href="mailto:service@shopshipshake.com" target="_blank">service@shopshipshake.com</a></div>
          <div class="assitant-wtsapp">
            <template v-if="isLogin">
              <p>{{customerIdentity==2?'Consultant':'Ambassador'}}</p>
              <a :href="`https://api.whatsapp.com/send?phone=${contactTel}&text=&source=&data=`" target="_blank">
                {{contactTel}}
              </a>
            </template>
            <template v-else>
              <router-link to="/login" replace style="color:red;">Login</router-link>
               to get your bussiness Consultant WhatsApp number
            </template>
          </div>
        </div>
          <div class="close-btn">
              <van-button type="default" @click=" show = false" class="btn">Close</van-button>
          </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {accountBasicInfoApi} from '@/api/account'
import {getLoginInfo , setUserType} from "@/utils/memory";
export default {
  name: "home_head_content",
  props:{
    bannerList:{
      type:Array,
      default:()=>[]
    },
  },
  data(){
    return{
      bannerSwiperOption:{
        speed: 1000,   // 轮播速度
        spaceBetween: 26,
        loop:true,
        pagination:{
          el:'.banner-swiper-pagination',
          type:'progress'
        }
      },//轮播图设置
      show:false,
      contactTel:'',
      userType:0,//用户身份 0(未参团)  1:团长 2:团元
      customerIdentity:0,
      tabList:[
        {name:'Categories',img:require('../../../assets/images/home/cagegories.png'),val:'category'},
        {name:'Forwarding',img:require('../../../assets/images/home/forwarding.png'),val:'forwarding'},
        {name:'Assistant',img:require('../../../assets/images/home/assistant.png'),val:'assistant'},
        {name:'Business',img:require('../../../assets/images/home/bussiness.png'),val:'business'},
        {name:'Help',img:require('../../../assets/images/home/help.png'),val:'help'},
      ],
      tabMemberList:[
        {name:'Categories',img:require('../../../assets/images/home/cagegories.png'),val:'category'},
        {name:'Assistant',img:require('../../../assets/images/home/assistant.png'),val:'assistant'},
        {name:'Business',img:require('../../../assets/images/home/bussiness.png'),val:'business'},
        {name:'Help',img:require('../../../assets/images/home/help.png'),val:'help'},
      ]
    }
  },
  methods:{
    swiperUrlHandle(item){
      window.open(item.hrefurl)
    },
    goOtherURL(e){
      if(!this.isLogin){
        this.$router.replace('/login')
      }else{
        window.open(`${this.$config.jianweiDomain}${e}`)
      }
    },
    goUserGuidanceHandle(){
      this.$router.push('/helpcenter/userguidance')
    },

    //tab点击操作
    tabOperateHandle(type){
      switch (type) {
          case 'category':
            this.$router.push('/shoppingmall/categorylist')
            break;
          case 'forwarding':
            // this.goOtherURL('/othershop/index')
            this.$router.push('/othershop/index')
            break;
            case 'assistant':
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

              *
              * */
              // this.$sensors.registerPage({
              //   is_member:getLoginInfo().vip>0,
              //   is_login:!!getUserID(),
              //   vip_level:getLoginInfo().vip || '',
              //   sales:getLoginInfo().businessname || ''
              // })
              if(process.client){
                this.$sensors.track('click_watsapp');//神策事件
              }

              if(this.isLogin){
                this.contactTel = `${getLoginInfo().ambassadorcountrycode?getLoginInfo().ambassadorcountrycode:''}${getLoginInfo().ambassadorcellphone}`
              }
              this.show = true;

              break;
          case 'business':
            /*

            if(getUserTicket()){
              //判断用户
              if(this.customerIdentity==2){
                //bussiness用户
                window.open('https://shopshipshake.co.za/business-service/','online')
              }else{
                this.$router.replace('/register/business?formType=update')
              }

            }else{
              this.$router.replace('/login')
            }
              */
            window.open('https://shopshipshake.co.za/business-service/','online')
            break;
          case 'help':
            this.$router.push('/helpcenter/index')
          break;
      }
    },
    getBasicInfo(){
      if(this.isLogin){
        this.customerIdentity = getLoginInfo().customeridentity;
        accountBasicInfoApi().then(res=>{
          this.userType = res.isleader;
          setUserType(this.userType)
        })
      }

    }
  },
  computed:{
    isLogin(){

      return getLoginInfo()!=null && getLoginInfo().id!=''
    }
  },
  mounted() {
    this.getBasicInfo();
  }
}
</script>

<style scoped lang="less">
  /deep/.van-swipe-item{
    height:134px;
  }
  .img-swiper{
    width:100%;
    padding-bottom: 100%;
    img{
      width:100%;
    }
  }
.assistant-content{
  .assistant-title{
    font-size:30px;
    font-weight: bold;
    padding: 20px 0;
    text-align: center;
  }
  .assistant-intro{
    text-align: center;
    font-size:18px;
    line-height:2;
    color:#797979;
    .assistant-email{
      margin-bottom: 10px;

    }
    a{
      color:#333;
    }
  }
  .close-btn{
       padding:10px 0 20px;
      text-align: center;
    .btn{
      background:rgb(174, 222, 244);
      color:#333;
      border-radius: 4px;
      font-size:20px;

    }
    /deep/.van-button{
      height:40px!important;

    }
  }
}
.s3_header_content{
  padding: 10px 8px 10px;
  .swiper_container{

    img{
      width:100%;
      height:100%;
      border-radius: 10px;

    }
  }
  .guidance_btn span{
    color: #222222;
    font-weight: 500;
  }
}
.home_tab_content{
  padding:20px 0 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .home_tab_item{
    font-size:13px;
    padding:0 4px;
    flex:1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width:40px;
      height:40px;
      border-radius: 50%;
    }
    .tan_title{
      margin-top: 6px;
      color:#2A2A2A;
    }
  }

}

/deep/ .van-swipe__indicators{
  left:89%;
  transform:translateX(-89%);
}
  /deep/ .van-swipe__indicator{
    width: 8px;
    height:8px
  }
  /deep/ .van-swipe__indicator--active{
    border-radius: 13px;
    background-color: rgb(252, 201, 0);
    padding: 0 10px;
  }
</style>
