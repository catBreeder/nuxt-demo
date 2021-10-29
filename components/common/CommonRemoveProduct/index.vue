<template>
    <div class="remove-product-wrapper">
      <van-sticky>
        <common-index-header
          @clickLeftEmit="goOtherUrlHandle('index')"
          @clickRightEmit="goOtherUrlHandle('message')"
        ><i class="icon iconfont icon-kaitongxuzhi" slot="left" style="font-size:24px; color:gray"
        ></i>
        </common-index-header>
      </van-sticky>
      <div class="remove_content d_flex d_flex_center">
        <div class="remove-box"><img src="~assets/images/common/error-cart.png" alt=""></div>

        <div class="remove-intro">The product have been removed or expired</div>
        <div  class="color_active look_link" @click="goOtherUrlHandle('index')">Looking for other products</div>
      </div>
    </div>
</template>

<script>
    import CommonIndexHeader  from "../CommonIndexHeader";
    export default {
        name: "index",
        components:{CommonIndexHeader},
        methods:{
          goOtherUrlHandle(type) {
            switch (type) {
              case "index":
                this.$router.replace("/");
                this.$EventBus.$emit("toIndex");
                break;
              case "message":
                this.$router.push("/message/index");
                break;
            }
          },
        }
    }
</script>

<style scoped lang="less">
  .remove_content{
    margin:25vh auto;
    flex-direction: column;
    .remove-box{
      width:90px;
      height:90px;
      img{
        max-width: 100%;
        height:auto;
      }
    }
    .look_link{
      border-bottom:1px solid #fcc900;
      font-size:18px;
    }
    .remove-intro{
      font-size:18px;
      margin:30px 0;
    }
  }
</style>
