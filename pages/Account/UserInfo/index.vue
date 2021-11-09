<template>
 <div class="profile-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="navbar-title">My Profile</div>
       </template>
     </van-nav-bar>
   </van-sticky>
    <scroll-view class="scrollCommonHeightView">
      <div class="profile-card bg_white">
        <div class="profile-card-title d_flex d_flex_between font_size_16">
          <div class="font_w">My Profile</div>
          <van-tag color="#fcc900" size="large" v-if="changeModel=='normal'" @click="changeModelHandle('form')"><span class="font_size_14">Update</span></van-tag>
        </div>
        <user-info-normal v-if="changeModel=='normal'"  :surveyCount="Number(basicInfo.surveyCount)" :expiredtime="basicInfo.expiredtime" :customervip="customervip" :user-info="userInfo" :currency="shopcustomer.currency"/>
        <user-info-form v-else @changeModelEvent="changeModelHandle('normal')"/>
      </div>
<!--      profile-program 开始-->
      <div class="profile-program-card bg_white" v-if="shopcustomer['plan1']==1">
          <div class="profile-card-title">
            <div class="profile-program-title font_size_16 font_w">Shopshipshake Affiliate Program</div>
            <div class="font_size_15 d_flex d_flex_end" @click="showInviteHandle"
                 v-if="shopcustomer['plan1'] == 1">
              Invite cumulative revenue：<span class="font_size_16 font_w color_orange_red">
                  {{basicInfo.totalbonus | moneyFormat}}</span>
              <van-icon name="arrow-down" size="16"/>
            </div>
            <div v-if="showPopover" class="profile-card-title-intro d_flex d_flex_end g_mt_m font_size_14 color_intro">
              <p v-for="(item,index ) in referralbonus" :key="index">
                {{item.number == 0?'First':item.number==1?'Second':'Third'}}
                transaction promotion income <span class="color_orange_red">{{item.money | moneyFormat}}</span>
              </p>
            </div>
          </div>
          <div class="profile-program-content">
            <p class="g_mb_l">
              As the partner of Shopshipshake,<br>
              Triple-S Ambassadors are the influential leaders in our members and will help new member to grow their business .
            </p>
            <p class="g_mb_l" v-if="shopcustomer['plan1']==1">
              In return triple-S Ambassador will get R40 from program once new user buy and receive their the products
              <section v-if="plancontent1.inviteemoney!=0">
                ,New user will get R{{plancontent1.inviteemoney }} once new user buy and receive their the products
              </section>
            </p>
            <p class=" color_blue font_size_16" >
              {{copyValue}}
            </p>
            <div class="copy-btn-area d_flex">
              <van-button color="#ecbd07" :plain="!copySuccess"  @click="operateHandle('copy')">Copy Link</van-button>
              <div class="face-btn" @click="operateHandle('facebook')">f</div>
            </div>
          </div>
      </div>
      <div class="customer-list-card bg_white" v-if="basicInfo.invitioncount!=0">
        <div class="profile-card-title d_flex d_flex_between">
          <div class="profile-program-title font_size_16 font_w"> Promoted customer list</div>
          <van-checkbox v-model="checked" @change="updateHandle" shape="square"><span class="font_w">UnPaid</span></van-checkbox>
        </div>
        <div class="profile-customer-content">
          <van-row class="font_size_15 font_w g_mb_l b_border g_pb_m" justify="space-between"
                   type="flex" align="center">

            <van-col span="10">Registration time </van-col>
            <van-col span="9" :offset="1">Contact </van-col>
            <van-col span="4">Paid </van-col>
          </van-row>
          <scroll-view class="scrollListHeight" @reachBottom="loadMoreHandle">
            <template v-if="isLoading">
              <van-loading type="spinner" color="#fcc900" size="45px"/>
            </template>
            <template v-else>
              <van-row class=" g_mb_l g_pb_m b_border_dash " v-for="(item,index) in inviteList" :key="index"
                       justify="space-between"
                       type="flex" align="center">
                <van-col span="6">{{item.ct}} </van-col>
                <van-col span="12">{{item.code}}{{item.cl}} </van-col>
                <van-col span="4"><span :class="{'color_active':item.paid>0,'color_warning':item.paid<=0}" >
                    {{item.paid>0?'paid':'unpaid'}}
                </span>
                </van-col>
              </van-row>
              <div class="list_bottom" >
                <div class="icon iconfont icon-end color_intro text-align" />
              </div>
            </template>

          </scroll-view>

        </div>
      </div>
    </scroll-view>
 </div>
</template>
<script>
import ScrollView from "@/components/common/ScrollView";
import UserInfoNormal from './UserInfoNormal'
import UserInfoForm from './UserInfoForm'
import config from '@/config'
import {getCurrentPageSpmID, setRefer, setRefSpm,getUserID} from '@/utils/memory'
import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
import {accountUserInfoApi,accountUserInviteListApi} from '@/api/account'
import {setCurrentPage} from "../../../utils/memory";
 export default {
   head(){
     return {
       title:'Personal Info - shopshipshake'
     }
   },
   data(){
      return{
        changeModel:'normal',
        userInfo:{},
        customervip:{},
        basicInfo:{
          expiredtime:'',
          surveyCount:0,
          totalbonus:0,
          invitioncount:0
        },
        shopcustomer:{},
        plancontent1:{},
        copySuccess:false,
        checked:false,
        page:1,
        inviteList:[],
        pageCount:1,
        showPopover:false,
        referralbonus:[],
        isLoading:false,
      }
   },
   computed:{
     copyValue(){return `https://shop.shopshipshake.com/register?inc=${getUserID()}`}
   },
   beforeRouteLeave(to,from,next){
     loginRegisterPageBury({
       p:'userInfo',
       operate:'close',
       spm:`a0001.userInfo.close.${getCurrentPageSpmID()}`
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
       p:'userInfo',
       operate:'page',
       spm:`a0001.userInfo.page.-1`
     })
     next();
   },

   components:{ScrollView,UserInfoNormal ,UserInfoForm},
    methods:{
      showInviteHandle(){
          this.showPopover= !this.showPopover;
      },
      loadMoreHandle(){
        if(this.page > this.pageCount) return;
        this.page++;
        accountUserInviteListApi({
          page:this.page,
          unpaid:this.checked?1:0
        }).then(res=>{
          this.inviteList =[...this.inviteList,... res.datas]
        })
      },
      //复制
      operateHandle(type){
        switch (type) {
            case 'copy':
              this.$copyText(this.copyValue).then(e=>{
                this.$toast({message:'Copy succeeded'})
                this.copySuccess= true;
              })
              break;
            case 'facebook':
              let url = `http://www.facebook.com/sharer/sharer.php?u=${this.copyValue}`;
               window.open(url)
              break;
        }

      },
      updateHandle(){
        this.page = 1;
        this.getInviteList()
      },
      goBackHandle(){
       this.$router.replace('/account/index')
      },
      changeModelHandle(type){
        if(type=='normal'){
          this.getUserInfo()
        }
        this.changeModel=type;

      },
      getInviteList(){
        this.isLoading = true;
        accountUserInviteListApi({
          page:this.page,
          unpaid:this.checked?1:0
        }).then(res=>{
          this.pageCount = res.pageCount;
          this.inviteList = res.datas || [];
          this.isLoading = false;
        })
      },
      getUserInfo(){
        accountUserInfoApi().then(res=>{
          if(res){
            let  {user,customervip,expiredtime,surveyCount,shopcustomer,totalbonus,plancontent1,invitioncount,referralbonus} = res;
            if(invitioncount != 0){
              this.getInviteList()
            }
            this.userInfo  = user;
            this.customervip=customervip;
            this.basicInfo={
              expiredtime:expiredtime?expiredtime:'',
              surveyCount,
              totalbonus:Number(totalbonus ),
              invitioncount
            }
            this.shopcustomer = shopcustomer || {};
            this.plancontent1 = plancontent1 || {};
            this.referralbonus = referralbonus || []
          }
        })
      }
    },
   mounted() {

     this.getUserInfo()
   },
 }
</script>

<style scoped lang="less">
  /deep/.van-loading{
    margin:30px auto;
  }
  .update-btn{
    font-size:15px;
    padding:3px 10px;
    border-radius: 15px;
  }
  .profile-card{
    padding-bottom: 20px;
  }
  .profile-card,.profile-program-card,.customer-list-card{
    border-radius: 4px;
    margin-bottom: 15px;
    .profile-card-title{
      padding:10px ;
      border-bottom:1px solid #EEEEED;

    }

  }
  .customer-list-card{
    .profile-program-title{
      margin-bottom: 8px;
      margin-top: 8px;
    }
    .profile-customer-content{
      padding:15px 8px;
      .scrollListHeight{
        max-height:300px;
      }
    }
  }
  .profile-program-card{
    .profile-program-title{
      margin-bottom: 8px;
      margin-top: 8px;
    }
    .profile-program-content{
      padding:15px 18px;
      p{
        text-align: left;
        font-size:16px;
        line-height:1.6;
        text-indent: 25px;
      }
      .copy-btn-area{
        margin-top: 12px;
        justify-content: center;
        .copy-btn{
          border:1px solid #ecbd07;
          color:#ecbd07;
          padding:8px 10px;
          font-size:15px;
          border-radius: 4px;

        }
        .bg_success{
          background-color: #ecbd07;
          color:#fff;
        }
        .face-btn{
          background-color: #2d4373;
          font-weight: bold;
          color:#fff;
          font-size: 30px;
          padding:0 16px;
          margin-left: 6px;
          border-radius: 4px;
        }
      }
    }
  }
  .b_border_blue{
    border-bottom:1px solid lightskyblue;
  }
</style>
