<template>
  <div class="order-detail-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="navbarOperateHandle('back')"  @click-right="navbarOperateHandle('share')">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989" />
        </template>
        <template #title>
          <div class="navbar-title">{{orderDetail.title}}</div>
        </template>
        <template #right>
          <span class="icon iconfont icon-fenxiang1" v-show="orderDetail.share"></span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <!--      内容开始-->
    <scroll-view  class="contentScroll">
      <template v-if="isRemoved">
        <div class="remove_content d_flex d_flex_center">
          <img src="~assets/images/common/error-cart.png" alt="">
          <h3 class="g_mb_l g_mt_l">The product have been removed or expired</h3>
          <h6  class="color_active font_size_16 look_link" @click="findHandle">Looking for other products</h6>
        </div>
      </template>
      <template v-else>
        <template v-if="isLoading">
          <van-loading type="spinner" color="#fcc900" size="45px"/>
        </template>
        <template v-else>
          <div class="order-detail-content">
            <div class="order-detail-parcel order-detail-box" v-if="toLogistics && toLogistics.content" >
              <div @click="checkLogisticHandle">
                <van-row type="flex" align="center">
                  <van-col span="22">
                    <div class="parcel-left">
                      <van-icon name="logistics"  size="18" color="#fcc900" class="g_mr_l" />
                      <div style="width:90%;">
                        <p class="parcel-status van-ellipsis" :class="{'color_warning':orderDetail.title =='Failed'}">{{toLogistics.content}}</p>
                        <p class="parcel-time">{{toLogistics.createtime | timeFormat('YMDHM')}}</p>
                      </div>
                    </div>
                  </van-col>
                  <van-col span="2" >
                    <van-icon name="arrow" color="gray" size="18"/>
                  </van-col>
                </van-row>
              </div>
            </div>
            <!--收件人 -->
            <div v-if="receiveInfo && receiveInfo.receiver" class="order-detail-recharge order-detail-box">
              <van-row type="flex" align="center">
                <van-col span="6">
                  <div class="recharge-left">
                    <img :src="receiveInfo.countryImage" alt="">
                  </div>
                </van-col>
                <van-col span="18">
                  <div class="recharge-right">
                    <div class="d_flex_between d_flex">
                      <p >{{receiveInfo.countryName}}</p>
                      <!--                    -->
                      <p v-if="receiveInfo.showChange"
                         @click="editAddressHandle"
                         class="d_flex"><van-icon name="edit" size="15" color="#3597FF" class="g_mr-s"/><span class="tag-change">Change</span></p>
                    </div>

                    <p><span class="g_mr_l">{{receiveInfo.receiver}}</span> <span>{{receiveInfo.receivetelephone}}</span></p>
                    <div class="right-add">Address:{{receiveInfo.address}}</div>
                  </div>
                </van-col>
              </van-row>
            </div>
            <!--收件人-->
            <!--商品详情 开始-->
            <div class="order-detail-product order-detail-box" v-if="orderDetail.details">
              <div class="order-detail_no">No.{{shoporder.orderno}}</div>
              <template v-if="orderDetail.details.length>5">
                <product-card type="detail"
                              :order="shoporder"
                              :productID="orderDetail.productid"
                              v-for="(itemFirst,indexFirst) in orderDetail.listFirst" :index="itemFirst.id" :product="itemFirst" :key="itemFirst.id">
                  <div slot="count"><span class="product-count"> x {{itemFirst.qty}}</span></div>
                  <!--                旧价格-->
                  <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="itemFirst.priceold>0 && shoporder == $config.orderStatus.AwaitingPayment">
                    <div class="product-tag-left" >
                      <del>
                        {{itemFirst.productoldcostzar | moneyFormat}}
                        <span v-show="itemFirst.unit >= 30">
                      {{$config.orderUnit[itemFirst.unit]}}
                    </span>
                      </del>
                    </div>
                    <div class="product-tag-right" v-show="itemFirst.originalqty >0">
                      <del>X {{itemFirst.originalqty }}</del>
                    </div>
                  </div>
                </product-card>
                <div class="other-open" v-if="orderDetail.details.length > 5 " @click="showOtherListHandle">
                  {{orderDetail.listFirst.length}} records in total, click to show another {{orderDetail.details.length-5}}
                  <van-icon name="arrow-down" class="g_ml_m"/></div>
                <product-card type="detail"  :productID="orderDetail.productid"
                              :order="shoporder"
                              :index="itemLast.id" :product="itemLast" :key="itemLast.id"
                              v-for="(itemLast,indexLast) in orderDetail.listLast" v-if="orderDetail.isOpen">
                  <div slot="count"><span class="product-count"> x {{itemLast.qty}}</span></div>
                  <div slot="origin" v-if="itemLast.priceoldzar>0"><del>R{{itemLast.priceoldzar}}</del></div>
                  <!--                旧价格-->
                  <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="itemLast.priceold>0 && shoporder == $config.orderStatus.AwaitingPayment">
                    <div class="product-tag-left" >
                      <del>
                        {{itemLast.productoldcostzar | moneyFormat}}
                        <span v-show="itemLast.unit >= 30">
                      {{$config.orderUnit[itemLast.unit]}}
                    </span>
                      </del>
                    </div>
                    <div class="product-tag-right" v-show="itemLast.originalqty >0">
                      <del>X {{itemLast.originalqty }}</del>
                    </div>
                  </div>
                </product-card>
              </template>
              <template v-else>
                <product-card :product="item" type="detail"  :productID="orderDetail.productid"
                              :order="shoporder"
                              v-for="(item,index) in orderDetail.details" :key="index">
                  <div slot="count"><span class="product-count"> x {{item.qty}}</span></div>
                  <div slot="origin" v-if="item.priceoldzar>0"><del>R{{item.priceoldzar}}</del></div>
                  <!--                旧价格-->
                  <div slot="tags"  class="g_mt_s g_mb_s product-tag"  v-show="item.priceold>0 && shoporder == $config.orderStatus.AwaitingPayment">
                    <div class="product-tag-left" >
                      <del>
                        {{item.productoldcostzar | moneyFormat}}
                        <span v-show="item.unit >= 30">
                      {{$config.orderUnit[item.unit]}}
                    </span>
                      </del>
                    </div>
                    <div class="product-tag-right" v-show="item.originalqty >0">
                      <del>X {{item.originalqty }}</del>
                    </div>
                  </div>
                </product-card>
              </template>
            </div>
            <!--商品详情 结束-->
            <!--          备注开始-->
            <div class="order-detail-custome order-detail-box">

              <div class="g_mb_l d_flex d_flex_between"  v-if="orderDetail.productInspection">
                <div class="d_flex">
                  <div class="g_mr_m">Product Inspection(Full Inspection) : </div>
                  <div >
                    <template v-if="orderDetail.productInspection">{{orderDetail.productInspection | moneyFormat}}</template>
                    <template v-else>R0.00</template>
                  </div>
                </div>
                <van-checkbox v-model="checked.quality"   v-if="orderDetail.showUpdateInspectiontype" @change="updateOrderHandle('inspectiontype')"/>
              </div>
              <div class="g_mb_l d_flex d_flex_between" v-if="orderDetail.removeshoeboxcost">
                <div class="d_flex">
                  <div class="g_mr_m">Remove Shoebox : </div>
                  <div >R{{orderDetail.removeshoeboxcost}}</div>
                </div>
                <van-checkbox v-model="checked.removeBox"  v-if="orderDetail.showUpdateRemoveshoebox"  @change="updateOrderHandle('removeshoebox')"/>
              </div>
              <div class="g_mb_l " >
                <div v-if="remarkLength>15">
                  <div class="g_mr_m">
                    Custom Remarks :
                  </div>
                  <div class="d_flex g_mt_m"  @click="editHandle" >
                    <template v-if="shoporder && shoporder.cellphone">
                      <span class="color_blue">+{{shoporder.countrycode}}{{shoporder.cellphone}}{{shoporder.name}}</span>
                      &nbsp;<van-icon size="16" name="edit" color="#3597FF"/>
                    </template>
                    <template v-else>
                      <div class="color_blue g_mr_m">+27</div>
                      &nbsp;<van-icon size="16" name="edit" color="#3597FF"/>
                    </template>
                  </div>
                </div>
                <div v-else>
                  <div class="d_flex">
                    <div class="g_mr_m">
                      Custom Remarks :
                    </div>
                    <div class="d_flex"  @click="editHandle" >
                      <template v-if="shoporder && shoporder.cellphone">
                        <span class="color_blue">+{{shoporder.countrycode}}{{shoporder.cellphone}}{{shoporder.name}}</span>
                        <van-icon size="16" name="edit" color="#3597FF"/>
                      </template>
                      <template v-else>
                        <div class="color_blue g_mr_m">+27</div>
                        <van-icon size="16" name="edit" color="#3597FF"/>
                      </template>
                    </div>
                  </div>
                </div>

              </div>
              <div class="g_mb_l d_flex d_flex_between" v-if="orderDetail.isbig==1">
                <div class="d_flex" >
                  <div class="g_mr_m">Shopify order NO : </div>
                  <div :class="{'color_blue':shoporder.status<$config.orderStatus.Paid}"  @click="editCustomerHandle">
                    <span class="g_mr_m"> {{shoporder.shopifyorderno}}</span>
                    <van-icon name="edit" color="#3597FF" size="16" v-if="shoporder.status<$config.orderStatus.Paid"/>
                  </div>
                </div>
              </div>
            </div>
            <!--          备注END-->
            <!--            质检开始-->
            <div class="order-detail-price" v-if="orderDetail.qualityinspection">
              <div class="toPay-price">
                <div class="toPay-price-title d_flex">
                  <img src="~assets/images/orders/order_quality.png" alt="" class="g_mr_m">
                  <div class="color_orange font_w" v-if="shoporder.status>=37 && shoporder.status<80">{{orderDetail.qualityinspection.qualitypercent}} Pass</div>
                </div>

                <div class="toPay-info" v-if="orderDetail.qualityinspection.qualityqty  > 0">
                  <div class="toPay-info-pass d_flex_between  d_flex g_mb_m">
                    <div class="toPay-info-order-left ">
                      pass {{orderDetail.qualityinspection.entrysiteqty}} item(s)
                    </div>
                    <div class="toPay-info-pass-right" >
                      Unqualified {{orderDetail.qualityinspection.qualityqty}} item(s)
                    </div>
                  </div>
                  <!--                  问题图片 start-->
                  <!--                 -->
                  <van-grid :border="false" :column-num="4"  v-if="orderDetail.qualityinspection.probleimages && orderDetail.qualityinspection.probleimages.length">
                    <van-grid-item v-for="item in orderDetail.qualityinspection.probleimages"
                                   @click="checkImgHandle"
                                   :key="item" class="quality_item">

                      <span class="quality_icon"></span>
                      <van-image :src="item"     height="90" width="90" type="contain"/>
                    </van-grid-item>
                  </van-grid>
                  <!--                  问题图片 end-->
                  <div class="topay-info-quality ">
                    Unqualified item(s) had been retuned to supplier, amount of the item(s) will be refunded to your wallet.
                  </div>
                </div>
              </div>
            </div>
            <!--            质检结束-->
            <div class="order-detail-price">
              <div class="toPay-price b_border_dash">
                <div class="toPay-price-title" >Price Calculation</div>
                <div class="toPay-info">
                  <div class="toPay-info-order d_flex">
                    <template v-if="shoporder && shoporder.newprice == 0 && shoporder.status>=20 ">
                      <div class="g_mb_l  toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Order Value</div>
                        <strong>
                          {{orderValue  | moneyFormat}}
                        </strong>
                      </div>
                      <div class="g_mb_l g_ml_m toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Exchange Lose</div>
                        <div><strong>{{costvo['exchangelosscostzar']/ 100 | moneyFormat}}</strong></div>
                      </div>
                      <div class="g_mb_l  toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Operation Fee</div>
                        <strong>{{costvo['purchasecostzar']/100  | moneyFormat}}</strong>
                      </div>
                      <div class="g_mb_l g_ml_m toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Clearance Service Fee</div>
                        <div><strong>{{costvo['taxpaymentcostzar'] / 100 | moneyFormat}}</strong></div>
                      </div>
                      <div class="g_mb_l  toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Product Inspection Fee</div>
                        <strong>{{costvo['inspectioncostzar']  | moneyFormat}}</strong>
                      </div>
                      <div class="g_mb_l g_ml_m toPay-info-order-item">
                        <div class="color_intro g_mb_m" >Remove Shoebox Fee</div>
                        <div><strong>{{costvo['removeshoeboxcostzar'] / 100 | moneyFormat}}</strong></div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="  toPay-info-order-item g_mb_l">
                        <div class="color_intro g_mb_m" >Order Value</div>
                        <div class="d_flex" @click="orderValueHandle">
                          <strong>{{orderValue  | moneyFormat}}</strong>
                          <van-icon name="arrow" size="15" style="vertical-align: middle" color="#888"/>
                        </div>
                      </div>
                      <div class="g_mb_m  toPay-info-order-item g_mb_l">
                        <div class="color_intro g_mb_m" >Chinese Freight</div>
                        <div><strong>{{costvo.waybillcostzar / 100 | moneyFormat}}</strong></div>
                      </div>
                      <div class="toPay-info-order-item g_mb_l" >
                        <div class="color_intro g_mb_m" >Remove Shoebox Fee</div>
                        <div><strong>{{costvo.removeshoeboxcostzar/100 | moneyFormat}}</strong></div>
                      </div>
                      <div class="toPay-info-order-item"
                           v-if="costvo.qualityinspectiontype==1
                           && shoporder.status>10">
                        <div class="color_intro g_mb_m" >Quality Inspection Fee</div>
                        <div><strong>{{costvo.qualityinspectioncostzar /100 | moneyFormat}}</strong></div>
                      </div>
                    </template>
                    <div class="toPay-info-order-item  g_mb_l">
                      <div class="color_intro  g_mb_m" >S Coin</div>
                      <strong>-{{shoporder.scoin/100 | moneyFormat}}</strong>
                    </div>
                    <div class="toPay-info-order-item" v-if="shopordercost.groupservicefeezar >0">
                      <div class="color_intro g_mb_l" >Group-buy Service Fee</div>
                      <strong >{{shopordercost.groupservicefeezar/100 | moneyFormat}}</strong>
                    </div>
                    <div class="toPay-info-order-item" v-if="shopordercost.bigcustomerservicefeezar >0">
                      <div class="color_intro g_mb_l" >Service Fee</div>
                      <strong >{{shopordercost.bigcustomerservicefeezar/100 | moneyFormat}}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div class="purchase-value">
                <div class="d_flex d_flex_between">
                  <div>
                    <div class="font_w g_mb_m">Purchase Value</div>
                    <div class="purchase-intro color_intro">
                      ({{shoporder.urlcomfrom==2?'Include':'Exclude'}} Int'l Fright Cost)
                    </div>
                  </div>
                  <div class="purchase_pay">
                    <div v-if="shoporder.newprice==0 && shoporder.status >= $config.orderStatus.Paid">
                      {{costvo.totalcostzar/100 | moneyFormat}}
                    </div>
                    <div v-else>
                      <del v-if="showDiscount" class="color_intro">
                        {{discountValue | moneyFormat}}
                      </del>
                      <br>
                      <strong >
                        {{purchaseValue | moneyFormat}}
                      </strong>
                    </div>
                  </div>
                </div>
                <van-notice-bar class="g_mt_l"
                                :scrollable="false" v-if="shoporder.couponmoney > 0"
                >
                  <div class="color_warning coupon-title">Coupons</div>
                  <template #right-icon>
                    <div class="color_warning coupon-title">- R{{shoporder.couponmoney /100 }}</div>
                  </template>
                </van-notice-bar>
              </div>
            </div>
            <!--          package start-->
            <div class="order-detail-package" v-if="shoporder.arrivetime >0">
              <div class="toPay-price-title">
                Package Information
              </div>
              <div class="package-content">
                <van-row type="flex" align="center">
                  <van-col span="8">
                    <div class="package-img">
                      <template v-if="shoporder.entryimages ">
                        <img :src="shoporder.entryimages.split(',')[0]" alt="">
                      </template>
                      <template v-else>
                        <img :src="OrderImg" alt="">
                      </template>
                    </div>
                  </van-col>
                  <van-col span="16" class="text_align_l">
                    <div class="g_mb_l">Weight : {{shoporder.weight }}KG</div>
                    <div>Volume : {{shoporder.length }}cm * {{shoporder.width}}cm * {{shoporder.height}}cm</div>
                    <div
                      @click="relateHandle"
                      v-if="shoporder.expressid > 0 && express.status > 19  && (shoporder.ambassadorteamuserid == 0 || orderDetail.isleader)"
                    ><van-button size="small" class="note-btn">Related Shipping Note</van-button></div>
                  </van-col>
                </van-row>
              </div>

            </div>
            <!--          package end-->
            <!--            orders start-->
            <div class="order-detail-orders">
              <!--             -->
              <div class="toPay-price-title d_flex d_flex_between">
                Orders Information
                <div class="toPay-detail-orders-link"
                     @click="goOtherUrlHandle"  v-if="shoporder.alibabaproductid > 0 && shoporder.urlcomfrom == 0"
                >
                  1688 Link
                </div>
              </div>

              <div class="order-content">

                <van-row class="g_mb_s">
                  <van-col span="12">Type</van-col>
                  <van-col span="12">{{shoporder.ordertype|orderTypeFilter}}</van-col>
                </van-row>
                <van-row type="flex" align="center" class="g_mb_s ">
                  <van-col span="12">Order No</van-col>
                  <van-col span="12" class="b_border">
                    {{shoporder.orderno}}
                    <span v-clipboard:copy="shoporder.orderno" v-clipboard:success="copyHandle">
                      <span class="icon iconfont icon-copy color_blue g_ml_m"></span>
                    </span>
                  </van-col>
                </van-row>
                <van-row class="g_mb_s">
                  <van-col span="12">Create Time</van-col>
                  <van-col span="12">{{ (shoporder.createtime- 6 * 60 * 60 * 1000 ) | timeFormat('YMDHM')}}</van-col>
                </van-row>
                <van-row class="g_mb_s" v-if="shoporder.customerpaytime  >0 ">
                  <van-col span="12">Order Payment Time</van-col>
                  <van-col span="12">{{(shoporder.customerpaytime- 6 * 60 * 60 * 1000)  | timeFormat('YMDHM')}}</van-col>
                </van-row>
                <template v-if="shoporder.expressid!=0 && express ">
                  <van-row class="g_mb_s" v-if="express.paytime >0">
                    <van-col span="12">Freignt Payment Time</van-col>
                    <van-col span="12">{{(express.paytime - 6 * 60 * 60 * 1000) | timeFormat('YMDHM')}}</van-col>
                  </van-row>
                  <van-row type="flex" align="center">
                    <van-col span="8">Tracking No</van-col>
                    <van-col span="16" class="text_align_r">
                      {{express.expressnumber}}
                      <span v-clipboard:copy="express.expressnumber" v-clipboard:success="copyHandle">
                        <i class="icon iconfont icon-copy color_blue g_ml_m"></i>
                       </span>
                    </van-col>
                  </van-row>
                  <van-row type="flex" align="center" v-if="shoporder.finishtime > 0 && shoporder.status == 70">
                    <van-col span="8">Sign Time</van-col>
                    <van-col span="16">
                      {{(shoporder.finishtime- 6 * 60 * 60 * 1000 ) | timeFormat('YMDHM')}}
                    </van-col>
                  </van-row>
                  <van-row type="flex" align="center" v-if="shoporder.canceltime > 0 && shoporder.status == 90">
                    <van-col span="8">Cancel Order Time</van-col>
                    <van-col span="16">
                      {{(shoporder.canceltime - 6 * 60 * 60 * 1000 ) | timeFormat('YMDHM')}}
                    </van-col>
                  </van-row>
                </template>
                <van-row class="g_mb_s" v-if="orderDetail.weigth">
                  <van-col span="12">Weight</van-col>
                  <van-col span="12">{{orderDetail.weigth}}KG</van-col>
                </van-row>

              </div>
            </div>
            <!--            orders end-->
            <!--            我的评价开始-->
            <div class="order-detail-orders" v-if="orderevaluation && orderevaluation.id">
              <!--             -->
              <div class="toPay-price-title">
                My Review
              </div>

              <div class="order-content">
                <div class="order-rate d_flex d_flex_between g_mb_m" >
                  <div>
                    <van-rate v-model="orderevaluation.score1" :size="20" color="#fcc900" void-icon="star" void-color="#eee"/>
                  </div>
                  <div class="color_intro">
                    {{(orderevaluation.createtime - 6 * 60 * 60 * 1000) | timeFormat('YMDHM')}}
                  </div>
                </div>
                <div class="g_mb_m order_rate_inner">{{orderevaluation.description }}</div>
                <div class="order-rate-image d_flex" v-if="orderevaluation.images">
                  <div class="order-rate-image-item" v-for="(item,index) in orderevaluation.images.split(',')" :key="index">
                    <img :src="item" alt="">
                  </div>
                </div>
              </div>
            </div>
            <!--            我的评价结束-->
          </div>
        </template>
        <div class="bottom_space"></div>
      </template>
    </scroll-view>
    <!--    定位-->
    <div class="order-detail-remind">
      <van-button class="remind-btn"
                  @click="orderDetailOperate('remind')"
                  v-if="shoporder.status > $config.orderStatus.AwaitingPayment &&
                        shoporder.status < $config.orderStatus.Signed &&
                        shoporder.status != $config.orderStatus.Failed &&
                        (shoporder.ambassadorteamuserid == 0 || orderDetail.isleader)"

      >Remind</van-button>
      <!--          -->
      <template v-if="shoporder.status == $config.orderStatus.Signed ">
        <van-button class="remind-btn "
                    v-if=" (shoporder.alibabaproductid  > 0 || shoporder.specailproductid  >0)"

                    @click="orderDetailOperate('again')">Buy Again</van-button>
        <van-button class="remind-btn"
                    v-if="orderDetail.afterseviceflg"

                    @click="orderDetailOperate('after')">After Sale</van-button>
      </template>

      <van-button

        v-if="(shoporder.status== $config.orderStatus.Failed || shoporder.status > $config.orderStatus.Signed) && shoporder.ordertype  == 0"
        @click="orderDetailOperate('similar')"
        class="remind-btn ">Similar</van-button>
      <!--        -->
      <van-button class="track-btn "  v-if="shoporder.status== $config.orderStatus.AwaitingPayment"
                  @click="orderDetailOperate('cancel')"
      >Cancel</van-button>
    </div>
    <!--      内容结束-->
    <!--    显示分享狂-->
    <van-share-sheet
      v-model="shareVisible"
      cancel-text="close"
      :options="shareOptions"
      @select="selectShareHandle"
    >
      <template #title>
        <div class="share-title">
          Share to your friends
          <van-icon name="cross" class="share-close-tag" @click="shareVisible = false"/>
        </div>
      </template>
      <template #description>
        <div class="share-title-description b_border">
          <div class="g_mb_s"><span class="color_blue">Tip : </span>Just share pictures and descriptions,your friends won't see the actual price of the goods and shipshopshake's website</div>
          <div class="share-product-info">
            <div class="share-product-info-img">
              <van-swipe  @change="swiperChangeHandle" height="360px" v-if="shareItem.images && shareItem.images.length">
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
                @blur="changeDespHandle"

                type="textarea"
                :placeholder="productDescription"
              />
            </div>
          </div>
        </div>
      </template>
    </van-share-sheet>
    <!--      order value-->
    <van-action-sheet v-model="showPopupVisible" title="Order Value Detail">
      <order-value-popup @confirmEmit="showPopupVisible = false"
                         type="order"
                         :priceCostInfo="costvo"/>
    </van-action-sheet>
    <van-dialog v-model="isVisible" :showConfirmButton="false">
      <template v-if="selectType==='cancel'">
        <common-dialog type="Warning"
                       cancelText="No,Wait and See"
                       confirmText="Yes,Cancel it"
                       :hasTwoBtn="true"
                       confirmColor="#fff"
                       @confirmEmit="cancelOrderHandle"
                       @cancelEmit="isVisible = false"
                       :intro="`Do you confirm cancel the delivery order ?`"/>
      </template>
      <template v-else-if="selectType==='status'">
        <div class="assistant-content">
          <div class="assistant-intro">
            {{statusZn}}
          </div>
          <div class="close-btn">
            <van-button type="default"
                        @click="isVisible = false" class="btn">OK</van-button>
          </div>
        </div>
      </template>
    </van-dialog>
    <van-overlay :show="isWaiting" @click="isWaiting = false">
      <div class="wrapper">
        <van-loading type="spinner" color="#fcc900" size="30"/>
      </div>
    </van-overlay>
    <!--    编辑大客户订单号-->
    <van-dialog v-model="editVisible" title="Edit" :show-confirm-button="false">
      <big-customer-order-edit
        :shopifyorderno="shoporder.shopifyorderno"
        :id="shoporder.id"
        @cancelEmit="editVisible= false"
        @successEmit="editSuccessHandle"
      />
    </van-dialog>
  </div>
</template>

<script>
  import BigCustomerOrderEdit from '@/components/content/BigCustomerOrderEdit'
  import OrderImg from '@/assets/images/orders/order_img.jpg';
  import ScrollView from "@/components/common/ScrollView";
  import ProductCard from '../childComponents/ProductCard';
  import {trackTagFun  ,clickPointFun} from '@/utils';
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint'
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import {ImagePreview} from "vant";
  import {shareInfoApi ,shareInitApi} from '@/api/home'
  import {urlSearchApi} from '@/api/home'
  import config from '@/config'
  import CommonDialog from '@/components/common/CommonDialog'
  import {
    shopOrderRemindApi,
    shopOrderDetailApi ,
    shopOrderUpdateOrderApi,
    shopOrderCancelApi
  } from '@/api/orders'
  import {getCurrentPageSpmID, setRefer, setRefSpm,getUserID} from '@/utils/memory'
  import PriceCalculation from "@/components/content/PriceCalculation";
  import OrderValuePopup from '@/components/content/OrderValuePopup';



  export default {
    name: "index",
    components:{ScrollView ,ProductCard ,PriceCalculation ,OrderValuePopup,CommonDialog ,BigCustomerOrderEdit},
    computed:{
      orderValue(){
        return (this.costvo['productcostzar'] + this.costvo['purchasecostzar'] + this.costvo['taxpaymentcostzar'] + this.costvo['exchangelosscostzar']+this.costvo['extrapricecostzar'])/100
      },
      purchaseValue(){
        return (Number(this.shoporder.totalcostzar?this.shoporder.totalcostzar:0)-
          Number(this.shopordercost.refundamountzar?this.shopordercost.refundamountzar:0)+
          Number(this.shopordercost.groupservicefeezar?this.shopordercost.groupservicefeezar:0)+
          Number(this.shopordercost.bigcustomerservicefeezar?this.shopordercost.bigcustomerservicefeezar:0))/100
      },
      discountValue(){
        return (Number(this.shopordercost.customerpaytotalcostzar?this.shopordercost.customerpaytotalcostzar:0) +
          Number(this.shopordercost.groupservicefeezar?this.shopordercost.groupservicefeezar:0) +
          Number(this.shopordercost.bigcustomerservicefeezar?this.shopordercost.bigcustomerservicefeezar:0))/100
      },
      remarkLength(){
        let val1 = this.shoporder.name?this.shoporder.name.length :0;
        let val2 = this.shoporder.cellphone?this.shoporder.cellphone.length:0;
        let val3=this.shoporder.countrycode?this.shoporder.countrycode.length:0;
        return val1+val2+val3;
      },
      //是否显示原来的价格
      showDiscount(){
        return this.shopordercost.customerpaytotalcostzar > 0 &&
          this.shopordercost.customerpaytotalcostzar  > (this.shoporder.totalcostzar-this.shopordercost.refundamountzar)
      },

    },
    filters:{
      orderTypeFilter(val){return config.orderType[val]}
    },

    data(){
      return{
        isRemoved:false,
        selectType:'',
        isWaiting:false,
        OrderImg,
        isLoading:false,
        shareVisible:false,
        shareOptions:[
          { name: 'Download', icon: require('../../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../../assets/images/home/whatsapp.png') },
        ],
        imgIndex:0,//轮播图的位置
        shareItem:{},//分享产品信息
        shareInfo:{},//分享的内容
        productDescription:'',
        showPopupVisible:false,
        priceCostInfo:{},
        orderDetail:{},//订单详情
        checked:{
          removeBox:false,
          quality:false
        },
        costvo: {} ,
        qualityinspection:{},
        receiveInfo:{},
        shoporder:{},
        shopordercost:{},
        toLogistics:{},
        express:{},
        orderevaluation:{},//评价
        isVisible:false,
        statusZn:'',
        editVisible:false,
        editItem:{}
      }
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'订单详情',
        operate:'close',
        spm:`a0001.订单详情.close.${getCurrentPageSpmID()}`
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
        p:'订单详情',
        operate:'page',
        spm:`a0001.订单详情.page.-1`
      })
      next();
    },
    methods:{
      findHandle(){
        this.$router.replace('/')
      },
      editCustomerHandle(){
        if(this.shoporder.status<this.$config.orderStatus.Paid){
          this.editVisible = true;
        }
      },
      editSuccessHandle(){
        this.editVisible = false;
        this.getOrderDetailHandle()
      },
      //查看路径
      checkLogisticHandle(){
        this.$router.push(`/shoporder/2/logistics/${this.$route.params.id}`)
      },
      //确定取消
      cancelOrderHandle(){
        shopOrderCancelApi(this.shoporder.id).then(res=>{
          if(res.status==0){
            this.$toast({message:'Cancel Success !'});
            this.isVisible = false;
            this.navbarOperateHandle('back')
          }else{
            this.isVisible = false;
            this.$toast({message:res.message})
          }
        })
      },
      orderDetailOperate(type){
        switch (type) {
          case 'remind':
            shopOrderRemindApi(this.shoporder.id).then(res=>{
              if(res.status==0){
                if(res.data.info){
                  this.isVisible = true;
                  this.selectType='status'
                  this.statusZn = res.data.info;
                }else{
                  if(res.data.count==1){
                    this.$toast({message:'Success'});
                  }else{
                    this.isVisible = true;
                    this.selectType='status'
                    this.statusZn = 'Your assitant has already been reminded';
                  }
                }
              }

            })
            break;
          case 'again':
            this.isWaiting = true;
            let spm = `a0001.detail.buyagain.0`
            clickPointFun({
              p:'',
              spm:`a0001.detail.buyagain.0.${getCurrentPageSpmID()}`
            })

            let productId=this.shoporder.specailproductid>0?`sp.${this.shoporder.specailproductid}`:`${this.shoporder.alibabaproductid}`
            let url = `${this.$config.jianweiDomain}/search?spm=${spm}&productid=${productId}`
            window.location.href=url;
            this.isWaiting = false;
            break;
          case 'after':
            let afterURL =`${this.$config.jianweiDomain}/shoporder/workorder/${this.shoporder.id}`
            window.open(afterURL,'online');
            break;
          case 'similar':
            this.isWaiting = true;
            urlSearchApi(this.orderDetail.details[0]['images']).then(res=>{
              if(res){
                this.$router.push({
                  path:'/shoppingmall/imagesearch',
                  query:{
                    key:res,
                    picurl:this.orderDetail.details[0]['images']
                  }
                })
                this.isWaiting = false;
              }

            })
            break;
          case 'cancel':
            this.isVisible = true;
            this.selectType='cancel'
            break;
        }
      },
      //编辑地址
      editAddressHandle(){
        if(!this.receiveInfo.showChange) return;
        this.$router.push({
          path:'/client/2/index',
          query:{
            type:'orderDetail',
            shoporder:this.shoporder.id,
            receivedid:this.shoporder.receivedid|| 0
          }
        })
      },
      //relate点击
      relateHandle(){
        this.$router.push(`/deliveryorder/detail/${this.shoporder.expressid}`);
        // window.open(`${this.$config.jianweiDomain}/deliveryorder/detail/${this.shoporder.expressid}`,'online')
      },
      //复制成功
      copyHandle(event){
        this.$toast({message:'Copy Success !'})
      },
      //1688链接
      goOtherUrlHandle(){
        let url = `https://detail.1688.com/offer/${this.shoporder.alibabaproductid}.html`;
        window.open(url,'online')
      },
      navbarOperateHandle(type){
        switch (type) {
          case 'back':
            this.$router.back()
            break
          case 'share':
            this.shareVisible = true;
            this.shareInitHandle(this.orderDetail.productid)
            break;
        }
      },
      //查看图片
      checkImgHandle(){
        ImagePreview(this.orderDetail.qualityinspection.probleimages)
      },
      //修改订单
      updateOrderHandle(type){
        shopOrderUpdateOrderApi({
          value:type==='removeshoebox'?this.checked.removeBox?1:0:this.checked.quality?2:0,
          id:this.shoporder.id,
          key:type
        }).then(res=>{
          this.getOrderDetailHandle()
        })
      },
      //图片下载
      downloadHandle(){
        let image = new Image();
        image.setAttribute('crossOrigin','anonymous');
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
        this.$toast({message: 'Download succeeded....' });
      },
      swiperChangeHandle(event){
        this.imgIndex = event;
      },
      changeDespHandle(event){
        this.shareInfo = event;
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
      trackTagHandle(page,fun,index){
        trackTagFun({page,fun,index})
      },
      //确定分享
      selectShareHandle(option){
        const { name }= option;
        let value ={}
        switch (name){
          case 'Download':
            this.trackTagHandle(this.$route.name,'download',this.imgIndex)
            //添加谷歌埋点 -Share Now点击后的弹出框，点击Download按钮
            gTagFun('Share to Download','Share to Download','首页')
            this.downloadHandle();
            break;
          case 'Facebook':
            this.trackTagHandle(this.$route.name,'download',this.imgIndex)
            //添加谷歌埋点 --Share Now点击后的弹出框，点击Facebook按钮
            gTagFun('Share to  FB','Share to  FB','首页')

            value =`{"userid":${getUserID()?getUserID():''},"platform":${this.$config.platform.Facebook},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`;
            shareInfoApi(value).then(res=>{
              let url = this.$config.shareURL + res.data.data;
              let producturl =`http://www.facebook.com/sharer/sharer.php?u=${url}`;
              window.open(producturl,'_blank')
            })
            break;
          case 'WhatsApp':
            this.trackTagHandle(this.$route.name,'whatsapp',this.imgIndex)
            //添加谷歌埋点 -Share Now点击后的弹出框，点击Whatsapp按钮
            gTagFun('Share to Whatsapp','Share to Whatsapp','首页')
            value =`{"platform":${this.$config.platform.WhatsApp},"description":"${this.productDescription}","image":"${this.shareItem.images[this.imgIndex]}","title":"${this.shareItem.title}","productid":"${this.shareItem.productid}"}`   ;
            shareInfoApi(value).then(res=>{
              let producturl = this.$config.shareURL + res.data.data;
              var content = (res.description || "") + "\n"+producturl+"\n";
              location.href="whatsapp://send?text="+ encodeURIComponent(content);
            })
            break;
        }
      },
      //编辑姓名
      editHandle(){
        this.$router.push({
          path:'/shopOrder/edit',
          query:{
            id:this.shoporder.id,
            name:this.shoporder.name,
            cellphone:this.shoporder.cellphone,
            countrycode:this.shoporder.countrycode
          }
        })
      },
      //显示order value
      orderValueHandle(){
        this.showPopupVisible = true;
      },
      //显示剩余商品
      showOtherListHandle(){
        this.orderDetail.isOpen = !this.orderDetail.isOpen;
      },
      //获取商品详情
      getOrderDetailHandle(){
        shopOrderDetailApi(this.$route.params.id).then(res=>{
          if(res.status!=0){
            this.isRemoved = true;
          }else{
            let result = res.data;
            if(result.details ){
              if(result.details.length>5){
                result = {...result,...{
                    listFirst:result.details.slice(0,5),
                    listLast:result.details.slice(5),
                    isOpen:false
                  }}
              }
            }
            if(result.qualityinspection && result.qualityinspection.probleimages){
              result.qualityinspection.probleimages = result.qualityinspection.probleimages.split(',');
            }
            this.orderDetail = result;
            const {costvo  ,qualityinspection,receiveInfo,shoporder,shopordercost,toLogistics ,express ,orderevaluation} = result;
            this.costvo =costvo || {};
            this.qualityinspection=qualityinspection||{};
            this.receiveInfo=receiveInfo|| {};
            this.shoporder=shoporder ||{};
            if(this.shoporder.inspectiontype && this.shoporder.inspectiontype===2){
              this.checked.quality = true;
            }
            if(this.shoporder.removeshoebox===1){
              this.checked.removeBox = true;
            }
            this.shopordercost=shopordercost || {};
            this.toLogistics=toLogistics||{};
            this.express = express||{};
            this.orderevaluation = orderevaluation || {}
          }

          this.isLoading = false;

        })
      }
    },
    mounted() {
      this.isLoading = true;
      this.getOrderDetailHandle()
    },


  }
</script>

<style scoped lang="less">
  .remove_content{
    margin:90px auto;
    flex-direction: column;
    .look_link{
      border-bottom:1px solid #fcc900;
    }
  }
  .quality_item{
    position: relative;
    .quality_icon{
      width: 30PX;
      height: 30PX;
      position: absolute;
      z-index:1;
      left:0;
      top: 0;
      background: url('../../../assets/images/common/quality_fail.png') no-repeat;
      background-size: 30PX 30PX;
      border-bottom-right-radius: 12px;
    }
  }
  /deep/.van-field__body{
    background-color: #fff;
    border-radius: 6px;
  }
  /*弹出框*/
  .assistant-content{
    padding-top:20px;
    .assistant-intro{
      text-align: center;
      font-size:14px;
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
        font-size:15px;
      }
    }
  }
  .price-exchange{
    font-size:12px;
    font-weight: 400;
    color:orangered;
  }
  /*弹出狂*/
  .other-open{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:5px 15px 10px;
    background-color: #fff;
    color:#f00;
  }
  .icon-fenxiang1{
    font-size:22px;
    color:grey
  }
  .icon-copy{
    font-size:18px;
  }
  /*分享开始*/
  /deep/ .van-share-sheet__icon{
    border-radius: 50%;
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
  /deep/.van-share-sheet__options{
    padding:5px 10px;
  }
  .share-title-description{
    color:#2A2A2A;
    /deep/.van-cell{
      padding:0 5px;
    }
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
  /deep/ .van-divider{
    margin:2px 0;
  }
  /deep/ .van-field__control{
    padding:2px 8px 0 8px;
    border-radius: 10px;
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
  /*分享结束*/
  .orderDetailScroll{
    height:calc(100vh - 46PX );
    background-color: #EEEEED;
  }
  .contentScroll{
    height:calc(100vh - 46PX);
    background-color: #EEEEED;
  }
  .bottom_space{
    height:50px;
    width:100%;
  }
  .order-detail-wrapper{
    position: relative;
    .order-detail-content{
      .order-detail-box{
        border-radius: 6px;
        margin: 8px 6px;
        background-color: #fff;
      }
      .order-detail_no{
        padding:8px 10px 0;
      }
      /*  物流开始*/
      .order-detail-parcel{
        padding: 10px 20px;
        .parcel-left{
          display: flex;
          align-items: center;
          .parcel-status{
            font-size:13px;
            /*color:#2A2A2A;*/
            margin-bottom: 8px;
          }
          .parcel-time{
            color:grey;
            font-size:13px;
          }
        }
      }
      /*  物流结束*/
      .order-detail-recharge{
        padding: 10px 20px;
        .recharge-left{
          width:64px;
          height:64px;
          img{
            width:100%;
            height:auto;
          }
        }
        .recharge-right{
          p{
            font-size:14px;
            color:#2A2A2A;
            margin:4px 0;
          }
          .tag-change{
            font-size:14px;
            color:#3597FF;
          }
          .right-add{
            font-size:12px;
            color:grey;
          }
        }
      }

      .order-detail-custome{
        padding:10px 20px;
        font-size:14px;
      }
      .toPay-price-title{
        font-size:16px;
        font-weight: 500;
        margin:10px 0 10px 10px;
        padding:2px 0 2px 20px;
        border-left:1px solid #FCC900;
      }
      .order-detail-price{
        padding:6px 0;
        border-radius: 6px;
        margin: 8px 6px;
        background-color: #fff;
        .toPay-price{

          margin-right:-10px;

          .toPay-info{
            margin:10px 0 10px 10px;
            padding:2px 0 2px 20px;
            .topay-info-quality{
              line-height:1.5;
            }
            .toPay-info-pass{
              font-size:14px;
              .toPay-info-pass-right{
                margin-right: 35px;
              }
            }
            .toPay-info-order{
              font-size:14px;
              flex-wrap: wrap;
              .toPay-info-order-item{
                width:48%;
                margin-bottom: 8px;
                .color_intro{
                  font-size:14px;
                }
              }
              .toPay-info-order-right{
                padding-right: 20px;
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
        .purchase-value{
          padding:10px 20px;
          .purchase_pay{
            font-size:15px;
          }
          .purchase-intro{
            font-size:14px;
          }
          .purchase-num{
            font-size:16px;
            font-weight: bold;
          }
          .purchase-discount{
            font-size:13px;
            margin-top: 4px;
          }
          .coupon-title{
            font-size: 15px;
          }
        }
      }
      /*  包裹信息*/
      .order-detail-package{
        padding:6px;
        background-color: #fff;
        margin:8px 6px;
        border-radius: 6px;
        .package-content{
          padding:8px 20px;
          .package-img{
            width:96PX;
            height:96PX;
            img{
              width:96PX;
              height:96PX;
            }
          }
          .note-btn{
            background-color: #f7a54a;
            color:#fff;
            border-radius: 4px;
            margin-top: 12px;
            font-size:13px;
            height:30PX !important;
            line-height:30PX;
          }
        }

      }
      .order-detail-orders{
        padding:6px;
        background-color: #fff;
        margin:8px 6px;
        border-radius: 6px;
        .toPay-detail-orders-link{
          margin-right:15px;
          text-decoration: underline;
          color:lightskyblue;
          font-size:15px;
          text-align: right;
        }
        .order-content{
          padding:8px 20px;
          font-size:14px;
          color:gray;
          line-height:1.8;
          .order_rate_inner{
            word-break: break-all;
          }
        }
      }
    }
    .order-rate-image{
      flex-wrap: wrap;
      .order-rate-image-item{
        width:24%;
        margin:2px;
        img{
          display: block;
          max-width: 100%;
          height: auto;
        }
      }
    }
    .order-detail-remind{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: fixed;
      /*padding:8px 15px;*/
      bottom:0;
      left:0;
      right:0;
      z-index:1;
      background-color: #fff;

      .remind-btn{
        margin:4px 10px  4px 0;
        border-radius: 4px;
        background-color:#f8ac59;
        color:#fff;

      }
      .track-btn{
        margin:4px 10px  4px 0;
        font-size:15px;
        background-color: #fff;
        border-radius: 4px;
        border:1px solid #eeeeeD;
      }
    }
  }
</style>
