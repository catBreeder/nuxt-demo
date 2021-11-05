<template>
  <div class="s3-message-detail-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon
                    name="arrow-left" size="24"  color="#8B8989"/>
        </template>
        <template #title>
          <div class="navbar-title">Message Detail</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollHeight">
      <div class="message-detail-content">
        <h4 class="detail-name">{{ messageItem.title }}</h4>
        <div class="message-time">{{ messageItem.date }}</div>
        <div class="message-info" v-html="messageItem.content"></div>
      </div>
    </scroll-view>

  </div>
</template>

<script>
  import { messageDetailApi,readMessageApi} from '@/api/message'
  import ScrollView from "@/components/common/ScrollView";
  export default {
    head(){
      return {
        title:'Message Detail - shopshipshake'
      }
    },
    name: "index",
    components:{ScrollView},
    data(){
      return {
        messageItem:{}
      }
    },
    computed:{
      id(){return this.$route.params.id},
      type(){return this.$route.params.type}
    },
    methods:{
      goBackHandle(){
        this.$router.go(-1);
      },
      getMessageInfo(){
        messageDetailApi(this.id,this.type).then(res=>{
          this.messageItem = res.message?res.message:{};
          this.messageItem.content = this.messageItem.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
        })
      },
    },
    mounted() {
      this.getMessageInfo()
    }
  }
</script>
<style scoped>
  .message-info >>>  p{
    word-break: break-all;
    text-align: left;
  }
  .message-info >>>  div{
    word-break: break-all;
    text-align: left;
  }
</style>
<style scoped lang="less">
  .scrollHeight{
    height:calc(100% - 49PX)
  }
  .navbar-title{
    font-size:18px;
    font-weight: bold;
  }
  .s3-message-detail-wrapper{
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background-color: #fff;

  }
  .message-detail-content{
    background-color: #fff;
    padding:30px 15px 60px;
    .detail-name{
      margin-bottom: 10px;
      font-size:18px;
    }
    .message-time{
      font-size:13px;
      color:#888888;
      margin-bottom: 20px;
    }
    .message-info{
      font-size:13px;
      color:rgb(61,65,69);
      line-height:1.6;
      padding-bottom: 80px;
    }
  }
</style>
