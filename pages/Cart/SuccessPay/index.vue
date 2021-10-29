<template>
    <div >
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
<!--          <template #left>-->
<!--            <van-icon name="arrow-left" size="24" color="#8B8989"/>-->
<!--          </template>-->
        </van-nav-bar>
      </van-sticky>
      <div class="success-pay-wrapper">
        <h2><van-icon name="checked" color="#4DD965" size="20"/> Payment successful！！</h2>
        <div class="view-btn">
          <div class="view-order-btn" @click='viewOrderHandle'>View Order</div>
          <div class="another-order-btn" @click="anotherOrderHandle">Another Order</div>
        </div>
      </div>

    </div>
</template>
<script>
export default {
  head(){
    return {
      title:'Cart - shopshipshake'
    }
  },
    methods:{
        viewOrderHandle(){
          this.$EventBus.$emit('toOrder')
            this.$router.replace('/shoporder/2/index')
        },
        anotherOrderHandle(){
          this.$EventBus.$emit('toIndex')
            this.$router.replace('/')
        },
      goBackHandle(){
          this.$router.go(-1)
      }
    }
}
</script>
<style lang="less" scoped>
  /deep/.van-nav-bar{
    background-color: #fff;
    box-shadow: none;
  }
  /deep/.van-hairline--bottom::after{
    border-bottom:none;
  }
    .success-pay-wrapper{
        height:calc(100vh - 50px);
        background-color: #fff;
        color:#3d4145;
        text-align: center;
        h2{
            margin-bottom:30px;
            padding-top: 50px;
        }
        .view-btn{
           justify-content: center;
            display: flex;
            font-size:15px;
            align-items: center;
            .view-order-btn{
                margin-right:15px;

            }
            .another-order-btn{
                border-radius:18px;
                color:#f00;
                border:1px solid #f00;
                padding:8px 10px;
            }
        }
    }
</style>
