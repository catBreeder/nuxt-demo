<template>
    <div class="delivery_way_wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Delivery Way</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollViewHeight">
        <div class="delivery_way_content">
          <div class="intro_title font_w">Delivery way change to</div>
          <div class="delivery_way_choose">
            <van-radio v-model="wayRadio" :name="wayRadio">
              <span v-if="isself">Door to Door</span>
              <span v-else>Self Pick-up</span>
            </van-radio>
          </div>
          <div class="delivery_way_inner">
            <div class="" v-if="isself">
              <div class="change_card">
                <div class="change_card_left">
                  <div class="d_flex g_mb_m">
                    <div>Receiver :&nbsp; &nbsp;</div>
                    <div>{{express.receiver  }}</div>
                  </div>
                  <div class="d_flex d_flex_between">
                    <div>
                      TEL :&nbsp; &nbsp;{{express.receivetelephone  }}
                    </div>
                    <div @click="changeAddressHandle" class="color_blue"><van-icon name="edit" /> Change</div>
                  </div>
                </div>

              </div>
              <div class="g_mb_l">
                <div class="g_mb_s intro_title">Address：</div>
                <div>{{express.receiveaddress }}&nbsp;{{express.receiveaddress2}}</div>
              </div>
              <div class="d_flex">
                <div>Express delivery fee：</div>
                <div><strong>R{{deliveryfee}}</strong></div>
              </div>
            </div>
            <div v-else>
              <div class="g_mb_s intro_title">Address：</div>
              <div>Unit 3 106 Loper Avenue, Spartan X2, Kempton Park, 1619. Johannesburg +27105934710/+27870953451</div>
            </div>
          </div>
        </div>
      </scroll-view>

      <div class="delivery_post_area">
        <div class="d_flex d_flex_around">
          <van-button class="cancel_btn" @click="operateHandle('cancel')">Back</van-button>
          <van-button class="confirm_btn" @click="operateHandle('confirm')">{{pay==0?'Confirm':'pay'}}</van-button>
        </div>
      </div>
      <van-dialog v-model="isVisible">
        <common-dialog  :isShowImg="false" :hasTwoBtn="true"
                        :isFont="false"
                        title="Additional fees may be charged if change delivery way from Self Pick-up to door to door, are you sure continue to change delivery way to Self Pick-up?"
                        cancelText="No"
                        confirmText="Yes"
                        confirmBg="#DD6B55"
                        confirmBorder="#DD6B55"
                        @cancelEmit="isVisible = false" @confirmEmit="saveHandle"/>
      </van-dialog>

      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
    </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {orderDeliveryWayTransportApi,orderDeliveryWayChangeApi} from '@/api/orders';
  import CommonDialog from '@/components/common/CommonDialog'
    export default {
      head(){
        return {
          title:'Orders Delivery - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView,CommonDialog},
        data(){
          return{
            isself:false,
            wayRadio:null,
            express:{},
            deliveryfee:0,
            receiver:{},
            pay:0,
            isVisible:false,
            isWaiting:false
          }
        },
        methods:{
          goBackHandle(){
            this.$router.back()
          },
          getBasicInfo(){
            orderDeliveryWayTransportApi({
              expressid:this.$route.query.expressid,
              shoporderid:this.$route.query.shoporderid
            }).then(res=>{
              this.isself = res.isself;
              this.wayRadio = this.isself?1:2;
              this.express = res.express;
              this.pay = res.pay;
              this.deliveryfee= res.deliveryfee;
              this.receiver = res.receiver;
            })
          },
          operateHandle(type){
            switch (type) {
              case 'cancel':
                this.goBackHandle();
                break;
               case 'confirm':
                 this.confirmHandle();
                 break;
            }
          },
          confirmHandle(){
            //如果isself==true, 调用更改派送方式的接口，修改成功后返回物流信息页；
            if(this.isself){
              this.saveHandle()
            }else{
              // 如果isself==false，弹框提示，确认后调用更改派送方式的接口，修改成功后返回物流信息页
              this.isVisible = true;
            }
          },
          saveHandle(){
            //1:改成派送 2:改成自提
            this.isWaiting = true;
            orderDeliveryWayChangeApi({
              expressid:this.$route.query.expressid,
              way:this.wayRadio
            }).then(res=>{
              if(res.status==0){
                this.isWaiting = true;
                this.$toast({message:'Change delivery way Success!'});
                this.goBackHandle();
              }else{
                this.isWaiting = true;
                this.isVisible = false;
                this.$toast({message:res.message})

              }
            })
          },
          //修改收件人
          changeAddressHandle(){
            this.$router.push({
              path:'/deliveryorder/2/receiver',
              query:{
                receiverid:this.receiver.id,
                expressid:this.$route.query.expressid,
              }
            })
          }
        },
      mounted() {
          this.getBasicInfo()
      }
    }
</script>

<style scoped lang="less">
  /deep/.van-dialog__footer{
    display: none !important;
  }
  /deep/.van-radio__icon--checked .van-icon{
    background-color: #fcc900;
    border-color:#fcc900;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .intro_title{
    font-size:18px;
    color:#2A2A2A;
    margin-bottom:15px;
  }
.delivery_way_wrapper{
  font-size:14px;
  position: relative;
}

  .delivery_way_content{
    padding:20px;

  }
  .delivery_way_choose{
    margin:4px 0 10px;
  }
  .delivery_way_inner{
    font-size:15px;
    line-height: 1.5;
    .intro_title{
      margin-top: 15px;
    }
  }
  .change_card{
    padding:8px;
    border-bottom:1px solid #EEEEED;
    margin-bottom: 10px;
    .change_card_left{
      flex:1;
    }
    .change_card_right{
      width:80px;
    }
  }
  .delivery_post_area{
    position:absolute;
    bottom:50px;
    left:0;
    right:0;
  }
  .cancel_btn{
    width:40%;
    border-radius: 6px;
    font-size:15px;
  }
  .confirm_btn{
    width:40%;
    border-radius: 6px;
    background-color: #fcc900;
    font-size:15px;
  }
  .scrollViewHeight{
    height:calc(100vh - 46PX);
  }
</style>
