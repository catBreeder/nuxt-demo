<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title><div class="navbar-title">{{basicInfo.title}}</div></template>
     </van-nav-bar>
     <div class="track-steps-content">
        <div class="track-steps-inner">
            <div class="track_steps_step">
              <div class="track-steps-inner-top">
                <div class="step-item-box" :class="basicInfo.status>$config.orderStatus.AwaitingPayment?'bg_active':'bg_gray'"></div>
                <template v-if="basicInfo.status==$config.orderStatus.Closed">
                  <div class="step-item-line" :class="intransitList.length==0?'bg_red':'bg_active'"></div>
                  <van-icon name="warning" size="30" color="#f00"/>
                  <div class="step-item-line" :class="intransitList.length==0?'bg_gray':'bg_red'"></div>
                  <template v-if="!intransitList.length">
                    <div class="step-item-box bg_gray" ></div>
                  </template>
                  <template v-else>
                    <van-icon name="warning-o" size="30" color="#f00"/>
                  </template>
                </template>
                <template v-else>
                  <div class="step-item-line" :class="basicInfo.status>$config.orderStatus.AwaitingPayment?'bg_active':'bg_gray'" />
                  <div class="step-item-box" :class="toShipList.length>0 || basicInfo.status== $config.orderStatus.Signed?'bg_active':'bg_gray'"></div>
                  <div class="step-item-line" :class="intransitList.length>0 || basicInfo.status== $config.orderStatus.Signed?'bg_active':'bg_gray'"></div>
                  <div class="step-item-box" :class="intransitList.length>0 || basicInfo.status== $config.orderStatus.Signed?'bg_active':'bg_gray'"></div>
                </template>
                <div class="step-item-line " :class="intransitList.length>0 || basicInfo.status== $config.orderStatus.Signed?'bg_active':'bg_gray'"></div>
                <van-icon name="checked" size="30" :color="basicInfo.status== $config.orderStatus.Signed?'#fcc900':'gray'"/>

              </div>
              <div class="track-steps-inner-bottom">
                <div class="bottom-item">Purchase</div>
                <div class="bottom-item text_align_l">To Ship</div>
                <div class="bottom-item text-align">Int'l Transit</div>
                <div class="bottom-item text_align_r">Signed</div>
              </div>
            </div>
            <div class="track_step_intro">
              <div v-if="basicInfo.country.name" class="track_country_info">
                Destination:
                <img :src="basicInfo.country.image" alt="" class="country_img">
                {{basicInfo.country.name }}
              </div>
            </div>
        </div>

     </div>
   </van-sticky>
   <scroll-view class="trackScroll">

     <div class="track_content">
       <div class="track_content_top" >
         <div class="delivery_box" v-if="shoporder.expressid > 0 && basicInfo.deliverywayflag != 2">
           <div class="track_content_top_title">
             <p v-if="express.transportmode ==1">Economical Air Freight -Door to door</p>
             <p v-if="express.transportmode ==2">Fast Air</p>
             <p v-if="express.transportmode ==3">Economical Air - Self Pick-up</p>
             <p v-if="express.transportmode ==10">Ocean Shipping - Door to door</p>
             <p v-if="express.transportmode ==15">Ocean Shipping - Self Pick-up</p>
           </div>
           <div class="track_content_top_title_intro">
             <div v-if="express.transportmode  ==2">Don not support changing delivery way</div>
             <div v-else>
               <div v-if="basicInfo.deliverywayflag >0" class="disable_change">
                 <p class="color_normal"> Cannot change delivery way</p>
                 <p>Parcel has been handed over to third party courier company</p>
               </div>
               <div v-if="basicInfo.deliverywayflag==0">
                 <p class="change_way" @click="changeWayHandle">
                   <van-icon name="edit" size="18"/>&nbsp;
                   <span class="change_way_inner">Change delivery way </span>

                 </p>
               </div>
             </div>
           </div>
         </div>
         <div v-if="express.status >= $config.orderStatus.Paid && express.status < $config.orderStatus.Closed && express.targettimemax > 0 && showpush">
           <div class="push_process_box">
             <van-button block round @click="pushProcessHandle">
               <i class="icon iconfont icon-run"></i>
               Push order processing</van-button>
             <div class="record_box" v-if="wrecords">
               <div v-for="(item,index) in wrecords" :key="index">
                 <div class="record_box_inner" v-for="(value,valueID) in item" :key="valueID">
                   <div class="record_left_box" v-if="value.customer">
                     <p class="g_mb_s">You : {{value.content}}</p>
                     <p class="color_intro">{{value.time}}</p>
                   </div>
                   <van-row v-else>
                     <van-col :span="4">
                       <div class="record_box_img">
                         <img src="https://shop.shopshipshake.com/resources/images/icon_home_default.svg" alt="">
                       </div>
                     </van-col>
                     <van-col :span="20">
                       <div class="record_box_message">
                         {{value.content}}
                       </div>
                     </van-col>
                   </van-row>
                 </div>
               </div>

             </div>
             <div class="next_step_box">
               <div class="next_step_title color_active">Next Step...</div>
               <div class="next_step_intro">
                 {{nextStepContent}}

               </div>

             </div>
           </div>
         </div>
       </div>
<!--       失败的显示　开始-->
       <div v-if="basicInfo.status==$config.orderStatus.Failed">
         <div class="step_title_box step_box_fail">
           <div class="step_title_box_left">
             <span class="icon iconfont icon-guanbi color_warning"></span>
           </div>
           <div class="step_title_box_right">
             <div class="color_normal step_title">
               Failed
               <br>
               <span class="color_intro step_title_intro">{{shoporder.failreason}}</span>
             </div>
           </div>
         </div>
         <div class="step_title_time_box" v-for="(item,index) in closeList" :key="index">
           <div class="step_title_time_box_left">
             <div class="step_title_time_box_left_link"></div>
             <div class="step_title_time_box_left_time">
               {{item.date}}
               <br>
               {{item.time}}
             </div>
             <div class="step_title_time_box_left_circle"></div>
           </div>
           <div class="step_title_time_box_right">
             {{item.content}}
           </div>
         </div>
       </div>
<!--       失败的显示　结束-->
<!--       close start-->
       <div v-if="closeList.length">
         <div class="step_title_box">
           <div class="step_title_box_left">
             <van-icon name="warning" color="#f00" size="35"/>
           </div>
           <div class="step_title_box_right step_alone_title">
             <div class="color_warning step_title">Order Close</div>
           </div>
         </div>
         <div class="step_title_time_box" v-for="(item,index) in closeList" :key="index">
           <div class="step_title_time_box_left">
             <div class="step_title_time_box_left_link"></div>
             <div class="step_title_time_box_left_time">
               {{item.date}}
               <br>
               {{item.time}}
             </div>
             <div class="step_title_time_box_left_circle" style="border:1px solid #f00;"> </div>
           </div>
           <div class="step_title_time_box_right" style="color:#f00">
             {{item.content}}
           </div>
         </div>
       </div>
<!--       close end-->
<!--       complete start-->
       <div v-if="signList.length">
         <div class="step_title_box">
           <div class="step_title_box_left">
             <span class="icon iconfont icon-yunshu1" ></span>
           </div>
           <div class="step_title_box_right step_alone_title">
             <div class="color_normal step_title">Completed</div>
           </div>
         </div>
         <div class="step_title_time_box" v-for="(item,index) in signList" :key="index">
           <div class="step_title_time_box_left">
             <div class="step_title_time_box_left_link"></div>
             <div class="step_title_time_box_left_time">
               {{item.date}}
               <br>
               {{item.time}}
             </div>
             <div class="step_title_time_box_left_circle"></div>
           </div>
           <div class="step_title_time_box_right">
             {{item.content}}
           </div>
         </div>
       </div>
<!--       complete end-->
<!--       instrani start-->
       <div v-if="intransitList.length">
         <div class="step_title_box">
           <div class="step_title_box_left">
             <span class="icon iconfont icon-yunshu1" ></span>
           </div>
           <div class="step_title_box_right step_alone_title">
             <div class="color_normal step_title">In the Transit</div>
           </div>
         </div>
         <div class="step_title_time_box" v-for="(item,index) in intransitList" :key="index">
           <div class="step_title_time_box_left">
             <div class="step_title_time_box_left_link"></div>
             <div class="step_title_time_box_left_time">
               {{item.date}}
               <br>
               {{item.time}}
             </div>
             <div class="step_title_time_box_left_circle"></div>
           </div>
           <div class="step_title_time_box_right">
             {{item.content}}
           </div>
         </div>
       </div>
<!--       instrani end-->
<!--       to SHIP START-->
          <div v-if="toShipList.length">
            <div class="step_title_box">
              <div class="step_title_box_left">
             <span class="icon iconfont icon-fangzi1 color_intro" :class="{
                 'color_active':basicInfo.status >= 40 && basicInfo.status < 60 && basicInfo.status != 31
               }"></span>
              </div>
              <div class="step_title_box_right step_alone_title">
                <div class="color_normal step_title">To Ship</div>
              </div>
            </div>
            <div class="step_title_time_box" v-for="(item,index) in toShipList" :key="index">
              <div class="step_title_time_box_left">
                <div class="step_title_time_box_left_link"></div>
                <div class="step_title_time_box_left_time">
                  {{item.date}}
                  <br>
                  {{item.time}}
                </div>
                <div class="step_title_time_box_left_circle"></div>
              </div>
              <div class="step_title_time_box_right">
                {{item.content}}
                <template v-if="item.status==40"> , Congratulations,your order has arrived at 3S's Warehouse(CN).</template>
              </div>
            </div>
          </div>
<!--       to SHIP END-->
<!--       purchase start-->
       <div v-if="purchaseList.length">
         <div class="step_title_box">
           <div class="step_title_box_left">
             <span class="icon iconfont icon-take color_intro"></span>
           </div>
           <div class="step_title_box_right step_alone_title">
             <div class="color_normal step_title">Purchase</div>
           </div>
         </div>
         <div class="step_title_time_box" v-for="(item,index) in purchaseList" :key="index">
           <div class="step_title_time_box_left">
             <div class="step_title_time_box_left_link"></div>
             <div class="step_title_time_box_left_time">
               {{item.date}}
               <br>
               {{item.time}}
             </div>
             <div class="step_title_time_box_left_circle"></div>
           </div>
           <div class="step_title_time_box_right">
             {{item.content}}
             <template v-if="item.status==$config.orderStatus.Paid"> , Dear Customer,your order has been processed and is being Purchase(CN).</template>
              <template v-if="item.status==$config.orderStatus.PurchasedNoPay"> , Congratulations,your order has been purchased successfully</template>
           </div>
         </div>
       </div>
<!--       purchase end-->

     </div>
   </scroll-view>
    <van-dialog v-model="isVisible">
      <common-dialog
        type="info"
        :fontSize="15"
        :isShowImg="false"
        :isFont="false"
        :title="processIntro"
        :isCenter="true"
        @okEmit ="isVisible = false"
        />
    </van-dialog>
     <van-dialog v-model="showProcessVisible" title="Content" show-cancel-button>
        <div class="show-process-dialog-content">
           <van-field v-model="processContent" placeholder="Push order processing" />
            <div class="show-process-dialog-btn">
                <van-button class="cancel_btn" @click="processCancelHandle('cancel')">Cancel</van-button>
                <van-button class="ok_btn" @click="processCancelHandle('confirm')">OK</van-button>
            </div>
        </div>
     </van-dialog>
 </div>
</template>
<script>

import { shopOrderLogisticsApi,orderExpressWordOrderApi }  from '@/api/orders'
import CommonDialog from '@/components/common/CommonDialog'
import ScrollView from "@/components/common/ScrollView";
 export default {
   head(){
     return {
       title:'Orders Logistics - shopshipshake'
     }
   },
    computed:{
      nextStepContent(){
        if(this.express.status >= 70){
          return `It is expected to be delivered to your home on ${this.timeMax};`
        }else if(this.express.status >= 67){
          return `It is expected to deliver from the warehouse during ${this.timeMin} to ${this.timeMax};`
        }else if(this.express.status>=50){
          return ` It is expected to enter the warehouse in South Africa during ${this.timeMin} to ${this.timeMax};`
        }else if(this.express.status>=40){
          return `It is expected to arrive ${this.isOcean ? 'at the port of Durban,':'in'} South Africa on ${this.timeMax};`
        }else if(this.express.status>=20){
          return `It is expected to ${this.isOcean ? 'sea ship':'flight ship'} from China during ${this.timeMin} to ${this.timeMax};`
        }
      }
    },
   components:{ScrollView,CommonDialog},
   data(){
      return{
        basicInfo:{title:'',status:'',country:{},workordercount:0,deliverywayflag:null},
        isLoading:false,
        closeList:[],
        intransitList:[],
        purchaseList:[],
        signList:[],
        toShipList:[],
        country:{},
        shoporder:{},
        express:{},
        showpush:false,
        timeMax:null,
        timeMin:null,
        isOcean:false,
        isVisible:false,
        processIntro:'',
        showProcessVisible:false,
        processContent:'',
        maxCount:0,
        wrecords:null,
      }
   },
    methods:{
      //修改配送方式
      changeWayHandle(){
          this.$router.push({
            path:'/deliveryorder/2/transport',
            query:{
              expressid:this.shoporder.expressid,
              shoporderid:this.shoporder.id
            }
          })
      },
      //点击ｐｕｓｈ　ｏｒｄｅｒ　ｐｒｏｃｅｓｓｉｎｇ
        pushProcessHandle(){
          if(this.maxCount==0){
              this.isVisible = true;
              this.processIntro = `<p class="g_mb_l">${this.nextStepContent}</p>Logistic service center team will closely track your package.`
          }else{
            if(this.basicInfo.workordercount>0){
              this.isVisible = true;
              this.processIntro = 'Logistic service center will give feedback within 1 working day.'
            }else{
              this.showProcessVisible = true;
            }
          }
        },
      processCancelHandle(type){
          switch (type) {
            case 'cancel':
              this.showProcessVisible = false;
              break;
             case 'confirm':
               orderExpressWordOrderApi({
                 expressid:this.express.id,
                 shoporderid:this.shoporder.id,
                 content:this.processContent
               }).then(res=>{
                 if(res.status==0){
                   this.showProcessVisible = false;
                   this.getTrackInfo();
                 }else{
                   this.showProcessVisible = false;
                   this.$toast({message:res.message})
                 }
               })
               break;
          }
      },
        goBackHandle(){
          this.$router.go(-1)
        },
      //获取物流信息
        getTrackInfo(){
          this.isLoading = true;
          shopOrderLogisticsApi(this.$route.params.id).then(res=>{
            this.isLoading = false;
            this.basicInfo.title= res.title;
            this.basicInfo.status=res.status;
            this.basicInfo.country = res.country || {};
            const {close,intransit,purchases,sign,max,toship,wrecords,express,showpush,tmax,tmin,isOcean,workordercount,deliverywayflag} = res;
            this.basicInfo.deliverywayflag = deliverywayflag;
            this.closeList = close || [];
            this.intransitList = intransit || [];
            this.purchaseList =purchases || [];
            this.signList =sign ||[];
            this.toShipList = toship || [];
            this.shoporder= res.shoporder;
            this.express = express || {};
            this.showpush = showpush;
            this.timeMax =tmax;
            this.timeMin =tmin;
            this.isOcean= isOcean;
            this.basicInfo.workordercount = workordercount;
            this.maxCount = max;
            this.wrecords = wrecords;

          })
        },
    },

    mounted(){
        this.getTrackInfo()
    }

 }
</script>

<style scoped lang="less">
  .show-process-dialog-content{
    .show-process-dialog-btn{
      padding:10px 15px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .ok_btn{
        border-radius: 4px;
        background-color: #AEDEF4;
        font-size:15px;
      }
      .cancel_btn{
        color:#fff;
        font-size:15px;
        border-radius: 4px;
        background-color: #D0D0D0;
      }
    }
  }

  /deep/.van-dialog__footer{
    display: none !important;
  }
  /deep/.van-field__control{
    border:1px solid lightgray;
    padding:4px 10px;
  }
  .step_box_fail{
    margin-bottom: 40px;
  }
  .step_title_box{
    display: flex;
    align-items: center;

    .step_title_box_left{
      width:80PX;
      text-align: center;
      height:45PX;
      line-height: 45PX;
    }
    .step_alone_title{
      line-height:45PX;
    }
    .step_title_box_right{
      flex:1;
      height:45PX;
      .step_title{
        font-size:18px;
      }
      .step_title_intro{
        font-size:12px;
      }
    }
  }
  .step_title_time_box{
    display: flex;
    align-items: center;
    height:100PX;
    .step_title_time_box_left{
      position: relative;
      width:80PX;
      .step_title_time_box_left_link{
        position: absolute;
        background:lightgrey;
        bottom:-45PX;
        left:40PX;
        top:-40PX;
        width:1px;
      }
      .step_title_time_box_left_time{
        padding-top: 10px;
        color:grey;
        font-size:13px;
      }
      .step_title_time_box_left_circle{
        width:8PX;
        height:8PX;
        border-radius: 100%;
        border:1px solid lightgrey;
        position: absolute;
        left:35PX;
        top:20PX;
      }
    }
    .step_title_time_box_right{
      flex:1;
      line-height: 1.4;
      color:gray;
      /*padding-top: 10px;*/
    }
  }
  .icon-yunshu1{
    color:#fcc900;
  }
  .icon-guanbi,.icon-take,.icon-fangzi1,.icon-yunshu1{
    font-size:30px;
  }
  .icon-run{
      font-size:15px;
      color:#fcc900;
      margin-right: 4px;
  }
  /deep/.van-nav-bar{
    background-color: #fcc900;
    box-shadow: none;
  }
  .bg_red{
    background-color: red;
  }
  .bg_gray{
    background-color: grey;
  }
  .bg_active{
    background-color: #fcc900;
  }
.track-steps-content{
  background-color: #fcc900;
  min-height:110px;
  position: relative;
  .track-steps-inner{
    background-color: #F5F5F5;
    position:absolute;
    top:10px;
    left:10px;
    right:10px;
    bottom:-20px;
    z-index:1;
    border-radius: 8px;
    padding:20px;
    .track_steps_step{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .track_step_intro{
      margin-top: 10px;

      font-size:14px;

      .track_country_info{
        display: flex;
        height:20PX;
        line-height: 20PX;
        align-items: center;
        .country_img{
          height:20PX;
          margin:0 4px;
          img{
            height:100%;
          }
        }
      }

    }
    .track-steps-inner-top{
      display: flex;
      align-items: center;
    }
    .track-steps-inner-bottom{
      margin-top: 15px;
      display: flex;
      align-items: center;
      width:100%;
      .bottom-item{
        flex:1
      }
    }
  }
}
  .step-item-box{
    width:10px;
    height:10px;
    border-radius:100%;
  }
  .step-item-line{
    width:80px;
    height:2px;
  }
  .track_content{
    padding:30px 10px 50px;
  }
  .trackScroll{
    height:calc(100vh - 150PX - 46PX);
  }
  .track_content_top{
    /*border:1px solid #EEEEED;*/
    border-radius: 4px;
    .push_process_box{
      padding:0 8px 10px;
      /deep/ .van-button{
        height:34PX !important;
        line-height:34PX;
        border:2px solid lightgrey;
      }
      .record_box{
        margin-top: 8px;
        background-color: #EEEEED;
        /*border-radius: 6px;*/
        .record_box_inner{
          padding:6px 8px;
          .record_left_box{
            text-align: right;
            background-color: #fff;
            padding:4px 10px;
            font-size:13px;
            border-radius: 8px;
          }
          .record_box_img{
            width:48PX;
            height:48PX;
            img{
              width:100%;
              height:auto;
            }
          }
          .record_box_message{
            background-color:rgba(255, 255, 128);
            padding:4px 10px;
            font-size:13px;
            line-height: 1.5;
            border-radius: 8px;
          }
        }
      }
      .next_step_box{
        padding:10px 0;
        font-size:14px;
        line-height:1.4;
        color:grey;
      }
      .next_step_title{
        font-size:15px;
        margin-bottom: 4px;
      }
      .next_step_intro{
        font-size:16px;
        line-height:1.5;
        color:#2A2A2A;
      }
    }

    .track_content_top_title{
      font-size:15px;
      padding:4px 10px;
      margin-bottom: 4px;
    }
    .track_content_top_title_intro{
      color:grey;
      font-size:13px;
      padding:0px 10px 4px ;
      margin-bottom: 8px;
      .disable_change{
        padding:0 0 10px;
        font-size:14px;
        line-height:1.4;
        border-bottom:1px solid #EEEEED;
      }
      .change_way{
        display: flex;
        align-items: center;
        color:dodgerblue;
        .change_way_inner{
          padding:4px;
          border-bottom: 1px solid dodgerblue;
        }
      }
    }
  }
</style>
