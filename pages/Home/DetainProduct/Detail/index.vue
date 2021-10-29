<template>
    <div>
      <van-nav-bar fixed @click-left="goBackHandle">
        <template #left> <van-icon name="arrow-left" size="26" color="#fff"/></template>
      </van-nav-bar>
      <scroll-view class="detainScrollView">
        <common-product-swiper  :images="imagesList"/>
        <div class="detain-product-content">
          <div class="product-name van-multi-ellipsis--l2">{{detailInfo.productname}}</div>
          <div class=" d_flex d_flex_between">
            <div class="product-price">{{detailInfo.pricezar / 100 | moneyFormat}}</div>
            <del class="color_intro font_size_14" v-show="detailInfo.originalpricezar>0">{{detailInfo.originalpricezar/100 | moneyFormat}}</del>
          </div>
        </div>
<!--        usertype-->
<!--        2 显示团运费-->
<!--        4 显示大客户服务费-->
        <div class="notice-bar-content" v-if="detailInfo.usertype==2 || detailInfo.usertype==4">
          <div class="d_flex">
            <div >{{getServiceFeeTitle}}&nbsp;</div>
            <div class="font_w font_size_15">{{serviceFee | moneyFormat}}</div>
          </div>
        </div>
        <div class="detain-product-title">
          List
        </div>
        <div class="detain-product-list">
          <div class="detain-product-item" v-for="(item,index) in detailInfo.detaillist" :key="index">
            <van-row>
              <van-col :span="8">
                <div class="product-img">
                  <img :src="!item.images?noImage:item.images" >
                </div>
              </van-col>
              <van-col :span="16">
                <div class="product-info">
                  <van-notice-bar color="#2a2a2a" wrapable background="#f5f5f5" :scrollable="false">{{item.model}}</van-notice-bar>
                  <div class=" d_flex d_flex_end">qty : <span class="product-count">{{item.qty}}</span></div>
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="detain-product-title">
          Description
        </div>
        <div class="detain-product-intro">
          <van-notice-bar :scrollable="false" text="Dear customer,"/>
          <van-notice-bar wrapable :scrollable="false" text="This product is a SSS Lucky Parcel, and each package includes multiple categories."/>
          <van-notice-bar wrapable :scrollable="false" text="The following are the precautions for purchasing these packages, please do not purchase if you mind:"/>
          <van-notice-bar wrapable :scrollable="false" text="1. After you paid for purchasing, Parcel will be collected to your SSS account, please ship the goods within 7 days, otherwise， they will be refunded and auction again."/>
          <van-notice-bar wrapable :scrollable="false" text="2. The pictures of each package are for reference only, there may be a few errors."/>
          <van-notice-bar wrapable :scrollable="false" text="3. Some products may have some defects."/>

          <template v-if="detailInfo.specialgoods == $config.specialGoodsType.NORMAL">
            <van-notice-bar wrapable :scrollable="false" text="4. The package can be shipped by sea or air."/>
            <van-notice-bar wrapable :scrollable="false" text="5.Shipping costs are based on the measured volume of the actual packages."/>

          </template>
          <template v-else>
            <van-notice-bar wrapable :scrollable="false" text="4. The package can only be shipped by sea (Parcels may contain powdered liquid products )"/>
            <van-notice-bar wrapable :scrollable="false" text="5.Shipping costs are based on the measured volume of the actual packages."/>
          </template>
        </div>
      </scroll-view>
      <div class="product_footer">
        <div class="product_footer-inner d_flex d_flex_between">
          <div>Total : <span class="font_w font_size_15">{{totalMoney/100 | moneyFormat}}</span></div>
          <van-button class="cart_btn" v-prevent-re-click @click="toPayHandle">Pay</van-button>
        </div>
      </div>

      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
      <!--    金额不足的弹出框start-->
      <van-dialog v-model="isVisible" :show-cancel-button="false" :show-confirm-button="false">
        <common-dialog type="error" v-if="visibleType=='noPay'"
                       cancelText="Close"
                       confirmText="Pay&Recharge"
                       confirmBg="#fcc900"
                       confirmBorder="#fcc900"
                       @cancelEmit="isVisible = false"
                       @confirmEmit="goRechargeHandle"
                       :hasTwoBtn="true"
                       title="Your balance is not enough"
                       :intro="`<strong class='color_warning'>Balance : R ${balanceInfo.balance } </strong>`"/>
        <common-dialog type="error" v-else-if="visibleType=='error'"
                       @okEmit="isVisible = false"
                       title="Error"
                       :intro="visibleContent"
        />
        <common-dialog-operate v-else-if="visibleType=='success'">
          <div slot="title">Success</div>
          <div slot="intro" class="color_intro">Cost of goods: <span class="color-price">{{totalMoney/100 | moneyFormat}}</span></div>
          <div slot="footer">
            <div class="d_flex color_blue d_flex_center">
              <div @click="orderOperateHandle('view')">View Order</div>
              <div class="g_mr_m g_ml_m">|</div>
              <div @click="orderOperateHandle('another')">Another Order</div>
            </div>
          </div>
        </common-dialog-operate>
      </van-dialog>
      <!--    确认支付弹出框start-->
      <van-dialog width="90%" v-model="confirmPayVisible"  :show-confirm-button="false" :show-cancel-button="false">
        <template #title>
          <div class="pay-dialog-title d_flex_between d_flex b_border">
            <div class="pay-dialog-title font_w">Total : {{totalMoney/100| moneyFormat}}</div>
            <div class="pay-dialog-close" @click="confirmPayVisible = false ">
              <van-icon name="cross" size="24" color="#ccc"/></div>
          </div>
        </template>
        <common-pay-dialog :balanceInfo="balanceInfo"
                    @confirmPayEmit="confirmPayHandle"
                    :total="totalMoney/100"/>
      </van-dialog>
    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    import CommonProductSwiper from '@/components/common/CommonProductSwiper'
    import {homeAbandonOrderDetailApi,homeAbandonOrderPayApi} from '@/api/home'
    import CommonPayDialog from '@/components/common/CommonPayDialog'
    import CommonDialog from '@/components/common/CommonDialog';
    import CommonDialogOperate from '@/components/common/CommonDialogOperate';
    import noImage from '@/assets/images/common/no_image.jpg'
    export default {
        name: "index",
        components:{ScrollView,CommonProductSwiper,CommonPayDialog,CommonDialog,CommonDialogOperate},
        data(){
          return{
            imagesList:[],
            detailInfo:{},
            confirmPayVisible:false,
            isWaiting:false,
            isVisible:false,
            visibleType:'',
            visibleContent:'',
            noImage
          }
        },
        computed:{
          getServiceFeeTitle(){
            let newValue = '';
            if(this.detailInfo.usertype==2){
              newValue =  'Group-buy Service Fee : ';
            }else if(this.detailInfo.usertype==4){
              newValue = 'Service Fee :  '
            }

            return newValue ;
          },
          serviceFee(){
            let newValue = 0;
            if(this.detailInfo.usertype==2){
              newValue =  this.detailInfo.groupservicefeezar/100;
            }else if(this.detailInfo.usertype==4){
              newValue = this.detailInfo.bigcustomerservicefeezar/100
            }

            return newValue ;
          },
           totalMoney(){
             return this.detailInfo['bigcustomerservicefeezar'] + this.detailInfo['pricezar'] +this.detailInfo.groupservicefeezar
           },
          balanceInfo(){
             return {
               balance:this.detailInfo.balance + this.detailInfo['creditline']
             }
          }
        },
        methods:{
          goRechargeHandle(type){
            this.$EventBus.$emit('toRecharge','checkout')
            this.$router.replace('/user/recharge')
          },
          orderOperateHandle(type){
            this.isVisible =false;
            switch (type) {
                case 'view':
                  this.$EventBus.$emit('toOrder')
                  this.$router.replace('/shoporder/2/index?tagIndex=ship')
                  break;
                case 'another':
                  this.goBackHandle()
                  break;
            }
          },
          goBackHandle(){
            this.$router.back()
          },
          confirmPayHandle(){
            this.confirmPayVisible = false;
            this.isWaiting = true;
            homeAbandonOrderPayApi(this.$route.params.id).then(res=>{
              this.isWaiting = false;
              if(res.status==0){
                this.isVisible = true;
                this.visibleType='success';
              }else{
                this.isVisible = true;
                this.visibleType ='error';
                this.visibleContent = res.message;
              }
            })
          },
          toPayHandle(){
            if(this.totalMoney > this.balanceInfo.balance){
              //余额不足
              this.isVisible = true;
              this.visibleType='noPay'
            }else{
              this.confirmPayVisible = true;
            }
          },
          getDetainOrderDetainHandle(){
            this.imagesList =[]
            homeAbandonOrderDetailApi(this.$route.params.id).then(res=>{
              res.images=res.images?res.images:noImage;
              this.imagesList = [res.images];
              this.detailInfo= res || {};
            })
          }
        },
      mounted() {
        this.getDetainOrderDetainHandle()
      }
    }
</script>

<style scoped lang="less">
  .detain-product-intro{
    /deep/.van-notice-bar{
      background-color: #fff;
    }
    /deep/.van-notice-bar__content{
      font-size:15px;
      color:#2a2a2a;
    }
  }
  //弹出框
  /deep/.van-dialog__header{
    padding-top: 10px;
  }
  .pay-dialog-title{
    padding: 0 10px 5px;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/.van-nav-bar{
    background: transparent;
    box-shadow: none;
  }
  /deep/.van-nav-bar__content:after{
    content: "";
    position: absolute;
    height: 6.5rem;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAADwCAYAAAA5O/XCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRkI2OUVGODY3RjExRThCOTJERTIyMzA2MEU2QzQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRkI2OUYwODY3RjExRThCOTJERTIyMzA2MEU2QzQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZGQjY5RUQ4NjdGMTFFOEI5MkRFMjIzMDYwRTZDNDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZGQjY5RUU4NjdGMTFFOEI5MkRFMjIzMDYwRTZDNDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5L76RvAAAA+klEQVR42uyXawrDMAyDnceNdv+zafuxgbPEwYOyKUOBUGhNsRzZ7VfM7GaJVS25rg/sj43gWfHPdm/EAWJYCl4XOcLdgxdjgaAhmKDgJcizvPLcibGszeSeKTCsZw9sxioGQY5YnUwYTNYKy7aoi+TZTua0QYqdKfqm4CAU4wVNwrKDFN/JMXQPu8MzgfikFUDUriUqek9+PlhmT8nmiAN/r9laAYvrMINqEMTcCuIZ8Yx4RjwjnhHPiGfEM+IZ8Yx4RjwjnpF7xDPiGfGMeEY8I565imfac5Pk+P8807Jv/aGY5j61x/OMF3M8zzRuh0+Oeb8OMXcBBgDC0tDJbEEQNgAAAABJRU5ErkJggg==);
    background-repeat: repeat-x;
    background-position: 50%;
    background-size: contain;
  }
  /deep/.van-hairline--bottom::after{
    border-bottom:none;
  }
  .product-title-right{
    .product-btn{
      color: #fff;
      width: 36px;
      height:  36px;
      opacity: 0.5;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
    }
    .product-btn-cart{
      background:#000 url('~assets/images/common/icon_list_cart.svg') no-repeat 50%;
      width:36px;
    }
    .product-btn-share{
      background: #000 url('~assets/images/common/share.svg') no-repeat 50%;
      width:36px;
    }
    .product-btn-more{
      background: #000 url('~assets/images/common/icon_more.svg') no-repeat 50%;
      width:36px;
    }

  }
  .detainScrollView{
    height:calc(100vh - 49px);
    /*background-color:red;*/

  }
  .detain-product-content{
    padding:6px 10px;
    .product-name{
      font-size:16px;
    }
    .product-price{
      margin:8px 0;
      font-weight: bold;
      font-size: 20px;
      color:red;
    }

  }
  .notice-bar-content{
   padding:15px;
    margin: -2px 10px 10px;
    border-radius: 4px;
    background-color: #f5f5f5;
    font-size:14px;

  }
  .detain-product-title{
    margin: 0 10px;
    font-size:20px;
    padding-bottom: 10px;
    border-bottom:1px solid #FCC900;
  }
  .detain-product-intro{
    padding-bottom: 20px;
  }
  .detain-product-list{
    margin:15px 8px;
    .detain-product-item{
      padding:10px 8px;
      border:1px solid #EEEEED;
      border-radius: 4px;
      margin-bottom: 12px;
      .product-img{
        width:65px;
        height:65px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }
      .product-info{
        /deep/.van-notice-bar{
          border-radius: 6px;
        }
        .product-count{
          padding:10px 4px;
          font-size:16px;


        }
      }

    }
  }
  .product_footer{
    position: fixed;
    bottom:0;
    right:0;
    left:0;
    z-index:10;
    background-color: #fff;
    /*height:49px;*/
    .product_footer-inner{
      box-shadow: 10px 10px 10px 8px rgba(0, 0, 0, 0.2);
      padding:7px;
      .cart_btn{
        margin-right:10px;
        border-radius: 5px;
        width:30%;
        font-size:16px;
        background-color: #fcc900;
      }
    }
  }
</style>
