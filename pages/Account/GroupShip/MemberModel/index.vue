<template>
  <div class="member_wrapper">
    <div class="group-ship-member">
      <div class="member-title text-align">Group-Buy bound !</div>
      <div class="member-intro">
        <p>1.You can share the privilege of One Item Purchase !</p>
        <p>2. Please confirm with your PA and a good conmunication can make the process more smooth.</p>
        <p>3.Binded Account cannot ship with your own account. If you wnat unbind the privilege of One Item Purchase !</p>
        <p>4.The service fee will charge {{groupShipInfo?groupShipInfo.groupbuy_service_fee:''}}% of each order amount. If your order amount is over {{groupShipInfo?groupShipInfo.groupbuy_service_fee_change_line:''}}R,
          your service fee rate will change into {{groupShipInfo?groupShipInfo.groupbuy_service_fee_change_rate:''}}%. {{groupShipInfo?groupShipInfo.groupbuy_min_service_fee:''}}R at least.
        </p>

      </div>

    </div>
    <div class="intro-bottom intro-other">
      <a href="@/assets/files/BUY_via_SSS_or_PA.pdf"
         download="BUY via SSS or PA.pdf"> <span class="click-btn g_mr_m">Click here</span> for more Service details.</a>
    </div>
  </div>
</template>
<script>

  export default {
    name:'index',
    props:{
      groupShipInfo:{
        type:Object,
        default:()=>{}
      }
    },
    data(){
      return{

      }
    },
    mounted() {
      console.log(this.groupShipInfo);
    }
  }
</script>
<style scoped lang="less">
  .group-ship-member{

    padding-top:40px;
    .member-title{
      font-size:20px;
      color:#fcc900;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .member-intro {
      font-size: 16px;
      line-height: 1.6;
      padding: 10px 20px;
    }
    p{
      margin-bottom: 10px;
    }
  }
  .member_wrapper{
    position: relative;
    height:calc(100vh - 150px)
  }
  .intro-other{
    position: absolute;
    bottom:20px;
    margin-top:20px;
    left:15%;
    font-size:15px;
    .click-btn{
      text-decoration: underline;
      color:orange;

    }
  }
</style>
