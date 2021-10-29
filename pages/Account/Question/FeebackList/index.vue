<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Feedback</template>
        </van-nav-bar>
      </van-sticky>
      <div class="feedback-content">

        <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
        <section v-else>
          <template v-if="questionfeedbackList.length">
            <div  v-for="(item,index) in questionfeedbackList" :key="index">
              <div class="feedback-list-item" v-if="item.status==2">
                <div class="item-content d_flex d_flex_between">
                  <div>Q:{{item.content}}</div>
                  <div class="color_intro font_size_12">{{item.createtime | timeFormat('YMDHMS')}}</div>
                </div>
                <div class="g_pt_m g_pb_m">
                  <van-image
                    width="90"
                    height="90"
                    :src="item.imgage"
                  />
                </div>
                <template v-if="feedbackResult[item.id]">
                  <div class="item_answer" v-if="feedbackResult[item.id]">A: <span v-html="feedbackResult[item.id].content"></span></div>
                  <div class="d_flex d_flex_end">
                    <van-button :disabled="item.useful>0" class="operate-btn" plain @click="operateItemHandle(item,'agree')" size="mini"><van-icon name="good-job-o"  color="#3597FF" size="16" /></van-button>

                    <van-button  :disabled="item.useful>0" class="operate-btn" plain @click="operateItemHandle(item,'reject')" size="mini"><i class="icon iconfont icon-caibishi"  ></i></van-button>
                  </div>
                </template>
              </div>
            </div>
            <div class="feedback_title font_w">Pending reply</div>
            <div v-for="(item,index) in questionfeedbackList" :key="index">
              <div class="feedback-list-item"  v-if="item.status<2">
                <div class="item-content d_flex d_flex_between">
                  <div>Q:{{item.content}}</div>
                  <div class="color_intro font_size_12">{{item.createtime | timeFormat('YMDHMS')}}</div>
                </div>
                <div class="g_pt_m g_pb_m">
                  <van-image
                    width="90"
                    height="90"
                    :src="item.imgage"
                  />
                </div>
              </div>
            </div>
          </template>
          <van-empty description="No results found" v-else>
            <img src="~assets/images/common/empty.png" alt=""  width="80px" slot="image">
          </van-empty>
        </section>

      </div>
    </div>
</template>

<script>
    import {feedbackIndexApi,feedbackOperateApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Feedback - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            questionfeedbackList:[],
            isLoading:false,
            feedbackResult:{}
          }
        },
        methods:{
          operateItemHandle(item,type){
            feedbackOperateApi({
              id:item.id,
              type:type=='agree'?1:2
            }).then(res=>{
             if(res.status==0){
               this.getFeedbackList()
             }else{
               this.$toast({message:res.message})
             }
            })
          },
          goBackHandle(){this.$router.back()},
          goIndexHandle(){
            this.$router.replace('/');
            this.$emit('toIndex')
          },
          getFeedbackList(){
            this.isLoading= true;
            feedbackIndexApi().then(res=>{
              this.feedbackResult = res.feedbackResult ||{};
              this.questionfeedbackList = res.questionfeedbackList ||[];
              this.isLoading =false;
            })
          }
        },
      mounted() {
          this.getFeedbackList()
      }
    }
</script>

<style scoped lang="less">
  .icon-caibishi{
    font-size:16px;
    color:#f00;
  }
  .feedback-content{
    padding:10px;
    .feedback_title{
      font-size:16px;
      padding:15px 8px;
    }
  }
.feedback-list-item{
  border:1px solid #EEEEED;
  border-radius: 4px;
  padding:10px;
  margin-bottom: 15px;
  .item-content{
    padding:5px;
    border-bottom:1px solid #EEEEED;
  }
  .item_answer{
    padding-top:5px;
  }
  .operate-btn{
    margin-right:10px;
    padding:0 20px;
    height:32PX!important;
    line-height: 32PX !important;
    text-align: center;
    border-radius: 4px;
  }
}
</style>
