<template>
 <div class="order-ship-wrapper">
<!-- 头部开始  -->
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title><div class="navbar-title">Ship</div></template>
     </van-nav-bar>
   </van-sticky>
<!--   头部结束-->

   <scroll-view class="orderShipScroll">
     <template v-if="isRemoved">
        <div class="remove_content d_flex d_flex_center">
          <div class="remove-box"><img src="~assets/images/common/error-cart.png" alt=""></div>

          <div class="remove-intro">The product have been removed or expired</div>
          <div  class="color_active look_link" @click="findHandle">Looking for other products</div>
        </div>
     </template>
    <template v-else>
      <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
      <template v-else>
        <div class="order-ship-content">
          <order-ship-address :receiverid="Number(receiverid)" :country="country" :receiver="receiver" :isShow="voInfo.serviceSize ==0"/>
          <!--          transport start-->
          <div class="order-ship-transport-box order-ship-box" >
            <van-radio-group v-model="viaRadio">
              <div v-for="(value, supplyKey, index) in supplierModeVos " :key="index" class="order-ship-choose-area ">
                <van-notice-bar :scrollable="false" color="orange" v-if="supplychainMap && supplychainMap[supplyKey]"
                                background="#fff" :text="`Transport via ${supplychainMap[supplyKey].name}`"/>
                <div class="order-ship-via-item g_mb_m" v-for="(item,index1) in value" :key="`${index1}-supplierModeVos-${index1}`">
                  <van-row>
                    <van-col span="24">
                      <div class="via-title d_flex">
                        <strong>{{item.name}}</strong>
                        <van-icon name="question-o" @click="deliveryWayHandle(item)" color="#D3D3D3" size="17" class="g_ml_m"/>
                      </div>
                    </van-col>
                  </van-row>
                  <van-row type="flex" align="center">
                    <van-col span="22">
                      <div class="via-item-left">
                        <div class="via-intro">
                          {{item.days}}
                        </div>
                        <div class="via-address" v-if="item.address">
                          Address: {{item.address}}
                        </div>
                        <div class="via-money">
                          <template v-if="item.exists<2">
                            {{item.exists==1?'About':''}} R {{item.fcost }}
                          </template>
                          <template v-if="item.exists==2">
                            Choose to get the quote
                          </template>
                        </div>
                      </div>
                    </van-col>
                    <van-col span="2">
                      <van-radio :disabled="item.disable==1" :name="item.servicepriceid" />
                    </van-col>
                  </van-row>
                </div>
              </div>
              <div class="order-ship-choose-area g_mt_m" v-if="voInfo.showBuffalo">
                <van-notice-bar :scrollable="false" color="#2A2A2A" background="#fff" text="Transport via BUFFALO"/>
                <div class="order-ship-via-item g_mt_m" v-for="(item,index2) in voInfo.modeVos" :key="`${index2}-modeVos${index2}`">
                  <van-row>
                    <van-col span="24">
                      <div class="via-title d_flex">
                        <strong>{{item.name}}</strong>
                        <span class="color_intro">&nbsp;({{item.deliveryway}})</span>
                        <van-icon name="question-o" @click="deliveryWayHandle(item)" color="#D3D3D3" size="17" class="g_ml_m"/>
                      </div>
                    </van-col>
                  </van-row>
                  <van-row type="flex" align="center">
                    <van-col span="22">
                      <div class="via-item-left">
                        <div class="via-intro">
                          {{item.days}}
                        </div>
                        <div class="via-address" v-if="item.address">
                          Address: {{item.address}}
                        </div>
                        <div class="via-money">R{{item.fcost }}</div>
                      </div>
                    </van-col>
                    <van-col span="2">
                      <van-radio :disabled="item.disable==1" :name="item.servicepriceid" />
                    </van-col>
                  </van-row>
                </div>
                <div class="order-ship-via-item g_mt_m" v-for="(item,index3) in voInfo.oceanModeVos" :key="`${index3}-oceanModeVos${index3}`">
                  <van-row>
                    <van-col span="24">
                      <div class="via-title d_flex">
                        Sea Shipping ({{item.deliveryway }})
                      </div>
                    </van-col>
                  </van-row>
                  <van-row type="flex" align="center">
                    <van-col span="22">
                      <div class="via-item-left">

                        <div class="via-intro">
                          {{item.days}}
                        </div>
                        <div class="via-address" v-if="item.address">
                          Address:{{item.address}}
                        </div>
                        <div class="via-money">R {{item.fcost}}</div>
                      </div>
                    </van-col>
                    <van-col span="2">
                      <van-radio :disabled="item.disable==1" :name="item.servicepriceid" />
                    </van-col>
                  </van-row>
                </div>
              </div>
            </van-radio-group>
          </div>
          <!--          transport end-->
          <!--        商品信息 start-->
          <div class="order-ship-good-info ">
            <div v-for="(product,index) in shoporders" :key="product.id">
              <van-notice-bar class="b_border"
                              @click="showDetailListHandle(product.id)"
                              :scrollable="false" color="#2A2A2A" background="#fff" >
                <template #right-icon>
                  <van-icon :name="product.isOpen?'arrow-up':'arrow-down'" />
                </template>
                <div class="navbar-good-info font_size_14">
                  <span class="g_mr-s color_orange">No.{{index+1}}</span>
                  <span class="g_mr_l">{{product.waybillno }}</span>
                  <span class="g_mr_l">{{product.weight }}Kg</span>
                  <span v-if="product.length + product.width + product.height >0">{{product.length }}CM*{{product.width}}CM*{{product.height}}CM</span>
                </div>
              </van-notice-bar>
              <div v-if="product.isOpen">
                <product-ship-card   v-for="(detail,detailIndex) in details[product.id]"
                                     :key="detailIndex"
                                     :product="detail"
                                     :order="product">
                  <div slot="thumb">
                    <template v-if="detail.images">
                      <img :src="detail.images.split(',')[0]" alt="" >
                    </template>
                    <template v-if="product.urlcomfrom != 2">
                      <img alt="image" class="img-lg" :src="detail.images.split(',')[0].replace('.jpg','.460x460xz.jpg')">
                    </template>
                    <template v-else>
                      <img  :src="orderImg" alt="">
                    </template>
                  </div>
                  <strong slot="origin" class="product-price" v-if="detail.priceold >0 && product.status==10">
                    <del class="del-price">R{{detail.productoldcostzar}}</del>
                  </strong>
                  <div slot="count">X{{detail.qty}}</div>
                </product-ship-card>
                <div class="d_flex d_flex_end product-bottom">
                  <span class="color_normal">Shipping Cost : </span><span class="product-bottom-count">R{{shippingCostInfo[product.id] || 0}}</span>  <span class="color_normal">of</span> <span class="product-bottom-count">{{totalCount | moneyFormat}}</span>
                </div>
              </div>


            </div>

          </div>
          <!--        商品信息 end-->

          <!--        weight 开始-->
          <div class="order-ship-volume-box order-ship-box-common">
            <div class="order-ship-title">
              {{volumeFlag?'Volume':'Weight'}}
            </div>
            <div class="volume-content">
              <div v-if="volumeFlag">
                <van-notice-bar  background="#fff" class="volume-item_1">
                  <div class="color_intro">Actual Volume</div>
                  <template #right-icon>
                    <div class=" color_intro">{{volumeInfo.avolume}}m³</div>
                  </template>
                </van-notice-bar>
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class=" d_flex" @click="popupHandle('volume')">Chargeable Volume  <van-icon name="question-o" color="#D3D3D3" size="17" class="g_ml_s"/></div>
                  <template #right-icon>
                    <div class=" ">{{volumeInfo.fvolume}}m³</div>
                  </template>
                </van-notice-bar>
              </div>
              <div v-else>
                <van-notice-bar  background="#fff" class="volume-item_1">
                  <div class="color_intro">Actual Weight</div>
                  <template #right-icon>
                    <div class=" color_intro">{{volumeInfo.aweight}}Kg</div>
                  </template>
                </van-notice-bar>
                <van-notice-bar  background="#fff" class="volume-item_1">
                  <div class="color_intro">Weight by Volume</div>
                  <template #right-icon>
                    <div class=" color_intro">{{volumeInfo.vweight}}Kg</div>
                  </template>
                </van-notice-bar>
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class=" d_flex">Chargeable Weight</div>
                  <template #right-icon>
                    <div class=" ">{{volumeInfo.fweight}}Kg</div>
                  </template>
                </van-notice-bar>
              </div>
              <van-notice-bar  color="#F00" class="g_mb_m"  @click="showPopupHandle">
                <div class="volume-item-left  d_flex">Coupons</div>
                <template #right-icon>
                  <div class="volume-item-right d_flex ">- R{{chooseCoupon.money}} <van-icon name="arrow" color="#f00"/></div>
                </template>
              </van-notice-bar>
              <van-notice-bar  color="#F00" :scrollable="false" >
                <div class="volume-item-left  d_flex">
                  <van-checkbox v-model="useCoinFlag" icon-size="16" >
                    <span class="color_warning">Use {{useCoinInfo.useCoin}} S Coins</span>
                  </van-checkbox>
                </div>
                <template #right-icon>
                  <div class="volume-item-right ">- R{{useCoinInfo.useMoney}}</div>
                </template>
              </van-notice-bar>
            </div>
          </div>
          <!--        volume end-->
          <!--        price start-->
          <div class="order-ship-volume-box order-ship-box-common">
            <div class="order-ship-title">
              Price Calculation
            </div>
            <div class="volume-content">
              <template v-if="viaRadio >=10 && viaRadio <=20">
                <!--              海运-->
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class=" d_flex" @click="popupHandle('volume')">Ocean Freight Fee <van-icon name="question-o" color="#D3D3D3" size="17" class="g_ml_s"/></div>
                  <template #right-icon>
                    <strong>R{{shippingCostJson.cost || 0}}</strong>
                    <del class="price-del color_intro g_ml_s" v-if="shippingCostJson.oldcost>0">R{{shippingCostJson.oldcost || 0}}</del>
                  </template>
                </van-notice-bar>
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class=" d_flex">Delivery Fee in South Africa</div>
                  <template #right-icon>
                    <strong >R{{shippingCostJson.deliverycost || 0}}</strong>
                  </template>
                </van-notice-bar>
              </template>
              <template v-else-if="viaRadio==-1">
                <!--              团运-->
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class="color_intro d_flex" >Shipping Fee</div>
                  <template #right-icon>
                    <strong>{{Number(shippingCostJson.cost?shippingCostJson.cost:0) + Number(shippingCostJson.deliverycost?shippingCostJson.deliverycost:0) | moneyFormat}}</strong>
                  </template>
                </van-notice-bar>
              </template>
              <template v-else>
                <!--              空运-->
                <van-notice-bar  background="#fff" color="#2A2A2A">
                  <div class=" d_flex">Freight Charge</div>
                  <template #right-icon>
                    <strong>R{{shippingCostJson.cost || shippingCostJson.fcost || 0}}</strong>
                  </template>
                </van-notice-bar>

              </template>
              <van-notice-bar  background="#fff" color="#2A2A2A" v-if="shippingCostJson.servicefee>0">
                <div class="= d_flex">Service Fee</div>
                <template #right-icon>
                  <strong>R{{shippingCostJson.servicefee}}</strong>
                </template>
              </van-notice-bar>
              <van-notice-bar  background="#fff" color="#2A2A2A" v-if="shippingCostJson.remoteareacost>0">
                <div class=" d_flex">Remote area charges</div>
                <template #right-icon>
                  <strong>R{{shippingCostJson.remoteareacost}}</strong>
                </template>
              </van-notice-bar>
              <van-notice-bar  background="#fff" color="#2A2A2A" v-if="shippingCostJson.tax">
                <div class=" d_flex">Taxes paid</div>
                <template #right-icon>
                  <strong>{{shippingCostJson.tax<0?'-':''}}R{{shippingCostJson.tax<0?-(shippingCostJson.tax):shippingCostJson.tax}}</strong>
                </template>
              </van-notice-bar>
            </div>
          </div>
          <!--        price end-->
        </div>
        <!--   定位-->
        <div class="pay-box">
          <template v-if="voInfo.serviceSize >0">
            <div class="pay-total"><span class="color_intro">Total :</span> <strong>{{totalCount | moneyFormat}}</strong></div>
            <div class="pay-btn-area">
              <van-button class="pay-btn"
                          :disabled="tipsInfo.cannotpay==1"
                          @click="payHandle"
              >Pay</van-button>
            </div>
          </template>
          <template v-else>
            <van-button block class="unable-pay-btn" disabled>Unable to Pay</van-button>
          </template>
        </div>
      </template>
    </template>
   </scroll-view>

   <!--    优惠劵-->
   <van-action-sheet v-model="useCouponVisible" title="Select Coupons">
     <coupon-popup
       :isChoose="true"
       :avaliable-list="couponmap1"
       :un-avaliable-list="couponmap0"
       @chooseCouponEmit="chooseCouponHandle"/>
   </van-action-sheet>
<!--   弹出框-->
   <van-dialog v-model="isVisible"  :show-cancel-button="false" :show-confirm-button="false">
     <calculate-popup :kgCount="Number(kgCount)" v-if="selectType == 'deliveryWay'" @closeEmit="isVisible = false"/>
     <volume-popup @closeEmit="isVisible = false" v-else-if="selectType=='volume'" :seasys="seasys"/>
   </van-dialog>
<!--   支付弹出框-->
   <van-dialog v-model="commonDialogVisible" :show-cancel-button="false" :show-confirm-button="false">
     <common-dialog type="error" v-if="dialogType=='noPay'"
                    cancelText="Close"
                    confirmText="Recharge"
                    confirmBg="#fcc900"
                    confirmBorder="#fcc900"
                    @cancelEmit="commonDialogVisible = false"
                    @confirmEmit="goRechargeHandle"
                    :hasTwoBtn="true"
                    title="Your balance is not enough"
                    :intro="`<strong class='color_warning'>Balance : R ${balanceInfo.balance } </strong>`"/>
    <order-ship-attention v-else-if="dialogType=='attention'" @operateEmit="operateHandle" :tipTitle="tipsInfo.tips"/>
   </van-dialog>
   <!--    确认支付弹出框start-->
   <van-dialog v-model="payDialogVisible"  :show-cancel-button="false" :show-confirm-button="false">
     <template #title>
       <div class="pay-dialog-title d_flex_between d_flex b_border">
         <div class="pay-dialog-title font_w">Total : {{totalCount| moneyFormat}}</div>
         <div class="pay-dialog-close" @click="payDialogVisible = false ">
           <van-icon name="cross" size="24" color="#ccc"/></div>
       </div>
     </template>
     <pay-dialog :balanceInfo="balanceInfo"
                 @confirmPayEmit="confirmPayHandle"
                 :total="totalCount"/>
   </van-dialog>
   <van-overlay :show="isWaiting" >
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="45" />
     </div>
   </van-overlay>
<!--   <div class="tips-box" v-if="!isRemoved && tipsInfo.tips" @click="tipsShowHandle">Tips</div>-->
   <drag title="Tips" bgColor="orangered" v-if="!isRemoved && tipsInfo.tips" @operateEmit="tipsShowHandle"></drag>
<!--   商品品名-->
   <van-dialog v-model="showDecleareVisible" width="95%" title="Decleared Product Name" :show-cancel-button="false" :show-confirm-button="false">
     <decleare-product-name @confirmEditEmit="declearProductConfirmHandle" :declarednamemaplist="declarednamemaplist"/>
   </van-dialog>
 </div>
</template>

<script>
  // import Drag from '@/components/common/Drag'
  import OrderImg from '@/assets/images/orders/order_img.jpg';
import {decimalFun} from '@/utils';
import ScrollView from "@/components/common/ScrollView";
import GoodCard from '@/components/content/GoodCard';
import CouponPopup from '@/components/content/CouponPopup'
import CalculatePopup from '@/components/content/CalculatePopup'
import {deliveryOrderInfoApi ,deliveryorderSaveApi} from '@/api/orders'
import PayDialog from "@/components/content/PayDialog";
import DecleareProductName from "./DecleareProductName";
import { getOrderShipAddressID ,removeOrderShipAddressID} from '@/utils/memory'
import CommonDialog from '@/components/common/CommonDialog'
import ProductShipCard from '../childComponents/ProductShipCard'
import VolumePopup from '../childComponents/VolumePopup'
  import OrderShipAttention from "./OrderShipAttention";
import {accountBasicInfoApi} from '@/api/account'
  import {cartUserBalanceApi,} from '@/api/cart'
  import OrderShipAddress from "./OrderShipAddress";

 export default {
   head(){
     return {
       title:'Orders Ship - shopshipshake'
     }
   },
    data(){
      return{
        isLoading:false,
        isWaiting:false,
        viaRadio:'',
        useCoinFlag:true,
        avaliableList:[],
        unAvaliableList:[],
        cost:0,
        useCouponVisible:false,
        isVisible:false,
        selectType:'',
        shipInfo:{},//页面基本信息
        details:[],//商品列表
        country:{},//城市
        receiver:{},//收件人
        voInfo:{},
        receiverid:'',//收件人ID
        shoporders:[],//要显示的商品
        OrderImg,
        shippingCostInfo:{},
        shippingCostJson:{},
        volumeFlag:false,//是否显示volume
        volumeInfo:{},
        seasys:{},//弹出框内容
        remotefee:'',
        tax:'',
        couponmap1:[],//有效的
        couponmap0:[],//无效效的
        allCoupon1:[],//全部有效的
        allCoupon0:[],//全部无效的
        chooseCoupon:{
          money:0,
          id:0,
        },//选中的优惠卷
        useCoinInfo:{
          useMoney:0,
          useCoin:0
        },//积分详情
        payDialogVisible:false,
        commonDialogVisible:false,//金额不足，attention弹框
        dialogType:'',
        balanceInfo:{balance:0},
        scoin:0,//积分
        supplierModeVos:[],
        supplychainMap:{},
        totalMapList:[],
        kgCount:8000,
        isRemoved:false,
        tipsInfo:{},
        tipValue:{},
        userType:'',
        showDecleareVisible:false,//显示商品品名
        declarednamemaplist:[],
        declearProductName:{}
      }
    },
    computed:{
      //获取总金额
      totalCount(){
        if(this.shippingCostJson.fcost){
          let value = Number(this.shippingCostJson.fcost) - Number(this.chooseCoupon.money || 0);
          let newValue = this.useCoinFlag ? value - Number(this.useCoinInfo.useMoney):value;
          let finalValue = newValue >0?newValue:0
          if(this.volumeInfo.serviceFee){

            return finalValue + Number(this.volumeInfo.serviceFee)
          }else{
            return finalValue;
          }

        }
      },
      totalCountNoScoin(){
        if(this.shippingCostJson.fcost){
          let value = Number(this.shippingCostJson.fcost) - Number(this.chooseCoupon.money || 0);
          return value>0?value:0;
        }
      }
    },
   watch:{
     viaRadio(value){
       this.getShippingCost(value);//显示PriceCalucation内容
       this.getCouponInfo(value);//显示优惠卷
       this.getScoinInfo(this.totalCountNoScoin);//显示积分
       this.getTipsHandle(value)
     },

   },
   components:{DecleareProductName,OrderShipAttention,OrderShipAddress,ScrollView ,GoodCard ,CouponPopup ,CalculatePopup ,ProductShipCard ,VolumePopup ,CommonDialog ,PayDialog},
    methods:{
      //确认品名
      declearProductConfirmHandle(event){
        this.declearProductName = event;
        this.showDecleareVisible = false;
        this.payDialogVisible= true;
      },
      getTipsHandle(value){
        this.tipsInfo =  this.tipValue[value]?this.tipValue[value]:{};
        if(this.tipsInfo.tips){
          this.commonDialogVisible= true;
          this.dialogType='attention';
        }
      },
      tipsShowHandle(){
        this.commonDialogVisible = true;
        this.dialogType='attention';
      },
      operateHandle(type){
        switch (type) {
            case 'know':
              this.commonDialogVisible = false;
              break
            case 'contact':
              window.location.href ="https://api.whatsapp.com/send?phone="+ this.tipsInfo.bussinesswhatsapp+"&text=&source=&data=";
              break;
        }
      },
      findHandle(){
        this.$router.replace('/')
      },
      //确定支付
      confirmPayHandle(){
        this.payDialogVisible = false;
        this.isWaiting = true;
        this.shippingCostJson={
            ...this.shippingCostJson,

          ...{
              ordertype:0,
            couponrecordid:this.chooseCoupon.id>0?this.chooseCoupon.id:'',
            receivedid:this.receiverid,
            ids:this.$route.query.ids,
            scoin:this.useCoinFlag?1:0,
            bigcustomerdeclarednamemap :this.declearProductName
          }
        }
        deliveryorderSaveApi(this.shippingCostJson).then(res=>{
          if(res.status==0){
            this.$router.replace('/shoporder/2/index')
            removeOrderShipAddressID();
            this.isWaiting = false;
          }else{
            this.isWaiting = false;
            this.$toast({message:res.message})
          }
        })
      },
      //获取页面信息
      deliveryOrderInfoHandle(){
        deliveryOrderInfoApi({
          receiverid:this.receiverid,
          ids:this.$route.query.ids
        }).then(res=>{
          if(res!=null){
            const { details ,country ,receiver,vo ,shoporders  ,seasys,coupons1,coupons0,declarednamemaplist} = res;
            this.shoporders = shoporders.map(item=>{
              item.isOpen =false;
              return item;
            });
            this.declarednamemaplist = !declarednamemaplist ?[] :declarednamemaplist;

            this.country = country;//城市
            this.shipInfo = res;
            this.voInfo = vo || {};
            this.receiver = receiver || {};
            this.details = details || {};
            this.seasys = JSON.parse(seasys);
            this.allCoupon1 = coupons1 || [];
            this.allCoupon0 = coupons0 || [];
            this.supplierModeVos = vo.supplierModeVos || {};
            this.supplychainMap = vo.supplychainMap || {};
            this.tipValue = vo.tips || {}
            this.getChooseMapList(this.voInfo,this.supplierModeVos);
          }else{
            this.isRemoved= true;
          }
          this.isLoading = false;


        })
      },
      //获取全部选择列表
      getChooseMapList(voInfo,supplierModeVos){
        let value = [...voInfo.modeVos,...voInfo.oceanModeVos];
        this.totalMapList = [...this.totalMapList,...value];
        for(let key in supplierModeVos){
          this.totalMapList = [...supplierModeVos[key],...this.totalMapList]
        }
        //那个有数据，就赋值;
        this.viaRadio =this.totalMapList.find(item=>item.disable==0).servicepriceid;
      },
      //支付
      payHandle(){
          if(Number(this.balanceInfo.balance) < this.totalCount){
            //金额不足
            this.commonDialogVisible = true;
            this.dialogType ='noPay'
          }else{
             //如果是大客户，显示大客户商品品名
              if(this.userType==this.$config.orderUserType.BIGCUSTOMER){
                if(this.declarednamemaplist && this.declarednamemaplist.length>0){
                    this.showDecleareVisible = true;
                }else{
                  this.payDialogVisible = true;
                }
              }else{
                this.payDialogVisible = true;
              }
          }

      },
      //去recharge页面
      goRechargeHandle(){
        this.$EventBus.$emit('toRecharge','checkout')
        this.$router.replace('/user/recharge');
        removeOrderShipAddressID();
      },
      //获取积分
      getScoinInfo(totalCost){
        let value ={};
        if(totalCost > Number(this.scoin)){
          value={
            useCoin:parseInt(this.scoin) || 0,
            useMoney:decimalFun(this.scoin/100)
          }
        }else{
          //如果积分大于总金额，使用总金额
          value={
            useCoin:parseInt(totalCost) || 0,
            useMoney:decimalFun(totalCost/100)
          }
        }
        this.useCoinInfo = value;
      },
      //获取优惠卷
      getCouponInfo(viaRadio){
          if(!viaRadio) return;
          this.couponmap1 = this.allCoupon1.filter(item=>item.servicepriceid==viaRadio);
          this.couponmap0 = this.allCoupon0.filter(item=>item.servicepriceid==viaRadio);
          if(this.couponmap1 && this.couponmap1.length){
            this.chooseCoupon = {
              id:this.couponmap1[0].id,
              money:this.couponmap1[0].money
            }
          }else{
            this.chooseCoupon = {
              id:-1,
              money:0
            }
          }

      },
      //获取shippingCost
      getShippingCost(viaRadio){
         if(!viaRadio) return;
        var json =null;
         json = this.totalMapList.find(item=>item.servicepriceid == viaRadio);
         this.shippingCostJson = json;//选中和viaRadio相同的对象
        this.shippingCostInfo = json.shopordercost;
          this.remotefee = json.remoteareacost || 0;
          this.tax = json.tax || 0;
          this.weightOrVolumeHandle(json);

      },
      //判断显示weight还是volume
      weightOrVolumeHandle(json){
        if((this.viaRadio >=10 && this.viaRadio <20) || this.viaRadio==-1){
           //海运
           this.volumeFlag = true;//显示volume
           this.volumeInfo ={
             avolume:json.volumestr,
             fvolume:json.finalvolumestr,
             ofcharge:json.cost,
             dfcharge:json.deliverycost,
             oofcharge:json.oldcost?json.oldcost:'',
             serviceFee:json.servicefee
           }
         }else{
           this.volumeFlag = false;//显示weight
           this.volumeInfo={
             aweight:json.totalweight || 0,
             vweight:json.volumeWeight,
             fweight:json.finalWeight,
             fcharge:json.cost || json.fcose
           }

         }
      },
      //点击查看商品列表
      showDetailListHandle(id){
          this.shoporders = this.shoporders.map(item=>{
            if(item.id == id){
              item.isOpen = !item.isOpen;
            }
            return item;
          })
      },

      deliveryWayHandle(item){
        if((item.servicepriceid >=10 && item.servicepriceid <20) || item.servicepriceid==-1){
          this.kgCount=4000;
        }else{
          this.kgCount = 8000;
        }
        this.isVisible = true;
        this.selectType ='deliveryWay';
      },
      //弹出狂
      popupHandle(type){
          this.isVisible = true;
          this.selectType =type;
      },
      goBackHandle(){
          this.$router.back()
      },
      //显示优惠券
      showPopupHandle(){
          this.useCouponVisible = true;
      },
      //选择优惠卷
      chooseCouponHandle(item){
        this.useCouponVisible = false;
        this.chooseCoupon = item;
        this.getScoinInfo(this.totalCountNoScoin);//显示积分
      },
      //获取当前用户的积分
      getBalanceInfo(){
        cartUserBalanceApi().then(res=>{
          this.balanceInfo = {balance:Number(res.balance) + Number(res.creditline)}
          this.scoin = res.scoin;
        })
      },
      getUserInfoHandle(){
        accountBasicInfoApi().then(res=>{

          this.userType = res.isleader;
          //userType =1团长， =2团员，4大客户

        })
      }
    },
  beforeRouteEnter(to,from,next){
    if(from.name == 'orderList'){
      removeOrderShipAddressID()
    }
    next()
  },
   mounted(){
        this.isLoading = true;
        this.receiverid = getOrderShipAddressID()?getOrderShipAddressID():this.$route.query.receiverid;
        this.getUserInfoHandle()
        this.getBalanceInfo();
        this.deliveryOrderInfoHandle();
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
  .pay-dialog-title{
    padding: 0 10px 5px;
  }
  /deep/.van-notice-bar--wrapable{
    padding:0;
  }
  .ship-intro{
    font-size:13px;
  }
  /*弹出框*/
  .popup-content{
    position: absolute;
    top:8%;
    bottom:6%;
    right:8%;
    left:8%;
    background-color: #fff;
    border-radius: 10px;

  }
  .volume-popup-content{
    position: absolute;
    top:20%;
    bottom:20%;
    right:6%;
    left:6%;
    background-color: #fff;
    border-radius: 10px;
  }
.order-ship-wrapper{
  position: relative;
  .tips-box{
    position: fixed;
    z-index:100;
    right:10px;
    bottom:100px;
    width:45px;
    height:45px;
    background-color: orangered;
    border-radius: 50%;
    display: flex;
    color:#fff;
    font-size:18px;
    align-items: center;
    justify-content: center;
  }
  .orderShipScroll{
    position: relative;
    height:calc(100vh - 46PX);
    background-color: #EEEEED;
  }
  .remove_content{
    margin:90px auto;
    flex-direction: column;
    .remove-box{
      width:90px;
      height:90px;
      img{
        max-width: 100%;
        height:auto;
      }
    }
    .look_link{
      border-bottom:1px solid #fcc900;
      font-size:18px;
    }
    .remove-intro{
      font-size:18px;
      margin:30px 0;
    }
  }
  .order-ship-content{
    margin:4px 2px 55px;

    .order-ship-box-common{
      padding:10px;
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 8px;
    }

  /*  选择运输方式 start*/
    .order-ship-transport-box{

      border-radius: 4px;
      margin-bottom: 8px;
        /deep/.van-notice-bar__content{
          font-size:16px;
        }
        /deep/.van-radio__icon--checked .van-icon{
          background-color: #fcc900;
          border-color:#FCC900;
        }

      .order-ship-choose-area{
        background-color: #fff;
          padding:2px 4px 10px;
        border-radius: 4px;
          .order-ship-via-item{
            padding:10px 6px;
            border:1px solid lightblue;
            border-radius: 4px;
            .via-title{
              font-size: 15px;
              margin-bottom: 8px;
            }
            .via-item-left{

              .via-intro{
                  color:gray;
                  font-size:15px;
                 line-height: 1.5;
                margin-bottom: 8px;
              }
              .via-address{
                color:#333;
                font-size:15px;
                line-height: 1.5;
                margin-bottom: 8px;
              }
              .via-money{
                font-weight: bold;
                font-size:16px;
              }
            }
          }
      }
    }
  /*  选择运输方式 end*/
  /*  商品信息 start*/
    .order-ship-good-info{
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 8px;
      /deep/.van-notice-bar__content{
        font-size:12px;
      }
      .del-price{
        font-size:13px;
        font-weight: normal;
      }
      .product-price{
        font-size:16px;
      }
      .product-bottom{
        color:orange;
        padding:8px 20px 8px 0 ;
        border-top:1px solid #EEEEED;
        .product-bottom-count{

          margin:0 6px;
          font-size:15px;
        }
      }
    }
  /*  商品信息 end*/
    .order-ship-title{
      font-size:16px;
      padding-left:15px;
      border-left:1px solid #FCC900;
    }
  /*  volume start*/
    .order-ship-volume-box{
      .volume-content{

      }
    }
  /*  volume end*/
  }
  .pay-box{
    position: fixed;
    z-index:10;
    bottom:0px;
    left:0;
    right:0;
    background-color: #fff;
    padding:4px ;
    border-top:1px solid #EEEEED;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .unable-pay-btn{
      background-color: #fcc900;
    }
    .pay-total{
      font-size:16px;
      padding:10px ;
    }
    .pay-btn{
      background-color: #FCC900;
      border-radius: 4px;
      font-size:16px;
      padding: 10px 40px;
    }
    /deep/.van-button{
      height:38px !important;
      line-height:38px !important;
    }
  }
  .volume-item_1{
    border-bottom:1px dashed #EEEEED;
  }
  .price-del{
    font-size:12px;
  }
}
</style>
