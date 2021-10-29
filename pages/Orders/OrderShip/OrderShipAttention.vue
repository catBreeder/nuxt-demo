<template>

  <div class="ship-attention-content">
    <div class="content-title font_size_20">Pay Attention To</div>
    <div class="content-intro text-align">
      {{tipTitle}}
    </div>

    <div class="content-btn-area d_flex d_flex_between g_mt_m">
      <div class="know_btn" @click="operateHandle('know')">Got it !</div>
      <div class="contact_btn" @click="operateHandle('contact')">Contact your Consultant</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OrderShipAttention",
    props:{
      tipTitle:String
    },
    methods:{
      operateHandle(type){
        this.$emit('operateEmit',type)
      }
    }
  }
</script>

<style scoped lang="less">

  .ship-attention-content{
    padding:30px 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .content-intro{
      margin:20px 8px;
      font-size:16px;
      line-height:1.8;
      word-break: break-all;
    }
    .content-tips{
      font-size:14px;
      line-height: 1.6;
    }
    .content-btn-area{
      margin-top: 20px;
      width:92%;
      color:#fff;
      font-size:16px;
    }
    .know_btn{
      border-radius: 4px;
      height:32PX;
      line-height:32PX;
      padding:0 15px;
      background-color: grey;
      border:1px solid grey;
      font-size:16px;
      color:#fff;
    }
    .contact_btn{
      height:32PX;
      line-height:32PX;
      padding:0 15px;
      border-radius: 6px;
      background:#AEDEF4
    ;
      border:1px solid #AEDEF4
    ;
      font-size:16px;
      color:#fff;
    }
  }
</style>
