<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="navbarOperateHandle('back')" @click-right="navbarOperateHandle('index')">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Answer</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollHeightNoBar" style="background: #FFFFFF" @reachBottom="loadMoreHandle">
        <div class="question_content">
          <div class="question_search-area">
            <van-search v-model="searchKey" background="#fcc900" @clear="clearHandle" @search="searchHandle"  placeholder="Search for your question"  shape="round"/>
          </div>
          <div class="question_tab">
            Sort by
            <span :class="{'color_active':sorttype==1}" class="g_ml_s" @click="sortByHandle(1)">likes</span>
            <span class="g_ml_s g_mr-s">|</span>
            <span :class="{'color_active':sorttype==2}" @click="sortByHandle(2)">news</span>
          </div>
          <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
          <template v-else>
            <div v-if="searchList.length">
              <div class="answer-list">
                <div class="answer-list-item" v-for="(item,index) in searchList" :key="index">
                  <div>Q:</div>
                  <div v-html="item.content" class="g_mt_m g_mb_m"/>
                  <div class="g_mb_m">A:</div>
                  <div v-html="feedbackResult[item.id].content"/>
                  <div class="d_flex d_flex_end g_mt_m" @click="operateItemHandle(item.id)">
                    <van-icon name="good-job-o" :color="item.color" size="18"/>&nbsp;{{item.usefulcount}}</div>
                </div>
              </div>
            </div>
            <van-empty description="Not Find Any Questions" v-else>
              <img src="~assets/images/common/empty.png" alt=""  width="80px" slot="image">
            </van-empty>
          </template>

        </div>
      </scroll-view>
      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
    </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {feedbackSearchListApi,feedbackOperatePlusApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Answer - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView},
        data(){
          return{
            searchKey:'',
            sorttype:1,
            searchList:[],
            page:1,
            pageCount:0,
            isLoading:false,
            isFinish:false,
            feedbackResult:{},
            isWaiting:false

          }
        },
        methods:{
          operateItemHandle(id){
            this.isWaiting = true;
            feedbackOperatePlusApi(id).then(res=>{
              if(res.status==0){
                this.isWaiting = false;
                this.searchList = this.searchList.map(item=>{
                  if(item.id == id){
                    item.color='#eee';
                  }
                  return item;
                })
              }
            })
          },
          loadMoreHandle(){

            if(this.page > this.pageCount)  return;
            this.page ++;
            feedbackSearchListApi({
              page:this.page,
              name:this.searchKey,
              sorttype:this.sorttype
            }).then(res=>{
              let result = res.pageinfo || {};
              var patt1 = new RegExp(this.searchKey,'g');
              result.list = result.list.map(item=>{
                item.color='#1890ff';
                item.content =item.content.replace(patt1,`<span style='color: red'>${this.searchKey}</span>`)
                return item;
              })
              this.searchList =[...this.searchList,...result.list ];

            })
          },
          checkDetailHandle(item){
            this.$router.push(`/question/answer/${item.id}`)
          },
          sortByHandle(count){
            this.sorttype=count;
            this.update()
          },
          update(){
            this.page =1;
            this.getSearchList()
          },
          navbarOperateHandle(type){
            switch (type) {
              case 'back':this.$router.back();break;
              case 'index':
                this.$router.replace('/');
                this.$emit('toIndex')
                break;
            }
          },
          clearHandle(){
            this.update()
          },
          searchHandle(){
            this.update()
          },
          getSearchList(){
            this.isLoading = true;
            feedbackSearchListApi({
              page:this.page,
              name:this.searchKey,
              sorttype:this.sorttype
            }).then(res=>{
              setTimeout(()=>{
                let result = res.pageinfo || {};
                this.searchList = result.list ||[];
                var patt1 = new RegExp(this.searchKey,'g');
                this.searchList = this.searchList.map(item=>{
                  item.content =item.content.replace(patt1,`<span style='color: red'>${this.searchKey}</span>`);
                  item.color='#1890ff';
                  return item;
                })
                this.feedbackResult = res.feedbackResult ||{};
                this.pageCount = res.pageCount;
                this.isLoading = false;
              },500)
            })
          }
        },
      mounted() {
          this.searchKey = this.$route.query.name;
          this.getSearchList()
      }
    }
</script>

<style scoped lang="less">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .question_content{
    .question_search-area{
      background-color: #fcc900;
      padding:25px 15px;
      border-radius: 4px;
      margin:6px;
      .search_name{
        font-size:16px;
        margin-bottom:10px;
        .username{
          font-size:20px;
        }
      }
      /deep/.van-icon-search{
        display: none;
      }
    }
    .question_FAQ_content{
      padding:10px 0;
      background-color: #fff;
      .common_title{
        padding:10px 15px;
        margin-top: 10px;
        font-size:18px;
        font-weight: bold;
      }
      /deep/.van-cell__title{
        font-size:16px;
      }
      .question_bottom{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:17px;
        padding:20px 0;
        margin-top: 10px;

      }
      .question_search_bottom{
        margin:10px auto;
        text-align: center;
        padding:10px;
        font-size:15px;
      }
    }
  }
  .question_tab{
    text-align: right;
    font-size:15px;
    padding:15px 10px;
    background-color: #fff;
  }
  .answer-list{
    .answer-list-item{
      padding:10px;
      margin:0 10px 10px ;
      border-bottom:1px solid #EEEEED;
    }
  }
</style>
