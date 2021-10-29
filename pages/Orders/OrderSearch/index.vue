<template>
  <div class="s3-order-search-wrapper">
    <!--头部navbar start....-->
    <van-sticky>
      <van-nav-bar  left-arrow  border z-index="10" @click-left="goBackHandle" @click-right="searchListHandle">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <van-search
            @search="searchListHandle"
            :clearable="false"
            v-model="searchKey"
            placeholder="Orders No./Goods Name/Shopify No./Remark" shape="round" />
        </template>
        <template #right>
          <i class="icon iconfont icon-sousuo"></i>
        </template>
      </van-nav-bar>
    </van-sticky>
    <!--头部navbar end....-->
    <scroll-view @reachBottom="loadMoreHandle" class="scrollCommonHeightView">
        <div class="order-search-content ">
          <template v-if="!searchKey">
            <div class="order-search-title d_flex d_flex_between bg_white">
              <div class="">Search history</div>
              <div @click="clearHandle"><van-icon name="delete-o" size="18"/></div>
            </div>
            <div class="order-search-list d_flex bg_white">
              <div  class="tag-item" @click="tagSearchHandle(item)"  v-for="(item,index) in historyList" :key="index">{{item}}</div>
            </div>
          </template>
          <template v-else>
            <van-loading v-if="isLoading" type="spinner" color="#fcc900" size="45px"/>
            <template v-else>
              <van-empty v-if="noListVisible"
                         class="custom-image animate__animated animate__bounceInUp" description="No Orders Found">
                <img src="~assets/images/cart/empty.png" alt="" slot="image">
                <van-button round  class="shopping-btn" @click="goOtherUrlHandle()">Shopping Now</van-button>
              </van-empty>
              <div class="s3-orders-content" v-for="(item,index) in shopOrders" :key="index">
                <div class="s3-order-content-bottom">
                  <div class="product-title " >
                    <!--                  头部-->
                    <div class="product-notice " v-if="item.leadname || item.customername ">
                      <span v-if="item.leadname"> In process by shipping ambassador - {{item.leadname}}</span>
                      <span v-if="item.customername">Customer's order - {{item.customername}}</span>
                    </div>
                    <div class="product-title-padding g_pt_m g_mb_m" v-if="item.shopifyorderno">
                      <img v-show="item.shopifyorderno"  src="https://shop.shopshipshake.com/resources/images/icon-shopify.svg" alt="" class="g_mr_s shopify-img">
                      <span class="color_blue">{{item.shopifyorderno}}</span>
                    </div>
                    <div class=" d_flex d_flex_between product-title-padding g_pt_s">
                      <div> No.{{item.orderno}}</div>
                      <div class="product-time d_flex" :style="{'color':$config.orderStatusColor[item.status]}" @click="checkStatusHandle(item.status,'normal')">
                        {{item.statusStr}} <van-icon name="question-o" class="g_ml_s" size="13" />
                      </div>
                    </div>
                  </div>
                  <!--              海运 和 地址-->
                  <div class="product-title-quality d_flex d_flex_between"
                       :class="{'quality-padding':item.specialgoods == 2 && item.status ==$config.orderStatus.Collected}">
                    <div :class="{'quality_item':item.qualityinspectiontype == 1 && item.status > $config.orderStatus.AwaitingPayment}">
                      <div @click="showQualityHandle" v-show="item.qualityinspectiontype == 1 && item.status > $config.orderStatus.AwaitingPayment">
                        <img src="~assets/images/orders/order_quality.png" alt="">
                      </div>
                    </div>
                    <div  :class="{'quality_item':item.cellphone}">
                      <div class="product-time g_mt_s d_flex" @click="confirmOrderHandle(item,'editName')" v-show="item.cellphone">
                        {{item.name}}&nbsp;{{item.countrycode}}{{item.cellphone}}
                        &nbsp;<van-icon name="edit" color="#00BFFF"/>
                      </div>
                    </div>
                  </div>
                  <!--              免费存储空间-->
                  <div class="product-title-quality d_flex d_flex_between "
                       :class="{'quality-padding':item.storagedays>0 || item.receiver}">
                    <div class="color_blue " :class="{'quality_item':item.storagedays>0 || item.receiver}" >
                      <div v-show="item.storagedays>0">
                        Free storage : <strong>{{item.storagedays}}</strong> Ds left
                      </div>
                    </div>
                    <div class="color_blue " :class="{'quality_item':item.receiver}" v-show="item.receiver">
                      <van-icon name="manager-o" /> : {{item.receiver }}
                    </div>
                  </div>
                  <!--订单详情-->
                  <template v-if="item.shoporderdetails.length<=5">
                    <product-card :product="product" :order="item" v-for="(product,productIndex) in item.shoporderdetails" :key="productIndex">
                      <div slot="count"><span class="product-count"> x {{product.qty}}</span></div>
                      <!--                旧价格-->
                      <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="product.priceold>0 && item.status == $config.orderStatus.AwaitingPayment">
                        <div class="product-tag-left" >
                          <del>
                            {{product.productoldcostzar | moneyFormat}}
                            <span v-show="product.unit >= 30">
                      {{$config.orderUnit[product.unit]}}
                    </span>
                          </del>
                        </div>
                        <div class="product-tag-right" v-show="product.originalqty >0">
                          <del>X {{product.originalqty }}</del>
                        </div>
                      </div>
                    </product-card>
                  </template>
                  <template v-else>
                    <product-card :product="productFirst" :order="item"
                                  v-for="(productFirst,productIndex1) in item.shopOrderFirst"
                                  :key="productFirst.id">
                      <div slot="count"><span class="product-count"> x {{productFirst.qty}}</span></div>
                      <!--                旧价格-->
                      <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="productFirst.priceold>0 && item.status == $config.orderStatus.AwaitingPayment">
                        <div class="product-tag-left" >
                          <del>
                            {{productFirst.productoldcostzar | moneyFormat}}
                            <span v-show="productFirst.unit >= 30">
                      {{$config.orderUnit[productFirst.unit]}}
                    </span>
                          </del>
                        </div>
                        <div class="product-tag-right" v-show="productFirst.originalqty >0">
                          <del>X {{productFirst.originalqty }}</del>
                        </div>
                      </div>
                    </product-card>
                    <div class="other-open" v-if="item.shoporderdetails.length > 5 && !item.isOpen" @click="showOtherListHandle(item)">
                      {{item.shoporderdetails.length}} records in total, click to show another {{item.shoporderdetails.length-5}}
                      <van-icon name="arrow-down" class="g_ml_m"/></div>
                    <product-card :product="productNext" v-if="item.isOpen" :order="item"
                                  v-for="(productNext,productIndex2) in item.shopOrderNext"
                                  :key="productNext.id">
                      <div slot="count"><span class="product-count"> x {{productNext.qty}}</span></div>
                      <!--                旧价格-->
                      <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="productNext.priceold>0 && item.status == $config.orderStatus.AwaitingPayment">
                        <div class="product-tag-left" >
                          <del>
                            {{productNext.productoldcostzar | moneyFormat}}
                            <span v-show="productNext.unit >= 30">
                      {{$config.orderUnit[productNext.unit]}}
                    </span>
                          </del>
                        </div>
                        <div class="product-tag-right" v-show="productNext.originalqty >0">
                          <del>X {{productNext.originalqty }}</del>
                        </div>
                      </div>
                    </product-card>
                  </template>

                  <!--                底部-->
                  <div class="product-footer">
                    <div class="d_flex d_flex_between">
                      <div>
                        <div  class="product-special"  v-show="item.specialgoods == 2 && item.status ==$config.orderStatus.Collected">
                          Powder/Liquid items <van-icon name="question-o" class="g_ml_s" size="13" />
                        </div>
                      </div>
                      <div class="product-footer-btn">
                        <van-button class="track-btn"

                                    v-if="item.status>$config.orderStatus.AwaitingPayment && item.status < $config.orderStatus.Signed"
                                    @click="confirmOrderHandle(item,'track')">Track Parcel</van-button>
                        <van-button class="track-btn"
                                    v-if="item.status == $config.orderStatus.Signed && (item.alibabaproductid  > 0 || item.specailproductid  >0)"
                                    @click="confirmOrderHandle(item,'again')">Buy Again</van-button>
                        <van-button class="track-btn"
                                    v-if="item.afterseviceflg"
                                    @click="confirmOrderHandle(item,'after')">After Sale</van-button>
                        <van-button class="confirm_btn g_mr_l"
                                    v-if="(item.status == $config.orderStatus.Failed || item.status == $config.orderStatus.Closed ) && item.failconfirmflg == 0"
                                    @click="confirmOrderHandle(item,'confirm')">Confirm</van-button>
                        <van-button

                          v-if="item.status > $config.orderStatus.AwaitingPayment && item.status < $config.orderStatus.Shipped && item.status!= $config.orderStatus.Failed"
                          @click="confirmOrderHandle(item,'remind')"
                          class="sim_btn">Remind</van-button>
                        <van-button

                          v-if="item.shareflg == 1"
                          @click="confirmOrderHandle(item,'share')"
                          class="sim_btn">Share</van-button>
                        <van-button

                          v-if="(item.status== $config.orderStatus.Failed || item.status > $config.orderStatus.Signed) && item.ordertype  == 0"
                          @click="confirmOrderHandle(item,'similar')"
                          class="sim_btn">Similar</van-button>
                      </div>
                    </div>
                    <div class="product-track" v-if="item.status>=10">
                      <van-notice-bar :scrollable="false" @click="confirmOrderHandle(item,'track')"
                                      color="#8B8682" background="#F2F2F2"
                                      :text="item.record">
                        <template #left-icon>
                          <img src="~assets/images/orders/icon_car.png" alt="" width="26" height="26">
                        </template>
                      </van-notice-bar>
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </template>
    </div>
    </scroll-view>
    <!--    状态弹出框 和 power L-->
    <van-dialog v-model="isVisible" :showConfirmButton="false">
      <template v-if="dialogVisible">
        <div class="assistant-content">
          <div class="assistant-intro">
            <template  v-if="selectType==='status' || selectType==='remind'">
              {{statusZn}}
            </template>
            <template v-else-if="selectType==='sea'">
              According to Chiness law,powder and liquid goods cannot be transported by air.Only can be transported by Ocean
            </template>
          </div>

          <div class="close-btn">
            <van-button type="default"
                        @click="isVisible = false" class="btn">{{selectType==='status'?'Close':'OK'}}</van-button>
          </div>
        </div>
      </template>
      <template v-else-if="selectType==='confirm'">
        <common-dialog type="info"
                       title="Warning"
                       cancelText="No"
                       confirmText="Yes"
                       :hasTwoBtn="true"
                       @confirmEmit="confirmCloseHandle"
                       @cancelEmit="isVisible = false"
                       :intro="`Are you sure ?`"/>
      </template>
      <template v-else-if="selectType==='onlyOne'">
        <common-dialog
          type="info"
          :fontSize="15"
          title="Warning"
          @okEmit ="isVisible = false"
          intro="Please select at least one" />
      </template>
    </van-dialog>
    <!--    质检弹出框-->
    <van-dialog v-model="qualityInfoVisible"
                theme="'round-button"
                class="stard-pop" show-cancel-button :show-confirm-button="false" cancelButtonText="close"
                @cancel="qualityInfoVisible=false"
                title="Quality Inspection Standards">
      <scroll-view class="scrollHeight">
        <standard-dialog/>
      </scroll-view>
    </van-dialog>
    <!--loading-->
    <van-overlay :show="isWaiting" >
      <div class="wrapper">
        <van-loading type="spinner" color="#fcc900" size="30"/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import NavBarSpecial from "@/components/common/NavBarSpecial";
import ProductCard from '../childComponents/ProductCard'
import { shopOrderListApi,shopOrderRemindApi ,shopOrderConfirmApi ,shopOrderSearchHistoryApi ,shopOrderClearHistoryApi} from '@/api/orders'
import ScrollView from "@/components/common/ScrollView";
import {urlSearchApi} from '@/api/home'

import CommonDialog from '@/components/common/CommonDialog'
import StandardDialog from '../../Cart/childComponent/StandardDialog'
import {clickPointFun} from '@/utils';
import config from '@/config'
import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';

export default {
  head(){
    return {
      title:'Orders Search - shopshipshake'
    }
  },
  name: "index",
  components:{NavBarSpecial ,ScrollView,ProductCard ,StandardDialog ,CommonDialog },
  data(){
    return{
      searchKey:'',
      page:1,
      shopOrders:[],
      isVisible:false,//是否显示问号的内容
      selectType:'',
      selectOrder:{},
      statusZn:'',
      statusDes:{},//状态描述
      qualityInfoVisible:false,//质检弹出框
      historyList:[],
      isLoading:false,
      noListVisible:false,
      isWaiting:false
    }
  },
  beforeRouteLeave(to,from,next){
    loginRegisterPageBury({
      p:'orderSearch',
      operate:'close',
      spm:`a0001.orderSearch.close.${getCurrentPageSpmID()}`
    })
    next();
  },
  beforeRouteEnter(to,from,next){
    if(from.path!='/'){
      setRefer(config.jianweiDomain +from.path)
    }
    if(to.query.spm){
      setRefSpm(to.query.spm);
    }

    loginRegisterPageBury({
      p:'orderSearch',
      operate:'page',
      spm:`a0001.orderSearch.page.-1`
    })
    next();
  },
  computed:{
    dialogVisible(){
      return this.selectType==='status' ||  this.selectType==='sea' || this.selectType==='remind'
    },
  },
  mounted() {
    this.getSearchHistory()
  },
  activated() {
    this.getSearchHistory()
  },
  methods:{
    clearHandle(){
      shopOrderClearHistoryApi().then(res=>{
        this.getSearchHistory()
      })
    },
    //shopping Now
    goOtherUrlHandle(){
      this.$router.replace('/');
      this.$EventBus.$emit('toIndex')
    },
    //显示剩余的额数组
    showOtherListHandle(order){
      this.shopOrders = this.shopOrders.map(item=>{
        if(item.id == order.id ){
          item.isOpen = true;
        }
        return item;
      })
    },
    //点击状态
    checkStatusHandle(status){
      if(status === this.$config.orderStatus.AwaitingPayment){
        this.$router.replace({
          path:'/shoporder/cart',
          query:{tab:1}
        })
      }else{
        if(status){
          this.statusZn = this.statusDes[status];
          if(this.statusZn){
            this.isVisible = true;
            this.selectType='status';
          }

        }
      }
    },
    loadMoreHandle(){},
    //显示quality弹出框
    showQualityHandle(){
      this.qualityInfoVisible = true;
    },
    goBackHandle(){
      this.$router.replace('/shoporder/2/index')
    },
    searchListHandle(){
      this.isLoading= true;
      shopOrderListApi({
        tab:this.$config.orderTab.all,
        page:this.page,
        source:this.$config.orderSource.SEARCH,
        shopifyflg:0,
        search:this.searchKey?this.searchKey.trim():''
      }).then(res=>{
        let {shoporders,statusDes} = res;
        this.shopOrders = shoporders.map(item=>{
          if(item.shoporderdetails.length>5){
            item.shopOrderFirst = item.shoporderdetails.slice(0,5);
            item.shopOrderNext = item.shoporderdetails.slice(5);
            item.isOpen = false;
            item.isCheck = false;
          }
          return item;
        })
        this.statusDes = statusDes;
        if(this.shopOrders.length==0){this.noListVisible = true;}
        setTimeout(()=>{
          this.isLoading = false;
        },this.$config.duringWait)
      })
    },
    getSearchHistory(){
      shopOrderSearchHistoryApi().then(res=>{
        this.historyList = res.historys;
      })
    },
    //关闭关单弹出框
    confirmCloseHandle(){
      shopOrderConfirmApi(this.selectOrder.id).then(res=>{
        if(res.status==0){
          this.$toast({message:'Confirm success'});
          this.searchListHandle()
        }
        this.isVisible = false;
      })
    },
    //已关单或者采购失败 - 失败确认
    confirmOrderHandle(item,type){
      switch (type) {
        case 'confirm':
          this.selectOrder= item;
          this.isVisible = true;
          this.selectType ='confirm';
          break;
        case 'remind':
          //提醒
          shopOrderRemindApi(item.id).then(res=>{
            if(res.status==0){
              if(res.data.info){
                this.isVisible = true;
                this.selectType = 'remind';
                this.statusZn = res.data.info;
              }else{
                if(res.data.count==1){
                  this.$toast({message:'Success'});
                }else{
                  this.isVisible = true;
                  this.selectType = 'remind';
                  this.statusZn = 'Your assitant has already been reminded';
                }
              }
            }

          })
          break;
        case 'similar':
          this.isWaiting = true;
          urlSearchApi(item.shoporderdetails[0]['images']).then(res=>{
            if(res){
              this.$router.push({
                path:'/shoppingmall/imagesearch',
                query:{
                  key:res,
                  picurl:item.shoporderdetails[0]['images']
                }
              })
              this.isWaiting = false;
            }

          })
          break;
        case 'rateAndShare':
          window.location.href=`${this.$config.jianweiDomain}/shoporder/evaluate/${item.id}`
          break;
        case 'editName':
          this.$router.push({
            name:'shopOrderEdit',
            query:{
              name:item.name ,
              countrycode:item.countrycode,
              cellphone:item.cellphone
            }
          })
          break;
        case 'track':
          this.$router.push(`/shoporder/2/logistics/${item.id}`)
          break;
        case 'after':
          window.location.href=`${this.$config.jianweiDomain}/shoporder/workorder/${item.id}`
          break;
        case 'again':
          let spm = `a0001.orderList.buyagain.0.`;
          clickPointFun({
            p:'',
            spm:`a0001.detail.buyagain.0.${getCurrentPageSpmID()}`
          })
          let productId=item.specailproductid>0?`sp.${item.specailproductid}`:`so.${item.alibabaproductid}`
          let url = `${this.$config.jianweiDomain}/search?spm=${spm}&productid=${productId}`
          window.location.href=url;
          break;
        case 'share':
          window.location.href=`${this.$config.jianweiDomain}/share/index/${item.id}`
          break;
      }

    },
    tagSearchHandle(event){
      this.searchKey = event;
      this.page =1;
      this.searchListHandle()
    }
  }
}
</script>

<style scoped lang="less">
  .other-open{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:5px 15px;
    background-color: #fff;
    color:#f00;
  }
  .product-title-padding{
    padding-top:10px;
  }
  .product-title{
    background-color: #fff;
    padding:0px 10px 0;
    border-radius: 10px 10px 0 0 ;
    font-size:14px;
    color:#0D0D0D;
    .product-time{
      color: #8F8E94FF;
      font-size:14px;

    }
    .product-notice{
      padding:8px 0 ;
      border-radius: 10px 10px 0 0 ;
      margin:0 -10px 8px ;
      text-align: center;
      background-color: #fcc900;
      color:#fff;
      font-size:14px;
    }

  }
  .quality-padding{
    padding:8px 10px 0 8px;
  }

  .shopping-btn {
    color: #2A2A2A;
    background-color: #FCC900;
    font-size: 16px;
    font-weight: bold;
  }
  .other-open{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:5px 15px;
    color:#f00;
  }
  .product-special{
    color:#6495ED;
    font-size:12px;
    display: flex;
    align-items: center;
  }
  .g_ml_s{
    margin-left: 4px;
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
    .scrollHeight {
      height: 60vh;
    }
  }
  .assistant-content{
    padding-top:20px;
    .assistant-intro{
      text-align: center;
      font-size:15px;
      padding:0 20px 10px;
      line-height:2;
      color:#797979;
      a{
        color:#333;
      }
    }
    .close-btn{
      padding:10px 0 20px;
      text-align: center;
      .btn{
        background:rgb(174, 222, 244);
        color:#333;
        border-radius: 6px;
        font-size:16px;
      }
    }
  }
  .product-tag{
    font-size:15px;
    color:#bebebe;
    padding:2px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .product-count{
    font-size:16px;
    color:#2A2A2A;

  }
  .shopify-img{
    width: 20PX;
    height: 20PX;
    max-width: 100%;
  }
  .scrollContentHeight{
    height:calc(100vh - 50px - 50px)
  }
/deep/.van-icon-search{
  display: none;
}
/deep/.van-search__content{
  background: transparent;
  border:1px solid #EEEEED;
}
/deep/.van-tag--large{
  padding:10px 30px;
  margin-right:8px;
  margin-top: 8px;
}

.s3-order-search-wrapper{
    .order-search-content{
      .order-search-title{
        padding:20px 20px 10px;
        font-size:16px;
        color:#4A4A4A;
      }
      .order-search-list{
        padding:10px;
        flex-wrap: wrap;
        .tag-item{
          background-color:#F2F2F2;
          color:#2A2A2A;
          padding:4px 10px;
          margin:4px;
          border-radius: 4px;
          text-overflow: ellipsis;
          overflow: hidden;
          height:30px;
          line-height:30px;
          width:25%;
          white-space: nowrap;
        }
      }
    }
  .s3-orders-content{
    margin:10px 8px;
  }
  .product-title-quality{
    background-color: #fff;
    font-size:14px;
    color:#0D0D0D;
    .quality_item{
      margin:4px 8px;
    }
    .product-time{
      font-family: SF Pro Text Regular;
      color: #8F8E94FF;
    }
  }
  .product-footer{
    background-color: #fff;
    border-top:1px solid #EEEEED;
    padding:8px 10px;
    border-radius:0 0 4px 4px;
    .product-footer-btn{
      padding:2px 8px;
      margin-bottom: 5px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .track-btn{
        font-size:15px;
        background-color: #fff;
        border-radius: 4px;
        border:1px solid #eeeeeD;
        margin-right: 4px;
      }
      .sim_btn,.confirm_btn{
        font-size:15px;
        background-color: #fcc900;
        color:#2A2A2A;
        border-radius: 4px;
      }
    }
    /deep/.van-button--normal{
      padding:0 6px;
    }
  }
}
  /deep/.van-search__content{
    background-color: #fff;
    border:1px solid #EEEEED;
  }
  .icon-sousuo{
    font-size:24px;
    color:gray;
  }
  /deep/.van-field__left-icon{
    display: none;
  }
  /deep/ .van-nav-bar__title{
    min-width:280px;
  }
</style>
