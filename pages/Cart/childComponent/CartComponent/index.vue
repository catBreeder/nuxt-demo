<template>
  <div class="cart-wrapper">
    <van-sticky>
      <div class="s3-cart-navbar d_flex ">
        <div class="cart-navbar-title">
          <div class="Cart_title">
            <span>Cart</span>
          </div>
          <div class="toPag-title" @click="changeTabHandle"> To Pay
            <span class="toPay" v-if="Number(cartInfo.paytask)>=1"/>
          </div>
        </div>
        <div class="cart-navbar-delete  d_flex"
             :class="{'color_warning':chooseLength!==0}"
             @click="deleteHandle" >
          <van-icon name="delete-o" size="18"/><span>{{chooseLength}} </span>
        </div>
      </div>
    </van-sticky>
    <scroll-view class="scrollViewHeight" @reachBottom="loadMoreHandle">
      <div class="cart-content">
        <template v-if="isLoading">
          <van-loading type="spinner" color="#fcc900" size="45px"/>
        </template>
        <template v-else>

          <!--          通知栏 start-->
          <div class="cart-notice">
            <!--            大客户不显示超过120-->
            <van-notice-bar color="#f00" background="#fff" v-if="selectAllInfo.cartSize >= 120 && selectAllInfo.isBig ==0" >
              Cart is overloaded,expired orders had been cleared
            </van-notice-bar>
            <van-notice-bar color="#f00" background="#fff"
                            @click="goOtherUrlHandle('coupon')"
                            v-if="cartInfo.couponqtyex >=1" class="g_mt_s">
              You have 1 coupons that are about to expire！
            </van-notice-bar>
            <van-notice-bar color="#222" background="#fff" class="g_mt_s"
                            @click="goOtherUrlHandle('toPay')"
                            v-if="cartInfo.paytask>=1">
                <span class="color_warning">
                  You have  {{cartInfo.paytask}}  Orders Waiting you </span>  to pay .
              <template #right-icon><i class="icon iconfont icon-tiaozhuan color_active"></i></template>

            </van-notice-bar>
          </div>
          <!--          通知栏 end-->
          <template v-if="cartList.length">
            <div class="cart-product-list" v-for="(item,index) in cartList" :key="index">
              <div class="product-title d_flex" @click="bigCustomerEditHandle(item)">
                <img v-if="item.shopifyorderno" src="https://shop.shopshipshake.com/resources/images/icon-shopify.svg" alt="" class="shopify-img">
                <span class="color_blue g_ml_m">{{item.shopifyorderno}}</span>
                <van-icon name="edit" color="#3597FF" size="16" class="g_ml_s" v-if="item.isbig == 1"/>
              </div>
              <div class="product-title d_flex d_flex_between">
                <van-checkbox :name="item.id"  v-model="item.isChecked" icon-size="18" @click="chooseOrderHandle(item)">
                  No.{{ item.orderno }}
                </van-checkbox>
                <div class="product-time">{{ item.createtimestr }}</div>
              </div>
              <template v-if="item.dlist.length>5">
                <good-item v-for="(product,indexFirst) in item.dlistFirst" :key="`dlistFirst_${indexFirst}`"
                           :product="product"
                           :order="item"
                           lineType="cart"
                >
                  <img v-if="item.producttype==1" slot="tag" src="~assets/images/top100/tag.png" alt="" width="30" height="30">
                  <div slot="count">
                    <div class="item-count-box">
                      <div class="item-count-box-left" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jian"></i>
                      </div>
                      <div class="item-count-num">{{ product.qty }}</div>
                      <div class="item-count-box-right" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jia"></i>
                      </div>
                    </div>
                  </div>
                  <div slot="price">{{product.pricezar | moneyFormat}}</div>
                  <div slot="footer" class="product-footer g_mt_m">
                    <van-notice-bar left-icon="warning-o" v-if="item.pflg==1" class="g_mb_m"
                                    text="May have quality problem"/>
                  </div>
                </good-item>
<!--                v-if="!item.isOpen"-->
                <div  class="other-open"  @click="showOtherListHandle(item)">
                  {{item.shopNum}} records in total, click to {{item.isOpen?'hide':'show'}} another
                  <van-icon :name="item.isOpen?'arrow-down':'arrow-up'" class="g_ml_m"/>
                </div>
                <good-item v-for="(product) in item.dlistLast" v-if="item.isOpen" :key="product.id"
                           :isShowTop="Number(item.producttype) ===1"
                           :product="product"
                           :order="item"
                           lineType="cart"
                >
                  <img v-if="item.producttype===1" slot="tag" src="~assets/images/top100/tag.png" alt="" width="30" height="30">
                  <div slot="count">
                    <div class="item-count-box">
                      <div class="item-count-box-left" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jian"></i>
                      </div>
                      <div class="item-count-num">{{ product.qty }}</div>
                      <div class="item-count-box-right" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jia"></i>
                      </div>
                    </div>
                  </div>
                  <div slot="price">{{product.pricezar | moneyFormat}}</div>
                  <div slot="footer" class="product-footer g_mt_m">
                    <van-notice-bar left-icon="warning-o" v-if="Number(item.pflg)===1" class="g_mb_m"
                                    text="May have quality problem"/>
                  </div>
                </good-item>
              </template>
              <template v-else>
                <good-item v-for="(product,index1) in item.dlist" :key="index1"
                           :product="product"
                           :order="item"
                           lineType="cart"
                >
                  <img v-if="item.producttype==1" slot="tag" src="~assets/images/top100/tag.png" alt="" width="30" height="30">
                  <div slot="count">
                    <div class="item-count-box">
                      <div class="item-count-box-left" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jian"></i>
                      </div>
                      <div class="item-count-num">{{ product.qty }}</div>
                      <div class="item-count-box-right" @click.stop="operateQtyHandle(product)">
                        <i class="icon iconfont icon-jia"></i>
                      </div>
                    </div>
                  </div>
                  <div slot="price">{{product.pricezar | moneyFormat}}</div>
                  <div slot="footer" class="product-footer g_mt_m">
                    <van-notice-bar left-icon="warning-o" v-if="Number(item.pflg)===1" class="g_mb_m"
                                    text="May have quality problem"/>
                  </div>
                </good-item>
              </template>
              <van-row type="flex" justify="space-between" align="center">
                <van-col span="8">
                  <div class="footer-btn" @click="shareHandle(item)">
                    <div class='share-btn'>
                      <i class="icon iconfont icon-fenxiang"></i>
                      <span> SHARE NOW</span>
                    </div>
                  </div>
                </van-col>
                <van-col span="16" class="g_pt_m">
                  <template v-if="item.hasqualitydiscount">
                    <van-checkbox v-model="item.isQty" @click="clickQueryHandle(item)" :disabled="userType==$config.orderUserType.BIGCUSTOMER" icon-size="18" class="d_flex " style="font-size:12px">
                      <div class="d_flex">
                        <div>
                          <div>Quality Inspection <span class="color_warning">R{{ item.qualityCostzar }}</span> <del class="color_intro">R{{item.originalqualityCostzar }}</del></div>
                          <div class="color_warning" v-if="cartInfo.vipname">{{cartInfo.vipname}}  Membership's discount </div>
                        </div>
                        <van-icon name="question" size="16"  @click.stop="showQualityInfoHandle"/>
                      </div>
                    </van-checkbox>
                  </template>
                  <template v-else>
                    <div v-if="item.qualityinspectiontype !==0">
                      <van-checkbox v-model="item.isQty" :disabled="userType==$config.orderUserType.BIGCUSTOMER"
                                    icon-size="18" class="d_flex " style="font-size:12px">
                        Quality Inspection R{{ item.qualityCostzar }}&nbsp;
                        <van-icon name="question" size="16"  @click.stop="showQualityInfoHandle"/>
                      </van-checkbox>
                    </div>
                  </template>
                </van-col>
              </van-row>
            </div>
            <div class="s3_home_end"><i class="icon iconfont icon-end"></i></div>
          </template>
          <template v-if="isEmpty">
            <van-empty
              class="custom-image animate__animated animate__bounceInUp" description="No Orders Found">
              <img src="~assets/images/cart/empty.png" alt="" slot="image">
              <van-button round  class="shopping-btn" @click="goOtherUrlHandle('shopping')">Shopping Now</van-button>
            </van-empty>
          </template>
          <template v-if="errorList.length">
            <div class="cart-valid-content" >
              <div class="cart-valid-title d_flex d_flex_between">
                <div class="d_flex"><van-icon name="warning-o" size="15" class="g_mr-s"/> Invalid commodity</div>
                <div class="color_warning" @click="deleteErrorHandle">Delete</div>
              </div>
              <good-item lineType="error" :product="errorItem" v-for="errorItem in errorList" :key="errorItem.id">
                <div slot="count">
                  <van-tag @click.stop="similarHandle(errorItem)"  size="large"  round  plain  color="#EEEEED" text-color="#f00">
                    Similar
                  </van-tag>
                </div>
                <div slot="price"><div class="item-price">{{errorItem.pricezar | moneyFormat}}</div></div>
                <div slot="tags">
                  <van-tag  plain size="medium"  color="#BEBEBE" round text-color="#2a2a2a">
                    {{ errorItem.errorinfo }}
                  </van-tag>
                </div>
              </good-item>
            </div>
          </template>
        </template>
      </div>
    </scroll-view>

    <div class="cart-total">
      <van-notice-bar color="#FF5467" v-if="cartInfo.couponqty>0"
                      background="#FFF8DB"
                      :text="`${cartInfo.couponqty} coupons available ,up to R${cartInfo.couponmoney} reduction`"/>
      <div class="cart-notice ">
        <van-notice-bar color="#222" background="#fff">
          <van-checkbox v-model="allQualityFlag"
                        :disabled="userType==$config.orderUserType.BIGCUSTOMER"
                        icon-size="18"
                        @change="allQualityHandle">
            <template v-if="cartInfo.vipname && originTotalQuality>0">
              <div class="d_flex">
                <div>
                  <div>Quality Inspection for all
                    <span style="font-size:15px;" class="font_w g_ml_s color_warning"> {{ totalQuality | moneyFormat }}</span>
                    <del class="color_intro">{{originTotalQuality | moneyFormat}}</del></div>
                  <div class="color_warning">{{cartInfo.vipname}} Membership's discount</div>
                </div>
                <van-icon name="question" size="16"
                          @click.stop="showQualityInfoHandle"
                          style="vertical-align: top"/>
              </div>
            </template>
            <template v-else>
              Quality Inspection for all
              <span style="font-size:15px;" class="font_w g_ml_s"> {{ totalQuality | moneyFormat }}</span>
              <van-icon name="question" size="16"
                        @click.stop="showQualityInfoHandle"
                        style="vertical-align: top"/>
            </template>

          </van-checkbox>
        </van-notice-bar>
      </div>
      <div class="cart-total-pay ">
        <template v-if="userType==$config.orderUserType.MANAGER">
          <van-checkbox v-model="allTotalFlag"  icon-size="18" @change="selectAllHandle">
            Total :
            <span style="font-size:15px;" class="font_w">
               {{totalMoney | moneyFormat }}
           </span>
          </van-checkbox>
          <div class="d_flex_end d_flex g_mt_m">
            <van-button class="share-other-btn" type="primary"
                        @click="shareMemberHandle"
                        v-if="userType==$config.orderUserType.MANAGER">Share</van-button>
            <van-button class="checkout-btn " @click="checkOutHandle"> Checkout({{ chooseLength }})</van-button>
          </div>
        </template>
        <template v-else>
        <div class="d_flex d_flex_between">
          <van-checkbox v-model="allTotalFlag"  icon-size="18" @change="selectAllHandle">
            Total :
            <span style="font-size:15px;" class="font_w">
               {{totalMoney | moneyFormat }}
           </span>
          </van-checkbox>
          <van-button class="checkout-btn " @click="checkOutHandle"> Checkout({{ chooseLength }})</van-button>
        </div>
        </template>

      </div>
    </div>
    <van-dialog v-model="qualityInfoVisible"
                theme="'round-button"
                class="stard-pop" show-cancel-button :show-confirm-button="false" cancelButtonText="close"
                @cancel="qualityInfoVisible=false"
                title="Quality Inspection Standards">
      <scroll-view class="scrollHeight">
        <standard-dialog/>
      </scroll-view>
    </van-dialog>
    <!--    数量操作弹框-->
    <van-action-sheet v-model="operateVisible" title="Modify quantity">
      <div class="modify-content">
        <operate-count
          @uptoMaxEmit="uptoMaxHandle"
          @changeSuccessEmit="changeSuccessHandle" :selectProduct="selectProduct"/>
      </div>
    </van-action-sheet>
    <!--    确认弹出框-->
    <van-overlay :show="isWait" z-index="9999" >
      <div class="loading-wrapper">
        <van-loading color="#fcc900" type="spinner" size="45" vertical class="loading_btn">wait a moment......</van-loading>
      </div>
    </van-overlay>
    <!--    分享弹出啊狂-->
    <van-share-sheet
      v-model="showShare"
      cancel-text="close"
      :options="shareOptions"
      @select="selectShareHandle"
    >
      <template #title>
        <div class="share-title">
          Share to your friends
          <van-icon name="cross" class="share-close-tag" @click="showShare = false"/>
        </div>
      </template>
      <template #description>
        <div class="share-title-description b_border">
          <div><span class="color_blue">Tip : </span>Just share pictures and descriptions,your friends won't see the actual price of the goods and shipshopshake's website</div>
          <div class="share-product-info">
            <div class="share-product-info-img">
              <van-swipe  @change="swiperChangeHandle" height="360" v-if="shareItem && shareItem.images && shareItem.images.length">
                <van-swipe-item v-for="(item, index) in shareItem.images" :key="index">
                  <img :src="item" style="border-radius: 10px"/>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div class="share-product-info-img-description">
              <van-divider content-position="left">Commodity Description(you can edit it)</van-divider>
              <van-field
                v-model="productDescription"
                rows="2"
                ref="inputRef"
                type="textarea"
                :placeholder="productDescription"
              />
            </div>
          </div>
        </div>
      </template>
    </van-share-sheet>

    <!--    弹出狂-->
    <van-dialog v-model="dialogVisible" class="dialog-content">
      <!--      数量达到上限-->
      <common-dialog v-if="dialogType==='upTo'"
                     type="error"
                     :fontSize="15"
                     title="Error"
                     @okEmit="dialogVisible= false"
                     intro="Exceed the maximum number of merchants selling!:)" />
      <!--删除-->
      <common-dialog
        type="info" v-if="dialogType==='delete'"
        :fontSize="15" :hasTwoBtn="true"
        title="Warning"
        @cancelEmit="dialogVisible = false"
        @confirmEmit="confirmDeleteHandle"
        :intro="`Are you sure you want to delete ${chooseLength} orders?`" />
      <!--      选择一个商品进行操作-->
      <common-dialog
        type="info" v-if="dialogType==='confirm'"
        :fontSize="15"
        title="Warning"
        @okEmit ="dialogVisible = false"
        intro="Please select at least one" />
      <common-dialog
        type="info" v-if="dialogType=='ensure'"
        :fontSize="15"
        @cancelEmit ="ensureOperateHandle('cancel')"
        @confirmEmit="ensureOperateHandle('confirm')"
        intro="(The warehouse staff checks before shipping to ensure all orders are intact.)"
        title="Ensure to give up Half-Price Quality Inspection Service?"
        :hasTwoBtn="true"
        :isShowImg="false"
        cancelText="Do not use"
        confirmText="Continue to use"
        confirmBg="#fcc900"
        confirmBorder="#fcc900"
      />
      <common-dialog
        type="success" v-if="dialogType=='shareSuccess'"
        :fontSize="15"
        :isShowImg="false"
        title="Successfully sharing!"
        @okEmit ="dialogVisible = false"
      />
      <common-dialog
        type="info" v-if="dialogType=='accept'"
        :fontSize="15"
        :showTitle="false"
        @cancelEmit ="acceptOperateHandle('cancel')"
        @confirmEmit="acceptOperateHandle('confirm')"
        intro="Your PA recommanded some products to you. Do you want to put it into your cart?"
        :hasTwoBtn="true"
        :isShowImg="false"
        cancelText="Cancel"
        confirmText="Accept"
        introColor="#2a2a2a"
        confirmBg="#fcc900"
        confirmBorder="#fcc900"
      />
    </van-dialog>

    <!--    编辑大客户订单号-->
    <van-dialog v-model="editVisible" title="Edit" :show-cancel-button="false" :show-confirm-button="false">
      <big-customer-order-edit v-if="editVisible"
                               :shopifyorderno="editItem.shopifyorderno"
                               :id="editItem.id"
                               @cancelEmit="editVisible= false"
                               @successEmit="editSuccessHandle"
      />
    </van-dialog>
<!--    团长给团员分享商品-->
    <van-dialog v-model="shareMemberVisible" width="95%" title="Enter the cellphone of the team member"
                :show-cancel-button="false"
                :show-confirm-button="false">
      <good-share v-if="shareMemberVisible"
                  @cancelEmit="hideVisibleHandle"
                  @confirmEmit="confirmShareHandle"
                  :id="chooseID"/>
    </van-dialog>
  </div>
</template>

<script>
  import JsCookie from 'js-cookie'
  import GoodShare from '../GoodShare'
  import BigCustomerOrderEdit from '@/components/content/BigCustomerOrderEdit'
  import OperateCount from '../OperateCount'
  import StandardDialog from "../StandardDialog";
  import GoodItem from "../GoodItem";
  import ScrollView from "@/components/common/ScrollView";
  import CommonDialog from '@/components/common/CommonDialog'
  import {accountBasicInfoApi} from '@/api/account'
  import {urlSearchApi} from '@/api/home'
  import {getLoginInfo} from '@/utils/memory'
  import { trackTagFun } from '@/utils';
  import {
    cartSelectAllApi,
    cartBasicInfoApi,
    cartListApi,
    cartCheckoutApi,
    cartDeleteApi,
    cartAcceptGoodApi,
    cartConfirmAcceptApi
  } from '@/api/cart'
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import {shareInfoApi,shareInitApi} from '@/api/home'
  import {getCartQualityFlag, setCartQualityFlag} from "@/utils/memory";
  export default {
    name: "index",
    components: {StandardDialog, ScrollView, GoodItem, OperateCount ,CommonDialog,BigCustomerOrderEdit,GoodShare},
    data() {
      return {
        // 之后的数据
        isWait:false,
        isEmpty:false,
        errorList:[],
        allQualityFlag: false,
        cartTab:0,
        isLoading: false,
        cartList: [],//购物车的全部数据
        pageCount:0,//总页数
        recordTotal: 0,//购物车总个数
        page: 1,//页数
        cartInfo: {},//cart页面基本信息
        operateVisible:false,//显示数量操作弹出框
        qualityInfoVisible:false,//质检信息弹出框
        selectProduct: {
          id: null,
          qty: null,
          shoporderid: null
        },//选中要操纵数量的商品
        dialogVisible:false,//是否显示弹出啊狂
        dialogType:'',//弹出框类型
        shareItem:{},//分享产品信息
        productDescription:'',//商品标题
        showShare:false,
        shareOptions:[
          { name: 'Download', icon: require('../../../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../../../assets/images/home/whatsapp.png') },
        ],
        imgIndex:0,
        vipname:'',
        editVisible:false,
        editItem:{},
        userType:0,
        leaderType:0,//用户身份
        selectAllInfo:{cartSize:0,isBig:0},
        allTotalFlag:false,
        ensureItem:{},
        shareMemberVisible:false,//团长给团员分享商品

      }
    },
    computed: {
      totalMoney() {
        let value = this.cartList.filter(item=>item.isChecked);//选中的商品\
        value.forEach(item=>{
          console.log(item.qualityCostzar,item.costzar)
        })
        return value.reduce((pre,cur)=>{
          return cur.isQty? Number(cur.qualityCostzar) + Number(cur.costzar) + pre : Number(cur.costzar) + pre;
        },0)
      },
      totalQuality() {
        let value =  this.cartList.filter(item=>item.isChecked && item.qualityinspectiontype !==0 && item.isQty);
        return value.reduce((pre,cur)=>{
          return Number(cur.qualityCostzar) + pre;
        },0)
      },
      originTotalQuality(){
        let value =  this.cartList.filter(item=>item.isChecked && item.qualityinspectiontype !==0 && item.isQty);
        return value.reduce((pre,cur)=>{
          return Number(cur.originalqualityCostzar) + pre;
        },0)
      },
      /*
      //选择全部商品
      allTotalFlag:{
        set(val){
          this.cartList = this.cartList.map(item=>{
            item.isChecked = val;
            if(this.userType == this.$config.orderUserType.BIGCUSTOMER){
              //如果是大客户，自动质检
              item.isQty = val;
            }
            return item;
          })
        },
        get(){
          if(this.cartList.length){
            let value = this.cartList.filter(item=>item.isChecked).map(item=>item.id);
            return value.length === this.cartList.length;
          }

        }
      },
      * */
      //选择的个数
      chooseLength(){
        return this.cartList.filter(item=>item.isChecked).length || 0;
      },
      //选择商品的id数据
      chooseID(){
        return this.cartList.filter(item=>item.isChecked).map(item=>item.id) || [];
      },
      //选中商品的pid
      choosePID(){
        let value = this.cartList.filter(item=>item.isChecked);
        return value.filter(item=>item.isQty && item.qualityCostzar).map(item=>item.id)
      }
    },
    mounted() {

      this.getCartAllList()
      //2.获取页面基本信息
      this.cartBasicInfoHandle();
      this.getCartList()
    },
    methods:{
      acceptOperateHandle(type){
        if(type=='cancel'){
          this.dialogVisible = false;
          this.dialogType = '';
          cartConfirmAcceptApi(0).then(res=>{})
          this.getCartList()
        }else if(type=='confirm'){
          this.isLoading = true;
          this.dialogVisible = false;
          this.dialogType = '';

          cartConfirmAcceptApi(1).then(res=>{
            if(res.status==0){
              this.getCartList()
            }
          })
        }

      },
      hideVisibleHandle(){
        this.shareMemberVisible = false;
      },
      confirmShareHandle(){
        this.shareMemberVisible = false;
       this.dialogVisible =true;
       this.dialogType='shareSuccess';
      },
      /*
      * 团购用户弹框
      * */
      ensureOperateHandle(type){

        switch (type) {
          case 'cancel':
            this.dialogVisible = false;
            setCartQualityFlag(1);
            break;
          case 'confirm':
            //保存flag

            this.dialogVisible = false;
            this.cartList = this.cartList.map(item=>{
              if(item.id== this.ensureItem.id){
                item.isQty = true;
              }
              return item;
            })
            break;
        }
      },
      trackTagHandle(page,fun,index){
        trackTagFun({page,fun,index})
      },
      editSuccessHandle(event){
        this.editVisible = false;
        this.cartList = this.cartList.map(item=>{
          if(item.id == event.id){
            item.shopifyorderno = event.orderNo;

          }
          return item;
        })
      },
      //显示剩余的额数组
      showOtherListHandle(order){
        this.cartList = this.cartList.map(item=>{
          if(item.id === order.id){
            item.isOpen = !item.isOpen;
          }
          return item;
        })
      },

      //获取购物车基本信息
      cartBasicInfoHandle() {

        accountBasicInfoApi().then(res=>{
          if(res.isleader == this.$config.orderUserType.BIGCUSTOMER ||
            res.isleader == this.$config.orderUserType.MEMBER ||
            res.isleader == this.$config.orderUserType.MANAGER
          ){
            this.allQualityFlag = true;
          }
          this.userType = res.isleader;
          //userType =1团长， =2团员，4大客户
          if(this.userType == this.$config.orderUserType.MEMBER){
            this.acceptGoodsShareHandle()
          }
        })
        cartBasicInfoApi().then(res => {
          this.cartInfo = res;
        })
      },
      //团员接受
      acceptGoodsShareHandle(){
        cartAcceptGoodApi().then(res=>{
          if(res.status==0){
            this.dialogType='accept';
            this.dialogVisible = true;
          }
        })
      },
      //全部质检
      allQualityHandle(){
        if(this.userType == this.$config.orderUserType.BIGCUSTOMER) return;
        this.cartList = this.cartList.map(item=>{
          if(item.isChecked &&　item.qualityCostzar){
            item.isQty =this.allQualityFlag;
          }
          return item;
        })
      },
      clickQueryHandle(item){
        //如果是大客户
        if(this.userType == this.$config.orderUserType.BIGCUSTOMER) return;
        //如果是团员或者团长
        if(this.userType == this.$config.orderUserType.MANAGER || this.userType == this.$config.orderUserType.MEMBER){
          //如果是取消，会有弹框
          if(item.isChecked){
            this.ensureItem = item;
            this.cartList = this.cartList.map(order=>{
              if(item.id == order.id){
                order.isQty = item.isQty;
              }
              return order;
            })
            if(getCartQualityFlag()==1) return;
            if(!item.isQty){
              this.dialogVisible = true;
              this.dialogType = 'ensure';
            }
          }

        }else{
          //普通用户
          this.cartList = this.cartList.map(order=>{
            if(item.id == order.id){
              order.isQty = item.isQty;
            }
            return order;
          })
        }


      },
      //如果是大客户，默认勾选
      chooseOrderHandle(item){
        if(this.userType == this.$config.orderUserType.BIGCUSTOMER){
          this.cartList = this.cartList.map(order=>{
            if(item.id == order.id){
              order.isQty = item.isChecked;
            }
            return order;
          })
        }else{
          this.cartList = this.cartList.map(order=>{
            if(item.id == order.id){
              order.isChecked = item.isChecked;
              if(this.allQualityFlag){
                item.isQty = this.allQualityFlag;
              }
            }
            return order;
          })

        }
        if(this.chooseLength==0){
          this.allTotalFlag = false;
        }
      },
      //大客户编辑订单号
      bigCustomerEditHandle(item){
        if(this.userType == this.$config.orderUserType.BIGCUSTOMER){
          this.editItem= item;
          this.editVisible = true;
        }

      },
      //商品数量操作
      operateQtyHandle(product){
        const {id, qty, shoporderid} = product;
        this.selectProduct = {
          id, qty: Number(qty), shoporderid
        }
        this.operateVisible = true;
      },
      shareMemberHandle(){
        if(!this.chooseID.length){
          this.dialogVisible = true;
          this.dialogType = 'confirm';
        }else{
          this.shareMemberVisible = true;
        }
      },
      //checkout操作
      checkOutHandle(){
        if(!this.chooseID.length){
          this.dialogVisible = true;
          this.dialogType = 'confirm';
        }else{
          this.isWait = true;
          cartCheckoutApi({
            ids:this.chooseID.join(','),
            qids:this.choosePID.join(','),
          }).then(res=>{
            setTimeout(()=>{
              this.isWait = false;
            },this.$config.duringWait)
            if(res.torisk == this.$config.toRiskType.YES){
              //有问题
              this.$store.commit('setCheckoutErrorInfo',res)
              this.$router.push('/cart/exchange')
            }else{
              //没有问题
              this.$store.commit('setCheckoutInfo',res)
              this.$router.push(`/shoporder/checkpaynew`)
            }
          })
        }
      },
      //显示质检信息
      showQualityInfoHandle(){
        this.qualityInfoVisible = true;
      },
      //分享商品
      shareHandle(item){
        //添加谷歌埋点
        gTagFun('大类名','Share Now','Cart')
        this.showShare = true;
        this.shareInitHandle(item['alibabaproductid']);
      },
      shareInitHandle(id){
        shareInitApi(id).then(res=>{
          if(res.status==0){
            this.shareItem = res.data;
            this.productDescription = this.shareItem.title
          }else{
            this.$toast({message:'The product have been removed or expired'})
          }

        })
      },
      //跳转到toPay页面
      changeTabHandle(){
        this.$emit('goToPayEmit')
      },
      //删除选中的商品
      deleteHandle(){
        this.dialogVisible = true;
        let value = this.cartList.filter(item=>item.isChecked);
        if(value.length===0){
          this.dialogType ='confirm'
        }else{
          this.dialogType ='delete'
        }
      },
      //跳转到优惠卷页面
      goOtherUrlHandle(type){
        switch (type) {
          case 'coupon':
            this.$router.push('/coupon/index')
            break;
          case 'toPay':
            this.changeTabHandle()
            break;
          case 'shopping':
            this.$router.replace('/');
            break;
        }
      },
      //商品到达上限
      uptoMaxHandle(result){
        this.dialogVisible = true;
        this.dialogType = 'upTo';
        this.operateVisible = false;
        this.cartList = this.cartList.map(item=>{
          if(item.id === result.shoporderid){
            item.dlist = result.list;
            item.costzar = result.totalzar
          }
          return item;
        })
      },
      //商品成功修改
      changeSuccessHandle(result){
        if(!result.list){
          this.cartList = this.cartList.filter(item=>item.id !== result.shoporderid)
        }else{
          this.cartList = this.cartList.map(item=>{
            if(item.id === result.shoporderid){
              item.dlist = result.list;
              item.costzar = result.totalzar
            }
            return item;
          })
        }
        this.operateVisible = false;
      },
      //确认删除
      confirmDeleteHandle(){
        cartDeleteApi(this.chooseID.join(',')).then(res=>{
          this.dialogVisible = false;
          this.chooseID.forEach(item=>{
            this.cartList.forEach((cart,index)=>{
              if(item===cart.id){
                this.cartList.splice(index,1)
              }
            })
          })
          if(res.status==0){
            // this.cartBasicInfoHandle();
            // this.getCartAllList()
            this.getCartAllList()
            //2.获取页面基本信息
            this.cartBasicInfoHandle();
            this.getCartList()
          }
        })
      },
      //分享
      //确定分享
      selectShareHandle(option){
        const { name }= option;
        let value ={}
        switch (name){
          case 'Download':
            this.trackTagHandle(this.$route.name,'download',this.imgIndex)
            //添加谷歌埋点 -Share Now点击后的弹出框，点击Download按钮
            gTagFun('Share to Download','Share to Download','Cart')
            this.downloadHandle();
            break;
          case 'Facebook':
            this.trackTagHandle(this.$route.name,'facebook',this.imgIndex)
            //添加谷歌埋点 --Share Now点击后的弹出框，点击Facebook按钮
            gTagFun('Share to  FB','Share to  FB','Cart')
            value =`{"userid":${getLoginInfo()?getLoginInfo().id:''},"platform":${this.$config.platform.Facebook},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`;
            shareInfoApi(value).then(res=>{
              let url = this.$config.shareURL + res.data.data;
              let producturl =`http://www.facebook.com/sharer/sharer.php?u=${url}`;
              window.open(producturl,'_blank')
            })
            break;
          case 'WhatsApp':
            this.trackTagHandle(this.$route.name,'whatsapp',this.imgIndex)
            //添加谷歌埋点 -Share Now点击后的弹出框，点击Whatsapp按钮
            gTagFun('Share to Whatsapp','Share to Whatsapp','Cart');
            value =`{"platform":${this.$config.platform.WhatsApp},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`   ;
            shareInfoApi(value).then(res=>{
              let producturl = this.$config.shareURL + res.data.data;
              var content = (res.description || "") + "\n"+producturl+"\n";
              location.href="whatsapp://send?text="+ encodeURIComponent(content);
            })
            break;
        }
      },
      //图片下载
      downloadHandle(){
        let image = new Image();
        image.setAttribute('crossOrigin','anonymous');
        let _this=this;
        image.onload = function(){
          let canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image,0,0,image.width,image.height);
          let url = canvas.toDataURL('image/png');
          let a =document.createElement('a');
          let event = new MouseEvent('click');
          a.download = Math.random()*1000+'.jpg'||'photo';
          a.href=url;
          a.dispatchEvent(event)
        }
        image.src=this.shareItem.images[this.imgIndex];
        setTimeout(()=>{
          this.$toast({message: 'Download succeeded....' });
        },this.$config.duringWait)
      },
      //轮播图改变
      swiperChangeHandle(event){
        this.imgIndex = event;
      },
      //相似的产品
      similarHandle(item){
        this.isWait =true;
        urlSearchApi(item.images).then(res=>{
          this.isWait =false;
          this.$router.push({
            path:'/shoppingmall/imagesearch',
            query:{
              key:res,
              picurl:item.images
            }
          })
        })
      },
      deleteErrorHandle(){
        this.isWait = true;
        let value = [...new Set(this.errorList.map(item=>item.shoporderid))];
        cartDeleteApi(value?value.join(','):'').then(res=>{
          this.isWait = false;
          this.page =1;
          this.cartBasicInfoHandle();
          this.getCartList()
        })
      },

      /*
      //1.获取分页列表
      cartListHandle(allList){
        cartListApi(this.page)
          .then(res=>{
            const { pageCount, list } = res.resultMap;
            if(!list.length){
              this.isEmpty = true;
            }else{
              list.forEach(partItem=>{
                this.cartList = allList.map(allItem=>{
                  if(partItem.id === allItem.id){
                    allItem.dlist = partItem.dlist;
                  }

                  return allItem
                })
              })
              this.pageCount = pageCount;//总页数
              //如果只有一页，判断是否有失效的商品
              if( pageCount ===1){
                this.errorList =  res.errorlist || []
              }
            }
            setTimeout(()=>{
              this.isLoading = false
            },this.$config.duringWait)
          })
      },
      * */

      //3.加载下一页
      loadMoreHandle1(){
        //如果当前页数小于总页数，就加载下一页
        if(this.page <= this.pageCount){
          this.page ++;
          cartListApi(this.page)
            .then(res=> {
              const {list} = res.resultMap;
              list.forEach(partItem=>{
                this.cartList = this.cartList.map(allItem=>{
                  if(partItem.id === allItem.id){
                    allItem.dlist = partItem.dlist;
                    if(partItem.dlist.length>5){
                      allItem.dlistFirst = partItem.dlist.slice(0,5);
                      allItem.dlistLast = partItem.dlist.slice(5);
                      allItem.isOpen = false;
                      allItem.isCheck = false;
                    }
                  }
                  return allItem
                })
              })
              this.errorList = res.errorlist || [];
            })
        }
      },
      /*--------------------新版本方法---------------------*/
      //获取所有商品
      getCartAllList(){
        this.isLoading = true;
        cartSelectAllApi()
          .then(res=>{
            this.selectAllInfo={
              cartSize: res.cartsize,
              isBig:res.isbig
            }
          }).catch(err=>{

        })
      },
      getCartList(){
        this.isEmpty = false;
        cartListApi(this.page)
          .then(res=>{
            const {list,pageCount} = res.resultMap;
            this.cartList = list || [];
            this.pageCount = pageCount;
            if(res.errorlist){
              this.errorList  = res.errorlist || []
            }
            if(this.cartList.length==0){
              this.isEmpty = true;
            }else{
              this.cartList = this.cartList.map(item=>{
                if(item.dlist.length>5){
                  item.dlistFirst = item.dlist.slice(0,5);
                  item.dlistLast = item.dlist.slice(5);
                }
                item.shopNum = item.dlist.length || 0;
                item.isOpen = false;
                item.isChecked = false;
                return item;
              })
            }
            this.isLoading = false;
          })
      },
      loadMoreHandle(){
        if(this.page >= this.pageCount) return;
        this.page ++;
        cartListApi(this.page)
          .then(res=>{
            const {list} = res.resultMap;
            let newValue = list.map(item=>{
              if(item.dlist.length>5){
                item.dlistFirst = item.dlist.slice(0,5);
                item.dlistLast = item.dlist.slice(5);
              }
              item.isOpen = false;
              item.isChecked = false;
              return item;
            })
            this.cartList = [...this.cartList,...newValue]
            this.errorList = res.errorlist || [];
          })
      },
      //选择全部
      async selectAllHandle(){
        this.isWait = true;
        if(this.allTotalFlag){
          if(this.page == this.pageCount){
            //如果cartList已经加载完成
            this.cartList = this.cartList.map(item=>{
              item.isChecked = this.allTotalFlag;
              if(this.userType==this.$config.orderUserType.BIGCUSTOMER){
                item.isQty = this.allTotalFlag
              }else{
                if(this.allQualityFlag){
                  item.isQty = this.allQualityFlag
                }
              }
              return item;
            })
            this.isWait = false;
          }else{
            //cartList没有加载完成
            while (this.page < this.pageCount) {
              this.page++;
              let result = await cartListApi(this.page)
              const {list} = result.resultMap;
              let newValue = list.map(item=>{
                if(item.dlist.length>5){
                  item.dlistFirst = item.dlist.slice(0,5);
                  item.dlistLast = item.dlist.slice(5);
                }
                item.shopNum = item.dlist.length || 0;
                item.isQty = false;
                item.isChecked = false;
                item.isOpen = false;
                return item;
              })
              this.cartList = [...this.cartList,...newValue];
              if(this.page == this.pageCount){
                this.cartList = this.cartList.map(item=>{
                  item.isChecked = this.allTotalFlag;
                  if(this.userType==this.$config.orderUserType.BIGCUSTOMER){
                    item.isQty = this.allTotalFlag
                  }
                  return item;
                })
                this.isWait = false;
              }

            }
          }
        }else{
          this.cartList = this.cartList.map(item=>{
            item.isChecked = this.allTotalFlag;
            item.isQty = this.allTotalFlag
            return item;
          })
          this.isWait = false;
        }
        this.isWait = false;
      }
    }
  }
</script>

<style scoped lang="less">

  /deep/.van-checkbox__label{
    display: flex;
    align-items: center;
  }
  /deep/.van-icon-search{
    display: none;
  }
  .color_warning{
    font-size:12px;
  }
  .other-open{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:5px 15px;
    background-color: #fff;
    color:#f00;
  }
  /deep/.van-card__bottom{
    margin-top: 4px;
  }
  /deep/.van-share-sheet__cancel{
    display: none;
  }
  /deep/.van-share-sheet__header{
    padding:10px 5px 0px
  }
  /deep/.van-share-sheet__title{
    font-size:16px;
    margin-bottom: 6px;
  }
  /deep/ .van-swipe{
    border-radius: 10px;
    max-height:360px;
  }
  /deep/.van-swipe-item{
    max-height:360px;
    img{
      object-fit: fill;
      width:100%;
      height:100%;
    }
  }
  /deep/.van-share-sheet__options{
    padding:5px 10px;
  }
  /deep/.van-cell{
    padding: 0 5px;
  }
  /deep/ .van-divider{
    margin:2px 0;
  }

  .share-title{
    position:relative;
    .share-close-tag{
      position:absolute;
      right:10px ;
      font-size:20px;
      color:gray;
    }
  }
  /deep/ .van-share-sheet__icon{
    border-radius: 50%;
  }
  .share-title-description{
    color:#2A2A2A;
    /deep/ .van-field__control{
      padding:2px 8px 0 8px;
      border-radius: 10px;
      background-color: #eeeeed;
    }
  }
  /deep/ .van-divider{
    margin:5px 0;
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
        span{
          padding:4px ;
          border-bottom:3px solid #fcc900;
        }
      }
      .toPag-title{
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
  .icon-jiazai{
    font-size:15px;
  }
  .shopify-img{
    width: 20PX;
    height: 20PX;
    max-width: 100%;
  }
  .modify-content{
    padding-bottom:30px;
  }
  .loading-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .loading-btn{
      width: 120px;
      height: 120px;
      background-color: #fff;
    }
  }
  /deep/ .van-radio__label {
    display: flex;
    align-items: center;
  }

  /deep/ .van-notice-bar {
    font-size: 15px;
    font-weight: 500;
  }

  .cart-wrapper {
    position: relative;
    height: 100%;
    .cart-total {
      position: fixed;
      bottom: 50px;
      left: 0;
      right: 0;
      z-index: 1;
      box-shadow: 10px 0 10px #E5E5E5;
      .cart-notice{
        margin:0;
      }
    }
  }

  .cart-valid-content {
    background-color: #fff;
    padding: 10px 0;
    border-top: 4px solid #EEEEED;

    .cart-valid-title {
      font-size: 15px;
      padding: 0 10px;
    }
  }
  .item-price{
    font-size:15px;
    font-weight: 500;
  }
  .end-footer {
    padding: 20px 0;
    text-align: center;
    font-size: 18px;
    color: grey;
    margin-bottom:120px;
  }

  /deep/ .van-empty__description {
    font-size: 17px;
    font-weight: bold;
    color: #2A2A2A;
  }

  .shopping-btn {
    color: #2A2A2A;
    background-color: #FCC900;
    font-size: 16px;
    font-weight: bold;
  }

  .item-count-box {
    display: flex;
    align-items: center;
    vertical-align: middle;

    .item-count-box-left, .item-count-box-right {
      color: lightgrey;
    }

    .item-count-num {
      font-size: 16px;
      color: #222222;
      margin: -2px 8px 0;
    }

    .icon-jian {
      font-size: 22px;
      color: lightgrey;
    }

    .icon-jia {
      font-size: 21px;
      color: lightgrey;
    }
  }

  .count-operate-title {
    padding: 0 15px 10px;
    border-bottom: 1px solid #eeeeed;

  }

  .order_input{
    padding:4px 15px;
  }
  .product-title {
    padding: 8px 15px 0 15px;
    font-size: 13px;

    .product-time {
      font-size: 10px;
      color: #8F8E94FF;
      text-align: right;
    }
  }

  .footer-btn {
    padding:0 10px 10px;
    margin-top:8px;
    .share-btn{
      margin-top: 4px;
      font-size:12px;
      border:1px solid #fcc900;
      padding:7px 0;
      text-align: center;
      border-radius: 4px;
      background-color: #fcc900;
    }
  }
  .cart-list-content{
    /*margin-bottom:100px;*/
  }

  .cart-total-pay {
    background-color: #fff;
    padding: 10px;
    .checkout-btn {
      background-color:#FCC900;
      border-radius: 6px;
      margin-left:8px;
    }
    .share-other-btn{
      border-radius: 6px;
      color:#000;
    }
  }

  //弹出框
  /deep/.van-dialog__header{
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: 10px 0 10px lightgrey;
  }
  .stard-pop {
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
  .dialog-content{
    /deep/ .van-dialog__footer {
      display: none !important;
    }
  }
  .scrollHeight {
    height: 60vh;
  }

  .stand-footer {
    padding: 10px 20px;
  }

  .scrollViewHeight {
    height: calc(100vh - 46px - 150px);
    background-color: #EEEEED;
  }

  .cart-notice {
    margin: 4px 0 0;
    border-bottom:6px solid #EEEEED;
    font-size: 16px;
    font-weight: 500;
  }

  //cart内容
  .cart-content {
    padding-bottom: 50px;
    .cart-product-list {
      background-color: #fff;
      margin-bottom:6px;
    }

  }

  .icon-fenxiang {
    font-size: 12px;
    margin-right: 2px;
  }

  /deep/ .van-card__footer {
    text-align: left;
  }

  /*/deep/ .van-tabs__line {*/
  /*  display: none;*/
  /*}*/

  /deep/ .van-tab {
    font-size: 18px;
    font-weight: bold;
  }

  /deep/ .van-tab--active {

    color:#FCC900
  }

  /deep/ .van-stepper__input {
    margin: 0;
  }

  /deep/ .van-card__footer .van-button {
    margin-left: 0;
  }
  .s3_home_end{
    text-align: center;
    color:#ccc;
    margin:20px auto 0;
  }

</style>
