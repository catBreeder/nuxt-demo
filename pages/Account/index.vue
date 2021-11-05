<template>
  <div class="s2-account-wrapper">
    <!--    头部开始-->
    <van-sticky v-if="hideVisible">
      <common-index-header
        page="个人中心"
        @clickLeftEmit="goOtherUrlHandle('index')"
        @clickRightEmit="goOtherUrlHandle('message')"
      >
        <i
          class="icon iconfont icon-kaitongxuzhi"
          v-click-track="{ triggerType: 'click', fun: 'intro' }"
          slot="left"
        ></i>
      </common-index-header>
    </van-sticky>
    <!--    头部结束-->
    <scroll-view class="scrollHeight">
      <div>
        <!--    用户信息开始-->
        <div class="account-user-content">
          <van-row class="user-info" type="flex" align="center">
            <van-col span="3">
              <img
                :src="vipImg"
                alt=""
                width="40"
                @click="goOtherUrlHandle('membership')"
              />
            </van-col>
            <van-col span="19" offset="2" class="user-name van-ellipsis">
              <div class="group-tag" v-if="showGroupFlag">
                {{ showGroupName }}
              </div>
              {{ basicInfo.username }}
            </van-col>
          </van-row>
          <van-row class="user-coin">
            <van-col span="12" @click="goOtherUrlHandle('balance')">
              <div class="user-intro">Balance</div>
              <div class="user-content">R{{ basicInfo.balance }}</div>
            </van-col>
            <van-col span="10" offset="2" @click="goOtherUrlHandle('scoin')">
              <div class="user-intro">S Coin</div>
              <div class="user-content">
                {{ basicInfo.scoin }}
              </div>
            </van-col>
          </van-row>
        </div>
        <!--    用户信息结束-->
        <div class="account-order-box">
          <div class="account-order-top">
            <div
              class="account-order-top-left"
              @click="goOtherUrlHandle('coupon')"
            >
              <van-icon name="bookmark-o" size="15" class="g_mr_m" />
              Coupon
              <span class="g_ml_m color_orange">{{ basicInfo.coupons }}</span>
            </div>
            <div
              class="account-order-top-right"
              @click="goOtherUrlHandle('favorite')"
            >
              <van-icon name="like-o" size="15" class="g_mr_m" />
              Favorites
              <span class="color_orange g_ml_m">{{ basicInfo.favorites }}</span>
            </div>
          </div>
          <div class="account-oder-title d_flex d_flex_between">
            <div class="title-left">Orders</div>
            <div class="title-right" @click="goOrderHandle('all')">
              <div>All</div>
              <van-icon name="arrow" size="14" class="g_ml_s" />
            </div>
          </div>
          <div class="account-order-content">
            <div class="account-order-item" @click="goOrderHandle('purchase')">
              <div class="item-count">{{ count.purchaseCount }}</div>
              <div class="item-name">Purchase</div>
            </div>
            <div
              class="account-order-item count-order-item-ship"
              @click="goOrderHandle('ship')"
            >
              <div class="item-count">{{ count.shipCount }}</div>
              <div class="item-name">To Ship</div>
              <div class="item-red" v-if="count.shipCount > 0"></div>
            </div>
            <div class="account-order-item" @click="goOrderHandle('transit')">
              <div class="item-count">{{ count.transitCount }}</div>
              <div class="item-name">In Transit</div>
            </div>
            <div class="account-order-item" @click="goOrderHandle('complete')">
              <div class="item-count">{{ count.completeCount }}</div>
              <div class="item-name">Completed</div>
            </div>
            <div class="account-order-item" @click="goOrderHandle('comment')">
              <div class="item-count">{{ count.commentCount }}</div>
              <div class="item-name">Comment</div>
            </div>
          </div>
        </div>

        <!--    banner开始-->
        <div
          class="banner-wrapper"
          v-if="basicInfo.viplevel == 0"
          @click="toMemberShipHandle"
        >
          <div class="banner-name">Upgrade to Platinum</div>
          <div>Monthly coupon R {{ basicInfo.leastCoupons }} in total</div>
          <div>Quality Inspection 90% off</div>
          <div>Fast Refund</div>
        </div>
        <!--    banner结束-->
        <!--    tab开始-->
        <div class="account-grid-box">
          <div
            class="grid-item"
            v-for="(item, index) in tabsList"
            :key="index"
            @click="goOtherUrlHandle(item.value)"
          >
            <div class="item-img">
              <img :src="item.img" alt="" width="24" />
            </div>
            <div class="item-title">{{ item.text }}</div>
          </div>
        </div>
        <div class="space-area"></div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import CommonIndexHeader from "@/components/common/CommonIndexHeader";
  import { shopOrderCountApi } from "@/api/orders";
  import ScrollView from "@/components/common/ScrollView";
  import { logoutApi } from "@/api/user";
  import { accountBasicInfoApi, accountCustomerTaskTodoApi } from "@/api/account";
  import { getUrlParams } from "@/utils";
  import config from "@/config";
  import { getCurrentPageSpmID, setRefer, setRefSpm } from "@/utils/memory";
  import { loginRegisterPageBury } from "@/utils/buryPoint/buryPoint";
  import {
    removeSearchHistory,
    removeUserTicket,
    removeLoginInfo,
    removeRegisterInfo,
    removeUserID,
    removeCategoryScroll,
    removeOrderShipAddressID,
    removeHomeSale,
    removeHomeGoodsList,
    removeCombineList,
    removeRefer,
    removeCurrentPageSpmID,
    removeUserType,
    removeSensorData,
    removeCartQualityFlag,
    removeCurrentPage,
    getLoginInfo, setCurrentPage
  } from "@/utils/memory";


  export default {
    head(){
      return {
        title:'My Account - shopshipshake'
      }
    },
    name: "index",
    components: { CommonIndexHeader, ScrollView },
    data() {
      return {
        count: {
          purchaseCount: 0,
          shipCount: 0,
          transitCount: 0,
          completeCount: 0,
          commentCount: 0
        },
        tabsList: [
          {
            text: "Personal Info",
            img: require("../../assets/images/Account/card.png"),
            value: "personal"
          },
          {
            text: "Account Bill",
            img: require("../../assets/images/Account/bill.png"),
            value: "balance"
          },
          {
            text: "S Coin",
            img: require("../../assets/images/Account/coinsvg.png"),
            value: "scoin"
          },
          {
            text: "Membership",
            img: require("../../assets/images/Account/Membership.png"),
            value: "membership"
          },
          // {text:'Recent View',img:require('../../assets/images/Account/footer.png'),value:'recentView'},
          {
            text: "Update Password",
            img: require("../../assets/images/Account/UpdatePassword.png"),
            value: "updatePassword"
          },
          {
            text: "After-Sale Service",
            img: require("../../assets/images/Account/AfterSaleService.png"),
            value: "afterSale"
          },
          {
            text: "Client Management",
            img: require("../../assets/images/Account/ClientManagement.png"),
            value: "client"
          },
          {
            text: "FAQ",
            img: require("../../assets/images/Account/FAQ.png"),
            value: "FAQ"
          },
          {
            text: "influencer",
            img: require("../../assets/images/Account/user-money.svg"),
            value: "influence"
          },
          {
            text: "Group-Buy",
            img: require("../../assets/images/Account/group.png"),
            value: "groupShip"
          },
          {
            text: "Business Account",
            img: require("../../assets/images/Account/update.svg"),
            value: "update"
          },
          {
            text: "Shopify",
            img: require("../../assets/images/shopify/Shopify.svg"),
            value: "shopify"
          },
          {
            text: "Login Out",
            img: require("../../assets/images/Account/LoginOut.png"),
            value: "loginOut"
          }
        ],
        basicInfo: {},
        hideVisible: true
      };
    },
    beforeRouteLeave(to, from, next) {
      loginRegisterPageBury({
        p: "account",
        operate: "close",
        spm: `a0001.account.close.${getCurrentPageSpmID()}`
      });
      next();
    },
    beforeRouteEnter(to, from, next) {
      if (from.path != "/") {
        setRefer(config.jianweiDomain + from.path);
      }
      if (to.query.spm) {
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      loginRegisterPageBury({
        p: "account",
        operate: "page",
        spm: `a0001.account.page.-1`
      });
      next();
    },
    mounted() {
      this.getOrderCount();
      this.getBasicInfo();
      if (getUrlParams("iframe") == "true") {
        this.hideVisible = false;
      }
    },
    computed: {
      //当isLeader=1||2时候，显示
      showGroupFlag() {
        return (
          this.basicInfo.isleader == this.$config.orderUserType.MANAGER ||
          this.basicInfo.isleader == this.$config.orderUserType.MEMBER
        );
      },
      //显示group -buy
      showGroupName() {
        if (this.basicInfo.isleader == this.$config.orderUserType.MANAGER) {
          return "Group-Buy Leader";
        } else if (this.basicInfo.isleader == this.$config.orderUserType.MEMBER) {
          return "Group-Buy member";
        }
      },
      vipImg() {
        return require(`../../assets/images/vip/vip${this.basicInfo.viplevel ||
        0}.png`);
      }
    },
    methods: {
      //获取基本信息
      getBasicInfo() {
        accountBasicInfoApi().then(res => {
          if (res.customertype != 10) {
            this.tabsList = this.tabsList.filter(
              item => item.value != "influence"
            );
          }
          //B客户不显示group-buy按钮，C客户显示
          //大客户没有group-buy入口
          if (res.isleader == this.$config.orderUserType.BIGCUSTOMER || res.customeridentity ==this.$config.customerIdentityType.business) {
            this.tabsList = this.tabsList.filter(
              item => item.value != "groupShip"
            );

          }
          //1是ｐｅｒｓｏｎ　，２是ｂｕｓｉｎｅｓｓ，只有１的时候才显示,团长的时候不显示
          if (res.customeridentity != this.$config.customerIdentityType.personal  || res.isleader == this.$config.orderUserType.MANAGER) {
            //person
            this.tabsList = this.tabsList.filter(item => item.value != "update");
          }
          // //大客户显示shopify入库
          if(res.shopifyflg != 1 ){
            this.tabsList = this.tabsList.filter(item => item.value != "shopify");
          }
          this.basicInfo = res;
        });
      },
      //1.获取商品tab个数
      getOrderCount() {
        shopOrderCountApi("account").then(res => {
          this.count = {
            purchaseCount: res.count3 || 0,
            shipCount: res.count4 || 0,
            transitCount: res.count5 || 0,
            completeCount: res.count6 || 0,
            commentCount: res.count9 || 0
          };
        });
      },
      toMemberShipHandle() {
        this.$router.push('/membership/index')
        // window.location.href = `${this.$config.jianweiDomain}/membership/index`;
      },
      goOtherUrlHandle(type) {
        let url = "";
        switch (type) {
          case "update":
            if (getLoginInfo()) {
              //判断用户
              if (getLoginInfo().customerIdentity == 2) {
                //bussiness用户
                window.open(
                  "https://shopshipshake.co.za/business-service/",
                  "online"
                );
              } else {
                this.$router.replace("/register/business?formType=update");
              }
            } else {
              this.$router.replace("/login");
            }

            break;
          case "membership":
            this.$router.push('/membership/index')
            break;
          case "balance":
            this.$router.push("/bill/index");
            break;
          case "scoin":
            this.$router.push("/scoin/index");
            break;
          case "coupon":
            this.$router.push("/coupon/index");
            break;
          case "favorite":
            this.$router.push("/shoppingmall/collectionproduct");
            break;
          case "order":
            this.$router.replace("/shoporder/2/index");
            this.$EventBus.$emit("toOrder");
            break;
          case "personal":
            this.$router.push("/user/info");
            break;
          case "updatePassword":
            this.$router.push("/user/updatepassword");
            break;
          case "afterSale":
            this.$router.push('/workorder/index')
            break;
          case "client":
            this.$router.push("/client/index");
            break;
          case "FAQ":
            this.$router.push("/question/index");
            break;
          case "loginOut":
            logoutApi().then(res => {});
            this.clearAllHandle()
            this.$EventBus.$emit("toIndex");
            this.$router.replace("/");
            break;
          case "groupShip":
            this.$router.push("/groupship/index");
            break;
          case "index":
            this.$router.replace("/");
            this.$EventBus.$emit("toIndex");
            break;
          case "message":
            this.$router.push("/message/index");
            break;
          case "influence":
            // url = `${this.$config.jianweiDomain}/customertask/promotion`;
            // window.location.href = url;
            this.$router.push('/customertask/promotion')
            break;
          case "recentView":
            this.$router.push("/recent/view");
            break;
           case 'shopify':
             this.$router.push('/shopify/index')
             break;
        }
      },
      clearAllHandle() {
        localStorage.clear();
          removeSearchHistory();
          removeUserTicket();
          removeLoginInfo();
          removeRegisterInfo();
          removeUserID();
          removeCategoryScroll();
          removeOrderShipAddressID();
          removeHomeSale();
          removeHomeGoodsList();
          removeCombineList();
          removeRefer();
          removeCurrentPageSpmID();
          removeUserType();
          removeSensorData();
          removeCartQualityFlag();
          removeCurrentPage();
          localStorage.removeItem('top100Info')
          localStorage.removeItem('HomeProductModal')
          localStorage.removeItem('changeTab');
          sessionStorage.removeItem('interrupt_popupwindow_login');
      },
      goOrderHandle(type) {
        this.$router.replace(`/shoporder/2/index?tagIndex=${type}`);
        this.$EventBus.$emit("toOrder");
      }
    }
  };
</script>

<style scoped lang="less">
  .group-tag {
    font-size: 13px;
    color: #fff;
  }
  .user-intro {
    color: #2a2a2a;
    font-size: 15px;
    margin-bottom: 6px;
  }
  .user-content {
    font-size: 18px;
  }
  .space-area {
    height: 30px;
    background-color: #eeeeed;
  }
  .scrollHeight {
    height: calc(100vh - 50PX - 30PX);
    background-color: #eeeeed;
  }
  .icon-kaitongxuzhi {
    font-size: 25px;
    color: gray;
  }

  .account-user-content {
    /*font-size:18px;*/
    border-radius: 6px;
    margin: 8px;
    background: linear-gradient(rgb(253, 214, 0), rgb(254, 224, 1));
    padding: 3px 10px;
    .user-info {
      padding: 10px;
      .user-name {
        font-size: 22px;
        font-weight: 500;
      }
    }
    .user-coin {
      font-size: 16px;
      color: #2a2a2a;
      /*font-weight: 600;*/
      padding: 0 6px 15px;
    }
  }
  .account-order-box {
    border-radius: 6px;
    padding: 8px 15px 10px;
    background: #fff;
    margin: 0 8px 8px;
    .account-order-top {
      color: gray;
      font-size: 16px;
      padding: 4px 10px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eeeeed;
      .account-order-top-left {
        flex: 1;
        border-right: 1px solid #eeeeed;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .account-order-top-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .account-oder-title {
      .title-left {
        font-size: 16px;
        font-weight: 600;
        padding: 8px 6px;
      }
      .title-right {
        color: gray;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
    }
    .account-order-content {
      padding: 10px 0;
      display: flex;
      align-items: center;
      .account-order-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .item-count {
          color: #ff976a;
          font-size: 18px;
          /*font-weight: bold;*/
          margin-bottom: 4px;
        }
        .item-name {
          font-size: 14px;
          color: gray;
        }
      }
      .count-order-item-ship {
        position: relative;
        .item-red {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: red;
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
    }
  }
  .account-grid-box {
    background-color: #fff;
    margin: 8px;
    padding: 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .grid-item {
      width: 25%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 8px 0;
      .item-img {
        margin-bottom: 4px;
      }
      .item-title {
        font-size: 13px;
        color: gray;
      }
    }
  }
  .banner-wrapper {
    background-color: #000;
    color: #fcc900;
    margin: 0 8px;
    border-radius: 6px;
    padding: 14px 20px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    font-size: 14px;
    line-height: 1.5;
    .banner-name {
      font-size: 20px;
      line-height: 1;
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
</style>
