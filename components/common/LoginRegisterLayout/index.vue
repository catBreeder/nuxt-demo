<template>
  <div class="login-wrapper">
    <scroll-view class="scrollViewHeight">
      <div class="user-header"

           :class="{
              'user_header_shopify_register':isShopify && $route.path=='/register/shopify',
              'user_header_shopify_login':isShopify && $route.path=='/login'
           }" >
        <template v-if="!isShopify">
          <div class="inner-img"  @click="goIndex" >
            <img src="~assets/images/user/logo.svg" alt="" >
          </div>
          <van-icon name="cross"  color="#898989" @click="closeHandle" class="close-tag"/>
        </template>
      </div>
      <slot></slot>
    </scroll-view>
  </div>
</template>

<script>
    import {getUserTicket} from '@/utils/memory'
    import ScrollView from "../ScrollView";
    export default {
        name: "index",
        components:{ScrollView},
        props:{
          isShopify:{type:Boolean,default:false}
        },
        methods:{
          goIndex(){
            let ticket = getUserTicket()|| '';
            window.open("https://shop.shopshipshake.com/shoppingmall/index" + "?ticket=" + ticket + "&spm=" + localStorage.getItem("spmClick"))
          },
          closeHandle(){
            this.$emit('closeEmit')
          }
        },
    }
</script>

<style scoped lang="less">
  .login-wrapper{
    .scrollViewHeight{
      height:100vh;
    }
    .user_header_shopify_register{
      margin-top: 20px;
    }
    .user_header_shopify_login{
      margin-top: 60px;
    }
    //头部
    .user-header{
      padding:15px 0;

      position: relative;
      .inner-img{
        height:60px;
        margin-left:20px;
        width:90%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          height:auto;
          width:auto;
        }
      }
      .close-tag{
        position:absolute;
        font-size:22px;
        left:20px;
        top:30px;
      }
    }
  }

</style>
