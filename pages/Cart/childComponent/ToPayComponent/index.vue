<template>
  <section>
    <van-sticky>
      <div class="s3-cart-navbar d_flex ">
        <div class="cart-navbar-title">
          <div class="Cart_title" @click="changeTabHandle">
            <span>Cart</span>
          </div>
          <div class="toPag-title" >
          <span>To Pay</span></div>
        </div>
        <div class="cart-navbar-delete  d_flex">
        </div>
      </div>
    </van-sticky>
    <scroll-view class="scrollViewHeight">
      <template v-if="isLoading">
        <van-loading type="spinner" color="#fcc900" size="50px"/>
      </template>
      <template v-else>
        <div v-if="shopOrders.length">
          <div  class="toPay-item-content">
            <div class="toPay-item-title d_flex_between d_flex">
              <div>
                <van-checkbox v-model="allChooseFlag" @click="chooseAllHandle">Shopping Orders :
                  <span class="font_w color_active">{{shopTask.money}}</span></van-checkbox>
              </div>
              <van-icon :name="showGoodVisible?'arrow-up':'arrow-down'" @click="showGoodsHandle"/>
            </div>
            <div class="toPay-price">
              <div class="toPay-price-title" >Price Calculation</div>
               <div class="toPay_detail_info">
                 <div class="toPay_info_item g_mb_l">
                   <div class="color_intro g_mb_m" >Order Value</div>
                   <div @click="showPopupHandle('orderValue')"><strong>{{orderValueCount| moneyFormat}}</strong>
                     <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/></div>
                 </div>
                 <div class="toPay_info_item g_mb_l">
                   <div class="color_intro g_mb_m" >Chinese Freight</div>
                   <div><strong>{{ chineseFreightCount |moneyFormat}}</strong></div>
                 </div>
                 <div class="toPay_info_item g_mb_l">
                   <div class="color_intro g_mb_m" >Remove Shoebox Fee</div>
                   <div><strong>{{ removeShoeBoxFeeCount | moneyFormat }}</strong></div>
                 </div>
                 <div class="toPay_info_item g_mb_l">
                   <div class="color_intro g_mb_m" >Quality Inspection Fee</div>
                   <div><strong>{{qualityInspectionFeeCount | moneyFormat}}</strong></div>
                 </div>
                 <div  class="toPay_info_item g_mb_l" v-if="groupBuyServiceCount>0">
                   <div class="color_intro g_mb_m g_mt_m" >Group-buy service Fee</div>
                   <strong>{{ groupBuyServiceCount | moneyFormat }}</strong>
                 </div>
                 <div class="toPay_info_item" v-if="bigCoustomerServiceCount>0">
                   <div class="color_intro g_mb_m g_mt_m" >Service Fee</div>
                   <strong>{{ bigCoustomerServiceCount | moneyFormat }}</strong>
                 </div>
               </div>


<!--              <div class="toPay-info">-->
<!--                <div class="toPay-info-order d_flex_between d_flex">-->
<!--                  <div class="toPay-info-order-left">-->
<!--                    <div class="g_mb_m">-->
<!--                      <div class="color_intro g_mb_m" >Order Value</div>-->
<!--                      <div @click="showPopupHandle('orderValue')"><strong>{{orderValueCount| moneyFormat}}</strong>-->
<!--                        <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/></div>-->
<!--                    </div>-->
<!--                    <div >-->
<!--                      <div class="color_intro g_mb_m" >Remove Shoebox Fee</div>-->
<!--                      <div><strong>{{ removeShoeBoxFeeCount | moneyFormat }}</strong></div>-->
<!--                    </div>-->
<!--                    <div v-if="groupBuyServiceCount>0">-->
<!--                      <div class="color_intro g_mb_m g_mt_m" >group-buy service Fee</div>-->
<!--                      <div><strong>{{ groupBuyServiceCount | moneyFormat }}</strong></div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="toPay-info-order-right" >-->
<!--                    <div class="g_mb_m">-->
<!--                      <div class="color_intro g_mb_m" >Chinese Freight</div>-->
<!--                      <div><strong>{{ chineseFreightCount |moneyFormat}}</strong></div>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                      <div class="color_intro g_mb_m" >Quality Inspection Fee</div>-->
<!--                      <div><strong>{{qualityInspectionFeeCount | moneyFormat}}</strong></div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->





              <div class="toPay-coupon g_mb_l" @click="showPopupHandle('coupons')">
                <van-cell title="Coupons" >
                  - R {{ chooseCoupon ?chooseCoupon.money : 0 }}
                  <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/>
                </van-cell>
              </div>
              <div class="toPay-coupon d_flex d_flex_between topay-scoin" >
                <van-checkbox v-model="coinFlag" icon-size="14" shape="square" >
                  <p class="color_warning">Use <strong>{{scoinCount.scoin}}</strong> S Coins</p>
                </van-checkbox>
                (<span v-if="scoinCount.scoinmoney>0">-</span>{{scoinCount.scoinmoney }}R)
              </div>
            </div>
<!--            列表-->
            <template v-if="showGoodVisible">
              <div class="cart-product-list g_mb_m" v-for="(order,orderID) in shopOrders" :key="orderID">
                <div class="product-title d_flex d_flex_between">
                  <van-checkbox  v-model="order.checked" icon-size="18px">No.{{ order.orderno }}</van-checkbox>
                  <img v-if="order.shopifyorderno" src="https://shop.shopshipshake.com/resources/images/icon-shopify.svg" alt="" class="shopify-img">
                  <div class="title-intro" @click="showWaitingHandle(order)">
                    Awaiting Payment <van-icon name="question-o" size="14" class="g_ml_s"/>
                  </div>
                  <div class="intro-content animate__animated animate__fadeInRight" v-show="order.isShow">
                    Waiting for you to pay for the order.
                  </div>
                </div>
                <div v-for="(product,index) in details[order.id]" :key="index">
                  <good-item  line-type="toPay" :product="product" :order="order">
                    <div slot="price">{{product.total | moneyFormat}}</div>
                    <div slot="count">
                      <div class="product-count"> x {{product.qty}}</div>
                    </div>
                  </good-item>
                  <div v-if="order.qualityinspectiontype == 1" class="order-intro">
                    Quality Inspection R {{order.qualityinspectioncostzar}}
                    <van-icon name="question" class="g_ml_m" size="16" @click.stop="showInfoHanlde"/>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <van-popup v-model="showPopupFlag"  closeable round position="bottom" >
            <order-value-popup v-if="selectTab==='orderValue'"
                               @confirmEmit="showPopupFlag = false"
                               :priceCostInfo="priceCostInfo"/>
          </van-popup>
        </div>
        <van-empty v-else
                   class="custom-image animate__animated animate__backInUp delay-5s" description="No Orders Found">
          <img src="~assets/images/cart/empty.png" alt="" slot="image">
          <van-button round  class="shopping-btn" @click="goIndexHandle">Shopping Now</van-button>
        </van-empty>
        <div class="toPay-btn">
          <van-row>
            <van-col span="10">
              <div><span class="color_intro g_ml_m"> Total : </span><strong>{{ payAmount | moneyFormat}}</strong></div>
            </van-col>
            <van-col span="6">
              <div class="cancel-btn" @click="cancelHandle">Cancel</div>
            </van-col>
            <van-col span="8">
              <div class="pay-btn" @click="showPayDialog">Pay({{payCount}})</div>
            </van-col>
          </van-row>
        </div>
      </template>
    </scroll-view>
    <van-dialog v-model="showInfoPop"
                theme="'round-button"
                class="stard-pop" show-cancel-button :show-confirm-button="false" cancelButtonText="close"
                @cancel="showInfoPop=false"
                title="Quality Inspection Standards">
      <scroll-view class="scrollHeight">
        <standard-dialog/>
      </scroll-view>
    </van-dialog>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
    <van-dialog v-model="payDialog"  show-cancel-button>
      <template #title>
        <div class="pay-dialog-title d_flex_between d_flex b_border">
          <div class="pay-dialog-title font_w">Total : {{payAmount | moneyFormat}}</div>
          <div class="pay-dialog-close" @click="payDialog = false ">
            <van-icon name="cross" size="24" color="#ccc"/>
          </div>
        </div>
      </template>
      <pay-dialog          :balanceInfo="balanceInfo"
                           @confirmPayEmit="confirmPayHandle"
                           :total="payAmount"/>
    </van-dialog>
    <van-dialog v-model="isCancelVisible">
      <common-dialog type="info" v-if="dialogValue==='cancel'"
                     title="Warning"
                     cancelText="Cancel"
                     :hasTwoBtn="true"
                     @confirmEmit="confirmCancelHandle"
                     confirmBg="#fcc900"
                     confirmBorder="#fcc900"
                     @cancelEmit="hidePopHandle"
                     intro="Are you sure ? "/>
      <common-dialog type="error" v-else-if="dialogValue==='recharge'"
                     cancelText="Close"
                     confirmText="Recharge"
                     confirmBg="#fcc900"
                     confirmBorder="#fcc900"
                     @cancelEmit="isCancelVisible = false"
                     @confirmEmit="goRechargeHandle"
                     :hasTwoBtn="true"
                     :confirmFont="16"
                     title="Your balance is not enough"
                     :intro="`<strong class='color_warning'>Balance : R ${balanceInfo.balance } </strong>`"/>

      <common-dialog type="error" v-else-if="dialogValue==='selectOne'"
                     @okEmit="isCancelVisible = false"
                     title="Error"
                     intro="please select one"
      />
    </van-dialog>
    <van-action-sheet v-model="useCouponVisible" title="Select Coupons">
      <coupon-popup
        :is-choose="true"
        :avaliable-list="avaliableList"
        :un-avaliable-list="unAvaliableList"
        :cost="Number(priceCostInfo.totalcostzar)"
        @chooseCouponEmit="chooseCouponHandle"/>
    </van-action-sheet>

<!--    有问题的数据-->
    <van-overlay :show="showQuestionVisible" >
      <div class="question_list_wrapper">
        <div class="question_title">Change Commodity</div>
        <scroll-view class="questionView">
          <div class="price-change-box" v-if="questionPriceList.length">
            <div class="change-title">
              <div class="title-name">Price changed</div>
              <div class="title-intro">Price changeed compared to adding to cart</div>
            </div>
            <div class="exchange-list">
              <div class="exchange-list-title" v-for="(item,index) in questionPriceList" :key="index">
                <div  >
                  <van-checkbox icon-size="16" :name="item.id" v-model="item.isChecked" > No.{{item.orderno}}</van-checkbox>
                </div>
                <good-item v-for="(product,index1) in item.dlist" :key="index1"
                           :isShowTop="Number(item.producttype) ===1"
                           :product="product"
                           :order="item"
                >

                  <div slot="count">
                    x {{product.qty}}
                  </div>
                </good-item>
              </div>
            </div>
          </div>
          <div class="price-change-box" v-if="questionProList.length">
            <div class="change-title">
              <div class="title-name">May have quality problem</div>
              <div class="title-intro"> The following goods may be
                problematic, tick it if you still to buy.</div>
            </div>
            <div class="exchange-list">
              <div class="exchange-list-title" v-for="(item,index) in questionProList" :key="index">
                <div  >
<!--                  @click="chooseProItemHandle(item)"-->
                  <van-checkbox icon-size="16" :name="item.id" v-model="item.isChecked" > No.{{item.orderno}}</van-checkbox>
                </div>
                <good-item v-for="(product,index1) in item.dlist" :key="index1"
                           :isShowTop="Number(item.producttype) ===1"
                           :product="product"
                           :order="item"
                >
                  <div slot="count">
                    x {{product.qty}}
                  </div>
                </good-item>
              </div>
            </div>
          </div>
          <div class="price-change-box" v-if="questionOutList.length">
            <div class="change-title">
              <div class="title-name">Sold out</div>
              <div class="title-intro">The following goods are Sold out,<strong class="color_warning">do NOT buy it !</strong></div>
            </div>
            <div class="exchange-list">
              <div class="exchange-list-title">
                <van-card v-for="(item,index) in questionOutList" :key="index"
                          currency="R "
                          :num="item.qty"
                          :title="item.productnameen"
                          :price="item.pricezar"
                          :thumb="item.images">
                  <template #desc>
                    <div class="product-desc">{{item.model}}</div>
                  </template>
                  <template #origin-price>
                    <span v-if="item.priceoldzar > 0" class="discount-price">{{item.priceoldzar |moneyFormat }}</span>
                  </template>
                </van-card>
              </div>
            </div>
          </div>
          <div class="price-change-box" v-if="questionBlackList.length">
            <div class="change-title">
              <div class="title-name">Poor quality</div>
              <div class="title-intro">The following goods are Poor quality,<strong class="color_warning">do NOT buy it !</strong></div>
            </div>
            <div class="exchange-list">
              <div class="exchange-list-title">
                <van-card v-for="(item,index) in questionBlackList" :key="index"
                          currency="R "
                          :num="item.qty"
                          :title="item.productnameen"
                          :price="item.pricezar"
                          :thumb="item.images">
                  <template #desc>
                    <div class="product-desc">{{item.model}}</div>
                  </template>
                  <template #origin-price>
                    <span v-if="item.priceoldzar > 0" class="discount-price">{{item.priceoldzar |moneyFormat }}</span>
                  </template>
                </van-card>
              </div>
            </div>
          </div>
        </scroll-view>
        <div class="bottom-area">
          <van-checkbox v-model="allQuestionChoose" @change="buyQuestionAllHandle"
                        v-if="questionPriceList.length || questionProList.length">Buy All</van-checkbox>
          <van-button  class="continue-btn"
                      @click="questionContinueHandle"
          >Continue</van-button>
        </div>
      </div>
    </van-overlay>

  </section>
</template>

<script>
  import CommonDialog from '@/components/common/CommonDialog'
  import GoodItem from "../GoodItem";
  import OrderValuePopup from '@/components/content/OrderValuePopup'
  import  CouponPopup from '@/components/content/CouponPopup'
  import PayDialog from "../PayDialog";
  import ScrollView from "@/components/common/ScrollView";
  import StandardDialog from '../StandardDialog'
  import {
    cartToPayApi,
    cartToPayCancelApi,
    cartToPayCheckApi,
    cartUserBalanceApi,
    confirmPayApi
  } from '@/api/cart'
  import { cartCouponAvailableApi } from '@/api/cart'
  export default {
    name: "index",
    data(){
      return{
        cartTab:1,
        isLoading:false,
        shopOrderRadio:false,
        activeName:1,
        showPopupFlag:false,
        selectTab:'',
        allChooseFlag:false,
        isShowProduct:false,
        showPopover:false,
        coinFlag:true,//使用金币单选框
        payDialog:false,
        //基本信息
        shopTask:{},
        details:{},
        shopOrders:[],
        isCancelVisible:false,
        dialogValue:'',
        priceCostInfo:{},
        isAwaitVisible:false,
        //priceInfo
        showGoodVisible:true,
        chooseCoupon:{},//选择优惠卷
        balanceInfo:{},//积分详情
        couponlist:[],
        useCouponVisible:false,//是否使用优惠卷
        showInfoPop:false,
        avaliableList:[],//可用的优惠卷
        unAvaliableList:[],//不可以用的优惠卷
        isWaiting:false,
        showQuestionVisible:false,//显示有问题的数据
        questionInfo:{},
        questionPriceList:[],//价格变动
        questionBlackList:[],//
        questionOutList:[],//没有货
        questionProList:[],
        payflg:0,
        allQuestionChoose:false,
        payids:[],
        outids:[],
        blackids:[],
        qids:[],
        questionIDS:[],
        questionPayAmount:0
      }
    },
    computed:{
      scoinCount(){
        let ordermoney =parseInt(this.finialCount);//总和- 优惠卷的价格
        if(this.balanceInfo.scoin > ordermoney){
          //如果积分大于总金额
          return  {
            scoin:ordermoney,
            scoinmoney:ordermoney/100.0}
        }else{
          return  {
            scoin:parseInt(this.balanceInfo.scoin),
            scoinmoney:parseInt(this.balanceInfo.scoin)/100.0
          }
        }
      },
      qualityInspectionFeeCount(){
        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.qualityfee) + pre : pre
        },0)
      },
      orderValueCount(){
        return this.shopOrders.reduce((pre,cur)=>{

          let value = Number(cur.extrapricecost)?Number(cur.extrapricecost)+Number(cur.ordervalue):Number(cur.ordervalue);
          return cur.checked?value+pre:pre
        },0)
      },
      chineseFreightCount(){
        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.chinesefreight) + pre : pre
        },0)
      },
      groupBuyServiceCount(){
        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.groupservicefee) + pre : pre
        },0)
      },
      //大客户
      bigCoustomerServiceCount(){

        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.bigcustomerservicefee) + pre : pre
        },0)
      },
      removeShoeBoxFeeCount(){
        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.removeshoeboxfee) + pre : pre
        },0)
      },
      totalCount(){
        return this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.total) + pre : pre
        },0)
      },
      finialCount(){
        //选中的总和-优惠卷的价格
        let total =  this.shopOrders.reduce((pre,cur)=>{
          return cur.checked ? Number(cur.total) + pre : pre
        },0)
        if(this.chooseCoupon && this.chooseCoupon.money){
          total -=this.chooseCoupon.money;
        }
        return  total;
      },
      payAmount(){
        if(this.coinFlag){
          let value = this.finialCount - this.scoinCount.scoinmoney>0?this.finialCount - this.scoinCount.scoinmoney:0
          return value + this.groupBuyServiceCount + this.bigCoustomerServiceCount
        }else{
          return this.finialCount+ this.groupBuyServiceCount + this.bigCoustomerServiceCount
        }
      },
      payCount(){
        return this.shopOrders.filter(item=>item.checked).length || 0
      },
      //选中的id
      chooseIDList(){
        return this.shopOrders.filter(item=>item.checked).map(item=>item.id) || []
      }
    },
    watch:{
      totalCount(){
        this.cartCouponAvailableHandle()
      },
    },
    methods:{
      buyQuestionAllHandle(){
        if(this.questionPriceList.length){
          this.questionPriceList = this.questionPriceList.map(item=>{
            item.isChecked = this.allQuestionChoose
            return item;
          })
        }
        if(this.questionProList.length){
          this.questionProList = this.questionProList.map(item=>{
            item.isChecked = this.allQuestionChoose
            return item;
          })
        }
      },
      questionContinueHandle(){
        let priceIDS=[];
        let proIDS =[]
        if(this.questionPriceList.length){
          priceIDS = this.questionPriceList.filter(item=>item.isChecked).map(item=>item.id);
        }
        if(this.questionProList.length){
          proIDS = this.questionProList.filter(item=>item.isChecked).map(item=>item.id);
        }
        this.questionIDS = [...priceIDS,...proIDS,...this.payids];
        this.showQuestionVisible = false;
        this.isWaiting = true;
        confirmPayApi({
          ids:this.questionIDS.join(','),
          couponrecordid:this.chooseCoupon.id,
          userscoin:this.coinFlag?1:0,
          pay_scenario:1,//(0是cart,1是topay)
        }).then(res=>{
          this.$router.push('/shoporder/paysuccess');
          this.isWaiting = false;
        })
      },
      goIndexHandle(){
        this.$EventBus.$emit('toIndex')
        this.$router.replace('/')
      },
      showInfoHanlde() {
        this.showInfoPop = true;
      },
      changeTabHandle(){
        this.$emit('goCarEmit')
      },
      showWaitingHandle(item){
        this.shopOrders =this.shopOrders.map(order => {
          if (order.id === item.id) {
            item.isShow = !item.isShow;
          }
          return order;
        })
      },
      //确定支付
      confirmPayHandle(){
        this.payDialog =false;
        this.isWaiting = true;
        cartToPayCheckApi(this.chooseIDList.join(',')).then(res=>{
          if(res.status==0){
            if(res.data.torisk ===0){
              confirmPayApi({
                ids:this.chooseIDList.join(','),
                couponrecordid:this.chooseCoupon.id,
                userscoin:this.coinFlag?1:0,
                pay_scenario:1,//(0是cart,1是topay)
              }).then(res=>{
                this.$router.push('/shoporder/paysuccess');
                this.isWaiting = false;
              })
            }else{
              this.questionHandle(res.data)
              this.isWaiting = false;
            }
          }
        })
      },
      questionHandle(data){
        this.showQuestionVisible = true;
        const { blackids,payids,qids,blacklist,outlist,prolist,pricelist,outids,payflg} = data;
        if(pricelist){
          this.questionPriceList = pricelist.map(item=>{item.isChecked = false;return item})
        }
        if(prolist){
          this.questionProList =prolist.map(item=>{item.isChecked = false;return item})
        }
        this.questionOutList = outlist || [];
        this.questionBlackList =blacklist || [];
        this.payids = payids?payids.split(','):[];
        this.outids =outids?outids.split(','):[];
        this.blackids = blackids?blackids.split(','):[];
        this.qids = qids?qids.split(','):[];
        this.payflg =payflg;
      },
      //获取优惠卷列表
      cartCouponAvailableHandle(){
        this.avaliableList =[];
        this.unAvaliableList =[];
        this.chooseCoupon ={id:0,money:0}
        cartCouponAvailableApi({
          cost:this.totalCount,
          type:this.$config.couponType.PURCHASE
        }).then(res=>{
          if(res.data.couponlist && res.data.couponlist.length){
            this.avaliableList = res.data.couponlist.filter(item=>item.available==1);
            this.unAvaliableList = res.data.couponlist.filter(item=>item.available!= 1);
            if(this.avaliableList.length){
              this.chooseCoupon ={
                id:this.avaliableList[0].id,
                money:this.avaliableList[0].money
              }
            }

          }else{
            this.chooseCoupon ={id:0, money:0}
            this.avaliableList = [];
            this.unAvaliableList = [];
          }
        })
      },
      chooseAllHandle(){
        this.shopOrders =  this.shopOrders.map(item=>{
          item.checked = this.allChooseFlag;
          return item;
        })
      },
      //显示商品列表
      showGoodsHandle(){
        this.showGoodVisible = !this.showGoodVisible;
      },
      //充值页面
      goRechargeHandle(){
        this.$EventBus.$emit('toRecharge','toPay')
        this.$router.replace('/user/recharge')
      },
     /*
     *  //支付成功
      paySuccessHandle(){
        this.isCancelVisible = false;
        this.$router.push('/shoporder/paysuccess')
      },
     * */
      //确定取消
      confirmCancelHandle(){
        cartToPayCancelApi(this.chooseIDList.join(',')).then(res=>{
          if(res.status==0){
            this.$toast({message:'Cancel Success'})
            this.getBaseInfo();
            this.cartUserBalanceHandle()
          }
          this.isCancelVisible = false;
        })
      },
      //获取优惠卷
      chooseCouponHandle(item){
        this.useCouponVisible = false;
        this.chooseCoupon = item?item:{};

      },
      cancelHandle(){
        if(this.chooseIDList.length==0){
          this.isCancelVisible = true;
          this.dialogValue = 'selectOne'
        }else{
          this.isCancelVisible = true;
          this.dialogValue ='cancel'
        }
      },
      hidePopHandle(){
        this.isCancelVisible = false;
      },
      showPayDialog(){
        if(this.chooseIDList.length==0){
          this.isCancelVisible = true;
          this.dialogValue = 'selectOne'
        }else{
          if(this.finialCount > this.balanceInfo.balance){
            //积分不足
            this.isCancelVisible = true;
            this.dialogValue ='recharge'
          }else{
            this.payDialog = true;
          }
        }

      },
      showPopupHandle(type){
        if(type==='coupons'){
          this.useCouponVisible = true;
        }else{
          this.showPopupFlag = true;
          this.selectTab = type;
          let chooseList = this.shopOrders.filter(item=>item.checked)
          let productvalue=chooseList.reduce((pre,cur)=>{return Number(cur.productvalue) + Number(pre)},0);
          let exchangelose=chooseList.reduce((pre,cur)=>{return Number(cur.exchangelose) + Number(pre)},0);
          let operationfee=chooseList.reduce((pre,cur)=>{return Number(cur.operationfee) + Number(pre)},0);//
          let extrapricecost=chooseList.reduce((pre,cur)=>{return Number(cur.extrapricecost)+Number(pre)},0)
          let clearanceservicefee = chooseList.reduce((pre,cur)=>{return Number(cur.clearanceservicefee) + Number(pre)},0);//
          this.priceCostInfo = {productvalue,exchangelose,operationfee,clearanceservicefee,extrapricecost}
        }

      },
      //显示商品列表
      showPorductListHandle(){
        this.isShowProduct = !this.isShowProduct
      },
      //显示基本信息
      getBaseInfo(){
        this.isLoading = true;
        this.shopOrders =[];
        this.shopTask = null;
        this.details=[];
        cartToPayApi().then(res=>{
          const {shoptask ,shoporders,details} = res;
          this.shopTask = shoptask;//用于总价值
          this.details = details;
          this.shopOrders =shoporders.map(item=>{
            item.checked = false;
            item.isShow = false;//显示状态说明
            return item;
          })
          setTimeout(()=>{
            this.isLoading = false;
          },this.$config.duringWait)
        }).catch(err=>{
          setTimeout(()=>{
            this.isLoading = false;
          },this.$config.duringWait)
        })
      },
      //获取积分信息
      cartUserBalanceHandle(){
        cartUserBalanceApi().then(res=>{
          if(res){
            this.balanceInfo = {
              balance:Number(res.balance) + Number(res.creditline),
              scoin:res.scoin
            };
          }
        })

      }
    },
    components:{GoodItem ,OrderValuePopup,CouponPopup ,PayDialog ,ScrollView ,CommonDialog,StandardDialog},
    mounted() {
      this.getBaseInfo();
      this.cartUserBalanceHandle()
    }
  }
</script>

<style scoped lang="less">
  .question_list_wrapper{
    background-color: #fff;
    position:absolute;
    top:20px;
    bottom:20px;
    right:20px;
    border-radius: 8px;
    left:20px;
    padding:10px ;
    .questionView{
      height:81vh;
      background-color: #EEEEED;
    }
    .bottom-area{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      bottom:0;
      left:0;
      right:0;
      height:48px;
      line-height: 48px;
      padding:0 10px;
      background-color: #fff;
      .continue-btn{
        font-size:16px;
        background-color: #fcc900;
        padding:0 20px;
        border-radius: 4px;
      }
    }
    .question_title{
      padding:4px 0 8px;
      font-size:15px;
      border-bottom:1px solid #EEEEED;
    }
    .change-title{
      background: #fff;
      padding: 10px;
      border-bottom:1px solid #EEEEED;
      .title-name{
        font-weight: bold;
        font-size:16px;
        margin-bottom: 4px;
      }
      .title-intro{
        font-size:15px;
        color:gray;

      }
    }
    .exchange-list{
      background-color: #fff;
      .exchange-list-title{
        padding:12px 10px;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/.van-dialog__header{
    padding-top: 10px;
  }
  .stard-pop {
    //弹出框
    /deep/.van-dialog__header{
      padding-top: 10px;
      padding-bottom: 10px;
      box-shadow: 10px 0 10px lightgrey;
    }
    /deep/ .van-dialog__footer {
      display: block;
    }

    /deep/ .van-dialog__footer {
      height: 40px;
      padding: 10px 0;
    }

    /deep/ .van-button__content {
      justify-content: flex-end;
    }

    /deep/ .van-button__text {
      border: 1px solid #eeeeed;
      display: block;
      padding: 2px 20px;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
  .scrollHeight {
    height: 60vh;
  }
  .order-intro{
    color:gray;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding:6px 20px 2px;
    text-align: right;
  }
  .g_ml_s{
    margin-left: 4px;
  }
  .s3-cart-navbar{
    background-color: #fff;
    height:46px;
    line-height:46px;
    padding:0 20px;
    box-shadow: 4px 0 4px #EEEEED;
    .cart-navbar-title{
      flex:5;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-weight: 500;
      font-size:16px;
      .Cart_title{

      }
      .toPag-title{
        span{
          padding:4px ;
          border-bottom:3px solid #fcc900;
        }
        position:relative;
        /*padding:0 8px;*/
        .toPay{
          right: -4px;
          position: absolute;
          background: red;
          top: 13px;
          width: 8px;
          height:8px;
          border-radius: 50%;
        }


      }
    }
    .cart-navbar-delete{
      flex:1;

      span{
        font-size:18px;
      }
    }
  }
  .shopping-btn {
    color: #2A2A2A;
    background-color: #FCC900;
    font-size: 16px;
    font-weight: bold;
  }
  .pop-title{
    font-size:13px;
    color:#2A2A2A;
    line-height:1.2;
    background:#FFE4C4	;
    padding:4px 8px;
  }
  /deep/.van-card__price{
    font-weight: bold;

  }
  .scrollViewHeight {
    height: calc(100vh - 46PX - 100PX);
    padding-bottom:50px;
    background-color: #EEEEED;
  }
  /deep/.van-dialog__footer{
    display: none;
  }
  .product-count{
    font-size:14px;
    color:#2A2A2A;
  }

  .pay-dialog-title{
    padding: 0 10px 5px;
  }
  .toPay-btn{
    border-top:1px solid #EEEEED;
    position:fixed;
    bottom:46PX;
    left:0;
    height:50px;
    line-height:50px;
    right:0;
    background-color: #fff;
    font-size:15px;
    //div:first-child{
    //  padding-left:10px;
    //}
    .cancel-btn{
      background: #ed5565;
      color:#fff;
      text-align: center;
    }
    .pay-btn{
      background: #FCC900;
      text-align: center;
    }
  }
  .toPay-item-content{
    background-color: #fff;
    padding:10px 10px 40px;
    .toPay-item-title{
      font-size:15px;
      padding:3px 0;
      font-weight: 500;
    }
  }
  .cart-product-list{
    border-top:1px solid #EEEEED;
    padding:10px 0;
    .product-title{
      padding:0 10px;
      position:relative;
    }
    .shopify-img{
      width:20PX;
      height:20PX;
      max-width: 100%;
    }
    .title-intro{
      font-size:13px;
      display: flex;
      align-items: center;
      color:gray;
      vertical-align: middle;
    }
  }
  .intro-content{
    background: #23527c;
    color:#fff;
    font-size:12px;
    border-radius: 10px;
    padding:4px 6px;
    position:absolute;
    z-index:10;
    right:10px;
    bottom:-25px;
  }
  .intro-content:after{
    content:'';position:absolute;
    bottom:100%;right:8px;
    width:0;height:0;
    border-width:8px;
    border-style:solid;
    border-color:transparent;
    border-bottom-width:8px;
    border-bottom-color:#23527c;
    color:#dddddd;}
  .toPay-product-list{
    border-top:1px solid #eeeeed;
    padding:10px;
    .toPay-title-intro{
      font-size:12px;
      .toPay-title-intro-left{
        font-size:14px;

      }
    }
    /deep/ .van-popover__content{
      font-size:12px !important;
      padding:3px ;
    }
  }
  .toPay-price{
    margin-right:-10px;
    .toPay-price-title{
      font-size:16px;
      font-weight: 500;
      margin:10px 0 10px 10px;
      padding:2px 0 2px 20px;
      border-left:1px solid #FCC900;
    }
    .toPay_detail_info{
      display: flex;
      flex-wrap: wrap;
      margin:10px 0 10px 10px;
      padding:2px 0 2px 20px;
      .toPay_info_item{
        width:50%;
      }

    }
    .toPay-info{
      margin:10px 0 10px 10px;
      padding:2px 0 2px 20px;
      .toPay-info-order{
        font-size:13px;
        .toPay-info-order-right{
          padding-right: 10px;
        }
      }
    }
    .toPay-coupon{

      margin:4px 10px ;
      /deep/.van-cell{
        background:#FFF8DB;
        color:red;
      }

    }
    .topay-scoin{
      margin:4px 10px ;
      color:red;
      padding:10px;
      background-color: #FFF8DB;
    }
  }
</style>
