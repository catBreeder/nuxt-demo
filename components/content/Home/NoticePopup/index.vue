<template>
  <section>
    <notice-model
                  :content_bg="popupType == $config.popupType.TASK?'#eeeeed':'#fff'"
                  title="Notification" :content_margin="popupType == $config.popupType.TASK">
      <section slot="header">
        <div class="header-wrapper" @click="closePopHandle">
          <div class="content-title" :class="{'text_l':popupType == $config.popupType.RESEARCH}">
            {{ isWindowtitle }}</div>
          <div class="content-time" v-if="isShowTime" >{{ popupItem.time }}</div>
          <van-icon name="cross" class="close-tag" />
        </div>
      </section>
      <template v-if="popupType == $config.popupType.NOTICE || popupType == $config.popupType.MESSAGE">
        <div class="content-detail" slot="content" v-html="popupItem.content"></div>
        <div class="btn-content" slot="footer" @click="closePopHandle">
          <span >{{popupItem.unreadnum}}</span> Unread Message
        </div>
      </template>
      <template v-if="popupType==$config.popupType.TASK">
        <div class="task-content" slot="content">
          <div class="task-list-content">
            <div class="task-title">
              {{ popupItem.customertype == 20 ? 'If you finish todo below, you can get rewards including' :'You have the following Todo to complete'}}
            </div>
            <div class="task-list">

              <section v-if="popupItem.customertype == 20">
                <p>•&nbsp;<span class="text-danger font-bold"> 2 </span>coupons immediately</p >
                <p>•&nbsp;<span class="text-danger font-bold"> 200 more </span>image searches per month</p >
                <p>•&nbsp;<span class="text-danger font-bold"> 300 more </span>keyword searches per month</p >
              </section>
              <div style="border-top:1px solid #EEEEED;">
                <p>◇ Todo 1：Email address verified</p>
                <p>◇ Todo 2：Complete the questionnaire</p>
                <p>◇ Todo 3：Phone number verified</p>
              </div>
            </div>
            <div class="task-btn"><van-button block @click="goFinishHandle">Go to finish</van-button></div>
          </div>

        </div>
      </template>
      <template v-if="popupType== $config.popupType.FEEDBACK">
        <div class="feedback-content" slot="content">
          <div>Q:{{ popupItem.question }}</div>
          <div>A：{{ popupItem.feedback }}</div>
        </div>
      </template>
      <template v-if="popupType== $config.popupType.COUPON">
        <div class="coupon-content" slot="content">
          <scroll-view class="coupon-list">
            <van-row class="item-info" v-for="(item,index) in popupItem.couponlist" :key="index">
              <van-col span="17" class="info-left">
                <div class="info-left-title">{{ item.couponname }}</div>
                <div  class="info-left-time">Validity : {{ item.validity }}</div>
              </van-col>
              <van-col span="7" class="info-right">
                {{item.usecoupon }}
              </van-col>
            </van-row>
          </scroll-view>
          <div class="task-btn"><van-button block @click="useCheckHandle">Use immediately</van-button></div>
        </div>
      </template>
      <template v-if="popupType==$config.popupType.VIP">
        <div class="vip-content" slot="content">
          <div>Your membership will be invalid after <span class="color_orange">{{popupItem.remainday}}</span> days , deadline <span class="color_orange"> {{popupItem.date}}</span> </div>
          <div class="g_mt_l g_mb_big">For now the membership has saved you <strong class="color_active">R{{ popupItem.money }}</strong></div>
          <div class="task-btn "><van-button block @click="becomeHandle">Renew immediately</van-button></div>
        </div>
      </template>
<!--      <template v-if="popupType == $config.popupType.RESEARCH">-->
<!--        <div class="research-content" slot="content">-->
<!--          <div class="order-title d_flex_between d_flex g_mb_m">-->
<!--            <div>{{ popupItem.expressnumber   }}</div>-->
<!--            <div v-if="popupItem.finishtime "> <span class="color_orange">Signed</span><span class="color_intro"> {{popupItem.finishtime }}</span> </div>-->
<!--          </div>-->
<!--          <van-row class="order-img g_mb" type="flex" align="center" >-->
<!--            <van-col span="18">-->
<!--              <van-image v-for="(item,index) in popupItem.images" :key="index"-->
<!--                         width="75px"-->
<!--                         height="75px"-->
<!--                         fit="cover"-->
<!--                         :src="item"-->
<!--                         style="border:1px solid #EEEEED"-->
<!--              />-->
<!--            </van-col>-->
<!--            <van-col span="6" style="font-size:12px;margin-right:-10px">-->
<!--              <div style="font-size:10px">Total<span class="color_orange"> {{popupItem.totalnumber}} </span>orders</div>-->
<!--            </van-col>-->
<!--          </van-row>-->
<!--          <van-row>-->
<!--            <van-col span="19">-->
<!--              <div class="question-title">Are you satisfied with your product(s)?</div>-->
<!--              <van-radio-group v-model="evaluate.satisfactionflg"  class="d_flex d_flex_between g_mt_m g_mb_m">-->
<!--                <van-radio name="1" icon-size="18px">Yes</van-radio>-->
<!--                <van-radio name="2" icon-size="18px"> No</van-radio>-->
<!--              </van-radio-group>-->
<!--            </van-col>-->
<!--          </van-row>-->
<!--          <van-row>-->
<!--            <van-col span="19">-->
<!--              <div class="question-title">Will your shop again via Shopshipshake?</div>-->
<!--              <van-radio-group v-model="evaluate.intentionflg" class="d_flex d_flex_between g_mt_m g_mb_m">-->
<!--                <van-radio name="1" icon-size="18px">Yes</van-radio>-->
<!--                <van-radio name="2" icon-size="18px"> No</van-radio>-->
<!--              </van-radio-group>-->
<!--            </van-col>-->
<!--          </van-row>-->
<!--          <van-row>-->
<!--            <van-col span="23">-->
<!--              <van-field class="textarea-content"-->
<!--                         v-model="evaluate.valuationcontent"-->
<!--                         rows="2"-->
<!--                         style="background: #eeeeee"-->
<!--                         type="textarea"-->
<!--                         maxlength="50"-->
<!--                         placeholder="Suggestions and comments"-->
<!--              />-->
<!--            </van-col>-->
<!--          </van-row>-->
<!--        </div>-->
<!--        <div slot="footer" class="research-btn d_flex">-->
<!--          <van-button   class="close-btn g_mr_l" @click="closePopHandle">Close</van-button>-->
<!--          <van-button class="submit-btn" @click="submitQuestionHandle">Submit</van-button>-->
<!--        </div>-->
<!--      </template>-->
    </notice-model>
  </section>

</template>

<script>
import NoticeModel from '../NoticeModel'
import ScrollView from "../../../common/ScrollView";
import {
  homePopupHandleApi ,
  homeReadPopupApi} from '@/api/home'
export default {
  name: "index",
  components:{NoticeModel,ScrollView},
  props:{
    popupType:{type:Number},
    popupItem:{
      type:Object,
      default:()=>{}
    }
  },
  computed:{
    isShowTime(){
      return this.popupType == this.$config.popupType.NOTICE ||
        this.popupType == this.$config.popupType.MESSAGE ||
        this.popupType==this.$config.popupType.FEEDBACK ||
        this.popupType ==this.$config.popupType.RESEARCH ||
        this.popupType == this.$config.popupType.FEEDBACK
    },
    isWindowtitle(){
      let value=''
      if(this.popupType == this.$config.popupType.FEEDBACK ||
        this.popupType == this.$config.popupType.TASK ||
        this.popupType == this.$config.popupType.COUPON ||  this.popupType == this.$config.popupType){
        value = this.popupItem.windowtitle
      }else if(this.popupType == this.$config.popupType.VIP){
        value = `Respectable ${this.popupItem.vipname} Membership`
      }else{
        value = this.popupItem.titlecontent
      }
      return value;
    }
  },
  data(){
    return{
      evaluate:{
        satisfactionflg:'',
        intentionflg:'',
        valuationcontent:'',
      },

    }
  },
  methods:{
    hidePopup(){this.$emit('hidePopupEmit')},
    closePopHandle() {
      homeReadPopupApi({id: this.popupItem.id, type: this.popupItem.type}).then(res => {
        this.hidePopup();
      })
    },
    goFinishHandle(){
      homePopupHandleApi({
        type:this.popupType,
        id:this.popupItem.id,
      }).then(res=>{
        window.location.href=`${this.$config.jianweiDomain}/customertask/todo`;
        this.hidePopup()
      })
    },
    useCheckHandle(){
      window.location.href=`${this.$config.jianweiDomain} /shoporder/cart`;
      this.hidePopup()
    },
    becomeHandle(){
      window.location.href=`${this.$config.jianweiDomain}/membership/checkout`;
      this.hidePopup()
    },
    submitQuestionHandle(){
      const {satisfactionflg,intentionflg,valuationcontent} = this.evaluate;
      if(!satisfactionflg || !intentionflg || !valuationcontent){
        return this.$toast({message:'Please complete the questionnaire before submitting it '})
      }
      homePopupHandleApi({
        type:this.popupType,
        id:this.popupItem.id,
        satisfactionflg,
        intentionflg,
        valuationcontent
      }).then(res=>{
        this.hidePopup()
      })

    },
  }
}
</script>

<style scoped lang="less">
  .research-btn{
    justify-content: center;
    padding:6px 0;
    border-top:1px solid #EEEEED;
    .close-btn{
      margin-right:10px;
      border-radius: 4px;
    }
    .submit-btn{
      border-radius: 4px;
      background-color: #FCC900;
      border-radius: 4px;
    }
  }
.header-wrapper{
  position:relative;
  .close-tag{
    position: absolute;
    right:5px;
    top: 50%;
    transform: translateY(-50%);
    color:gray;
    font-size:18px;
  }
}
.content-title{
  font-size:15px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin-right:20px;
}
.text_l{
  justify-content: flex-start !important;
}
.content-time{
  font-size:13px;
  color:gray;
  text-align: left;
  padding-bottom:10px;
  padding-left: 8px;
}

.content-detail{
    /deep/ p{
      font-size:15px;
      line-height:1.5;
      margin-bottom: 10px;
    }
  /deep/ img{
    margin-top:10px;
    width:96%;
    object-fit: fill;
  }
  }
.btn-content{
  text-align: center;
  font-weight: bold;
  color:#ff4062;
  padding:10px 4px 10px;
  background-color: #ffeab2;
  border-top:1px solid #EEEEED;

}
.task-content{
  background-color: #EEEEED;
  .task-list-content{
    background-color: #fff;
    padding:8px 10px;
    .task-title{
      font-size:12px;
      padding-bottom:8px;
      border-bottom:1px solid #EEEEED;
    }
    .task-list{
      P{
        padding:4px;
        font-size:14px;
      }
    }
    .task-btn{
      padding:10px 0;
      font-size:14px;
    }
  }
}
.task-btn{

  /deep/ .van-button{
    height:30px !important;
    line-height:30px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #FCC900;
    font-weight: bold;
  }
}
.feedback-content{
  div{
    font-weight: bold;
    padding:4px 0;
  }
}
.coupon-content{
  .coupon-list{
    height:200px;
    .item-info{
      border-radius: 8px;
      border:1px solid #EEEEED;
      padding: 8px;
      margin-bottom:10px;
      display: flex;
      justify-content: space-between;
      .info-left-title{
        font-weight: bold;
        margin-bottom:8px;
      }
      .info-left-time{
        font-size:10px;
        color:gray;
      }
      .info-right{
        display: flex;
        justify-content: center;
        align-items: center;
        color:#FCC900;
        font-weight: bold;
      }
    }

  }
}
</style>
