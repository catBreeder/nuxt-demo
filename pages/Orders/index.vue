<template>
  <div class="s3-orders-wrapper">
    <van-sticky>
      <van-nav-bar>
        <template #title>
          <div class="navbar_title">Orders</div>
        </template>
        <template #right>
          <router-link to="/shoporder/2/search">
            <i class="icon iconfont icon-sousuo"></i>
          </router-link>
        </template>
      </van-nav-bar>
      <div class="s3-orders-content-top">
        <div class="s3-orders-banner" @click="goAdsHandle">
          <img :src="imgInfo.image" alt="">
        </div>
        <tab-title :tag-list="tagList" :tab-index-prop="tagIndex" @tabChangeEmit="changeStatusHandle"/>
      </div>
    </van-sticky>
    <div ref="container">
      <scroll-view class="scrollViewHeight"
                   :class="{'scrollShipHeight':tagIndex=='ship' || (tagIndex=='combine' && ( userType== $config.orderUserType.MANAGER ) ),}"
                   @reachBottom="loadMoreHandle">
        <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
        <template v-else>
          <template>
            <operation-flow :tag-index="tagIndex" v-if="operateFlowVisible"/>
            <template  v-if="tagIndex=='transit' || tagIndex=='comment'">
              <div class="orderType-box" v-if="tagIndex=='transit'">
                <van-checkbox-group v-model="result" direction="horizontal" @change="filterHandle">
                  <van-checkbox name="1"><strong>Air transport</strong></van-checkbox>
                  <van-checkbox name="2"><strong>Ocean</strong></van-checkbox>
                </van-checkbox-group>
              </div>
              <template v-if="expressList.length">

                <div class="s3-orders-content" v-for="(express,index) in expressList" :key="express.id">
                  <div class="product-title ">
                    <div class="product-notice" v-if="userType == $config.orderUserType.MEMBER && express.shoporderList[0].leadname ">
                      In precess by shipping ambassador - {{express.shoporderList[0].leadname}}
                    </div>
                    <div class="d_flex d_flex_between ">
                      <div class="d_flex product-title-padding" @click="checkExpressOrderHandle(express)">
                        <span class="color_orange b_border"> No.{{express.expressnumber}}</span>
                        <img src="~assets/images/orders/icon_boat.png" alt="" class="g_ml_s shopify-img" v-if="express.isOcean">
                        <img src="~assets/images/orders/icon_fly.png" alt="" class="g_ml_s shopify-img" v-else>
                      </div>
                      <div class="product-time d_flex product-title-padding" :style="{'color':$config.orderStatusColor[express.status]}"
                           @click="checkStatusHandle(express.status,'transit')">
                        {{express.statusStr | strSpliceFilter}} <van-icon name="question-o" class="g_ml_s" size="13" />
                      </div>
                    </div>
                  </div>
                  <div class="product-title-quality d_flex d_flex_between "
                       :class="{'quality-padding':express.receiver}">
                    <div class="color_blue quality_item"  >
                    </div>
                    <div class="color_blue quality_item" v-show="express.receiver">
                      <van-icon name="manager-o" /> : {{express.receiver }}
                    </div>
                  </div>
                  <div class="s3-order-content-bottom">
                    <section v-if="express.shopOtherList && express.shopOtherList.length<=5">
                      <product-card :product="product" :order="product" type="comment"
                                    v-for="(product,productIndex) in express.shopOtherList" :key="productIndex">
                        <div slot="count"><span class="product-count"> x {{product.qty}}</span></div>
                      </product-card>
                    </section>
                    <section v-else-if="express.shopOtherList && express.shopOtherList.length>5">
                      <product-card v-for="productFirst in express.shopOtherFirst"
                                    :product="productFirst" :order="productFirst" type="comment"
                                    :key="productFirst.id">
                        <div slot="count"><span class="product-count"> x {{productFirst.qty}}</span></div>
                      </product-card>
                      <div class="other-open" v-if=" express.shopOtherList && express.shopOtherList.length>5 && !express.isOpen"
                           @click="showCommentOtherOrderList(express)">
                        {{express.shopOtherList.length}} records in total, click to show another {{express.shopOtherList.length-5}}
                        <van-icon name="arrow-down" class="g_ml_m"/>
                      </div>
                      <div v-if="express.isOpen">
                        <product-card v-for="productLast in express.shopOtherLast"
                                      type="comment"
                                      :product="productLast" :order="productLast"
                                      :key="productLast.id" >
                          <div slot="count"><span class="product-count"> x {{productLast.qty}}</span></div>
                        </product-card>
                      </div>
                    </section>
                  </div>
                  <div class="product-footer">
                    <div class="d_flex d_flex_between">
                      <div></div>
                      <div class="product-footer-btn" v-if="tagIndex=='transit'">
                        <van-button
                          v-if="express.status > $config.orderStatus.AwaitingPayment && express.status < $config.orderStatus.Shipped && express.status!= $config.orderStatus.Failed"
                          @click="confirmOrderHandle(express,'remind')"
                          class="sim_btn">Remind</van-button>
                        <van-button class="track-btn"

                                    @click="confirmOrderHandle(express.shoporderList[0],'track')">Track Parcel</van-button>
                        <van-button class="track-btn "

                                    v-if="express.status <= $config.orderStatus.AwaitingPayment && userType == $config.orderUserType.MANAGER"
                                    @click="confirmOrderHandle(express,'cancel')">Cancel</van-button>
                        <van-button class="sim_btn "

                                    v-if="express.status>$config.orderStatus.Paid && !express.shoporderList[0].leadname"
                                    @click="confirmOrderHandle(express,'sign')">Sign</van-button>
                      </div>
                      <div class="product-footer-btn" v-else-if="tagIndex=='comment'">
                        <van-button @click="confirmOrderHandle(express,'comment')"
                                    class="sim_btn" v-if="express.canevaluation==1">Parcel Reviews</van-button>
                        <van-button @click="confirmOrderHandle(express,'checkComment')"
                                    class="track-btn" v-else>See Parcel Reviews</van-button>
                      </div>
                    </div>
                    <div class="product-track" v-if="express.status>=10">
                      <van-notice-bar @click="confirmOrderHandle(express.shoporderList[0],'track')" :scrollable="false" color="#8B8682" background="#F2F2F2" :text="express.record">
                        <template #left-icon>
                          <img src="~assets/images/orders/icon_car.png" alt="" width="26" height="26">
                        </template>
                      </van-notice-bar>
                    </div>
                  </div>
                </div>
                <div class="list_bottom" v-if="expressList.length>=4">
                  <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
                  <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
                </div>
              </template>
              <template v-else>
                <van-empty
                  class="custom-image animate__animated animate__bounceInUp" description="No Orders Found">
                  <img src="~assets/images/cart/empty.png" alt="" slot="image">
                  <van-button round  class="shopping-btn" @click="goOtherUrlHandle">Shopping Now</van-button>
                </van-empty>
              </template>
            </template>
            <template v-else>
              <van-sticky offset-top="198">
                <van-tabs  v-if="tagIndex=='combine'" v-model="shipTab" @click="shipTabHandle">
                  <van-tab title="Ocean Shipping" name="1"/>
                  <van-tab title="Air Freight" name="2"/>
                </van-tabs>
              </van-sticky>

              <template v-if="shopOrders.length">
                <div class="s3-orders-content" v-for="(item,index) in shopOrders" :key="index">
                  <div class="s3-order-content-bottom">
                    <div class="product-title " >
                      <!--                  头部-->
                      <div class="product-notice " v-if="item.leadname || item.customername ">
                        <!--                      v-if="( tagIndex=='ship' && userType == $config.orderUserType.MEMBER && item.leadname) || (tagIndex=='combine' && userType == $config.orderUserType.MEMBER && item.leadname)"-->
                        <span v-if="item.leadname"> In process by shipping ambassador - {{item.leadname}}</span>
                        <span v-if="item.customername">Customer's order - {{item.customername}}</span>
                      </div>
                      <div class="product-title-padding g_pt_m g_mb_m" v-if="item.shopifyorderno">
                        <img v-show="item.shopifyorderno"  src="https://shop.shopshipshake.com/resources/images/icon-shopify.svg" alt="" class="g_mr_s shopify-img">
                        <span class="color_blue">{{item.shopifyorderno}}</span>
                      </div>
                      <div class=" d_flex d_flex_between product-title-padding g_pt_s">
                        <div class="d_flex">
                          <van-checkbox :disabled="item.leadname && userType == $config.orderUserType.MEMBER && tagIndex=='combine'"
                                        @click="chooseItemHandle(item)"
                                        v-model="item.isCheck"
                                        v-if="tagIndex=='ship' || tagIndex=='combine'" icon-size="18" class="g_mr_m"/>
                          No.{{item.orderno}}
                        </div>
                        <div class="product-time d_flex" :style="{'color':$config.orderStatusColor[item.status]}" @click="checkStatusHandle(item.status,'normal')">
                          {{item.statusStr | strSpliceFilter }} <van-icon name="question-o" class="g_ml_s" size="13" />
                        </div>
                      </div>
                    </div>
                    <!--              海运 和 地址-->
                    <div class="product-title-quality d_flex d_flex_between" :class="{'quality-padding':item.specialgoods == 2 && item.status ==$config.orderStatus.Collected}">
                      <div class="quality_item">
                        <!--                      qualityinspectiontype eq 1 && so.status > 10-->
                        <div @click="showQualityHandle" v-show="item.qualityinspectiontype == 1 && item.status > $config.orderStatus.AwaitingPayment">
                          <img src="~assets/images/orders/order_quality.png" alt="">
                        </div>
                      </div>
                      <div class="quality_item">
                        <div class="product-time g_mt_s d_flex" @click="confirmOrderHandle(item,'editName')" v-show="item.cellphone">
                          {{item.name}}&nbsp;{{item.countrycode}}{{item.cellphone}}
                          &nbsp;<van-icon name="edit" color="#00BFFF"/>
                        </div>
                      </div>
                    </div>
                    <!--              免费存储空间-->
                    <div class="product-title-quality d_flex d_flex_between " :class="{'quality-padding':item.storagedays>0 || item.receiver}">
                      <div class="color_blue quality_item"  >
                        <div v-show="item.storagedays>0">
                          Free storage : <strong>{{item.storagedays}}</strong> Ds left
                        </div>
                      </div>
                      <div class="color_blue quality_item" v-show="item.receiver">
                        <van-icon name="manager-o" /> : {{item.receiver }}
                      </div>
                    </div>
                    <!--订单详情-->
                    <template v-if="item.shoporderdetails && item.shoporderdetails.length<=5">
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
                    <template v-else-if="item.shoporderdetails && item.shoporderdetails.length>5">
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
                      <template v-if="tagIndex=='ship' &&  userType == $config.orderUserType.MEMBER && item.leadname">
                        <!--                    已经参团的数据-->
                        <div class="product-footer-btn">
                          <van-button class="track-btn"
                                      v-if="item.status>$config.orderStatus.AwaitingPayment && item.status < $config.orderStatus.Signed"
                                      @click="confirmOrderHandle(item,'track')">Track Parcel</van-button>
                          <van-button class="track-btn"
                                      v-if="item.shareflg == 1"
                                      @click="confirmOrderHandle(item,'share')">share</van-button>
                        </div>
                      </template>
                      <template v-else-if="tagIndex=='combine'">
                        <div class="product-footer-btn">
                          <van-button class="track-btn"
                                      v-if="item.status>$config.orderStatus.AwaitingPayment && item.status < $config.orderStatus.Signed"
                                      @click="confirmOrderHandle(item,'track')">Track Parcel</van-button>
                          <van-button
                            v-if="item.status > $config.orderStatus.AwaitingPayment && item.status < $config.orderStatus.Shipped && item.status!= $config.orderStatus.Failed"
                            @click="confirmOrderHandle(item,'remind')"
                            class="sim_btn">Remind</van-button>
                        </div>
                      </template>
                      <template v-else>
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
                      </template>
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
                <div class="list_bottom" v-show="shopOrders.length>=4">
                  <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
                  <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
                </div>
              </template>
              <van-empty v-else
                         class="custom-image animate__animated animate__bounceInUp" description="No Orders Found">
                <img src="~assets/images/cart/empty.png" alt="" slot="image">
                <van-button round  class="shopping-btn" @click="goOtherUrlHandle()">Shopping Now</van-button>
              </van-empty>
              <van-empty v-else
                         class="custom-image animate__animated animate__bounceInUp" description="No Orders Found">
                <img src="~assets/images/cart/empty.png" alt="" slot="image">
                <van-button round  class="shopping-btn" @click="goOtherUrlHandle()">Shopping Now</van-button>
              </van-empty>
            </template>

          </template>
        </template>
      </scroll-view>
    </div>

    <!--      定位-->
    <div class="pay-box" v-if="tagIndex=='ship' || tagIndex=='combine'">
      <div class="d_flex_between d_flex " :class="{'pay-content':tagIndex=='ship' || (tagIndex=='combine' && userType==$config.orderUserType.MANAGER)}">
        <van-checkbox v-model="allTotalFlag"
                      @change="allCheckHandle"
                      v-show="tagIndex=='ship' || (tagIndex=='combine' && userType == $config.orderUserType.MANAGER)" icon-size="17" class="g_mr-s">Select all</van-checkbox>
        <div class="d_flex">
          <!--          是团员显示-->
          <!--          <van-button class="cancel-btn group-btn" v-if="userType == $config.orderUserType.MEMBER" @click="groupShipHandle">Group Ship</van-button>-->
          <van-button class="pay-btn" @click="payHandle" v-if="tagIndex=='ship'">Pay({{chooseLength}})</van-button>
          <van-button class="pay-btn" @click="combineHandle" v-if="tagIndex=='combine' && userType== $config.orderUserType.MANAGER">Combine({{chooseLength}})</van-button>
        </div>
      </div>
    </div>
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

    <!--    状态弹出框 和 power L-->
    <van-dialog v-model="isVisible" :showConfirmButton="false">
      <template v-if="dialogVisible">
        <div class="assistant-content">
          <div class="assistant-intro">
            <template  v-if="selectType=='status' || selectType=='remind'">
              {{statusZn}}
            </template>
            <template v-else-if="selectType=='sea'">
              According to Chiness law,powder and liquid goods cannot be transported by air.Only can be transported by Ocean
            </template>
          </div>

          <div class="close-btn">
            <van-button type="default"
                        @click="isVisible = false" class="btn">{{selectType=='status'?'Close':'OK'}}</van-button>
          </div>
        </div>
      </template>
      <template v-else-if="selectType=='confirm'">
        <common-dialog type="info"
                       title="Warning"
                       cancelText="No"
                       confirmText="Yes"
                       :hasTwoBtn="true"
                       @confirmEmit="confirmCloseHandle"
                       @cancelEmit="isVisible = false"
                       :intro="`Are you Sure?`"/>
      </template>
      <template v-else-if="selectType=='onlyOne'">
        <common-dialog
          type="info"
          :fontSize="15"
          title="Warning"
          @okEmit ="isVisible = false"
          intro="Please select at least one" />
      </template>
      <template v-else-if="selectType=='payError'">
        <common-dialog
          type="info"
          :fontSize="15"
          title="Warning"
          @okEmit ="isVisible = false"
          intro="One Item ship rejected！ Please choose group ship or subscribe gold membership." />
      </template>
      <template v-else-if="selectType=='cancel'">
        <common-dialog type="Warning"
                       cancelText="No"
                       confirmText="Yes"
                       :hasTwoBtn="true"
                       @confirmEmit="cancelHandle"
                       @cancelEmit="isVisible = false"
                       :intro="`Do you confirm cancel the delivery order ?`"/>
      </template>
      <template v-else-if="selectType=='deliveryorder'">
        <common-dialog type="info"
                       cancelText="Reselect"
                       confirmText="Use"
                       confirmBg="#fcc900"
                       confirmBorder="#fcc900"
                       :hasTwoBtn="true"
                       @confirmEmit="deliveryOrderHandle('cancel')"
                       @cancelEmit="deliveryOrderHandle('confirm')"
                       :intro="`The goods you want to ship contains powder or liquid<br/>To ship these goods,you should choose Ocean Shipping`"/>
      </template>
      <template v-else-if="selectType=='reject'">
        <common-dialog type="info"
                       cancelText="No"
                       confirmText="Yes"
                       :hasTwoBtn="true"
                       @confirmEmit="rejectHandle"
                       @cancelEmit="isVisible = false"
                       intro="Are you sure you want to reject 1 orders"/>

      </template>
      <template v-else-if="selectType=='sign'">
        <common-dialog type="info"
                       cancelText="No"
                       confirmText="Yes"
                       :hasTwoBtn="true"
                       confirmBg="#fcc900"
                       confirmBorder="#fcc900"
                       @confirmEmit="signHandle"
                       @cancelEmit="isVisible = false"
                       intro="Are you sure sign?"/>
      </template>
      <template v-else-if="selectType=='sendAllModel'">
        <common-dialog
          type="info"
          :fontSize="15"
          title="Warning"
          @okEmit ="isVisible = false"
          :intro="payModelIntro" />
      </template>
    </van-dialog>
    <!--loading-->
    <van-overlay :show="isWaiting" >
      <div class="wrapper">
        <van-loading type="spinner" color="#fcc900" size="30"/>
      </div>
    </van-overlay>
    <!--    包裹评价弹出框-->
    <van-popup v-model="evaluateVisible"  round @click-overlay="closeRateHandle">
      <div class="evaluate-content-wrapper"  @click.stop>
        <div class="evaluate-content-title d_flex d_flex_between">
          <div>
            <div class="font_size_title g_mb_m">Quick-quiz to get <span class="color_orange">{{evaluateInfo.scoin}}</span> S Coin</div>
            <div class="font_size_normal">Arrive in <span class="color_orange"> two</span> working days</div>
          </div>
          <div>
            <van-icon name="cross" size="20" @click="closeRateHandle"/>
          </div>
        </div>
        <scroll-view class="evaluateScroll">

          <div class="evaluate-content-box ">
            <!--          商品详情-->
            <div class="evaluate-goods-box" v-if="evaluateInfo.expressnumber">
              <div class="goods-box-title g_mb_l">
                <div class="font_size_15 g_mb_m">{{evaluateInfo.expressnumber}}</div>
                <div class="font_size_12 text_align_r">
                  <span class="color_intro">{{evaluateInfo.finishtime}}</span>
                  <span class="color_orange">Signed</span>
                </div>
              </div>
              <div class="goods-box-list g_mb_l" v-if=" evaluateInfo.totalnum && evaluateInfo.totalnum>0">
                <van-grid :border="false" :column-num="4">
                  <van-grid-item v-if="evaluateInfo.img1">
                    <van-image :src="evaluateInfo.img1" />
                  </van-grid-item>
                  <van-grid-item v-if="evaluateInfo.img2">
                    <van-image :src="evaluateInfo.img2" />
                  </van-grid-item>
                  <van-grid-item v-if="evaluateInfo.img3">
                    <van-image :src="evaluateInfo.img3" />
                  </van-grid-item>
                  <van-grid-item>
                    <div class="d_flex">Total <span class="color_orange font_w font_size_title g_ml_m">{{evaluateInfo.totalnum}}</span></div>
                  </van-grid-item>
                </van-grid>
              </div>
              <div class="goods_rate g_mb_m">
                <van-row>
                  <van-col span="14"><div class="good-intro-title g_mr_l">International Logistic</div></van-col>
                  <van-col span="10"><van-rate
                    v-model="evaluateInfo.score2"
                    :readonly="evaluateInfo.readonly==1"
                    :size="20"
                    @change="updateOrderHandle('logistic')"
                    color="#fcc900"
                    void-icon="star"
                    void-color="#eee"/></van-col>
                </van-row>
              </div>
              <div class="goods_rate g_mb_l">
                <van-row>
                  <van-col span="14"><div class="good-intro-title g_mr_l">Client Service</div></van-col>
                  <van-col span="10"><van-rate
                    @change="updateOrderHandle('service')"
                    :readonly="evaluateInfo.readonly==1"
                    v-model="evaluateInfo.score1" :size="20"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"/></van-col>
                </van-row>
              </div>
              <div class="goods_rate g_mb_l" v-if="evaluateInfo.evaluateambassador==1">
                <van-row>
                  <van-col span="14"><div class="good-intro-title g_mr_l">Ambassador Services</div></van-col>
                  <van-col span="10"><van-rate
                    @change="updateOrderHandle('ambassador')"
                    :readonly="evaluateInfo.readonly==1"
                    v-model="evaluateInfo.ambassadorscore" :size="20"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"/></van-col>
                </van-row>
              </div>
              <div class="goods_remark g_mb_l" v-if="evaluateInfo.evaluateambassador==1">
                <van-field
                  v-model="evaluateInfo.valuationcontentambassador"
                  rows="1"
                  :disabled="evaluateInfo.readonly==1"
                  @blur="updateOrderHandle('ambassadorContent')"
                  type="textarea"
                  maxlength="50"
                  placeholder="suggestions and comments"
                  show-word-limit
                />
              </div>
              <div class="g_mb_l">
                <div>Will you shop again via ShopshipShake?</div>
                <div class="d_flex d_flex_between g_mt_s">
                  <van-radio-group v-model="evaluateInfo.intentionflg"
                                   :disabled="evaluateInfo.readonly==1"
                                   direction="horizontal">
                    <van-radio :name="1"  @click="updateOrderHandle('again')" icon-size="16">Yes</van-radio>
                    <van-radio :name="2"   @click="updateOrderHandle('again')" icon-size="16">No</van-radio>
                  </van-radio-group>
                </div>
              </div>
              <div class="goods_remark">
                <van-field
                  v-model="evaluateInfo.valuationcontent"
                  rows="1"
                  :disabled="evaluateInfo.readonly==1"
                  @blur="updateOrderHandle('comments')"
                  type="textarea"
                  maxlength="50"
                  placeholder="suggestions and comments"
                  show-word-limit
                />
              </div>
              <van-sticky :container="evaluateRef" :offset-top="60">
                <div class="goods_btn-area">
                  <van-button class="close-btn" @click="closeRateHandle">Close</van-button>
                  <van-button class="submit-btn" v-if="evaluateInfo.readonly!=1" @click="submitHandle">Submit</van-button>
                </div>
              </van-sticky>

            </div>
            <!--          商品详情-->
            <div class="goods-list-box" v-if="orderevaluationVoList.length">
              <input type="file" ref="inputRef" class="upload-input" accept="image/*"  @change="uploadFileHandle">
              <div class="goods-list-title">
                <span>To better service,</span>
                <br>
                please write your advice about the products</div>
              <div class="goods-list">
                <div class="goods-list-item g_pt_m b_border_dash" v-for="(item,index) in orderevaluationVoList" :key="index">

                  <van-row type="flex" align="center">
                    <van-col span="6">
                      <div class="goods-img">
                        <img :src="item.image" alt="">
                      </div>
                    </van-col>
                    <van-col span="17" offset="1">
                      <van-radio-group v-model="item.satisfied"  :disabled="evaluateInfo.readonly==1"  direction="horizontal">
                        <van-radio :name="1" @click="goodChangeHandle(item,'statify')" icon-size="15">satisfied</van-radio>
                        <van-radio :name="0" @click="goodChangeHandle(item,'statify')" icon-size="15">unsatisfied</van-radio>
                      </van-radio-group>
                      <div class="g_mt_s">
                        <van-field
                          v-model="item.description"
                          rows="1"
                          :disabled="evaluateInfo.readonly==1"
                          type="textarea"
                          @blur="goodChangeHandle(item,'remark')"
                          placeholder="want to say something?"
                        />
                      </div>
                      <van-grid class="g_mt_m">
                        <van-grid-item >
                          <div class="upload-item" @click="uploadImgHandle(item,0)">
                            <div class="upload-item-mask" v-if="evaluateInfo.readonly==1"/>
                            <img :src="item.imageList[0]" alt="" v-if="item.imageList && item.imageList[0]">
                            <i class="iconfont icon icon-shangchuan" v-else></i>
                          </div>
                        </van-grid-item>
                        <van-grid-item >

                          <div class="upload-item" @click="uploadImgHandle(item,1)">
                            <div class="upload-item-mask" v-if="evaluateInfo.readonly==1"/>
                            <img :src="item.imageList[1]" alt="" v-if="item.imageList && item.imageList[1]">
                            <i class="iconfont icon icon-shangchuan" v-else></i>
                          </div>
                        </van-grid-item>
                        <van-grid-item >
                          <div class="upload-item" @click="uploadImgHandle(item,2)">
                            <div class="upload-item-mask" v-if="evaluateInfo.readonly==1"/>
                            <img :src="item.imageList[2]" alt="" v-if="item.imageList && item.imageList[2]">
                            <i class="iconfont icon icon-shangchuan" v-else></i>
                          </div>
                        </van-grid-item>
                        <van-grid-item >
                          <div class="upload-item" @click="uploadImgHandle(item,3)">
                            <div class="upload-item-mask" v-if="evaluateInfo.readonly==1"/>
                            <img :src="item.imageList[3]" alt="" v-if="item.imageList && item.imageList[3]">
                            <i class="iconfont icon icon-shangchuan" v-else></i>
                          </div>
                        </van-grid-item>
                      </van-grid>
                    </van-col>
                  </van-row>
                </div>

              </div>
            </div>
          </div>
        </scroll-view>

      </div>
    </van-popup>
  </div>
</template>
<script>
  import ProductCard from './childComponents/ProductCard';
  import ScrollView from "@/components/common/ScrollView";
  import OperationFlow from './childComponents/OperationFlow'
  import StandardDialog from '../Cart/childComponent/StandardDialog'
  import CommonDialog from '@/components/common/CommonDialog'
  import {urlSearchApi,homePopupDraftApi,homePopupHandleApi,homeReadPopupApi} from '@/api/home'
  import {commonBannerAdvListApi} from '@/api/common'
  import TabTitle from './childComponents/TabTitle'
  import {
    shopOrderListApi,
    shopOrderCountApi,
    shopOrderConfirmApi,
    shopOrderRemindApi,
    shopOrderCancelApi,
    shopOrderSendAllApi,
    shopOrderGroupShipApi,
    orderCommentEvaluationDraftApi,
    shopOrderRejectApi,
    shopOrderSignApi
  } from '@/api/orders'
  import {accountBasicInfoApi} from '@/api/account'
  import {getCurrentPageSpmID,setRefSpm,setRefer} from "@/utils/memory";
  import {loginRegisterPageBury} from '@/utils/buryPoint/buryPoint';
  import config from '@/config'
  export default {
    head(){
      return {
        title:'My Orders - shopshipshake'
      }
    },
    name: "index",
    components:{
      ProductCard ,ScrollView ,
      OperationFlow ,
      StandardDialog,
      CommonDialog,
      TabTitle

    },
    data(){
      return {
        isLoading:true,
        orderList:[],
        tagList:[
          {name:'All',count:'',val:'all'},//1
          {name:'Purchase',count:'',val:'purchase'},//3
          {name:'To Ship',count:'',val:'ship'},//4
          {name:'Combine',count:'',val:'combine'},//8
          {name:'In Transit',count:'',val:'transit'},//5
          {name:'Completed',count:'',val:'complete'},//6
          {name:'Failed',count:'',val:'fail'},//7
          {name:'Comment',count:'',val:'comment'},//9
        ],
        tagIndex:'all',
        isVisible:false,//是否显示问号的内容
        page:1,
        pageCount:1,
        shopOrders:[],//order列表
        statusDes:{},//状态描述
        operateFlowVisible:false,//是否显示流程
        qualityInfoVisible:false,//质检弹出框
        statusZn:'',//状态的内容
        selectType:'',
        selectOrder:{},//选中的order
        isWaiting:false,
        airFlag:true,//空运
        oceanFlag:true,//海运
        expressList:[],//transit列表
        estatusDes:{},//transit状态
        result:['1','2'],//f复选框状态
        expressOtherList:[],
        userType:0,//用户身份
        payModelIntro:'',
        sendAllInfo:{},
        sendAllID:'',
        allTotalFlag:false,
        status:1,
        imgInfo:{
          image:require('../../assets/images/advs/home_weight_activity.png'),
          url:''
        },
        evaluateVisible:false,
        evaluateInfo:{},
        orderevaluationVoList:[],//订单列表
        shipTab:'1',
        shipOrderAllList:[],
      }
    },
    computed:{
      dialogVisible(){
        return this.selectType=='status' ||  this.selectType=='sea' || this.selectType=='remind' || this.selectType =='combine'
      },
      chooseLength(){
        return this.shopOrders.filter(item=>item.isCheck).length;
      }
    },
    methods:{
      shipTabHandle(event){
        this.allTotalFlag = false;
        this.shopOrders = this.shipOrderAllList.filter(item=>item.isocean == event);
        this.shopOrders = this.shopOrders.map(item=>{
          item.isCheck= false;
          return item;
        })
      },
      //包裹评价点击close
      closeRateHandle(){
        if(this.evaluateInfo.readonly==1){
          this.evaluateVisible = false;
        }else{
          homeReadPopupApi({id:this.evaluateInfo.expressid,type:this.evaluateInfo.type,ordertype:this.evaluateInfo.ordertype}).then(res=>{
            this.evaluateVisible = false;
          })
        }

      },
      goodChangeHandle(item,type){
        if(this.evaluateInfo.readonly ==1) return;
        if(item.satisfied==0){
          this.$toast({message:'Please upload pictures'})
        }
        let baseOption ={
          // draft:0,//是否保存草稿
          ordertype:this.evaluateInfo.ordertype,
          expressid:this.evaluateInfo.expressid,
        }
        let option ={};
        switch (type) {
          case 'statify':
            option ={
              ...baseOption,
              ...{"orderevaluationVoList":[
                  {"shoporderid":item.shoporderid,
                    "satisfied":item.satisfied}
                ]}
            }
            break;
          case 'remark':
            option ={...baseOption,
              ...{"orderevaluationVoList":[
                  {"shoporderid":item.shoporderid,
                    description:item.description}
                ]
              }
            }
            break;

        }
        this.finalHandle(option)
      },
      //包裹评价上传图片
      uploadFileHandle(){
        if(this.evaluateInfo.readonly ==1) return;
        const inputFile = this.$refs.inputRef.files[0];
        let _upload = new XCUPload({
          file:inputFile,
          savePath:'3simgs',
          onComplete:(info)=>{
            this.orderevaluationVoList = this.orderevaluationVoList.map(order=>{
              if(order.shoporderid === this.selectOrder.shoporderid){
                if(this.imageIndex < order.imageList.length){
                  order.imageList = order.imageList.map((image,index)=>{
                    if(index == this.imageIndex){
                      image = this.$config.onlineImgURL + info.path
                    }
                    return image;
                  })
                }else{
                  order.imageList =[...order.imageList,this.$config.onlineImgURL + info.path]
                }

              }
              return order;
            })
            let baseOption ={
              // draft:0,//是否保存草稿
              ordertype:this.evaluateInfo.ordertype,
              expressid:this.evaluateInfo.expressid,
              orderevaluationVoList:[{
                shoporderid:this.selectOrder.shoporderid,
                imageList:this.selectOrder.imageList
              }]
            }
            this.finalHandle(baseOption)

          }
        })
        _upload.upload()
      },
      //点击submit
      submitHandle(){
        let unSatifyList = this.orderevaluationVoList.filter(item=>item.satisfied==0);//不满意的
        let satifyList = this.orderevaluationVoList.filter(item=>item.satisfied!=0);//满意的
        let hasPic = false;
        if(unSatifyList.length){
          unSatifyList.forEach(item=>{
            if(item.satisfied==0 && item.imageList.length==0){
              hasPic = true;
            }
          })
        }
        if(this.evaluateInfo.score2==0){
          return this.$toast({message:'please mark our international Logistic '})
        }
        if(this.evaluateInfo.score1==0){
          return this.$toast({message:'please mark our Client Service  '})
        }
        if(this.evaluateInfo.evaluateambassador == 1 &&  this.evaluateInfo.ambassadorscore==0){
          return this.$toast({message:'Please mark our Ambassador Services'})
        }
        if(hasPic){
          this.$toast({message:'To show you a quick feedback, please upload the picture of product you are unsatisfied with.    '});
          this.orderevaluationVoList = [...unSatifyList,...satifyList];
        }else{
          let basicOption ={
            // draft,//是否保存草稿
            ordertype:this.evaluateInfo.ordertype,
            expressid:this.evaluateInfo.expressid,
            channel:this.evaluateInfo.channel
          }
          homePopupHandleApi({
            type:this.evaluateInfo.type,
            annex:basicOption
          }).then(res=>{
            this.$toast({message:'Evaluation is successful !'})
            this.evaluateVisible = false;
            this.getOrderCount()
            this.getOrderList()

          }).catch(err=>{
            this.$toast({message:'System error!'})
            this.evaluateVisible = false;
          })
        }
      },
      //更新操作
      updateOrderHandle(type){
        if(this.evaluateInfo.readonly==1) return;
        let baseOption ={
          // draft:0,//是否保存草稿
          ordertype:this.evaluateInfo.ordertype,
          expressid:this.evaluateInfo.expressid,
        }
        let option ={};
        switch (type) {
          case 'logistic':
            //修改logistic
            option ={...baseOption, ...{score2:this.evaluateInfo.score2}}
            break;
          case 'service':
            //修改服务
            option ={...baseOption, ...{score1:this.evaluateInfo.score1}}
            break;
          case 'again':
            //再次购买
            option ={...baseOption,...{intentionflg:this.evaluateInfo.intentionflg}};
            break;
          case 'comments':
            //评价
            option ={...baseOption,...{valuationcontent:this.evaluateInfo.valuationcontent}};
            break;
          case 'ambassador':
            //团长评价
            option ={...baseOption,...{ambassadorscore:this.evaluateInfo.ambassadorscore}};
            break;
          case 'ambassadorContent':
            //团长评价
            option ={...baseOption,...{valuationcontentambassador:this.evaluateInfo.valuationcontentambassador}};
            break;

        }
        this.finalHandle(option)
      },
      //包裹评价上传图片
      uploadImgHandle(item,index){
        if(this.evaluateInfo.readonly==1) return;
        this.selectOrder = item;
        this.imageIndex = index;
        this.$refs.inputRef.dispatchEvent(new MouseEvent('click'))
      },
      finalHandle(option){
        homePopupDraftApi({
          type:this.evaluateInfo.type,
          annex:option
        }).then(res=>{

        })
      },
      goAdsHandle(){
        if(!this.imgInfo.url) return;
        window.open(this.imgInfo.url)
      },
      //to ship页面，选中一个，如果这个waybillno有一个选中，其他有waybillno相同的，全部选中，一个取消，全部取消
      chooseItemHandle(item){
        if(this.tagIndex=='ship'){
          if(item.waybillno){
            // 如果是团员，并且单子已经在团长名下 是不可以点击的
            this.shopOrders = this.shopOrders.map(order=>{
              if( (order.waybillno == item.waybillno) ){
                order.isCheck = item.isCheck;
              }
              return order;
            })

          }
        }else if(this.tagIndex=='combine'){
          if(item.shopexpressdetailid){
            // 如果是团员，并且单子已经在团长名下 是不可以点击的
            this.shopOrders = this.shopOrders.map(order=>{
              if( (order.shopexpressdetailid == item.shopexpressdetailid) ){
                order.isCheck = item.isCheck;
              }
              return order;
            })
          }
        }

      },
      //全选
      allCheckHandle(){
        this.shopOrders = this.shopOrders.map(item=>{
          item.isCheck = this.allTotalFlag;
          return item;
        })
      },
      //获取banner图片
      getBannerAdv(){
        commonBannerAdvListApi('MOBILE_ORDER').then(res=>{
          if(res){
            const {image,url} = res[0]
            this.imgInfo = {image,url};

          }
        })
      },
      //拒绝订单
      rejectHandle(){
        shopOrderRejectApi(this.selectOrder.id).then(res=>{
          if(res.status==0){
            this.isVisible = false;
            this.$toast({message:'Reject Success'})
            this.getOrderList();
            this.getOrderCount()
          }
        })
      },
      deliveryOrderHandle(type){
        switch (type) {
          case 'cancel':
            let value = this.shopOrders.filter(item=>item.isCheck);
            let valueID=value.map(item=>item.id);
            this.toShipPageHandle(this.sendAllInfo,valueID.join(','))
            break;
          case 'confirm':
            this.isVisible = false;
            break;
        }
      },
      filterHandle(){
        let value = this.expressOtherList;
        if(this.result.includes('1')){
          //有空运
          this.expressList = value.filter(item=>!item.isOcean)
        }
        if(this.result.includes('2')){
          //海运
          this.expressList = value.filter(item=>item.isOcean)
        }
        if(this.result.includes('1') && this.result.includes('2')){
          this.expressList = value
        }
        if(!this.result.includes('1') && !this.result.includes('2')){
          this.expressList=[]
        }

      },
      //取消订单
      cancelHandle(){
        shopOrderCancelApi(this.selectOrder.id).then(res=>{
          if(res.status==0){
            this.$toast({message:'Cancel Success !'});
            this.expressList = this.expressList.filter(item=>item.id != this.selectOrder.id);
            this.expressOtherList = this.expressList
            this.getOrderCount();
          }else if(res.status==500){
            this.$toast({message:res.message});
          }
          this.isVisible = false;
        })
      },
      //显示其余的comment列表
      showCommentOtherOrderList(item){
        this.expressList = this.expressList.map(express=>{
          if(express.id == item.id){
            express.isOpen = true;
          }
          return express;
        })
      },

      showExpressOtherListHandle(item){

        this.expressList = this.expressList.map(express=>{
          express.shoporderList = express.shoporderList.map(order=>{
            if(order.id == item.id){
              order.isOpen = true;
            }
            return order;
          })
          return express;
        })
        this.expressOtherList = this.expressList
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
      //1.获取商品tab个数
      getOrderCount(){

        shopOrderCountApi().then(res=>{
          if(res){
            this.tagList = this.tagList.map(item=>{
              if(item.val=='purchase'){
                item.count = res.count3 || '';
              }
              if(item.val=='ship'){
                item.count = res.count4 || '';
              }
              if(item.val=='fail'){
                item.count = res.count7 || '';
              }
              if(item.val=='combine'){
                item.count= res.count8 || '';
              }
              if(item.val=='comment'){
                item.count  = res.count9 || ''
              }
              return item;
            })
            if(this.userType == this.$config.orderUserType.NORMAL || this.userType== this.$config.orderUserType.BIGCUSTOMER){
              //未参团，不显示combine tab
              this.tagList = this.tagList.filter(item=>item.val!='combine')
            }
          }


        })
      },
      //获取更多
      loadMoreHandle(){
        if(this.tagIndex=='comment') return;
        if(this.status==this.$config.loadingType.FINISHED) return;
        if(this.page <= this.pageCount){
          this.page ++;
          shopOrderListApi({
            tab:this.$config.orderTab[this.tagIndex],
            page:this.page,
            source:this.$config.orderSource.MYORDERS
          }).then(res=>{
            let { shoporders,expressList } = res;
            if(this.tagIndex =='transit'){
              if(!expressList || expressList.length==0){this.status=this.$config.loadingType.FINISHED}
              if(expressList){
                expressList = expressList.map(item=>{
                  item.shoporderList = item.shoporderList.map(order=>{
                    if(order.shoporderdetails.length>5){
                      order.shopOrderFirst = order.shoporderdetails.slice(0,5);
                      order.shopOrderNext = order.shoporderdetails.slice(5);
                      order.isOpen = false;
                    }
                    return order
                  })
                  return item;
                })
                this.expressList =[...this.expressList,...expressList]
                this.expressOtherList= [...this.expressOtherList,...expressList];
              }
            }else{
              if(!shoporders || shoporders.length==0){this.status=this.$config.loadingType.FINISHED}
              shoporders = shoporders.map(item=>{
                if(item.shoporderdetails.length>5){
                  item.shopOrderFirst = item.shoporderdetails.slice(0,5);
                  item.shopOrderNext = item.shoporderdetails.slice(5);
                  item.isOpen = false;
                }
                item.isCheck = false;
                return item;
              })
              if(this.tagIndex=='combine'){
                this.shipOrderAllList = [...this.shipOrderAllList,...shoporders];
                this.shopOrders = this.shipOrderAllList.filter(item=>item.isocean == this.shipTab);
              }else{
                this.shopOrders =[...this.shopOrders,...shoporders];
              }
            }

          })
        }else{
          this.status=this.$config.loadingType.FINISHED
        }
      },
      //2.获取商品列表
      getOrderList(){
        let newValue = [];
        this.isLoading = true;
        shopOrderListApi({
          tab:this.$config.orderTab[this.tagIndex],
          page:this.page,
          source:this.$config.orderSource.MYORDERS
        }).then(res=>{
          const {pageCount,shoporders,showOperationFlow,statusDes,estatusDes,expressList} = res;
          if(this.tagIndex == 'transit'){
            this.expressList = expressList.map(item=>{
              let value =[];
              item.shoporderList.forEach(order=>{
                order.shoporderdetails = order.shoporderdetails.map(detail=>{
                  if(order.ordertype == 10){
                    detail.waybillno = order.waybillno;
                    detail.ordertype = order.ordertype
                  }
                  return detail
                })
                value = [...value,...order.shoporderdetails];
              })
              item.shopOtherList  = value;
              item.isOpen = false;
              return item;
            })
            this.expressList = this.expressList.map(item=>{
              if(item.shopOtherList.length>5){
                item.shopOtherFirst = item.shopOtherList.slice(0,5);
                item.shopOtherLast = item.shopOtherList.slice(5)
              }
              return item;
            })
            this.expressOtherList= expressList;
            this.statusDes = estatusDes;
            this.isLoading = false;
          }else if(this.tagIndex =='comment'){
            this.expressList = expressList.map(item=>{
              let value =[];
              item.shoporderList.forEach(order=>{
                order.shoporderdetails = order.shoporderdetails.map(detail=>{
                  if(order.ordertype == 10){
                    detail.waybillno = order.waybillno;
                    detail.ordertype = order.ordertype;

                  }
                  detail.shopexpressdetailid = order.shopexpressdetailid
                  return detail
                })
                value = [...value,...order.shoporderdetails];
              })
              item.shopOtherList  = value;
              item.isOpen = false;
              return item;
            })
            this.expressList = this.expressList.map(item=>{
              if(item.shopOtherList.length>5){
                item.shopOtherFirst = item.shopOtherList.slice(0,5);
                item.shopOtherLast = item.shopOtherList.slice(5)
              }
              return item;
            })
            this.statusDes = estatusDes;
            this.isLoading = false;
            this.status = this.$config.loadingType.FINISHED;
          }else{
            newValue  = shoporders.map(item=>{
              if(item.shoporderdetails.length>5){
                item.shopOrderFirst = item.shoporderdetails.slice(0,5);
                item.shopOrderNext = item.shoporderdetails.slice(5);
                item.isOpen = false;
              }
              item.isCheck = false;
              return item;
            })
            if(this.tagIndex=='combine'){
              this.shipOrderAllList = newValue;
              this.shopOrders= this.shipOrderAllList.filter(item=>item.isocean==this.shipTab);
            }else{
              this.shopOrders = newValue;
            }
            this.statusDes = statusDes;

          }
          this.operateFlowVisible =showOperationFlow;
          this.pageCount  = pageCount;
          this.isLoading = false;
        }).catch(err=>{
          this.isLoading = false;
        })
      },
      //shopping Now
      goOtherUrlHandle(){
        this.$router.replace('/');
        this.$EventBus.$emit('toIndex')
      },
      //tab改变
      changeStatusHandle(val){
        this.page =1;
        this.expressList =[];
        this.shopOrders=[]
        this.tagIndex = val;
        this.status=this.$config.loadingType.LOADING;
        this.allTotalFlag = false;
        this.getOrderList();
        this.getOrderCount()
      },
      //点击状态
      checkStatusHandle(status,type){
        switch (type) {
          case 'normal':
            if(status == this.$config.orderStatus.AwaitingPayment){
              this.$router.replace({
                path:'/shoporder/cart',
                query:{tab:1}
              })
            }else{
              if(status){
                this.statusZn =this.statusDes[status];
                if(this.statusZn){
                  this.isVisible = true;
                  this.selectType='status';
                }

              }
            }
            break;
          case 'transit':
            this.statusZn =this.statusDes[status];
            if(this.statusZn){
              this.isVisible = true;
              this.selectType='status';
            }
            break;
        }

      },
      //显示quality弹出框
      showQualityHandle(){
        this.qualityInfoVisible = true;
      },
      checkExpressOrderHandle(item){
        this.$router.push(`/deliveryorder/detail/${item.id}`)
      },
      //已关单或者采购失败 - 失败确认
      confirmOrderHandle(item,type){
        this.selectType = type;
        switch (type) {
          case 'confirm':
            this.selectOrder= item;
            this.isVisible = true;
            break;
          case 'remind':
            //提醒
            shopOrderRemindApi(item.id).then(res=>{
              if(res.status==0){
                if(res.data.info){
                  this.isVisible = true;
                  this.statusZn = res.data.info;
                }else{
                  if(res.data.count==1){
                    this.$toast({message:'Success'});
                  }else{
                    this.isVisible = true;
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
                cellphone:item.cellphone,
                id:item.id
              }
            })
            break;
          case 'track':
            this.$router.push(`/shoporder/2/logistics/${item.id}`)
            break;
          case 'after':
            this.$router.push(`/shoporder/workorder/${item.id}`)
            break;
          case 'again':
            let spm =`a0001.detail.buyagain.0.${getCurrentPageSpmID()}`;
            loginRegisterPageBury({
              p:'',
              spm
            })
            let productId=item.specailproductid>0?`sp.${item.specailproductid}`:`${item.alibabaproductid}`
            let url = `${this.$config.jianweiDomain}/search?spm=${spm}&productid=${productId}`
            window.location.href=url;
            break;
          case 'share':
            window.location.href=`${this.$config.jianweiDomain}/share/index/${item.id}`
            break;
          case 'cancel':
            this.isVisible = true;
            this.selectOrder= item;
            break;
          case 'reject':
            this.isVisible = true;
            this.selectOrder = item;
            break;
          case 'sign':
            this.isVisible = true;
            this.selectOrder = item;
            break;
          case 'comment':
          case 'checkComment':
            this.checkCommentPopupHandle(item)
            break;
        }

      },
      checkCommentPopupHandle(item){
        orderCommentEvaluationDraftApi({
          expressid:item.id,
          shopexpressdetailid:item.shopexpressdetailid
        }).then(res=>{
          if(res.status==0){
            this.evaluateInfo = {...res.data.evaluation ,...{type:8}};
            this.orderevaluationVoList =[]
            if(this.evaluateInfo.orderevaluationVoList && this.evaluateInfo.orderevaluationVoList.length){
              this.orderevaluationVoList = this.evaluateInfo.orderevaluationVoList.map(item=>{
                item.fileList=[];
                if(item.imageList){
                  item.imageList.forEach(url=>{
                    item.fileList.push({'url':url});
                  })
                }
                return item;
              })

            }
            this.evaluateVisible = true;
          }else{
            this.$toast({message:'System error'})
          }
        })
      },
      signHandle(){
        shopOrderSignApi(this.selectOrder.id).then(res=>{
          if(res.status==0){
            this.$toast({message:'Sign Success !'});
            this.isVisible  = false;
            this.getOrderList()
            this.getOrderCount()
          }
        })
      },
      //相似的产品
      similarHandle(item){
        urlSearchApi(item.images).then(res=>{
          this.$router.push({
            path:'/shoppingmall/imagesearch',
            query:{
              key:res,
              picurl:item.images
            }
          })
        })
      },
      //关闭关单弹出框
      confirmCloseHandle(){
        shopOrderConfirmApi(this.selectOrder.id).then(res=>{
          if(res.status==0){
            this.$toast({message:'Confirm success'});
            this.changeStatusHandle('fail');
            this.getOrderCount()
          }
          this.isVisible = false;
        })
      },
      /*
     groupShipHandle(){
        let value = this.shopOrders.filter(item=>item.isCheck);
        if(!value.length){
          this.isVisible = true;
          this.selectType = 'onlyOne';
        }else{
          let valueID=value.map(item=>item.id);
          shopOrderGroupShipApi(valueID.join(',')).then(res=>{
            if(res.status==0){
              this.$toast({message:'Group Ship Success !'})
              this.getOrderList();
              this.getOrderCount()
            }
          })
        }

      },
      * */
      combineHandle(){
        let value = this.shopOrders.filter(item=>item.isCheck);
        if(!value.length){
          this.isVisible = true;
          this.selectType = 'onlyOne';
        }else{
          let valueID=value.map(item=>item.id);
          this.$router.push({
            name:'deliveryCombine',
            query:{
              ids:valueID.join(','),
              isOcean:this.shipTab
            }
          })
          //不用判断，直接跳转页面
          // this.confirmPayHandle(valueID.join(','))
        }
      },
      //支付
      payHandle(){
        this.isWaiting = true;
        let value = this.shopOrders.filter(item=>item.isCheck);
        if(!value.length){
          this.isWaiting = false;
          this.isVisible = true;
          this.selectType = 'onlyOne';
        }else{
          let valueID = value.map(item=>item.id);
          this.confirmPayHandle(valueID.join(','))
        }
      },
      toShipPageHandle(result,id){
        console.log(result);
        //id是订单的id
        if(result.toreceiver==2){
          this.$router.push(`/client/2/index?id=${id}&type=orderShip&orderType=${this.tagIndex}&shopIds=${id}`)


        }else if(result.toreceiver ==1){

          this.$router.push(`/client/2/edit?id=${result.receiverid}&type=orderShip&orderType=${this.tagIndex}&shopIds=${id}`)

        }else{
          if(this.tagIndex=='ship'){
            this.$router.push({
              path:'/deliveryorder/2/index',
              query:{
                ids:id,
                receiverid:result.receiverid
              }
            })
          }else if(this.tagIndex=='combine'){
            this.$router.push({
              name:'deliveryCombine',
              query:{
                ids:id,
                receiverid:result.receiverid,
              }
            })
            // this.$router.push(`/deliveryorder/3/index?ids=${id}&receiverid=${result.receiverid}`)
          }

        }

      },
      confirmPayHandle(valueID){
        this.isWaiting = true;
        shopOrderSendAllApi(valueID).then(res=>{
          if(res.status==0){
            this.isWaiting = false;
            if(res.data.special==0){
              this.toShipPageHandle(res.data,valueID)
            }else{
              this.isVisible = true;
              this.selectType = 'deliveryorder';
              this.sendAllInfo = res.data;
            }
          }else{
            this.isWaiting = false;
            this.isVisible = true;
            this.selectType = 'sendAllModel';
            this.payModelIntro = res.message;
          }
        })
      },
      //获取基本信息
      getBasicInfo(){
        accountBasicInfoApi().then(res=>{
          this.userType = res.isleader;
          this.getOrderCount();
          this.getOrderList()
        })
      },

    },
    beforeRouteLeave(to,from,next){
      if(to.path=='/shoporder/2/search'){
        to.meta.keepAlive = false;
      }
      loginRegisterPageBury({
        p:'orders',
        operate:'close',
        spm:`a0001.orders.close.${getCurrentPageSpmID()}`
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
        p:'orders',
        operate:'page',
        spm:`a0001.orders.page.-1`
      })
      next();
    },
    mounted(){
      this.evaluateRef = this.$refs.evaluateRef;
      if(this.$route.query.tagIndex){
        this.tagIndex = this.$route.query.tagIndex;
      }
      this.getBannerAdv()
      this.getBasicInfo()
    },


  }
</script>

<style scoped lang="less">
  /deep/.van-tab{
    color:#2A2A2A;
    font-size:14px;
  }
  /*包裹评价 开始*/
  //图片上传
  /deep/.van-grid-item__content{
    padding:0;
  }
  .upload-item{
    position: relative;
    height:60px;
    line-height:60px;
    img{
      width:100%;
      height:100%;
    }
  }
  .upload-item-mask{
    background: #fff;
    opacity: 0.8;
    position: absolute;
    top:0;
    bottom:0;
    right:0;
    left:0;
  }
  .font_size_title{
    font-size:15px;
  }
  .font_size_normal{font-size:14px;color:#3d4145}
  .evaluateScroll{
    height:72vh;
  }
  .evaluate-content-wrapper{
    background-color: #fff;
    width:92vw;

    /*  头部*/
    .evaluate-content-title{
      padding:10px 25px;
      border-bottom:1px solid #EEEEED;

    }
    /*  头部 end*/
    /*  内容 state*/
    .evaluate-content-box{

      /deep/.van-radio__icon--checked .van-icon{
        background: #fcc900;
        border-color: #fcc900;
      }
      /deep/.van-sticky--fixed{
        border-top:1px solid #EEEEED;
        box-shadow: 0 6px 6px #eee;
        transform: none !important;
      }
      padding:15px 15px 20px 15px;
      .evaluate-goods-box{
        .goods_rate{
          font-size:15px;
        }
        /deep/ .van-cell{
          padding:2px 10px;
          margin:4px 0;
          background-color: #EEEEED;

        }
        .goods_btn-area{
          padding:10px ;
          background-color: #fff;
          display: flex;
          justify-content: space-around;
          .close-btn{border-radius: 6px}
          .submit-btn{
            background-color: #fcc900;border-radius: 6px}
        }
        /deep/.van-field--min-height .van-field__control{
          min-height:30px;
          padding:4px;
          border-radius: 10px;
        }
      }
      .goods-list-box{
        .upload-input{
          display: none;
        }
        .goods-list-title{
          padding:10px 0;
          line-height:1.5;
          font-size:14px;
          color:#F00;
        }
        .goods-list{
          .goods-img{
            width:90px;
            height:90px;
            img{
              width:90%;
              height:auto;
              border-radius: 4px;
            }
          }
          /deep/ .van-cell{
            padding:4px 0;
            background-color: #EEEEED;
          }
          /deep/.van-uploader__file{
            width:45px;
            height:45px;
          }
          /deep/.van-field__control{
            padding:2px 4px;
            border-radius: 6px;
          }
          /deep/.van-uploader__upload{
            width:45px;
            height:45px;
          }
          /deep/.van-uploader__preview-image{
            width:45px;
            height:45px;
          }
        }
      }
    }
    /*  内容 end*/
  }
  /*包裹评价 结束*/
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  .notice-box{
    font-size:16px;
  }
  .other-open{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:5px 15px;
    background-color: #fff;
    color:#f00;
  }
  /deep/.van-notice-bar{
    height:32px;
  }
  .edit-name-dialog{
    padding:10px 20px;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .shopify-img{
    width: 16PX;
    height: 16PX;
    max-width: 100%;
  }
  .block {
    width: 120px;
    height: 120px;
  }
  /deep/ .van-empty__image{
    width:120px;
    height:120px;

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
  .product-special{
    color:#6495ED;
    font-size:12px;
    display: flex;
    align-items: center;
  }
  .bottom-space{
    height:100px;
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
  .product-title-quality{
    background-color: #fff;
    /*padding: 4px 8px 2px 4px;*/
    font-size:14px;
    color:#0D0D0D;
    .quality_item{
      margin:4px 8px;
    }
    .product-time{
      font-family: SF Pro Text Regular;
      color: #8F8E94FF;
      .g_ml_s{
        margin-left: 4px;
      }
    }
  }
  .product-footer{
    background-color: #fff;
    border-top:1px solid #EEEEED;
    padding:8px 10px;
    border-radius:0 0 10px 10px ;
    .product-footer-btn{
      padding:2px 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .track-btn{
        font-size:15px;
        background-color: #fff;
        border-radius: 4px;
        border:1px solid #eeeeeD;
        margin-right: 6px;
      }
      .sim_btn,.confirm_btn{
        font-size:15px;
        margin-right: 6px;
        background-color: #fcc900;
        color:#2A2A2A;
        border-radius: 4px;
      }
    }
    /deep/.van-button--normal{
      padding:0 6px;
    }
  }
  .scrollViewHeight{
    height:calc(100vh - 220PX - 40PX);
    background-color: #eee;
  }
  .scrollShipHeight{
    height:calc(100vh - 220PX - 94PX);
    background-color: #eee;
  }
  .icon-sousuo{
    font-size:24px;
    color:gray;
  }
  /*/deep/.van-badge--fixed{*/
  /*  right:20px;*/
  /*}*/
  /deep/.van-tag--large{
    padding:8px 20px;
  }
  .s3-orders-content{
    margin:10px 8px 8px;
  }
  .s3-orders-wrapper{
    position: relative;
    .pay-box{
      position: fixed;
      bottom:50PX;
      left:0;
      right:0;
      background-color: #FFFFF0;
      box-shadow: 10px 0 10px #EEEEED;
      font-size:16px;
      .pay-content{
        padding:6px 15px;
      }
      .pay-btn{
        background-color: #fcc900;
        color:#2A2A2A;
        font-size:16px;
        border-radius: 4px;
      }
    }
    .orderType-box{
      background-color: #fff;
      padding:10px ;
      margin-bottom:8px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .s3-orders-content-top{
      border-top:8px solid #EEEEED;
      border-bottom:8px solid #EEEEED;
      background-color: #fff;
      padding:4px 6px;
      .s3-orders-banner{
        img{
          width:100%;
          height:auto;
        }
      }
      .s3-orders-tags{
        padding-top: 15px;
      }

    }
    /deep/.van-empty{
      padding:0;
    }
    /deep/.van-goods-action-button{
      font-size:16px;
    }
    /deep/.van-dialog__footer .van-goods-action-button--danger {
      background: linear-gradient(to right,#ff6034,#fcc900) !important;
    }
    /deep/.van-dialog--round-button .van-dialog__message{
      padding-bottom: 0 !important;
      font-size:16px !important;
    }
    /deep/.van-dialog__content--isolated{
      min-height: 100px !important;
    }
    .product-tag{
      font-size:15px;
      color:#bebebe;
      padding:2px 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .shopping-btn {
      color: #2A2A2A;
      background-color: #FCC900;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .group-btn{
    margin-right: 8px;
  }
  .product-count{
    font-size:16px;
    color:#2A2A2A;

  }
</style>
