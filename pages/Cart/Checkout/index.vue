<template>
  <div class="s3-checkout-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="navbar-title">Checkout</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollViewHeight">
      <div class="order-info-box">
          <div class="order-info-content">
            <div class="order-info-content-left">
              <img :src="showImage" alt="">
            </div>
            <div class="order-info-content-right">
                <div class="good-count" @click="checkListHandle">
                  total {{totalLength}} <van-icon name="arrow" color="#8B8989" size="16" class="g_ml_s"/></div>
                  <div class="good-total">
                    <div>Total payment</div>
                    <div class="color_active">{{priceCostInfo.totalcostzar  | moneyFormat}}</div>
                  </div>
            </div>
          </div>
      </div>
      <div class="goods-info-box bg_white">
            <div class="good-price-info">
              <price-calculation
                :qtime="qtime"
                :oldqualitycost="baseInfo.oldqualitycost"
                :saveFee="baseInfo.saveFee"
                :qualityinspectioncostzar="baseInfo.qualityinspectioncostzar"
                :priceInfo="priceCostInfo" :vipname="baseInfo.vipname"  @showPopupEmit="showPopupHandle"/>
              <div class="toPay-coupon"
                   @click="checkCouponHandle">
                <div class="coupon-title d_flex d_flex_between">
                  <div>Coupons</div>
                  <div>
                    <template v-if="chooseCoupon.money > 0">
                        <strong class="color_warning">- {{chooseCoupon.money | moneyFormat}}</strong>
                    </template>
                    <template v-else>
                      <template v-if="avaliableList.length>0">
                        <van-tag size="medium"
                                 color="#FFD39B" text-color="#FF6347" round>
                          You have {{ avaliableList.length }} coupons and save up to R {{baseInfo.maxcouponmoney || 0}}
                          <van-icon name="arrow"/>
                        </van-tag>
                      </template>
                      <template v-else>
                        <van-tag size="medium" color="#EEEEED" text-color="#333" round>
                          Don't have coupons
                          <van-icon name="arrow"/>
                        </van-tag>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              <div class="toPay-coupon">
                <div class="coupon-title d_flex d_flex_between">
                  <van-checkbox   v-model="coinFlag" icon-size="14">
                    <strong> Use {{scoinInfo.useCoin  }} S Coins </strong>
                  </van-checkbox>
                  <strong class="color_warning"> - {{scoinInfo.useMoney | moneyFormat}}</strong>
                </div>
              </div>
            </div>
            <div class="good-cost-info">
              <van-collapse v-model="costActive" accordion>
                <van-collapse-item title="Estimate Int’l Freight Cost" name="1">
                    <div class="good-cost-content">
                        <div class="good-cost-img" @click="goAdsHandle">
                          <img :src="imgInfo.image" alt="" >
                        </div>
                        <div class="form-content">
                          <div class="form-item">
                            <div  class="g_ml_m form-label d_flex font_w">Postal Code<span class="color_warning"> *</span></div>
                            <div class="form-input">
                              <div class="input-area">
                                <input type="text" placeholder="Postal Code"
                                       v-model="searchKey.postal"
                                       @focus="showListPopHandle('postal')"
                                       class="input-area-input">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-content">
                        <div class="form-item">
                          <div  class="g_ml_m form-label d_flex font_w">Suburb<span class="color_warning"> *</span></div>
                          <div class="form-input">
                            <div class="input-area">
                              <input type="text" placeholder="Suburb"
                                     v-model="searchKey.suburb"
                                     @focus="showListPopHandle('suburb')"
                                     class="input-area-input">
                            </div>
                          </div>
                        </div>
                      </div>
                       <van-button block class="estimate-btn g_mt_l" @click="estimateHandle">Estimate</van-button>

                    </div>

                </van-collapse-item>

              </van-collapse>
            </div>
        </div>
    </scroll-view>

<!--    定位 start-->
      <div class="checkout-pay-content">
        <div class="d_flex d_flex_between">
            <div class="pay-left">
              <div class="pay-total">Total :  <strong>{{totalMoney  | moneyFormat}}</strong></div>
              <div class="color_intro pay_intro">(Exclude Int'l Freight Cost)</div>
            </div>
            <div class="pay-right">
              <div class="pay-btn" @click="payHandle">Pay</div>
            </div>
        </div>
      </div>
<!--    定位 end-->



    <van-action-sheet v-model="isVisible" :title="selectTab==='estimate'?'Estimate Int’l Freight Cost':'Order Value Detail'">
      <order-value-popup v-if="selectTab==='orderValue'" @confirmEmit="isVisible = false" :priceCostInfo="priceCostInfo"/>

      <estimate-popup v-else-if="selectTab==='estimate'"
                      @closeEmit="isVisible = false"
                      :estimateResult="estimateResult"/>
    </van-action-sheet>
<!--    优惠劵-->
    <van-action-sheet v-model="useCouponVisible" title="Select Coupons">
      <coupon-popup
                    :isChoose="true"
                    :avaliable-list="avaliableList"
                    :un-avaliable-list="unAvaliableList"
                    :cost="Number(priceCostInfo.totalcostzar)"
                    @chooseCouponEmit="chooseCouponHandle"/>
    </van-action-sheet>
<!--    确认支付弹出框start-->
    <van-dialog v-model="payDialogVisible"  show-cancel-button>
        <template #title>
          <div class="pay-dialog-title d_flex_between d_flex b_border">
            <div class="pay-dialog-title font_w">Total : {{totalMoney| moneyFormat}}</div>
            <div class="pay-dialog-close" @click="payDialogVisible = false ">
              <van-icon name="cross" size="24" color="#ccc"/></div>
          </div>
        </template>
      <common-pay-dialog :balanceInfo="balanceInfo"
                  @confirmPayEmit="confirmPayHandle"
                  :total="totalMoney"/>
    </van-dialog>
<!--    确认支付弹出框end-->
<!--    金额不足的弹出框start-->
    <van-dialog v-model="hasNoPayVisible">
      <common-dialog type="error"
                     cancelText="Close"
                     confirmText="Pay&Recharge"
                     confirmBg="#fcc900"
                     confirmBorder="#fcc900"
                     @cancelEmit="hasNoPayVisible = false"
                     @confirmEmit="goRechargeHandle"
                     :hasTwoBtn="true"
                     title="Your balance is not enough"
                     :intro="`<strong class='color_warning'>Balance : R ${balanceInfo.balance } </strong>`"/>
    </van-dialog>
<!--    金额不足的弹出框end-->
<!--estimate 弹出框-->
    <van-popup v-model="visible.suburb" round  position="bottom" :style="{ height: '50%' }" >
      <div class="postal-popup-content">
        <div class="postal-popup-search">
          <van-search  shape="round" @input="searchInputSuburbHandle" v-model="searchInput.suburb" placeholder="Suburb" />
        </div>
        <div class="postal-popup-list">
          <template v-if="subrubList.length">
            <scroll-view class="cellScrollHeight" @reachBottom="loadMoreSuburbHandle">
              <van-cell v-for="(item,index) in subrubList"
                        @click="chooseSuburbItem(item)"
                        :key="index" :title="item.text" />
            </scroll-view>
          </template>
          <van-empty description="No results found" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </div>

        <!--          列表数据-->

      </div>
    </van-popup>
    <van-popup v-model="visible.postal" round  position="bottom" :style="{ height: '50%' }" >
      <div class="postal-popup-content">
        <div class="postal-popup-search">
          <van-search  shape="round" @input="searchInputPostalHandle" v-model="searchInput.postal" placeholder="Postal Code" />
        </div>
        <div class="postal-popup-list">
          <template v-if="postalList.length">
            <scroll-view class="cellScrollHeight" @reachBottom="loadMorePostalHandle">
              <van-cell v-for="(item,index) in postalList"
                        @click="choosePostalItem(item)"
                        :key="index" :title="item.text" />
            </scroll-view>
          </template>
          <van-empty description="No results found" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </div>

        <!--          列表数据-->

      </div>
    </van-popup>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import ScrollView from "@/components/common/ScrollView";
import GoodItem from "../childComponent/GoodItem";
import PriceCalculation from "../childComponent/PriceCalculation";
import OrderValuePopup from '@/components/content/OrderValuePopup'
import CouponPopup from '@/components/content/CouponPopup'
import CommonPayDialog from '@/components/common/CommonPayDialog'
import CommonDialog from '@/components/common/CommonDialog'
import EstimatePopup from './EstimatePopup';
import EmptyImg from '@/assets/images/common/empty.png'
import { searchPostcodeApi  } from '@/api/help';
import {commonBannerAdvListApi} from '@/api/common'
import {
  cartCouponAvailableApi,
  cartUserBalanceApi,
  confirmPayApi,
  cartDeliveryOrderEstimateCostApi
} from '@/api/cart'
export default {
  head(){
    return {
      title:'Check out - shopshipshake'
    }
  },
  name: "index",
  components:{ScrollView ,
    CommonDialog,
    GoodItem ,PriceCalculation,OrderValuePopup,CouponPopup,
    CommonPayDialog,
    EstimatePopup},
  computed:{
    totalMoney(){

      if(Number(this.priceCostInfo.totalcostzar) -
        Number(this.chooseCoupon.money)>0){
        return Number(this.priceCostInfo.totalcostzar) -
          Number(this.chooseCoupon.money) -
          (this.coinFlag ? Number(this.scoinInfo.useMoney) : 0) +
          Number(this.priceCostInfo.groupservicefee/100.0) +
          Number(this.priceCostInfo.bigcustomerservicefee/100.0)
      }else{
        return (this.coinFlag ? Number(this.scoinInfo.useMoney) : 0) +
          Number(this.priceCostInfo.groupservicefee/100.0) +
          Number(this.priceCostInfo.bigcustomerservicefee/100.0)
      }


    },
    totalQuality(){
      if(this.$store.state.checkoutInfo){
        let list =this.$store.state.checkoutInfo.resultMap.list;
        return list.reduce((pre,cur)=>{
          return Number(cur.qualityinspectionfee) + pre
        },0)
      }else{
        return 0;
      }
    },
    //订单总数
    totalLength(){
      if(this.$store.state.checkoutInfo){
        return  this.$store.state.checkoutInfo.resultMap.list.length;
      }else{
        return 0
      }
    }
  },
  data(){
    return{
      EmptyImg,
      activeNames:['2'],
      selectTab:null,
      isVisible:false,
      costActive:'1',
      postCode:'',
      payDialogVisible:false,
      list:[],
      priceCostInfo:{},
      balanceInfo:{},//balance信息
      couponlist:[],
      chooseCoupon:{id:0,money:0},
      coinFlag:true,
      hasNoPayVisible:false,
      baseInfo:{},
      useCoinInfo:{},
      searchKey:{
        postal:'',
        suburb:'',
      },
      suburbCode:'',
      postalList:[],
      subrubList:[],
      page:1,
      showPostalVisible:false,
      estimateResult:[],
      scoinInfo:{
        useCoin:0,
        useMoney:0
      },
      useCouponVisible:false,//是否使用优惠卷
      showImage:'',//显示的图片信息
      avaliableList:[],//可用的优惠卷
      unAvaliableList:[],//不可以用的优惠卷
      visible:{
        postal:false,
        suburb:false,
      },
      postalPage:1,
      suburbPage:1,
      searchInput:{
        postal:'',
        suburb:'',
      },
      isWaiting:false,
      qtime:'',
      imgInfo:{
        image:require('../../../assets/images/advs/updated_banner.png'),
        url:''
      }
    }
  },
  methods:{
    //获取banner图片
    getBannerAdv(){
      commonBannerAdvListApi('MOBILE_PAYMENT').then(res=>{
        if(res){
          const {image,url} = res[0];
          this.imgInfo  = {
            image,url
          };
        }

      })
    },
    goAdsHandle(){
      if(!this.imgInfo.url) return;
      window.open(this.imgInfo.url,'online')

    },
    showListPopHandle(type){
      switch (type) {
        case 'postal':
          this.visible.postal = true;
          this.postalPage = 1;
          this.getPostalList()
          break;
        case 'suburb':
          this.visible.suburb = true;
          this.suburbPage =1;
          this.getSurburbList()
          break;
      }
    },
    estimateHandle(){
      if(!this.searchKey.postal){
        return this.$toast({message:'Postal Code is Required!'})
      }
      if(!this.searchKey.suburb){
        return this.$toast({message:'Suburb Code is Required!'})
      }
      cartDeliveryOrderEstimateCostApi({
        receivepostcode:this.searchKey.postal,
        receivesuburb:this.searchKey.suburb,
        shoporderids:this.baseInfo.ids
      }).then(res=> {
        this.estimateResult = res;
        this.isVisible = true;
        this.selectTab ='estimate'
      })
    },
    //显示postallist
    chooseSuburbItem(item){
      let value = item.text.split(',');
      this.searchKey.postal = value[1];
      this.searchKey.suburb = value[0];
      this.visible.suburb = false;
    },
    choosePostalItem(item){
      let value = item.text.split(',');
      this.searchKey.postal = item.id;
      this.searchKey.suburb = value[1];
      this.visible.postal = false;

    },
    loadMorePostalHandle(){
      this.postalPage++;
      searchPostcodeApi({
        search:this.searchInput.postal,
        type:'postcode',
        page:this.postalPage,
      }).then(res=>{
        this.postalList = [...this.postalList,...res.list];
      })
    },
    loadMoreSuburbHandle(){
      this.suburbPage++;
      searchPostcodeApi({
        search:this.searchInput.suburb,
        type:'suburb',
        page:this.suburbPage,
      }).then(res=>{
        this.subrubList =[...this.subrubList,... res.list];
      })

    },
    getPostalList(){
      searchPostcodeApi({
        search:this.searchInput.postal,
        type:'postcode',
        page:this.postalPage,
      }).then(res=>{
        this.postalList = res.list;
      })
    },
    getSurburbList(){
      searchPostcodeApi({
        search:this.searchInput.suburb,
        type:'suburb',
        page:this.suburbPage,
      }).then(res=>{
        this.subrubList = res.list;
      })
    },
    searchInputSuburbHandle(){
      this.suburbPage =1;
      this.getSurburbList()
    },
    //  查看orderlist
    checkListHandle(){
      this.$router.push('/shoporder/orderList')
    },
    searchInputPostalHandle(){
      this.postalPage =1;
      this.getPostalList()
    },
    //获取接受的数据
    searchKeyHandle(item){
      cartDeliveryOrderEstimateCostApi({
        receivepostcode:item.postal,
        receivesuburb:item.subsurb,
        shoporderids:this.baseInfo.ids
      }).then(res=> {
        this.estimateResult = res;
        this.isVisible = true;
        this.selectTab ='estimate'
      })
    },
    //确定提交
    confirmPayHandle(){
      this.payDialogVisible = false;
      this.isWaiting = true;
      confirmPayApi({
        ids:this.baseInfo.ids,
        userscoin:this.coinFlag?1:0,
        couponrecordid:this.chooseCoupon.id,
        pay_scenario:0,//(0是cart,1是topay)
      }).then(res=>{
        if(res.status==0){
          this.$router.push('/shoporder/paysuccess')
          this.$store.commit('removeCheckoutInfo')
          this.isWaiting = false;
          this.$store.commit('removeCheckoutInfo')
        }else{
          this.isWaiting = false;
          this.$toast({message:res.message})
        }


      })
    },
    //充值页面
    goRechargeHandle(){
      confirmPayApi({
        ids:this.baseInfo.ids,
        userscoin:this.coinFlag?1:0,
        couponrecordid:this.chooseCoupon.id,
        pay_scenario:0,//(0是cart,1是topay)
      }).then(res=>{
        if(res.status==0){
          this.$EventBus.$emit('toRecharge','checkout')
          this.$router.replace('/user/recharge')
        }else{
          this.$toast({message:res.message})
        }


      })

    },
    //选择优惠卷
    chooseCouponHandle(item){
      this.useCouponVisible = false;
      this.chooseCoupon = item?item:{};
      this.getScoinInfo()
    },
    goBackHandle(){
      this.$store.commit('removeCheckoutInfo')
      this.$router.back();
    },
    showPopupHandle(type){
      if(type==='coupons'){
        this.useCouponVisible = true;
      }else{
        this.selectTab = type;
        this.isVisible = true;
      }
    },
    payHandle(){
      if(Number(this.balanceInfo.balance) < Number(this.totalMoney)){
        this.hasNoPayVisible = true;
      }else{
        this.payDialogVisible = true;
      }
    },
    //查看优惠劵列表
    checkCouponHandle(){
      this.useCouponVisible = true;
    },
    //获取checkout后的数据
    getBasicInfo(){
      if(this.$store.state.checkoutInfo){
        let value = this.$store.state.checkoutInfo;
        const {list,cost,ids,couponsize,maxcouponmoney ,vipname,oldqualitycost,saveFee,so }= value.resultMap;
        this.qtime = value.qtime;
        this.list = list;
        this.priceCostInfo = cost;
        this.baseInfo ={
          ids,
          couponsize,
          maxcouponmoney,
          vipname,
          oldqualitycost:Number(oldqualitycost),
          saveFee:Number(saveFee),
          qualityinspectioncostzar:Number(so.qualityinspectioncostzar)
        }
        if(list && list[0].dlist){
          this.showImage = list[0].dlist[0].images;
        }

        this.cartCouponAvailableHandle();

      }
    },
    //获取优惠卷信息
    cartCouponAvailableHandle(){
      cartCouponAvailableApi({
        cost:this.priceCostInfo.totalcostzar,
        type:this.$config.couponType.PURCHASE
      }).then(res=>{
        this.couponlist =res.data.couponlist;
        if(res.data.couponlist && res.data.couponlist.length){
          this.avaliableList = res.data.couponlist.filter(item=>item.available===1);
          this.unAvaliableList = res.data.couponlist.filter(item=>item.available!= 1);
          if(this.avaliableList.length){
            this.chooseCoupon ={
              id:this.avaliableList[0].id,
              money:this.avaliableList[0].money
            }
          }else{
            this.chooseCoupon ={
              id:0,
              money:0
            }
          }

        }
        this.cartUserBalanceHandle();
      })
    },
    //获取积分信息
    cartUserBalanceHandle(){
      cartUserBalanceApi().then(res=>{
        this.balanceInfo={
          balance:Number(res.balance) + Number(res.creditline),//账户剩余金额
          scoin:res.scoin,//积分总数
        }
        this.getScoinInfo()
      })
    },
    //获取可使用积分
    getScoinInfo(){
      let value ={};
     let totalCost =this.priceCostInfo.totalcostzar - this.chooseCoupon.money>0? parseInt(this.priceCostInfo.totalcostzar - this.chooseCoupon.money):0;
      if(totalCost >this.balanceInfo.scoin){
        value={
          useCoin: parseInt(this.balanceInfo.scoin) ,
          useMoney:parseInt(this.balanceInfo.scoin)/100.0
        }
      }else{
        //如果积分大于总金额，使用总金额
        value={
          useCoin:totalCost,
          useMoney:totalCost/100.0
        }
      }
      this.scoinInfo = value;
    },
  },

  mounted() {
    this.getBasicInfo();
    this.getBannerAdv();



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
  .estimate-btn{
    margin-top: 20px;
    margin-bottom: 50px;
    background-color: #FCC900;
    border-radius: 4px;
    font-size:15px;
  }
.form-content{
  .form-item{
    margin-top: 12px;
  }
  .form-label{
    font-size:14px;
    color:#2A2A2A;
  }
  .form-input{
    margin-top: 8px;
    input{
      padding:9px 20px 9px 10px;
      border-radius: 6px;
      width:90%;
      color:#2A2A2A;
      border:1px solid #e5e6e7;

    }
  }
}
/*弹出框开始*/
/deep/.van-icon-search::before{
  content:''
}
.postal-popup-content{
  padding:0 10px 10px;
  position: relative;
  .postal-popup-search{
    background:#fff;
    padding-top:10px;
    padding-bottom: 8px;
    border-bottom:1px solid #EEEEED;
    position: fixed;
    left:10px;
    right:10px;
    z-index: 10;

  }
  .postal-popup-list{
    padding-top: 50px;
  }
  .cellScrollHeight{
    height:270px;
  }
  /deep/.van-empty{
    padding:30px 0;
  }
}
/*弹出框结束*/
  .order-info-box{
    background-color: #fff;
    padding:10px 10px 0;
    .order-info-content{
      display: flex;
      justify-content: space-between;
      .order-info-content-left{
        height:110px;
        width:110px;
        border:1px solid #EEEEED;
        img{
          width:100%;
          height:100%;
          border-radius: 10px;
        }
      }
      .order-info-content-right{
        padding:10px 10px 0;
        flex:1;
        .good-count{
          text-align: right;
          font-size:16px;
          color:#2A2A2A;
          margin-bottom:55px;
        }
        .good-total{
          /*margin-bottom:12px;*/
          font-size:15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

      }
    }
  }
  .toPay-coupon{
    padding:5px 10px;
    border-bottom:1px solid #EEEEED;
    /deep/.van-cell{
      padding-left:0px;
    }
    .coupon-title{
      padding:10px 8px;
      font-size:14px;
    }
  }
  /deep/.van-collapse-item__content{
    padding:0;
  }
/deep/.van-dialog__footer{
  display: none;
}
//弹出框
/deep/.van-dialog__header{
  padding-top: 10px;
}
.pay-dialog-title{
  padding: 0 10px 5px;
}
.checkout-pay-content{
  position: fixed;
  border-top:1px solid #EEEEED;
  background-color: #fff;
  bottom:50px;
  left:0;
  right:0;
  padding:4px 15px;
  .pay-right{
    width:120px;
    .pay-btn{
      height:40px;
      text-align: center;
      line-height:40px;
      font-size:16px;
      border-radius: 4px;
      background-color: #FCC900;
    }
  }
  .pay-left{
    flex:1;
    color:gray;
    font-size:16px;
    strong{
      color:#2A2A2A;
    }
    .pay_intro{
      font-size:13px;
      margin-top: 4px;
    }

  }
}
.good-count{
  font-size:16px;
  font-weight: 400;
  color:#3d4145;
}

.s3-checkout-wrapper{
  .goods-info-box{
    /*margin-bottom: 90px;*/
    .product-title{
      padding: 8px 15px 0 15px;
      font-size: 13px;
    }

  }
  .good-cost-info{
    padding:0 10px;
    .good-cost-content{
      padding:10px 0 90px;
      .good-cost-img{
        img{
          height:auto;
          width:100%;
        }
      }
      .good-cost-field{

        .good-cost-field-name{
          font-size:14px;
          margin-bottom: 8px;
          color:#2A2A2A;
        }

        .select-area{
          padding:20px 20px;
        }
        .select-list{
          .select-item{
            padding:4px;
          }
        }
      }
      .operate-btn-area{
        padding:20px 0 10px;
        .operate-btn{
          background-color: #FCC900;
          border-radius: 6px;
          font-size:15px;
        }
      }
    }

  }
}
.scrollViewHeight{
  height:calc(100vh - 50PX - 90PX);
  background-color: #EEEEED;
}
/deep/.van-cell__title{
  font-size: 15px;
  font-weight: bold;
}

</style>
