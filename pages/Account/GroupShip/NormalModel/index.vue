<template>
  <div class="member_model_content">
    <scroll-view class="scrollViewHeight">
      <div class="group-ship-normal">
        <div class="normal-form-area">
          <div class="input-intro">Pro-Ambassdor  WhatsApp Number ：</div>
          <van-field
            border
            :label="countrycode"
            label-width="4em"
            v-model="cellphone"
            name="username"
            placeholder="WhatsApp Number"
            @focus="isShow = false"
            @blur="isShow = true"
          >
            <template #label>
              <span @click="isVisible = true">{{countrycode}}</span>
            </template>
          </van-field>
        </div>
        <template v-if="isError">
          <van-notice-bar color="#f00" :scrollable="false" wrapable class="animate__animated animate__fadeInLeft" v-if="errorType==='require'" background="#fff" text="Please enter the whatsapp number ！" />
          <van-notice-bar color="#f00"  :scrollable="false" wrapable class="animate__animated animate__fadeInLeft" v-else-if="errorType==='invalid'" background="#fff" :text="errorIntro" />
        </template>
        <div class="normal-btn" :class="{'btn_margin':!isError,'btn_margin_noTop':isError}">
          <van-button block class="confirm-btn" @click="bindHandle">Confirm</van-button>
          <div class="d_flex d_flex_center g_mt_m">
            <van-checkbox v-model="agreeFlag" icon-size="14" shape="square">Agree to service agreement</van-checkbox>
          </div>
        </div>
        <div class="bottom-area" v-show="isShow">
          <div class="intro-bottom g_mb_l">1. In the normal case, clients' single-time purchase lower than 3000R join the Group-Buy would save the shipping fee.</div>
          <div class="intro-bottom g_mb_l">2. Group-Buy may extend the time length about 3-7 days of arranging the group ship and local courier.</div>
          <div class="intro-bottom">3. Once you choose SSS to purchase, it means that you agree on the terms, including return and refund policy.</div>
          <div class="intro-bottom intro-other">
            <a href="@/assets/files/BUY_via_SSS_or_PA.pdf" download="BUY via SSS or PA.pdf"> <span class="click-btn g_mr_m">Click here</span> for more Service details.</a>
          </div>
        </div>
      </div>
    </scroll-view>
    <!--    选择区号-->
    <van-popup v-model="isVisible" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        cancel-button-text="cancel"
        confirm-button-text="confirm"
        @cancel="isVisible = false"
        @confirm="choseMobileTypeHandle"
      />
    </van-popup>
    <van-dialog v-model="bindVisible" :show-confirm-button="false" :show-cancel-button="false">
      <common-dialog :isShowImg="false" v-if="visibleType=='intransit'"
                     okText="OK" @okEmit="bindVisible = false"
                     type="info"
                     title="Error"
                     intro="Your former orders are in the process of picking up. Please wait it finished. Then you can bind."/>
      <common-dialog :isShowImg="false" v-if=" visibleType=='bindError'"
                     okText="OK" @okEmit="bindVisible = false"
                     type="info"
                     title="Error"
                     :intro="visibleContent"/>
      <common-dialog type="info" v-else
                     :hasTwoBtn="true"
                     title="CAUTION"
                     cancelText="Cancel"
                     confirmText="Confirm"
                     @cancelEmit="bindVisible = false"
                     @confirmEmit="confirmBindHandle"
                     confirmBorder="#fcc900"
                     confirmBg="#fcc900"
                     cancelBg="#fff"
                     cancelColor="#2a2a2a"
                     intro="The bind will charge the service fee of orders In Purchase ane To Ship status"/>

    </van-dialog>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
  </div>

</template>

<script>
  import {accountGroupShipBindApi } from '@/api/account';
  import CommonDialog from '@/components/common/CommonDialog'
  import ScrollView  from "@/components/common/ScrollView";
  import { shopOrderCountApi } from "@/api/orders";
  export default {
    name: "index",
    components:{CommonDialog,ScrollView},
    computed:{
      columns(){
        let val =[],count = this.$config.areaCode;
        for(let k in count){
          val=[...val,count[k]]
        }
        return val;
      },
    },
    data(){
      return {
        countrycode:'+27',
        cellphone:'',
        isVisible:false,
        errorType:'',
        isError:false,
        isShow:true,
        errorIntro:'',
        agreeFlag:true,//是否同意
        bindVisible:false,
        isWaiting:false,
        visibleType:'',
        count: {
          purchaseCount: 0,
          shipCount: 0,
          transitCount: 0,
          completeCount: 0,
          commentCount: 0
        },
        visibleContent:''
      }
    },
    created() {
      this.isShow = true;
      this.getOrderCount()
    },
    methods:{
      //1.获取商品tab个数
      getOrderCount() {
        shopOrderCountApi("account").then(res => {
          this.count = {
            purchaseCount: res.count3 || 0,
            shipCount: res.count4 || 0,
            transitCount: res.count5 || 0,
            completeCount: res.count6 || 0,
            commentCount: res.count9 || 0
          };
          console.log(this.count);
        });
      },
      //选择成功
      choseMobileTypeHandle(event){
        this.isVisible = false;
        this.countrycode = `+${event}`;
      },
      //绑定
      bindHandle(){
        if(!this.cellphone){
          this.isError = true;
          this.errorType = 'require'
        }else if(!this.agreeFlag){
            return this.$toast({message:'Please check the agreement'})
        }else{
          //判断当前用户订单状态
          if(this.count.transitCount > 0){
            //intracsit有订单
            this.bindVisible = true;
            this.visibleType = 'intransit';
            return;
          }

          if(this.count.purchaseCount > 0 || this.count.shipCount >0){
            // 如果该客户在purchase、to ship状态有订单
            this.bindVisible = true;
            this.visibleType ='toShip';
            return;
          }
          this.confirmBindHandle();
        }
      },
      confirmBindHandle(){
        this.bindVisible = false;
        this.isWaiting = true;
        accountGroupShipBindApi({
          countrycode:this.countrycode.substring(1),
          cellphone:this.cellphone,
          confirm:true
        }).then(res=>{
          if(res.status==0){
            this.isWaiting = false;
            this.$toast({message:'Bind succeeded'});
            this.$emit('bindSuccessEmit')
          }else{
            this.isWaiting = false;
            this.bindVisible = false;
            if(res.status=='501'){
                this.bindVisible = true;
                this.visibleType = 'bindError';
                this.visibleContent = res.message;
            }else{
              this.isError = true;
              this.errorType = 'invalid';
              this.errorIntro= res.message;
            }
            console.log(res);

          }
        })
      }
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
  .member_model_content {
    .scrollViewHeight {
      height: calc(100vh - 120px - 40px);
    }
  }
  .group-ship-normal{
    padding:25px 15px 10px;
    .normal-form-area{
      .input-intro{
        color:gray;
        font-size:15px;
        margin-bottom: 6px;
        display: flex;
        justify-content: flex-start;
      }
      /deep/.van-cell{
        padding-bottom: 0;
      }
      /deep/.van-field__label{
        text-align: center;
        font-size:16px;
        /*border-bottom:2px solid #565655;*/
        border-bottom:2px solid #00CED1;
      }
      /deep/.van-field__value{
        font-size:16px;
        /*border-bottom:2px solid #565655;*/
        border-bottom:2px solid #00CED1;;
      }
    }
    .normal-btn{
      .confirm-btn{
        font-size:18px;
        background-color:#FE9123;
        color:#fff;
        border-radius: 4px;
      }
    }
    .btn_margin{
      margin:20px;
    }
    .btn_margin_noTop{
      margin:0 20px 20px;
    }
  }
  .bottom-area{
    color:gray;
    padding-top: 30px;
    font-size:15px;
    line-height: 1.5;
    .intro-other{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top:20px;
      .click-btn{
        text-decoration: underline;
        color:orange;

      }
    }
  }
</style>
