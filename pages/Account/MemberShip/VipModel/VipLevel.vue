<template>
  <div class="memberShip-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="navbar-title">MemberShip</div>
        </template>
      </van-nav-bar>
      <!--     会员等级卡片-->
      <div class="member-ship-card-content">
        <div class="member-ship-card">
          <van-row type="flex" align="center">
            <van-col span="7">
              <div class="member-ship-img">
                <img :src="vipImg" alt="">
              </div>
            </van-col>
            <van-col span="16">
              <div class="member-ship-info">
                <div class="info-name">{{memberShip.username}}</div>
                <div class="info-time">Valid Thru: {{memberShip.validthru}}</div>
              </div>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="16" offset="8" class="text_align_r">
              <div class="member-ship-line"></div>
              <div class="member-ship-upgrade d_flex" @click="updateHandle">
                upgrading your membership
                <van-icon name="arrow" size="16" class="g_ml_s"/>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="member-ship-save d_flex d_flex_between" @click="checkSavingHandle">
          <div class="color_warning">Saving R{{memberShip.savings}}</div>
          <van-icon name="arrow" size="20" color="#f00"/>
        </div>
      </div>
    </van-sticky>
    <scroll-view class="membershipScroll">
      <div class="member-ship-content">
        <div class="member-ship-priority-box g_mb_l">
          <div class="box-title">
            <div class="priority-title">Membership priority</div>
            <div class="priority-intro "
                 @click="goPriorityHandle">priority comparison >></div>
          </div>
          <div class="priority-list-content">
            <div class="g_mb_m d_flex " v-for="(priority,index) in priorityList" :key="`priority_${index}`">
              <van-icon name="star" color="#fcc900" size="19"/>
              <div class="list-item-title">{{priority.priority}}</div>
              <div class="color_warning tag-new" v-if="priority.suffix==1">new</div>
            </div>
            <div class=" process-content">more priorities in processing.....</div>
          </div>
        </div>
        <div class="member-ship-priority-box">
          <div class="box-title">
            <div class="priority-title">Coupons only for membership</div>
            <div class="priority-intro color_orange"><strong class="color_active">{{memberShip.couponnums}}</strong> coupons per month</div>
          </div>
          <div class="member-ship-coupon">
            <template v-if="couponList && couponList.length ">
              <div class="coupon-item" v-for="(coupon,index) in couponList" :key="index">
                <div class="coupon-inner">
                  <div class="coupon-inner-money">R{{coupon.money}}</div>
                  <div class="coupon-inner-power">{{coupon.name}} Coupons</div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="coupon-extra">0 coupons per month</div>
            </template>
          </div>
        </div>
      </div>
      <question />
    </scroll-view>
  </div>
</template>

<script>
  import {accountVipInfoApi,accountMemberShipPriorityApi} from '@/api/account'
  import ScrollView from "@/components/common/ScrollView";
  import Question from '../Question'
  export default {
    components:{ScrollView,Question},
    data(){
      return{
        memberShip:{},
        priorityList:[],
        couponList:[],
        isLoading:false
      }
    },
    computed:{
      vipImg(){
        if(this.memberShip.viplevel==3){
          return require('../../../../assets/images/Account/vip3.png')
        }else if(this.memberShip.viplevel==2){
          return require('../../../../assets/images/Account/vip2.png')
        }else if(this.memberShip.viplevel==1){
          return require('../../../../assets/images/Account/vip1.png')
        }
      }
    },
    methods:{
      checkSavingHandle(){
        this.$router.push('/account/saving')
      },
      updateHandle(){
        this.$router.push(`/membership/checkout?vipgradeid=1`)
      },
      goBackHandle(){
        this.$router.back()
      },
      goPriorityHandle() {
        window.open('https://shopshipshake.co.za/business-service/membership', 'online')
      },
      getMemberShipInfo(){
        accountVipInfoApi().then(res=>{
          this.memberShip = {
            username:res.username,
            validthru:res.validthru,
            savings:res.savings,
            viplevel:res.viplevel,
            couponnums:res.couponnums[res.viplevel]

          };
          this.couponList= res.couponlist[res.viplevel] || [];
          this.getMemberShipPriority(res.viplevel)
        })
      },
      getMemberShipPriority(viplevel){
        accountMemberShipPriorityApi().then(res=>{
          this.priorityList = res[viplevel].priorityList || [];
        })
      }
    },
    created() {
      this.getMemberShipInfo();
    }


  }
</script>

<style scoped lang="less">
  .memberShip-wrapper{
    background:#EEEEED;
  }
  .memberShip-wrapper{
    /*    卡片开始*/
    .member-ship-card-content{

      .member-ship-card{
        margin:8px;
        background-color: #fff;
        border-radius: 8px;
        padding:10px 8px;
        background:linear-gradient(90deg, rgba(254, 230, 0, 1) 0%, rgba(252, 201, 0, 1) 100%);


      }
      .member-ship-img{
        width:80px;
        img{
          width:80px;
          height:auto;
        }
      }
      .member-ship-info{
        .info-name{
          font-size:24PX;
        }
        .info-time{
          font-size:14px;
          margin-top:10px;
          color:#2A2A2A;
        }
      }
      .member-ship-line{
        width:100%;
        height:1px;
        background-color: #fff;
      }
      .member-ship-upgrade{
        font-size:15px;
        padding:6px 3px;
        color:#0894ec;
      }
      .no-vip-card{
        margin:8px;
        color:#2A2A2A;
        background:linear-gradient(90deg, rgba(254, 230, 0, 1) 0%, rgba(252, 201, 0, 1) 100%);
        border-radius: 8px;
        padding:10px 8px;
      }
      .member-ship-save{
        margin-top:10px;
        background:#fcc900;
        padding:12px 20px;
        border-radius: 10px 10px 0 0 ;
        font-size:22px;
      }
    }
    /*    卡片结束*/
    .membershipScroll{
      height:calc(100vh - 100px - 200px);
      background-color: #fff;
    }
    .member-ship-content{
      padding:15px;
      .member-ship-priority-box{
        background-color: rgb(240, 240, 240);
        border-radius: 6px;
        padding:10px;
        .icon-new1{
          font-size:30px;
        }
        .box-title{
          .priority-title{
            font-size:18px;

          }
          .priority-intro{
            font-size:16px;
            text-align: right;
            margin:10px 0 ;
          }
        }
        .priority-list-content{
          .list-item-title{
            font-size: 14px;
            margin:2px 4px;
            line-height:1.5;
          }
          .tag-new{
            font-style: italic;
          }
          .process-content{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size:16px;
            margin-top: 15px;
            color:#2A2A2A;
          }
        }
        .member-ship-coupon{
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          .coupon-extra{
            padding:8px 0;
          }
          .coupon-item{
            width:45%;
            margin:0 6px 10px 0 ;
            padding:4px;
            border-radius: 10px;
            background-color: #FFA54F;
            .coupon-inner{
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              border:1px dashed #fff;
              border-radius: 10px;
              padding: 6px 10px;
              .coupon-inner-money{
                font-size:18px;
                margin-bottom: 4px;
              }
              .coupon-inner-power{
                color:#2A2A2A;
                font-size:14px;
              }
            }
          }
        }

      }

    }
    /*  优惠卷开始*/

    /*  优惠卷结束*/
  }

</style>
