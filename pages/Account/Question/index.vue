<template>
 <div class="question_wrapper">
   <van-sticky>
     <van-nav-bar @click-left="navbarOperateHandle('back')" @click-right="navbarOperateHandle('index')">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>User Service</template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="questionScroll">
      <div class="question_content">
        <div class="question_search-area">
          <div class="search_name">Hi,<span class="g_mr_m g_ml_m username">{{userName}}</span> Can I help you ?</div>
          <van-search v-model="searchKey" background="#fcc900" @clear="clearHandle" @search="searchHandle"  placeholder="Search for your question"  shape="round"/>
          <div class="color_warning g_mt_m g_pl_m" v-if="isError">Please fill in this field</div>
        </div>
        <div class="question_FAQ_content">
          <div class="common_title">{{questionModel.name}}</div>
          <van-cell :title="item.title" @click="checkDetailHandle(item)"  is-link v-for="(item,index) in faqList" :key="index"/>
          <div class="common_title">More Topics</div>
          <van-cell :title="item.name" @click="checkTopicHandle(item)" is-link v-for="(item,index) in questionModelList" :key="index"/>
          <div class="question_bottom" @click="viewFeebackHandle">
            Other questions ?
            <van-tag type="warning" size="large" class="g_mr_m g_ml_m">Click here</van-tag>
            to feedback
          </div>
        </div>
      </div>
   </scroll-view>
 </div>
</template>

<script>

import { getLoginInfo } from '@/utils/memory'
import ScrollView from "@/components/common/ScrollView";
import {questionIndexApi,questionSearchApi} from '@/api/account'
 export default {
   head(){
     return {
       title:'Feedback - shopshipshake'
     }
   },
    computed:{
      userName(){
        return getLoginInfo()? getLoginInfo().name:'';
      }

    },
   data(){
      return{
        searchKey:'',
        faqList:[],
        questionModelList:[],
        questionModel:{},
        isError:false
      }
   },
   components:{ScrollView},
    methods:{
      checkAnswerHandle(){
        this.$router.push(`/questionFeedback/feedbacksearch?name=${this.searchKey}`)
      },
      viewFeebackHandle(){
        this.$router.push('/questionFeedback/feedback')
      },
      checkTopicHandle(item){
        this.$router.push(`/question/topics/${item.id}`)
      },
      checkDetailHandle(item){
        this.$router.push(`/question/answer/${item.id}`)
      },
      clearHandle(){
        this.searchKey ='';
        this.getQuestionList()
      },
        searchHandle(){
          this.isError = false;
          if(!this.searchKey){
            this.isError = true;
          }else{
            this.$router.push(`/question/search?name=${this.searchKey}`)
          }

        },
        navbarOperateHandle(type){
            switch (type) {
              case 'back':this.$router.go(-1);break;
              case 'index':
                this.$emit('toIndex')
                this.$router.replace('/');

                break;
            }
        },
      getQuestionList(){
        questionIndexApi().then(res=>{
          const {faqlist,questionmoudleList,questionmoudle} = res;
          this.faqList = faqlist;
          this.questionModelList =questionmoudleList;
          this.questionModel = questionmoudle;
        })
      }
    },

    mounted(){
      this.getQuestionList()
    }

 }
</script>

<style scoped lang="less">
  /deep/.van-empty{
    padding:20px 0 !important;
  }
  .questionScroll{
    height:calc(100vh - 46PX);
    background-color: #EEEEED;
  }
  .question_content{
    .question_search-area{
      background-color: #fcc900;
      padding:15px 15px;
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
</style>
