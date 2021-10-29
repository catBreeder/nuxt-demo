<template>
    <div class="question_detail_wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>
            Q&A
          </template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="answerScroll">
        <div class="question_answer_content">
          <div class="common-title">{{questionInfo.title}}</div>
          <div class="answer_content" v-html="questionInfo.content"></div>
          <div class="answer_bottom">
              <div class="answer_bottom_title">Is this helpful for you?</div>
              <div>
                <van-button plain type="info" :disabled="disabled" size="small" class="g_mr_l" @click="operateHandle('1')">
                  <van-icon name="good-job-o" size="16"/> YES</van-button>
                <van-button plain type="danger"  :disabled="disabled" size="small" @click="operateHandle('2')">
                  <van-icon name="good-job-o" size="16"/> NO</van-button>
              </div>
          </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {questionAnswerApi,questionOperateApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Question search - shopshipshake'
        }
      },
        name: "index",
      components:{ScrollView},
        data(){
          return{
            questionInfo:{},
            disabled:false
          }
        },
        methods:{
          goIndexHandle(){
            this.$router.replace('/');
            this.$emit('toIndex')
          },
          goBackHandle(){
            this.$router.back()
          },
          getQuestionDetailInfo(){
            questionAnswerApi(this.detailID).then(res=>{
              this.questionInfo = res.question || {};
            })
          },
          operateHandle(count){
            questionOperateApi(this.detailID,count).then(res=>{
                if(res.status==0){
                  this.$toast({message:'Operation Success !'})
                  this.disabled = true;
                }
            })
          }
        },
      computed:{
          detailID(){return this.$route.params.id;},
          getTitle(){
            switch (this.$route.params.type) {
              case 'define': return 'Who is  Shopshipshake ?';
              case 'deliver': return 'Does Shopshipshake deliver during this lockdown ?'
            }
          }
      },
      mounted() {
          this.getQuestionDetailInfo()
      }
    }
</script>

<style scoped >
  .answer_content >>>  img{ display:block; max-width: 100%}
  .question_title{
    font-size:18px;
    font-weight: bold;
    color:#8B8989;
  }
    .answerScroll{
    height:calc(100vh - 46PX - 50PX);
      background-color: #f0f0f0;
  }
    .question_answer_content {
    background-color: #fff;
    padding: 8px 10px;
    margin: 6px;
    border-radius: 8px;
  }
    .common-title{
      font-size:16px;
      font-weight: bold;
      line-height:1.4;
      border-bottom:1px solid #EEEEED;
      padding:4px 0 8px;
    }
    .answer_content{
      padding:8px 0;
      font-size:17px;
      line-height:1.6;
      text-indent: 20px;
    }
    .answer_bottom{
      padding:20px ;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .answer_bottom_title{
      font-size:18px;
      margin-bottom: 15px;
    }
</style>
