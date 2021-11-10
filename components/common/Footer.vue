<template>
  <div class="s3-common-footer-wrapper">
    <div class="s3-common-footer">
      <div class="s3-footer-item"
           v-for="(item,index) in tabList" :key="index"
           @click="tabChangeHandle(item)"
           v-login-register-track="{triggerType:'click',operate:item.trackType}"
      >
        <div class="s3-footer-item-img">
          <img :src="tabIndex===item.id?item.activeImg:item.img" alt="home">
        </div>
        <div class="item-title"  :class="{'tab_active':tabIndex===item.id}">
          {{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeImg from '@/assets/images/Footer/home.png'
import { gTagFun } from '@/utils/buryPoint/gTag'
import {getCurrentPage} from "@/utils/memory";

export default {
  name: "Footer",
  data(){
    return {
      homeImg,
      tabIndex:1,
      tabList:[
        {id:1,name:'Shop',path:'/shoppingmall/index',
          activeImg:require('../../assets/images/Footer/home.png'),
          img:require('../../assets/images/Footer/home.png'),trackType:'shop'},
        {id:2,name:'Recharge',path:'/user/recharge',
          activeImg:require('../../assets/images/Footer/icon_recharge_active.svg'),
          img:require('../../assets/images/Footer/Recharge.svg'),trackType:'recharge'},
        {id:3,name:'Cart',path:'/shoporder/cart?tab=0',
          activeImg:require('../../assets/images/Footer/icon_cart_active.svg'),
          img:require('../../assets/images/Footer/Cart.svg'),trackType:'cart'},
        {id:4,name:'Orders',path:'/shoporder/2/index',
          activeImg:require('../../assets/images/Footer/icon_orders_active.svg'),
          img:require('../../assets/images/Footer/Orders.svg'),trackType:'orders'},
        {id:5,name:'Account',path:'/account/index',
          activeImg:require('../../assets/images/Footer/icon_account_active.svg'),
          img:require('../../assets/images/Footer/account.svg'),trackType:'account'},
      ]
    }
  },
  props:{
    currentTabIndex:{type:Number}
  },
  computed:{
    currentPage(){return getCurrentPage()}
  },
  methods: {
    tabChangeHandle(item){
      this.$router.replace(item.path)
      this.tabIndex = item.id;
      if (this.tabIndex == 2) {
        if (this.currentPage == 'shoppingmall') {
          gTagFun('Navigation_Recharge', '从导航打开Recharge', '首页')
          if (this.currentPage == 'billIndex') {
            gTagFun('Account_Balance_Recharge', '从Account_Balance打开Recharge', 'Account_Balance')
          }
          if (this.currentPage == 'account') {
            gTagFun('Account_Recharge', '从Account打开Recharge', 'Account')
          }
        }
      }else if(this.tabIndex==5){
        if (this.currentPage == 'shoppingmall') {
          gTagFun('Navigation_Account', '从导航打开Account', '首页')
        }
      }
      },
  },
  mounted() {
    this.$EventBus.$on('toRecharge',()=>{
     this.tabIndex = 2;
   })
    this.$EventBus.$on('toIndex',()=>{
      this.tabIndex = 1;
    })
    this.$EventBus.$on('toOrder',()=>{
      this.tabIndex = 4;
    })
    this.$EventBus.$on('toCart',()=>{
      this.tabIndex = 3;
    })
    this.$EventBus.$on('toAccount',()=>{
      this.tabIndex = 5;
    })
  }


}
</script>

<style scoped lang="less">
  a{
    color:#2A2A2A;
  }
  /deep/ .van-tabbar--fixed{
    border-top:1px solid red;
  }
  span{
    font-size:14px;
  }
  .s3-common-footer-wrapper{
    height:50PX;
    box-sizing: border-box;
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    z-index:1;
    background-color: #fff;
    box-shadow: 4px 0 1px gray;
    .s3-common-footer{
      display: flex;
      align-items: center;
      .s3-footer-item{
        flex:1;
        cursor: pointer;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        .item-title{
          font-size:13px;
          color:#2A2A2A;
        }
        .tab_active{
          color:#FCC900;

        }
        .s3-footer-item-img{
          width:22px;
          height:22px;
          margin:2px 0 2px;
          img{
            width:22px;
            height:auto;
          }
        }
      }
    }

 }
</style>
