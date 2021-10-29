<template>
  <div class="order-ship-info-box order-ship-box-common">
    <van-row type="flex" align="center">
      <van-col span="5">
        <div class="info-box-img" v-if="country">
          <img :src="country.image" alt="">
        </div>
      </van-col>
      <van-col span="19">
        <div class="info-box-center">
          <div class="box-name d_flex d_flex_between">
            {{country && country.name?country.name:''}}
            <div class="info-box-right d_flex color_blue" @click="changeAddressHandle">
              <van-icon name="edit" size="15"  />CHANGE
            </div>
          </div>
          <div><span class="g_mr_l"> {{receiver && receiver.receiver }} </span><span>{{receiver && receiver.receivetelephone }}</span> </div>
          <div class="color_intro box-address text_ellipsis_2">Address:{{receiver &&receiver.address }} {{receiver &&receiver.address2}}</div>
        </div>
      </van-col>
    </van-row>
<!--    -->
    <van-notice-bar class="g_mt_l" v-if="isShow"
                    wrapable
                    :scrollable="false"
                    background="#fff"
                    color="#2A2A2A"
    >
      <strong class="ship-intro">
        Due to your order contained powder/liquid or other prohibited items, importing to
        <span class="color_warning">{{country.name}}</span>
        is not available. Please change your destination or re-select the item(s) to be shipped.</strong>
    </van-notice-bar>
  </div>
</template>

<script>
    export default {
        name: "OrderShipAddress",
        props:{
          country:{type:Object,default:()=>{}},
          receiver:{type:Object,default:()=>{}},
          isShow:{type:Boolean,default:false},
          receiverid:{type:Number}

        },
      methods:{
        //修改地址
        changeAddressHandle(){
          this.$router.push({
            path:'/client/2/index',
            query:{
              type:'ship',
              receiverid:this.receiverid,
            }
          })
        },
      }
    }
</script>

<style scoped lang="less">
  /*  用户信息开始*/
  .order-ship-box-common{
    padding:10px;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .order-ship-info-box{
  .info-box-img{
    width:60px;
    height:60px;
  img{
    width:100%;
    height:100%;
  }
  }
  .info-box-center{
    font-size:14px;
    line-height:1.5;
    color:#333;
  .box-name{
    font-size:16px;
  }
  .box-address{
    font-size:15px;
  }
  }
  .info-box-right{
    font-size:14px;
  }
  }
  /*  用户信息结束*/
</style>
