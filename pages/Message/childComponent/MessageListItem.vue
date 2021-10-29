<template>
  <div class="message-item-info" @click="goMessageDetailHandle">
    <van-row v-if="item">
      <van-col span="5" class="message-tag">
        <img :src="imgTag" alt="" :class="{'img_gray':item.readflg===1}">
      </van-col>
      <van-col span="19">
        <div class="message-name-box d_flex d_flex_between">
          <div class="message-name van-ellipsis" >{{ item.title }}</div>
          <div class="message-time">{{ item.date }}</div>
        </div>
        <div class="message-content van-multi-ellipsis--l3" v-html="item.type===$config.noticeType.MESSAGE?item.content:item.intro" />
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: "MessageListItem",
  data(){
   return{

   }
  },
  props:{
    item:{
      type:Object,
      default:()=>{}
    },
    index:Number,
    tabIndex:Number,
  },
  computed:{
    imgTag(){
      if(this.item.type === this.$config.noticeType.NOTICE){
        return require('../../../assets/images/Message/notice.png')
      }else{
        //等于0
        switch (this.item.stype){
          case this.$config.messageStype.MONEY:
            return require('../../../assets/images/Message/money.png');
          case this.$config.messageStype.COUPON:
            return require('../../../assets/images/Message/coupon.png');
          case this.$config.messageStype.MEMBER:
            return require('../../../assets/images/Message/member.png');
          case this.$config.messageStype.QUALITY:
            return require('../../../assets/images/Message/quality.png');
          case this.$config.messageStype.SCOIN:
            return require('../../../assets/images/Message/scoin.png');
          default:
            return require('../../../assets/images/Message/order.png');
        }
      }
    }
  },
  methods:{
    goMessageDetailHandle(){

      this.$emit('checkItemEmit',{
        item:this.item,
        index:this.index
      })
    }
  },
  mounted() {


  }
}
</script>

<style scoped lang="less">
.img_gray {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  opacity: 0.3;
}
.message-item-info{
  padding:10px 8px 10px 0px;
  border-bottom:1px solid #eeeeed;
}
.message-tag{
  text-align: center;
  .icon{
    font-size:46px;
    color:lightgray;
  }
}
.message-name-box{
  font-size:14px;
  margin-bottom: 10px;
  color:#0d0d0d;
  .message-name{
    flex:5;
    font-size:15px;
    font-weight: bold;
  }
  .message-time{
    flex:2;
    font-size:13px;
    color:lightgray;
  }

}
.message-content{
  font-size:14px;
  line-height:1.4;
  color:#0d0d0d;
  color:gray;
  img{
    width:90% !important;
  }
}

</style>
