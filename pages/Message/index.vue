<template>
    <div class="s3-message-wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon  name="arrow-left"
                      size="30"  color="#8B8989"/>
          </template>
          <template #title>
            <div class="navbar-title">Message</div>
          </template>
        </van-nav-bar>
        <van-tabs v-model="tabIndex" animated color="'#fcc900'" title-active-color="'#fcc900'" @change="changeTabHandle" >
            <van-tab v-for="(item,index) in tabList" :key="index" >
              <template #title>
                <div style="padding:10px 10px"  v-click-track="{triggerType:'click',fun:item.title,index:index}">
                  <van-badge :content="item.count || ''"  max="99">
                    {{ item.title }}
                  </van-badge>
                </div>
              </template>
            </van-tab>
        </van-tabs>
      </van-sticky>
      <van-pull-refresh v-model="isRefesh" @refresh="refeshHandle" loosing-text="Release to refresh......" pulling-text="Pull down to refresh......">
        <template v-if="isLoading">
          <van-loading type="spinner" size="50px" color="#fcc900"/>
        </template>
        <template v-else>
          <template v-if="messageList.length">
            <scroll-view class="scrollViewHeight" @reachBottom="loadMoreHandle">
              <message-list-item
                @checkItemEmit="checkItemHandle"
                v-click-track="{triggerType:'click',fun:'message',index}"
                v-mag-exp :data-info="`${item.id}@${item.type}@${item.readflg}`"
                :tabIndex="tabIndex+1" v-for="(item,index) in messageList" :key="index" :item="item" :index="index"/>
            </scroll-view>
          </template>
          <common-empty v-else/>
        </template>
      </van-pull-refresh>
    </div>
</template>
<script>
import {unReadMessageApi} from '@/api/home';
import  { messageRecordApi } from '@/api/message';
import MessageListItem from "./childComponent/MessageListItem";
import CommonEmpty from '@/components/common/CommonEmpty'
import ScrollView from "@/components/common/ScrollView";
import {getUserTicket,setCurrentPage} from "@/utils/memory";
import JsCookie from 'js-cookie'
export default {
  head(){
    return {
      title:'Message Center - shopshipshake'
    }
  },
  components:{CommonEmpty  ,MessageListItem ,ScrollView},
  data(){
    return{
      tabIndex:0,
      isLoading:false,
      lastmintime:0,
      totalPage:0,
      tabList:[
        {title:'All',count:''},
        {title:'Unread',count:''},
        {title:'Order',count:''},
        {title:'Membership',count:''},
        {title:'Website',count:''},
      ],
      messageList:[],
      page:1,
      isRefesh:false,
      showContent:false,
      fromPath:''
    }
  },
  beforeRouteEnter(to,from,next){
    JsCookie.set('prePath',from.path);
    setCurrentPage(to.name)
    next()
  },
  methods:{
    checkItemHandle(event){
      const {item,index} =event;
      this.$router.push(`/message/detail/${item.id}/${item.type}`);
    },
    refeshHandle(){
      setTimeout(()=>{
        this.isRefesh = false;
        this.page =1;
        this.getMessageList()
      },this.$config.duringWait)
    },
    loadMoreHandle(){
      this.page ++;
      messageRecordApi({
        page:this.page,
        tab:this.tabIndex+1,
        lastmintime:this.lastmintime
      }).then(res=>{
        this.lastmintime = res.lastmintime_page || 0;
        this.messageList =[...this.messageList,...res.datas];
        this.totalPage = res.pageCount_page;//总页数
        if(this.messageList.length < 8 && res.pageCount_page>1){
          this.page ++;
          messageRecordApi({page:this.page,tab:this.tabIndex+1,lastmintime:this.lastmintime}).then(resp=>{
            this.lastmintime = resp.lastmintime_page || 0;
            this.messageList = [...this.messageList,...resp.datas]
          })
        }

      }).catch((err)=>{

      })

    },

    getUnReadCount(){
      unReadMessageApi().then(res=>{
        this.tabList=[
          {title:'All',count:res['count']},
          {title:'Unread',count:res['count2']},
          {title:'Order',count:res['count3']},
          {title:'Membership',count:res['count4']},
          {title:'Website',count:res['count5']},
        ];
      })

    },
    goBackHandle(){
      if(JsCookie.get('prePath')=='/shoppingmall/index'){
        this.$router.replace('/')
      }else if(JsCookie.get('prePath')=='/account/index'){
        this.$router.replace('/account/index')
      }else{
        this.$router.go(-1)
      }

    },
    changeTabHandle(){

      this.page =1;
      this.getMessageList();
      this.getUnReadCount()
    },
    getMessageList(){
      this.isLoading = true;
      messageRecordApi({
        page:this.page,
        tab:this.tabIndex+1,
        lastmintime:this.lastmintime
      }).then(res=>{
        this.lastmintime = res.lastmintime_page || 0;
        this.messageList =res.datas;
        this.totalPage = res.pageCount_page;//总页数
        if(this.messageList.length < 8 && res.pageCount_page>1){
          this.page ++;
          messageRecordApi({page:this.page,tab:this.tabIndex+1,lastmintime:this.lastmintime}).then(resp=>{
            this.lastmintime = resp.lastmintime_page || 0;
            this.messageList = [...this.messageList,...resp.datas]
          })
        }

      }).catch((err)=>{

      })
      setTimeout(()=>{
        this.isLoading = false;
      },this.$config.duringWait)

    },
  },
  mounted() {
    this.getUnReadCount();
    this.getMessageList();
  }
}
</script>
<style lang="less" scoped>
//tab修改
/deep/.van-tab--active{
  background-color: #fff;
  color:#FCC900;
}
/deep/.van-tabs__line{
  background-color: #FCC900;
}
/deep/.van-tabs__nav{
  background-color: #eee;
}
.s3-message-wrapper{

}
.scrollViewHeight{
  height:calc(100vh - 80PX - 50PX);
}
</style>
