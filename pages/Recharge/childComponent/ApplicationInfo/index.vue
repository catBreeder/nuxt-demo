<template>
  <div class="application-info-box">
    <div class="info-box" >
      <slot name="firstInfo"></slot>
    </div>
    <div class="info-box" >
      <slot name="nextInfo"></slot>
    </div>
    <div class="info-btn-box info-box" >
      <slot name="viewInfo"></slot>
    </div>
    <div class="info-other-box info-box">
      <slot name="introInfo"></slot>

    </div>
    <div class="d_flex_between d_flex operate-btn-box">
      <van-button class="left-btn"  size="large" @click="leftHandle">{{ leftText }}</van-button>
      <van-button class="right-btn" size="large" @click="rightHandle">{{rightText}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props:['leftText','rightText'],
  methods:{
    leftHandle(){this.$emit('clickLeftEmit')},
    rightHandle(){this.$emit('clickRightEmit')}
  }
}
</script>

<style scoped lang="less">
.application-info-box{
  height:100vh;
  padding:30px 20px;
  display: flex;
  flex-direction: column;
  font-size:16px;
  .info-box{
    margin-bottom: 30px;
  }
  .info-intro{
    font-weight: bold;
    margin-bottom: 6px;
  }
  .info-time{
    font-size:15px;
  }
  .info-btn-box{
    .info-btn{
      border-radius: 6px;
      background-color:#FCC900;
      border:1px solid #FCC900;
      font-size:15px;
    }
  }
  .info-other-box{
    font-size:14px;
    line-height:2;
    .info-other-special{
      font-weight: 500;
    }
  }
  .operate-btn-box{
    /deep/.van-button{
      height:40px !important;
      line-height:40px !important;
      font-size:18px;
      border-radius: 6px;
    }
    .left-btn{
      margin-right: 10px;
      background-color: #FCC900;
      border: 1px solid #fcc900;
      box-shadow:0 2px 4px grey;
    }
    .right-btn{
      box-shadow:0 2px 4px grey;
    }
  }
}
</style>
