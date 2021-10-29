<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Check out</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView " style="background-color: #fff;">
        <div class="vip-priority-card">
          <div class="vip-priority-card-title text-align">{{formInput.level}}</div>
          <div class="vip-priority-content">
            <div class="vip-priority-item" v-for="(item,index) in priorityList" :key="index">
              <i class="icon iconfont icon-chenggong "></i>
              <div class="list-item-title g_ml_s g_mr-s" v-html="item"></div>
            </div>
          </div>
        </div>
        <div class="vip-form-card">
          <van-cell title="Level" is-link :value="formInput.level" @click="showLevelHandle('level')"/>
          <van-cell title="Plan" is-link :value="formInput.plan" @click="showLevelHandle('plan')"/>
          <van-cell title="Total Amount" >
            <template v-if="priceInfo.hasspecialunitprice">
              <span  class="color_orange_red font_size_12 font_w">{{priceInfo.specialtotalamount}}</span>
              <br>
              <del class="font_size_12 color_intro">{{priceInfo.totalamount}}</del>
              <br>
              <span class="color_orange_red font_size_12 font_w">{{priceInfo.totalamountrate}}</span>
            </template>
            <template v-else>
              <span  class="color_orange_red  font_w">{{priceInfo.totalamount}}</span>
            </template>
          </van-cell>
          <van-cell title="Refund Amount" >
            <strong class="color_orange_red">{{priceInfo.refundamount}}</strong>
          </van-cell>
          <van-cell title="Valid Thru"  :border="!priceInfo.hasspecialtime">
            <template v-if="priceInfo.hasspecialtime">
              <del  class="color_intro font_size_12">Now ~ {{priceInfo.validthru}}</del>
              <br>
              <span class="color_intro font_size_12">Now ~ {{priceInfo.specialvalidthru}}</span>
            </template>
            <template v-else>
              <div>Now ~ {{priceInfo.validthru}}</div>
            </template>
          </van-cell>
          <div class="special-time-msg" v-if="priceInfo.hasspecialtime" v-html="priceInfo.specialtimemsg"></div>
          <van-field name="radio" label="Payment" input-align="right" label-width="60px">
            <template #input>
              <van-radio-group v-model="formInput.userpaymode" direction="horizontal" icon-size="15">
                <van-radio name="1" shape="square" checked-color="#fcc900" @click="changePayModeHandle('1')"><span class="font_size_12">Rand</span></van-radio>
                <van-radio name="2" shape="square" checked-color="#fcc900" @click="changePayModeHandle('2')"><span class="font_size_12">S Coin(Total {{priceInfo.scoinsum}})</span></van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-notice-bar v-if="priceInfo.paycode!=undefined"
                          wrapable
                          :scrollable="false"
                          color="#2a2a2a" background="#eaeaea"
                          :text="priceInfo.paymessage"
          />
          <div class="g_mt_m g_mb_m g_ml_l font_size_14" v-else>
            <strong>Grand Total: </strong>
            <strong class=" font_size_16" style="color:#deb349;">{{priceInfo.grandtotal}}</strong>
          </div>
          <div class="pay_btn" >
            <van-button
              @click="checkPayHandle"
              type="primary" :disabled="priceInfo.paycode!=undefined"
                         block round><span style="color:#000;" class="font_size_16">
              {{priceInfo.paycode!=undefined?'Invalid':'Pay'}}
            </span></van-button>
          </div>
        </div>
      </scroll-view>
      <van-action-sheet v-model="levelVisible"  :actions="levelMapList" @select="levelChooseHandle" />
      <van-action-sheet v-model="planVisible"  :actions="planMapList" @select="planChooseHandle" />
      <van-dialog v-model="dialogVisible"  :show-cancel-button="false" :show-confirm-button="false">
<!--        货币检查-->
        <common-dialog  v-if="formInput.userpaymode ==1 && dialogType=='noenough'"
                       cancelText="Cancel"
                       confirmText="Recharge"
                       confirmBg="#fcc900"
                       confirmBorder="#fcc900"
                       :isShowImg="false"
                       @cancelEmit="dialogVisible = false"
                       @confirmEmit="goRechargeHandle"
                       :hasTwoBtn="true"
                        introColor="#ed5565"
                        :title="`<strong class='color_warning'>Balance : R ${priceInfo.moneybalance } </strong>`"
                        intro="Order payment failed for insufficient balance, please recharge first."/>
<!--        积分检查-->
          <div class="enough-dialog" v-if="dialogType=='enough'">
            <div class="enough-dialog-title">
              <div class='color_warning'>
                <template v-if="formInput.userpaymode==2">{{priceInfo.paytotal}} S Coin</template>
                <template v-else-if="formInput.userpaymode==1">R{{priceInfo.paytotal}}</template>
              </div>
              <van-icon name="cross" class="close-icon" size="18" @click="closeDialogHandle"/>
            </div>
            <div class="enough-dialog-content">
              <div class="d_flex">
                <van-image :src="logoImg" class="g_mr_m"/>
                <strong class='color_warning'>
                  <template v-if="formInput.userpaymode==1">
                    Balance : R{{priceInfo.moneybalance}}
                  </template>
                  <template v-else-if="formInput.userpaymode==2">
                    S Coin Total : {{priceInfo.scoinsum}}
                  </template>
                  </strong>
              </div>
              <div class="btn-area">
                <van-button block type="primary" round
                @click="confirmPayHandle"
                > <span style="color:#000;font-size:15px;">
                  <template v-if="formInput.userpaymode==2">
                    Pay {{ priceInfo.paytotal}} S Coin
                  </template>
                  <template v-else-if="formInput.userpaymode==1"> Pay R{{ priceInfo.paytotal}}</template>

                </span></van-button>
              </div>
            </div>
          </div>
          <common-dialog
            type="success"
            okText="Confirm"
            @okEmit="successOperateHandle"
            introColor ='#2A2A2A'
            intro="Congratulations! And please note the coupons for the membership have been in your acount."
            v-if="dialogType=='success'">

          </common-dialog>
      </van-dialog>

    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    import CommonDialog from '@/components/common/CommonDialog'
    import {accountMemberShipCheckoutApi,accountMemberShipDescribeApi,
      accountMemberShipPayApi,
      accountMemberShipPlanApi,accountMemberShipPriceInfoApi} from '@/api/account';
    import {objectTranToArray} from '@/utils';
    import logoImg from '@/assets/images/common/icon_3scard.png'
    export default {
      head(){
        return {
          title:'Member Orders - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            logoImg,
            levelMapList:[],
            priorityList:[],
            planMapList:[],
            formInput:{
              level:'',
              plan:'',
              planID:'',
              total:'',
              userpaymode:'1',//支付方式
              validthru:'',

            },
            levelVisible:false,
            planVisible:false,
            levelTitle:'',
            vipGrade:0,
            hasSpecialFlag:false,
            priceInfo:{},
            dialogVisible:false,
            dialogType:''
            /*
            specialtotalamount:'',//当前会员套餐需要支付的总金额
              totalamount:'',//当前会员套餐需要优惠前的总金额
              totalamountrate:'',//当前会员套餐的折扣
              enoughpay: false,
              grandtotal: "",
              hasspecialtime: false,
              hasspecialunitprice: false,
              moneybalance: "0",
              paytotal: "",
              refundamount: "",
              scoinsum: "",
              unitprice: "",
              validthru: "",
              specialvalidthru:'',
              specialtimemsg:'',
              paymessage:'',
              paycode:''
            * */
          }
        },
        components:{ScrollView,CommonDialog},
        methods:{
          successOperateHandle(){
            this.dialogType ='';
            this.dialogVisible = false;
            this.$router.back()
          },
          //关闭弹框
          closeDialogHandle(){
            this.dialogType ='';
            this.dialogVisible = false;
          },
          //确认支付
          confirmPayHandle(){
            accountMemberShipPayApi({
              vipgradepriceid:this.formInput.planID,
              userpaymode:this.formInput.userpaymode
            }).then(res=>{
              if(res.status==0){
                this.dialogVisible = true;
                this.dialogType = 'success'
              }
            })
          },
          goRechargeHandle(){
            this.$EventBus.$emit('toRecharge','checkout')
            this.$router.replace('/user/recharge')
          },
          checkPayHandle(){
              if(this.priceInfo.enoughpay == 'true' || this.priceInfo.enoughpay == true){
                this.dialogType ='enough';
                this.dialogVisible = true;
              }else{
                this.dialogType ='noenough';
                this.dialogVisible = true;
              }
          },
          changePayModeHandle(count){
            this.formInput.userpaymode  = count;
            this.getMemberShipPriceInfo()
          },
          //选择会员等级
          levelChooseHandle(action){
            this.formInput.userpaymode ='1';
            const {id,name} = action;
             this.formInput.level = name;
             this.vipGrade = id;
             this.levelVisible = false;
             this.getMemberShipPlan();

          },
          planChooseHandle(action){
            this.formInput.userpaymode ='1';
            const {id,name}= action;
            this.formInput.plan = name;
            this.formInput.planID = id;
            this.planVisible = false;
            this.getPriorityHandle(id);
            this.getMemberShipPriceInfo()
          },
          goBackHandle(){this.$router.back()},
          getCheckoutInfo(){
            accountMemberShipCheckoutApi(this.$route.query.vipgradeid).then(res=>{
              this.levelMapList = objectTranToArray(res.levelmap);//会员等级列表
              this.formInput.level = res.levelmap[this.vipGrade];//会员名称
            })
          },
          getPriorityHandle(id){
            let value = []
            accountMemberShipDescribeApi(id).then(res=>{
              for(let key in res){
                if(res[key]!=-1){
                  value.push(key)
                }
              }
              this.priorityList = value;
            })
          },
          showLevelHandle(type){
            switch (type) {
              case 'level':
                this.levelVisible= true;
                break;
              case 'plan':
                this.planVisible = true;
                break;
            }
          },
          getMemberShipPriceInfo(){
            this.priceInfo ={};
            accountMemberShipPriceInfoApi({
              vipgradepriceid:this.formInput.planID,
              userpaymode:this.formInput.userpaymode
            }).then(res=>{
              if(res.status!=0){
               return  this.$toast({message:'load price info fail :'+res.message})
              }
              this.priceInfo = res.data || {};
              console.log(this.priceInfo);
              /*
              let result = res.data;
              //如果有兰特/积分优惠
              if(result.hasspecialunitprice){
                  this.hasSpecialFlag = true;
                  this.priceInfo.specialtotalamount=result.specialtotalamount;
                  this.priceInfo.totalamount=result.totalamount;
                  this.priceInfo.totalamountrate=result.totalamountrate;
                  this.priceInfo.hasspecialunitprice=result.hasspecialunitprice;
              }else{
                  this.priceInfo.totalamount = result.totalamount;
              }
              this.priceInfo.refundamount = result.refundamount;
              //如果有赠送时间
              if(result.hasspecialtime){
                  this.priceInfo.hasspecialtime = result.hasspecialtime;
                  this.priceInfo.validthru = result.validthru;
                  this.priceInfo.specialvalidthru = result.specialvalidthru;
                  this.priceInfo.specialtimemsg = result.specialtimemsg;
              }else{
                this.priceInfo.hasspecialtime = result.hasspecialtime;
                this.priceInfo.validthru = result.validthru;
              }
              //积分
              this.priceInfo.scoinsum = result.scoinsum;
              if(this.formInput.userpaymode==undefined){
                this.formInput.userpaymode = result.userpaymode +'';
              }
              this.priceInfo.paycode = result.paycode;
              if(this.priceInfo.paycode !=undefined){
                this.priceInfo.paymessage = result.paymessage;
              }else{
                this.priceInfo.grandtotal = result.grandtotal;
              }
              *
              * */

            })
          },
          getMemberShipPlan(){
            accountMemberShipPlanApi(this.vipGrade).then(res=>{
              this.planMapList = res.map(item=>{
                item.name = item.planname;
                return item;
              });
              this.formInput.planID = this.planMapList[0].id;
              this.formInput.plan = this.planMapList[0].name;
              this.getPriorityHandle(this.formInput.planID);
              this.getMemberShipPriceInfo()
            })
          }
        },
      mounted() {
          this.vipGrade = this.$route.query.vipgradeid;
          this.getCheckoutInfo();
          this.getMemberShipPlan()
          // this.getPriorityHandle();

      }
    }
</script>

<style scoped lang="less">
  .enough-dialog{
    background-color: #fff;
    padding:10px;

    .enough-dialog-title{
      padding:15px;
      border-bottom:1px solid lightgray;
      position: relative;
    }
    .enough-dialog-content{
      padding:15px;
    }
    .btn-area{
      margin-top: 20px;
    }
    .close-icon{
      position: absolute;
      right:10px;
      top:15px;
    }
  }
  .pay_btn{
    padding:15px 10px;
    margin-bottom:20px;
  }
  /deep/.van-cell{
    color:#000;
  }
  /deep/.van-cell__value{
    color:#000;
  }
  /deep/.van-field__label{
    color:#000;
  }
  .special-time-msg{
    color:blue;
    padding:0 15px 8px ;
    font-size:12px;
    border-bottom:1px solid #EEEEED;
  }
  .vip-form-card{
    border:1px solid #EEEEED;
    border-radius: 4px;
    background-color: #fff;
    padding:10px 10px;
    margin:15px 8px  ;
    .vip-form-item{
      padding: 8px;
      border-bottom:1px solid #EEEEED;
    }
  }
.vip-priority-card{
  border:1px solid #EEEEED;
  border-radius: 4px;
  background-color: #fff;
  padding:10px 15px;
  margin:8px ;
  .vip-priority-card-title{
    padding-bottom: 10px;
    font-size:16px;

  }
  .vip-priority-content{
    border-bottom:0.5px solid #eee;
    border-top:0.5px solid #eee;
    padding:10px 0;
    .vip-priority-item{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      line-height:1.5;
      font-size:14px;
      margin-bottom: 10px;
      .icon-chenggong{
        color:green;
        font-size:16px;
        margin-right: 4px;
      }
    }
  }

}
</style>
