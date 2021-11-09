<template>
  <div class="product-detail-content">
    <div class="product-detail-wrapper" v-if="!isEmpty">
      <van-nav-bar fixed @click-left="goBackHandle" >
        <template #right>
          <div class="product-title-right d_flex" v-show="!isShopifyBtn">
            <div class="product-btn product-btn-cart" @click.stop="navbarOperateHandle('cart')" />
            <div class="product-btn product-btn-share"  @click.stop="navbarOperateHandle('share')"/>
            <van-popover  placement="bottom-end"
                          v-model="showPopover"
                          style="left:240px;z-index: 4001"
                          trigger="click">
              <template #reference>
                <div class="product-btn product-btn-more"/>
              </template>
              <div v-for="(item,index) in actions"
                   :key="index" class="d_flex popover-item needsclick" @touchstart="moreOperateHandle(item)">
                <van-icon size="18" class="g_mr_m" :name="item.icon" />
                {{item.text}}
              </div>
            </van-popover>

            <!--          -->
          </div>
        </template>
        <template #left> <van-icon name="arrow-left" size="26" color="#fff"/></template>
      </van-nav-bar>
      <div class="scrollGoodDetail" ref="top" @scroll.passive="handleScroll">
        <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
        <div class="product-detail-inner" v-else>
          <common-product-swiper
            :images="productInfo.images"
            :imgAlt="imgAlt"
            :isShowTop100="isShowTop100"
            v-if="productInfo.images"/>
          <div class="product-name-card">
            <!--            商品名称-->
            <div class="product-name van-multi-ellipsis--l2">{{skuinfos['productnameen']}}</div>
            <!--              阶梯价格开始-->
            <div class="product-price d_flex d_flex_between" v-if="showPriceRange">
              <div class="product-price-item" v-for="(item,index) in saleInfo['priceRanges']" :key="index">
                <div class="item-price g_mb_s">
                  R {{item.price}}
                  <br>
                  <del class="old-price" v-if="skuinfos.offprice && !(oldSaleInfo.priceRanges[index].price == item.price)">
                    {{oldSaleInfo.priceRanges[index].price | moneyFormat}}
                  </del>
                </div>
                <div class=" font_size_12">
                  <template v-if="index == 0">
                    Min Qty:{{item.startQuantity}} {{productInfo.unitname}}
                  </template>
                  <template v-if="index > 0 && index + 1 < saleInfo.priceRanges.length">
                    {{item.startQuantity}} -{{saleInfo.priceRanges[index + 1].startQuantity -1}}{{productInfo.unitname}}
                  </template>
                  <template v-if="index + 1 == saleInfo.priceRanges.length">
                    ≥ {{item.startQuantity}} {{productInfo.unitname}}
                  </template>
                </div>
              </div>
            </div>
            <!--              阶梯价格结束-->
            <!--          v-if="saleInfo == null || saleInfo['priceRanges'] == null || saleInfo['priceRanges'].length<=0"-->
            <div class="g_mt_l d_flex" v-if="isShowCommonPrice">
              <div class="common-price g_mr_l g_mb_l" v-if="skuinfos.price">
                R {{skuinfos.price.split('~')[0]}} ~ {{skuinfos.price.split('~')[1]}}
                <br>
                <del v-if="skuinfos.offprice" class="old-price">
                  R {{skuinfos.originalprice.split('~')[0]}} ~ {{skuinfos.originalprice.split('~')[1]}}
                </del>
              </div>
              <!--            v-if="skuinfos.minPurchaseQuantity != null && skuinfos.minPurchaseQuantity > 0"-->
              <div v-if="isShowMinQty" class="g_mb_l font_size_13">
                Min qty:{{skuinfos.minPurchaseQuantity}} {{productInfo.unitname}}
              </div>
            </div>
            <div class="item-count "  v-if="skuinfos.mixNumber != null && skuinfos.mixNumber > 0">
              Min qty:{{skuinfos.mixNumber}} {{productInfo.unitname}}
              <span v-if="productBasicInfo.dakehu" class="font_size_13">(Bulk buyer privilege)</span>
              <span v-else class="font_size_13"> (Platinum&Golden members only)</span>
            </div>
            <!--是否是1688商品-->
            <div v-if="productBasicInfo.is1688product && !isShopifyBtn"  class="item-count font_size_13" @click="showEstimatePopupHandle">
              <span class="color_normal"> Exclude International Delivery</span>
              <span class="sea-tag" >Estimate Shipping Cost &gt;</span>
            </div>
            <!--是否是1688商品-->
            <div class="g_mb_l" style="color:#ff7300;font-size:18px;line-height: 1.3;" v-if="skuinfos.weightvalue" >
              <div>{{skuinfos.weightvalue}}</div>
              <div>It is more economical to purchase in multiples of the suggested quantity</div>
            </div>
            <!--判断是不是百优的商品-->
            <div style="margin:8px -8px 4px;" v-if="!isShopifyBtn">
              <div v-if="shopproduct.type==1">
                <router-link to="/supplier/product/index" >
                  <img src="~assets/images/top100/banner_from_home.png" alt="" width="100%">
                </router-link>

              </div>
              <div v-else>
                <div v-if="MOBILE_PRODUCT_DETAIL && MOBILE_PRODUCT_DETAIL.image ">
                  <a :href="MOBILE_PRODUCT_DETAIL.url" target="_blank">
                    <img :src="MOBILE_PRODUCT_DETAIL.image" width="100%"/>
                  </a>
                </div>
                <div v-else>
                  <router-link to="/membership/index" >
                    <img src="~assets/images/top100/top-rank-banner.png" width="100%"/>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="g_mt_m g_mb_m" v-if="productBasicInfo.dakehu">
              <div class="d_flex">
                <strong class="font_size_14">magnet/battery : </strong> &nbsp;
                <van-checkbox v-model="checkFlag " shape="square" icon-size="16"/>
              </div>
            </div>
          </div>

          <!--            商品信息结束-->
          <div class="product-data-card" v-if="shopproduct && JSON.stringify(shopproduct) != '{}'">
            <div class="product-data-title">Data</div>
            <div class="d_flex d_flex_between g_mt_l">
              <div class="data-item data-item-left">
                <div class="data-item-intro">in 30 days sales volume</div>
                <div class="data-item-count color_normal">
                  <span  v-if="shopproduct.platform == 2">
                    {{shopproduct.sellqty * (shopproduct.spec ? shopproduct.spec :1 )}}
                  </span>
                  <span v-else>{{shopproduct.platformsaleqtyby30?shopproduct.platformsaleqtyby30:0}}</span>
                </div>
                <div class="data-item-content color_intro font_size_12" v-if="shopproduct.platform != 2">retention rate {{shopproduct.platformrepurchase?shopproduct.platformrepurchase:0}}</div>
              </div>
              <div class="data-item" v-if="shopproduct.platform != 2">
                <div class="data-item-intro">in 30 days purchasers</div>
                <div class="data-item-count color_normal">{{shopproduct.platformbuyerqtyby30?shopproduct.platformbuyerqtyby30:0}}</div>
                <div class="data-item-content color_intro font_size_12">
                  {{shopproduct.platformavgpurchaseqty?shopproduct.platformavgpurchaseqty:0}}&nbsp;items/purchaser
                </div>
              </div>
            </div>
          </div>
          <!--          商品数据结束-->
          <div class="product-other-card">
            <van-cell  is-link  @click="createOrderHandle">
              <template #title><div class="font_size_18">Specification</div></template>
            </van-cell>
            <van-cell  is-link v-if="skuinfos.shopproductattrList && skuinfos.shopproductattrList.length!=0">
              <template #title><div class="font_size_18" >Attribute</div></template>
            </van-cell>
            <div class="van-cell d_flex" @click="checkReviewHandle">
              <div class="font_size_18 g_mr_l">Review</div>
              <div class="rate-content ">
                <div class="d_flex d_flex_between">
                  <div class="d_flex">
                  <span class="color_oranged font_size_15 g_mr_l">
                    {{shopproduct.platform == 2?5.0:shopproduct.platformstarlevel?productBasicInfo.platformstarlevelcss/10:0}}
                  </span>
                    <van-rate
                      :allow-half="true"
                      v-model="starRate"
                      :size="20"
                      color="#ff6000"
                      void-icon="star"
                      void-color="#eee"
                    />
                  </div>
                  <div class="d_flex">total {{orderevaluation.recordTotal}}<van-icon name="arrow" size="16"/></div>
                </div>
                <div class="font_size_12" v-if="orderevaluation.recordTotal > 0">
                  {{orderevaluation.username}} : {{orderevaluation.desciption}}
                </div>
              </div>
            </div>
            <div class="van-cell" v-if="isSeaShipping">
              <div class="font_size_18" style="color:#0000FF">Shipping</div>
              <div class="sea-tag">Sea Shipping Only</div>
            </div>
          </div>
          <!--          商品详情-->
          <div class="product-detail-card">
            <div class="product-detail-card-title">
              <h2>product details</h2>
              <hr style="border-top:2px solid #fcc900;">
            </div>
            <div v-if="productBasicInfo.content">
              {{productInfo.description}}
            </div>
            <div  class="product_description">
              <div v-html="descriptionHtml" class="product-inner"></div>
            </div>
          </div>
        </div>

      </div>
      <!--      底部定位-->
      <div class="product_footer">
        <template v-if="isShopifyBtn">
          <div class="product_shopify_inner">
            <van-button class="shopify-btn" block plain type="primary" @click="shareToShopifyHandle">
              <img src="@/assets/images/shopify/shopify_icon.svg" alt="">
            </van-button>
          </div>
        </template>
        <template v-else>
          <div class="product_footer-inner">
            <van-button class="cart_btn" v-prevent-re-click @click="createOrderHandle">Add to Cart</van-button>
            <van-button
              :plain="!productBasicInfo.iscollection"
              :class="{
              'collection_btn':productBasicInfo &&　productBasicInfo.iscollection,
              'like_btn':!productBasicInfo.iscollection
            }"
              v-prevent-re-click @click="collectionProductHandle">
              <div class="d_flex d_flex_center">
                <van-icon :name="productBasicInfo　&& productBasicInfo.iscollection?'success':'plus'" size="16" :color="productBasicInfo　&& productBasicInfo.iscollection?'#f00':'#FF6A6A'"/> &nbsp;&nbsp;
                <van-icon :name="productBasicInfo　&& productBasicInfo.iscollection?'like':'like-o'" :color="productBasicInfo　&& productBasicInfo.iscollection?'#f00':'#FF6A6A'" size="16"/>
                <span>&nbsp;Favorite</span>
              </div>
            </van-button>
          </div>
        </template>
      </div>
      <!--      直达顶部按钮-->
      <div class="top-box animate animate__fadeInUp"  v-if="showTop" @click="gotoTopHandle">
        <div class="d_flex d_flex_center top-box_inner" style="flex-direction: column">
          <van-icon name="arrow-up" />
          TOP
        </div>
      </div>

      <!--    estimate 弹框-->
      <van-action-sheet v-model="estimateVisible" :closeable="false"
                        cancel-text="Cancel"
                        close-on-click-action
                        @cancel="cancelHandle"
                        title="How to estimate international shipping freight？">
        <scroll-view class="scrollHeight">
          <estimate-popup />
        </scroll-view>
      </van-action-sheet>
      <!--      商品价格弹出框-->
      <van-popup v-model="productPriceVisible" round position="bottom"  :style="{ height: '90%' }" >
        <div class="product-price-dialog">
          <div class="product-price-dialog-title">
            <van-row>
              <van-col :span="6">
                <div class="image-content">
                  <div class="image-content-inner">
                    <img :src="productImgUrl" :title="imgAlt" :alt="imgAlt" v-if="productImgUrl">
                  </div>
                  <div class="size-tag" @click="checkSizeHandle">Size Guide</div>
                </div>
              </van-col>
              <van-col :span="16" :offset="1">
                <!--                  价格-->
                <div  v-if="isShowCommonPrice">
                  <div v-if="!productBasicInfo.procut43s" class="price-range">
                    <span class="font_size_16">R{{skuinfos['price'] && skuinfos['price'].split('~')[0] | moneyFormat(false)}}</span>
                    &nbsp;~&nbsp;
                    <span class="font_size_20">R{{skuinfos['price'] && skuinfos['price'].split('~')[1] | moneyFormat(false)}}</span>
                  </div>
                  <div v-else class="price-range">
                    <span>R</span>
                    <span>{{skuinfos['price'] &&　skuinfos.price.split('~')[0] | moneyFormat(false) }}</span>
                    <span>~</span>
                    <span class="font_size_18">R</span>
                    <span class="font_size_18">{{skuinfos['price']&& skuinfos.price.split('~')[1] | moneyFormat(false)}}</span>
                  </div>
                  <div class="color-price font_size_15">Min Qty {{skuinfos.minPurchaseQuantity}} {{productInfo.unitname}}</div>
                </div>
                <div v-if="saleInfo && saleInfo.priceRanges" class="d_flex d_flex_around price-range-list">
                  <div v-for="(item,index) in saleInfo.priceRanges" :key="index"
                       :class="{
                        'price-active':totalCountIndex == index
                      }"
                       class="price-item-range" >
                    <div v-if="!productBasicInfo. procut43s" class="price-item">R{{item.price | moneyFormat(false)}}</div>
                    <div class="price-item" v-else>R{{item.price | moneyFormat(false)}}</div>

                    <div>
                            <span v-if="index + 1 < saleInfo.priceRanges.length">
                              {{item.startQuantity}} - {{saleInfo.priceRanges[index + 1].startQuantity -1}} {{productInfo.unitname}}
                            </span>
                      <span v-if="index + 1 == saleInfo.priceRanges.length"> ≥ {{item.startQuantity}} {{productInfo.unitname}}</span>
                    </div>
                  </div>
                </div>
              </van-col>
              <!--              价格结束-->
            </van-row>
          </div>
          <scroll-view class="priceScrollHeight">
            <template v-if="!skuattrs.length">
              <van-notice-bar background="#F5F5F5" color="#ff6000" :scrollable="false" >
                Purchase quantity
                <span class="color-price" v-show="totalCount>0">({{totalCount}})</span>
              </van-notice-bar>
            </template>
            <template v-else>
              <template v-if="skuattrs.length==1">
                <van-notice-bar background="#F5F5F5" color="#ff6000" :scrollable="false" >
                  {{priceBasicInfo.skuinfos && priceBasicInfo.skuinfos.lastattributename}}
                  <span class="color-price" v-show="totalCount>0">({{totalCount}})</span>
                </van-notice-bar>
              </template>
              <template v-else>
                <div v-for="(skuinfo,skuinfosIndex) in skuattrs" :key="skuinfosIndex">
                  <div v-for="(sku,skuKey,skuIndex) in skuinfo" :key="`sku_${skuIndex}`">
                    <van-notice-bar background="#fff" :scrollable="false"  ref="selectRef"  color="#2A2A2A"  :text="skuKey"/>
                    <template v-if="skuKey=='color'">
                      <div class="product-price-color-content b_border">
                        <van-badge class="color-tag" :content="selectCount[`_${tab.value}`] || ''"
                                   v-for="(tab,tabIndex) in sku" :key="`tab_${tabIndex}`">
                          <van-tag  @click="colorTagHandle(tab,tabIndex)" size="large"
                                    color="#f2f3f5"
                                    class="tag-color-item"
                                    :text-color="tabIndex==colorIndex?'#ff6000':'#2A2A2A'"
                          >{{tab.valueen}}
                          </van-tag>
                        </van-badge>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </template>
            <div class="product-price-color-content">
              <div class=" size-count-item" v-for="(item,index) in selectedItem[colorTitle]" :key="index" v-if="selectedItem[colorTitle]">
                <van-row type="flex" align="center">
                  <van-col :span="9">
                    <div class="size-count-item-size">
                      <p class="color_normal van-multi-ellipsis--l3">{{item.lastattributevalueen}}</p>
                      <p class="color_intro">R {{item.price}}</p>
                    </div>
                  </van-col>
                  <van-col :span="7">
                    <div class="size-count-item-stock color_intro text-align">stock {{item.amountOnSale}}</div>
                  </van-col>
                  <van-col :span="8">
                    <div class="text_align_r">
                      <van-stepper v-model="item.qty" integer min="0" :disabled="item.amountOnSale==0" :max="item.amountOnSale" @change="plusHandle(item)"/>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </scroll-view>

          <div class="product-price-footer">
            <div class="product-price-total d_flex d_flex_between" >
              <div>
                <div v-if="priceBasicInfo.setqty != null && priceBasicInfo.setqty > 0">
                  sell by set 1set = 12
                </div>
              </div>

              <div class="d_flex ">
                <div class="g_mr_l">
                  <span>total qty</span>
                  <span class="color-qty">{{totalCount}}</span>
                </div>
                <div class="color-price">
                  <template v-if="!productBasicInfo['procut43s']">
                    {{totalRMoney | moneyFormat}}
                  </template>
                  <template v-else>
                    {{totalMoney | moneyFormat}}
                  </template>
                </div>
              </div>
            </div>
            <div class="d_flex d_flex_around product-price-btn" v-show="!isShopifyBtn">
              <van-button v-prevent-re-click class="cart-btn" size="large" @click="createOrderFromPopHandle">Add to Cart</van-button>
              <van-button v-prevent-re-click plain class="remark-btn" size="large" @click="remarkHandle">Add Remark</van-button>
            </div>
          </div>
        </div>
      </van-popup>
      <!--      新手添加购物车协议-->
      <van-popup v-model="addToCartNoticeVisible" position="bottom" :style="{ height: '90%' }" >
        <add-to-cart-notice-popup v-if="addToCartNoticeVisible"
                                  @cancelEmit="addToCartNoticeVisible = false"
                                  @remindEmit="remindHandle"/>

      </van-popup>
      <!--      数量不能为0-->
      <van-dialog v-model="isVisible" :show-confirm-button="false" :show-cancel-button="false">
        <common-dialog v-if="visibleType=='totalCount' || visibleType =='noReceiver' || visibleType=='error'" title="Error" @okEmit="isVisible = false" type="error" :intro="introContent"/>
        <common-dialog
          v-else-if="visibleType=='recommend' || visibleType=='limit' || visibleType=='choose'"
          :title="visibleType=='limit'?'warning':'info'"
          @okEmit="isVisible = false"
          type="info" :intro="introContent"/>
        <common-dialog
          v-else-if="visibleType=='shopifySuccess' || visibleType=='shopifyError' "
          :title="visibleType=='shopifySuccess'?'Success':'Error'"
          @okEmit="isVisible = false"
          :type="visibleType=='shopifySuccess'?'success':'error'" :intro="introContent"/>
        <common-dialog v-else-if="visibleType=='badReview'"
                       :hasTwoBtn="true"
                       title="Product with bad reviews! Are you sure to add?"
                       :cancelText="cancelButtonText"
                       type="info"
                       confirmText="Add to Cart"
                       confirmBg="#fcc900"
                       confirmBorder="#fcc900"
                       @cancelEmit="badReviewHandle('see')" @confirmEmit="badReviewHandle('confirm')"

        ></common-dialog>
        <common-dialog-operate v-else-if="visibleType=='success'">
          <div slot="title">Success</div>
          <div slot="intro" class="color_intro">Cost of goods: <span class="color-price">{{totalMoney | moneyFormat}}</span></div>
          <div slot="intro" class="color_intro" v-if="skuinfos.aveweight && skuinfos.aveweight>0">Weight of goods: <span class="color-price">{{totalWeight}}</span></div>
          <div slot="footer">
            <div class="d_flex color_blue d_flex_center">
              <div @click="orderOperateHandle('create')">Another order</div>
              <div class="g_mr_m g_ml_m">|</div>
              <div @click="orderOperateHandle('view')">View my cart</div>
            </div>
          </div>
        </common-dialog-operate>
        <common-dialog v-else-if="visibleType=='blackflg2'"
                       introColor="#2A2A2A"
                       cancelText="Yes"
                       confirmText="Home Page"
                       @confirmEmit="redirectIndexHandle"
                       @cancelEmit="isVisible = false"
                       :intro="introContent" title="Warning"
                       :hasTwoBtn="productBasicInfo.blackflg==2"/>
        <common-dialog v-else-if="visibleType=='blackflg1'"
                       :intro="introContent" title="Warning"
                       introColor="#2A2A2A"
                       okText="Home Page"
                       type="info"
                       @okEmit="redirectIndexHandle"
        />
      </van-dialog>
      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
      <!--    分享-->
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
            <div class="g_mb_s"><span class="color_blue">Tip : </span>
              <template v-if="ambassor==1">
                <!--              大使-->
                You can choose download the picture or share the product link by fackbook or whatsapp.
              </template>
              <template v-else>
                Just share pictures and descriptions,your friends won't see the actual price of the goods and shipshopshake's website
              </template>
            </div>
            <div class="share-product-info">
              <div class="share-product-info-img">
                <van-swipe  @change="swiperChangeHandle" :loop="false" height="360px" v-if="shareItem.images && shareItem.images.length">
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
      <van-dialog v-model="isShowStore" title="Please select the shopify shop" :show-cancel-button="false" :show-confirm-button="false">
        <div class="choose-store-content">
          <div class="choose-store-list">
            <van-checkbox-group v-model="storeResult">
              <van-cell-group>
                <van-cell
                  v-for="(item, index) in customershopifyList"
                  clickable
                  :key="index"
                  :title="item['shopurl']"

                >
                  <template #right-icon>
                    <van-checkbox :name="item.id" ref="checkboxes" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </div>
          <div class="choose-store-footer">
            <van-button size="small" type="default" plain @click="chooseOperateHandle('cancel')">Cancel</van-button>
            <van-button size="small" type="primary" @click="chooseOperateHandle('confirm')">Confirm</van-button>
          </div>
        </div>
      </van-dialog>
    </div>
    <common-remove-product v-else/>
  </div>

</template>

<script>
  import config from '@/config'
  import {shopifyShareToStoreApi,shopifyPrivateShareToStoreApi} from '@/api/shopify'
  import CommonRemoveProduct from '@/components/common/CommonRemoveProduct'
  import CommonProductSwiper from '@/components/common/CommonProductSwiper'
  import ScrollView from "@/components/common/ScrollView";
  import EstimatePopup from './childComponent/EstimatePopup';
  import AddToCartNoticePopup from './childComponent/AddToCartNoticePopup'
  import {collectGoodsApi} from '@/api/home'
  import { spmLogApi } from '@/api/common';
  import {getCurrentPageSpmID, setRefer, setRefSpm,getUserID,getUserTicket,getRefer} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {productDetailApi,productDescriptionApi,productPriceApi,ProductLimitApi,productBadReviewApi} from '@/api/product';
  import CommonDialog from '@/components/common/CommonDialog'
  import CommonDialogOperate from '@/components/common/CommonDialogOperate';
  import {trackTagFun } from '@/utils';
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import {shareInfoApi ,shareInitApi} from '@/api/home'
  import {getLoginInfo, getRefSpm, setCurrentPage} from "../../utils/memory";
  import axios from "axios";
  export default {
    head(){
      return {
        title:`${this.seoSetting.title} - shopshipshake`,
        meta:[
          {
            hid:'description',
            name:'description',
            content:`${this.seoSetting.title}`
          },
          {
            hid:'og:description',
            name:'og:description',
            content:`${this.seoSetting.title}`
          },
          {
            hid:'keywords',
            name:'keywords',
            content:`${this.seoSetting.title}`
          },
          {
            hid:'og:title',
            name:'og:title',
            content:`${this.seoSetting.title}`
          },
          {
            hid:'og:type',
            name:'og:type',
            content:'product'
          },
          {
            hid:'og:image',
            name:'og:image',
            content:this.seoSetting.productImg
          },
        ]
      }
    },
    name: "productDetail",
    components: {ScrollView, EstimatePopup,AddToCartNoticePopup,CommonDialog,CommonProductSwiper,CommonDialogOperate,CommonRemoveProduct},
    data() {
      return {
        seoSetting:{},
        showPopover:false,
        actions: [
          { text: 'Home',icon: 'wap-home-o',value:'home'},
          { text: 'Favorites' ,icon: 'like-o',value:'favorites'},
          { text: 'Message',icon: 'chat-o',value:'message'},
          { text: 'Orders',icon: 'gift-o',value:'orders' },
        ],
        estimateVisible: false,
        productInfo: {},
        skuinfos: {},
        shopproduct: {},
        productBasicInfo: {},
        saleInfo: {},
        oldSaleInfo: {},
        MOBILE_PRODUCT_DETAIL: {},
        orderevaluation: {},
        isLoading: false,
        isEmpty:false,
        descriptionHtml: '',
        showTop: false,
        checkFlag: false,
        productPriceVisible:false,
        colorIndex:0,
        colorTitle:'',
        skuattrs:[],
        selectedItem:{},
        totalCount:0,
        totalCountIndex:0,
        totalMoney:0,
        totalRMoney:0,
        selectCount:{},
        addToCartNoticeVisible:false,
        hasOnlyColorSkinInfo:{},
        isVisible:false,
        visibleType:'',
        introContent:'',
        receiveaddress:[],
        data7:{},
        productImgUrl:'',
        priceBasicInfo:{},
        serviceInfo:{},
        remarkInfo:{},
        selectRef:'',
        attrvalueRef:'',
        selectedList:{},
        isWaiting:false,
        shareVisible:false,
        shareOptions:[
          { name: 'Download', icon: require('../../assets/images/home/download.png') },
          { name: 'Facebook', icon: require('../../assets/images/home/facebook.png') },
          { name: 'WhatsApp', icon: require('../../assets/images/home/whatsapp.png') },
        ],
        imgIndex:0,//轮播图的位置
        shareItem:{},//分享产品信息
        shareInfo:{},//分享的内容
        productDescription:'',
        ambassor:0,
        showShare:false,
        customer:{},
        customershopifyList:[],
        isShowStore:false,
        storeResult:[],
        storeID:'',
        cancelButtonText:''

      }
    },
    computed: {
      //获取商品id
      getProductID(){
        let productID = '';
        let {productid,url} = this.$route.query;
        if(!productid && url){
          let newValue =["detail.1688.com/offer/", "detail.1688.com/pic/", "m.1688.com/offer/"];
          let startIndex =0;
          for(let key in newValue){
            if(url.indexOf(newValue[key])!=-1){
              startIndex = url.indexOf(newValue[key])+newValue[key].length;
              break;
            }
          }
          if(startIndex==0 || url.indexOf('.html')==-1){
            this.$router.replace('/');
          }
          productID =  url.substring(startIndex,url.indexOf('.html'))
        }else{
          productID = productid
        }
        return productID;
      },
      //判断是不是shopify商品
      isShopifyProduct(){
        return getLoginInfo() && getLoginInfo().shopifyflg==1  && ((this.shopproduct && this.shopproduct.shopifyflg==1) || (this.productBasicInfo.oneorderflg && this.productBasicInfo.oneorderflg==1))
      },
      isShopifyBtn(){
        return getLoginInfo() && getLoginInfo().shopifyflg==1 && this.productBasicInfo && this.productBasicInfo.showShopifyBtn==1
      },
      totalWeight(){
        return (this.totalCount * this.skuinfos.aveweight).toFixed(1) +'KG'
      },
      productID(){return this.productInfo.productID},
      mixAmount(){return this.skuinfos.mixAmount},
      mixNumber(){return this.skuinfos.mixNumber},
      //显示最少数量
      isShowMinQty(){
        return this.skuinfos.minPurchaseQuantity != null && this.skuinfos.minPurchaseQuantity > 0
      },
      isShowCommonPrice(){
        return this.skuinfos.saleInfo == null || this.saleInfo.priceRanges == null || this.saleInfo.priceRanges.length <= 0
      },
      //是否显示top100
      isShowTop100(){return this.shopproduct && this.shopproduct.type==1},
      imgAlt() {
        return !this.productBasicInfo.content ? this.skuinfos.productnameen : this.productBasicInfo.seokeywords;
      },
      showPriceRange() {
        return this.saleInfo != null && this.saleInfo.priceRanges != null && this.saleInfo.priceRanges.length > 0
      },
      //商品评价
      starRate() {
        if (this.shopproduct.platform == 2) {
          return 5;
        } else {
          return this.productBasicInfo.platformstarlevelcss ? this.productBasicInfo.platformstarlevelcss/10 : 0
        }
      },
      //是否是海运
      isSeaShipping() {
        return (this.shopproduct && this.shopproduct.specialgoods == 2) || (this.skuinfos.specailgoods == 2 && this.shopproduct == null)
      },
      //是否显示去鞋盒服务弹框
      showRemoveBoxService(){
        return (this.productBasicInfo.removeshoeflg  && this.productBasicInfo.removeshoeflg == 1) ||
          ( this.productInfo.platform && this.productInfo.platform == 2)
      }
    },
    methods: {
      //查看评价
      checkReviewHandle(){
        this.$router.push(`/reviewpage/${this.productInfo.productID}?type=0`)
      },
      redirectIndexHandle(){
        this.$router.replace('/')
      },
      downloadHandle(){
        if(!this.shareItem||!this.shareItem.images||!this.shareItem.images[this.imgIndex]){
          return
        }
        if(this.ambassor==1){
          //是大使，全部下载
          for(let i =0;i<this.shareItem.images.length;i++){
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
            image.src=this.shareItem.images[i];
          }
          this.$toast({message: 'Download succeeded....' });
        }else{
          //不是大使，只下载一张
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
          this.$toast({message: 'Download succeeded....' });
        }
      },
      swiperChangeHandle(event){
        this.imgIndex = event;
      },
      changeDespHandle(event){
        this.shareInfo = event;
      },
      shareInitHandle(id){
        shareInitApi(id).then(res=>{
          this.shareItem = res.data;
          this.productDescription = this.shareItem.title
        })
      },
//确定分享
      selectShareHandle(option){
        const { name }= option;
        let value ={}
        switch (name){
          case 'Download':
            trackTagFun({fun:'home_share_download_click',index:this.imgIndex})
            //添加谷歌埋点 -Share Now点击后的弹出框，点击Download按钮
            gTagFun('Share to Download','Share to Download','首页')
            this.downloadHandle();
            break;
          case 'Facebook':
            trackTagFun({fun:'home_share_facebook_click',index:this.imgIndex})
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
            trackTagFun({fun:'home_share_whatsapp_click',index:this.imgIndex})
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
      moreOperateHandle(item){
        switch (item.value) {
          case 'home':this.$router.replace('/');break
          case 'favorites':this.$router.push('/shoppingmall/collectionproduct');break;
          case 'message':this.$router.push('message/index');break;
          case 'orders':this.$router.replace('/shoporder/2/index');break
        }
        this.showPopover = false;
      },
      goBackHandle(){
        this.$router.back();
      },
      navbarOperateHandle(type){
        switch (type) {
          case 'cart':
            this.$router.replace('/shoporder/cart?tab=0')
            break;
          case 'share':
            this.showShare = true;
            this.shareInitHandle(this.productInfo.productID)
            break;
        }
      },
      orderOperateHandle(type){
        this.isVisible = false;
        this.visibleType = ''
        switch (type) {
          case 'create':
            this.productPriceVisible = false
            this.selectedItem ={};
            this.selectedList ={};
            this.selectCount={}
            this.totalCountIndex =0;
            this.totalCount =0;
            this.totalMoney =0;
            this.totalRMoney =0;
            this.getProductDetailHandle();
            break;
          case 'view':
            this.$router.replace('/shoporder/cart?tab=0')
            break;

        }
      },
      toBuyHandle(){
        if(!getUserID()){
          this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
          return;
        }
        // 未设强制差评，且评分不在差评范围内，则不需要弹窗
        if(this.productBasicInfo.badproduct == 0 && this.productBasicInfo.badscore == 0){
          this.confirmBuyHandle();
          fbq('track', 'Purchase');
          return;
        }
        this.isVisible = true;
        this.visibleType = 'badReview';
        this.cancelButtonText = this.productBasicInfo.badscore != 0?'See bad reviews':'Got it'
      },
      //获取评价信息
      getReviewInfo(productid,shoporderid,btntype){
        productBadReviewApi({
          productid,
          btntype,
          shoporderid
        }).then(res=>{
          // if(res.status==0){
          //   if(btntype==2){
          //     if(this.productBasicInfo.badreviews>=3){
          //       this.$router.push(`/reviewpage/${this.productInfo.productID}?type=2`)
          //     }else{
          //       this.$router.push(`/reviewpage/${this.productInfo.productID}?type=3`)
          //     }
          //   }
          // }
        })
      },
      //关闭坏评价弹框
      badReviewHandle(type){
        this.isVisible = false;
        this.visibleType ='';
        switch (type) {
          case "see":
            // 存在差评分数，且没有差评浏览记录，则添加新记录
            if(this.productBasicInfo.badscore != 0 && this.productBasicInfo.badrecord == 0){
              this.getReviewInfo(this.productInfo.id,0,2)
            }
            if(this.productBasicInfo.badscore != 0){
              if(this.productBasicInfo.badscore>=3){
                this.$router.push(`/reviewpage/${this.productInfo.productID}?type=2`)
              }else{
                this.$router.push(`/reviewpage/${this.productInfo.productID}?type=3`)
              }
            }
            // this.getReviewInfo(this.productInfo.id,0,2)
            break;
          case "confirm":
            this.confirmBuyHandle()
            break;
        }
      },
      confirmBuyHandle(){

        //判断总数量
        if(this.totalCount<=0){
          this.isVisible = true;
          this.visibleType ='totalCount';
          this.introContent='The order quantity must be an integer greater than 0';
          return;
        }
        let qtyerrflg = true,tflag=false;
        let minPurchaseQuantity = this.skuinfos.minPurchaseQuantity == null?0:this.skuinfos.minPurchaseQuantity;
        let mixamount = this.skuinfos.mixAmount == null?0:this.skuinfos.mixAmount;
        let mixnumber = this.skuinfos.mixNumber == null?0:this.skuinfos.mixNumber;
        if(this.totalCount  >= minPurchaseQuantity  || (mixnumber && this.totalCount >= mixnumber) || (mixamount && this.totalMoney >= mixamount)){
          qtyerrflg = false;
        }
        if(qtyerrflg){
          this.isVisible = true;
          this.visibleType ='totalCount';
          this.introContent='Quantity or value does not satisfy the business pass regulation';
          return;
        }
        if(tflag){return;}
        tflag = true;
        this.isWaiting = true;
        let option={
          skuinfos:this.selectedList,
          shipperinfoid:this.serviceInfo.receiver? this.serviceInfo.receiver.id:undefined,
          productid: this.productInfo.productID,
          removeshoebox: this.serviceInfo.serviceValue?this.serviceInfo.serviceValue:undefined,
          categoryid: this.$route.query.categoryid?this.$route.query.categoryid:undefined,
          edmdetailid:  this.productBasicInfo.edmdetailid?this.productBasicInfo.edmdetailid:undefined,
          shopproduct: this.productBasicInfo.shoppingmallproduct?this.productBasicInfo.shoppingmallproduct:'',
          spm:this.productBasicInfo.spm?this.productBasicInfo.spm:'',
          countrycode:this.remarkInfo.countrycode?this.remarkInfo.countrycode:undefined,
          cellphone: this.remarkInfo.cellphoneConfirm?this.remarkInfo.cellphoneConfirm:undefined,
          name: this.remarkInfo.name?this.remarkInfo.name:'',
          magnet: this.checkFlag?1:0
        }

        this.$axios.post(
          `${this.$config.jianweiDomain}/api/product/buy?ticket=${getUserTicket()?getUserTicket():''}&spm=${this.productBasicInfo.spm?this.productBasicInfo.spm:''}`,
          option,
          { contentType: 'application/json'}
        ).then(res=>{
          tflag=false;
          if(res.status==200){
            this.isWaiting = false;
            if(res.data.status==0){
              var orderids = res.data.data.orderids;
              this.isVisible = true;
              this.visibleType = 'success';
              spmLogApi({
                userid:getUserID()?getUserID():'',
                spm:`a0001.p0003.addtocartresult.0.${getCurrentPageSpmID()}`,
                spmvalue:getCurrentPageSpmID(),
                resultdata:this.productInfo.productID,
                refer:getRefer()?getRefer():'',
                operation:'click',
                device:'mobile',
                refspm:getRefSpm()?getRefSpm():this.$route.query.spm,
                p:'下单页面'
              }).then(res=>{

              })
              //判断
              if(this.productBasicInfo.badscore != 0 && this.productBasicInfo.badrecord == 0) {
                this.getReviewInfo(this.productInfo.id,orderids[0],1)
              }
            }else{
              this.isVisible = true;
              this.visibleType = 'error';
              this.introContent =res.data.message;
            }
          }else{

          }
        })

      },
      removeBoxConfirmHandle(event){
        this.serviceInfo = event;
        this.confirmBuyHandle()
      },
      remindHandle(){
        this.addToCartNoticeVisible = false;
        setTimeout(()=>{
          this.productPriceVisible = true;
        },500)

      },
      //添加评价
      remarkHandle(){
        this.productPriceVisible = false;
        this.$router.push('/shopOrder/edit')
      },
      //弹框的添加购物车
      createOrderFromPopHandle(){
        spmLogApi({
          userid:getUserID()?getUserID():'',
          spm:`a0001.p0003.addtocart.0.${getCurrentPageSpmID()}`,
          spmvalue:getCurrentPageSpmID(),
          resultdata:this.productInfo.productID,
          refer:getRefer()?getRefer():'',
          operation:'click',
          refspm:getRefSpm()?getRefSpm():this.$route.query.spm,
          p:'下单页面',
          device:'mobile',
        }).then(res=>{

        })
        if(!getUserID()){
          this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
          return;
        }
        //判断总数量
        if(this.totalCount<=0){
          this.isVisible = true;
          this.visibleType ='totalCount';
          this.introContent='The order quantity must be an integer greater than 0';
          return;
        }
        let qtyerrflg = true;
        let minPurchaseQuantity = this.skuinfos.minPurchaseQuantity == null?0:this.skuinfos.minPurchaseQuantity;
        let mixamount = this.skuinfos.mixAmount == null?0:this.skuinfos.mixAmount;
        let mixnumber = this.skuinfos.mixNumber == null?0:this.skuinfos.mixNumber;
        if(this.totalCount  >= minPurchaseQuantity  || (mixnumber && this.totalCount >= mixnumber) || (mixamount && this.totalMoney >= mixamount)){
          qtyerrflg = false;
        }
        if(qtyerrflg){
          this.isVisible = true;
          this.visibleType ='totalCount';
          this.introContent='Quantity or value does not satisfy the business pass regulation';
          return;
        }
        if(this.skuinfos.suggestqty > this.totalCount){
          this.isVisible = true;
          this.visibleType='recommend';
          this.introContent=`It's more economical to buy at multiple of ${this.skuinfos.suggestqty}`;
        }
        ProductLimitApi(this.productInfo.productID).then(res=>{
          if(res.status==500){
            this.isVisible = true;
            this.introContent='This is a restricted product.';
            this.visibleType='limit'
          }else{
            if(this.showRemoveBoxService){
              //  显示去鞋盒弹框
              this.productPriceVisible = false;
              this.$router.push(`/search/service/${this.productInfo.productID}`)
            }else{
              this.toBuyHandle()
            }
          }
        })
      },
      chooseOperateHandle(type){
        if(type=='cancel'){
          this.isShowStore = false;
        }else if(type=='confirm'){
          if(this.storeResult.length==0){
            this.isVisible = true;
            this.visibleType ='choose';
            this.introContent='Please select at least one shopify shop';
          }else{
            this.storeID = this.storeResult.join(',');
            this.isShowStore = false;
            this.saveHandle()
          }
        }
      },
      saveHandle(){
        this.isWaiting = true;
        if(this.productInfo.malltype==1){
          shopifyPrivateShareToStoreApi(this.productInfo.productID,this.storeID).then(res=>{
            this.isWaiting = false;
            if(res.status==0){
              this.isVisible = true;
              this.visibleType ='shopifySuccess';
              this.introContent='The product has been successfully listed in your store.'
            }else{
              this.isVisible = true;
              this.visibleType ='shopifyError';
              this.introContent = res.message;
            }
          })
        }else if(this.productInfo.malltype==0){
          shopifyShareToStoreApi(this.productInfo.productID,this.storeID).then(res=>{
            this.isWaiting = false;
            if(res.status==0){
              this.isVisible = true;
              this.visibleType ='shopifySuccess';
              this.introContent='The product has been successfully listed in your store.'
            }else{
              this.isVisible = true;
              this.visibleType ='shopifyError';
              this.introContent = res.message;
            }
          })
        }

      },
      //分享到shopify
      shareToShopifyHandle(){
        if(this.customershopifyList && this.customershopifyList.length==1){
          this.storeID = this.customershopifyList[0].id;
          this.saveHandle()
        }else{
          this.isShowStore = true;
        }
      },
      //添加购物车
      createOrderHandle(){
        if(this.productBasicInfo.remind==0){
          //判断是否登录
          if(!getUserID()){
            //登录页面
            this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
            return;
          }
          this.addToCartNoticeVisible = true;//显示协议弹框
          return;
        }
        if(this.productBasicInfo.tips){
          //tip弹框
          this.$dialog.confirm({
            title: this.productBasicInfo.tips,
            cancelButtonText:'Cancel',
            confirmButtonText:'Add to Cart',
          })
            .then(() => {
              this.showProductSpecHandle()
            })
            .catch(() => {
              // on cancel
            });
        }else{
          this.showProductSpecHandle()
        }
      },
      //显示价格弹出框
      showProductSpecHandle(){
        this.productPriceVisible = true;
      },
      //商品收藏
      collectionProductHandle(){
        collectGoodsApi(this.productInfo.productID).then(res=>{
          this.getProductDetailHandle()
        })
      },
      colorTagHandle(item,tabIndex){
        this.colorIndex = tabIndex;
        this.colorTitle = `_${item.value}`;
        this.getProductPriceHandle()
      },
      plusHandle(event){
        let sum =0,sumMoney=0,sumRMoney=0;
        this.selectedItem[this.colorTitle] = this.selectedItem[this.colorTitle].map(item=>{
          if(item.skuId == event.skuId){
            item.qty = event.qty;
            item.rprice = item.rprice;
            item.referencePrice = item.price;
          }
          return item;
        });

        //计算总个数
        for(let key in this.selectedItem){
          this.selectCount[key] = this.selectedItem[key].reduce((pre,cur)=>{
            return Number(cur.qty) + pre;
          },0);
        }
        for(let key in this.selectCount){
          sum +=Number(this.selectCount[key])
        };
        this.totalCount = sum;
        if( this.saleInfo.priceRanges){
          //根据总个数，计算价格
          this.saleInfo.priceRanges.forEach((item,index)=>{
            //如果超过最开始的数量
            if(this.totalCount >= item.startQuantity){
              this.totalCountIndex = index;
              //改变selectedItem的值
              for(let key in this.selectedItem){
                this.selectedItem[key]= this.selectedItem[key].map(selectValue=>{
                  selectValue.price = item.price;
                  selectValue.rprice = item.rprice;
                  selectValue.referencePrice = item.price;
                  return selectValue;
                })
              }
            }
          })
        }

        let selectMoney = {},selectRMoney={};
        for(let key in this.selectedItem){
          selectMoney[key] = this.selectedItem[key].reduce((pre,cur)=>{
            return Number(cur.price?cur.price:cur.referencePrice)*Number(cur.qty) + pre;
          },0);
          selectRMoney[key] = this.selectedItem[key].reduce((pre,cur)=>{
            return Number(cur.price?cur.price:cur.referencePrice)*Number(cur.qty) + pre;
          },0);
        }
        for(let key in selectMoney){
          sumMoney +=Number(selectMoney[key])
        }
        for(let key in selectRMoney){
          sumRMoney +=Number(selectMoney[key])
        }
        this.totalMoney = sumMoney;
        this.totalRMoney = sumRMoney;
        let array = this.selectedItem[this.colorTitle].filter(item=>item.qty>0);
        let newArray =[]
        array.forEach(item=>{
          newArray.push({
            attrvalue: item.lastattributevalueen,
            attrvaluecn:item.lastattributevalue,
            attrvalueref:this.attrvalueRef,
            index: item.index,
            price:item.price,
            qty: item.qty,
            rprice: item.price,
            selectkeyref:this.selectRef,
          })
        })
        this.selectedList[this.colorTitle]={...newArray};
      },
      checkSizeHandle(){
        // window.open(`${this.$config.jianweiDomain}/helpcenter/sizeguide`)
        this.$router.push('/helpcenter/sizeguide')
      },

      handleScroll(event) {
        let scrollTop = event.target.scrollTop;    //滚动条的高度
        if (scrollTop > 600) {  //当滚动条大于600的时候 回到顶部 dom出现
          this.showTop = true;
        } else {    //否则的话  继续消失
          this.showTop = false;
        }
      },
      gotoTopHandle(){
        let timer = setInterval(() => {
          if (this.$refs.top.scrollTop > 0) {			//当滚动条大于0时开一个定时器
            this.$refs.top.scrollTop -= 100;   //每30毫秒 滚动条减少100
          } else {
            clearInterval(timer);   //小于0时清除定时器
          }
        }, 30);
      },
      cancelHandle() {
        this.estimateVisible = false;
      },
      showEstimatePopupHandle() {
        this.estimateVisible = true;
      },
      getProductDescriptionHandle() {
        productDescriptionApi(this.getProductID).then(res => {
          if(res){
            this.descriptionHtml = res.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
          }

        })
      },
      getProductDetailHandle() {
        this.isLoading = true;
        const {categoryid, spm,sf} = this.$route.query;
        productDetailApi({
          productid:this.getProductID,
          categoryid,
          spm,
          sf: sf?sf:0
        }).then(res => {
          if(res){
            this.productBasicInfo = res;
            const {productInfo, skuinfos, shopproduct, MOBILE_PRODUCT_DETAIL, orderevaluation,receiveaddress,data7,customer,customershopifyList} = res;
            this.customer = customer || {}
            this.productInfo = productInfo || {};
            this.skuinfos = skuinfos || {};
            this.customershopifyList = customershopifyList || [];
            this.shopproduct = shopproduct || {};
            this.saleInfo = this.skuinfos.saleInfo || {};
            if(this.saleInfo.priceRanges){
              this.saleInfo.priceRanges = this.saleInfo.priceRanges.map(item=>{
                item.rprice = item.price;
                return item;
              })
            }
            this.skuattrs = this.skuinfos.skuattrs || [];
            this.productImgUrl = productInfo.images[0];
            this.receiveaddress =receiveaddress || [];
            this.data7 = data7 || {};
            this.oldSaleInfo = this.skuinfos.oldSaleInfo || {};
            this.MOBILE_PRODUCT_DETAIL = MOBILE_PRODUCT_DETAIL || {};
            this.orderevaluation = orderevaluation || {};
            if(this.productBasicInfo.blackflg){
              this.isVisible = true;
              this.visibleType=`blackflg${this.productBasicInfo.blackflg}`
              this.introContent = this.productBasicInfo.blackflg==1?'This product is Poor quality,do NOT buy it.':'This product may have quality problem,do you confirm the risk and continue to buy?'
            }``
            if(this.skuattrs.length>1){
              let colorItem = this.skuattrs.find((item,index)=>index==0);
              let sizeItem = this.skuattrs.find((item,index)=>index==1)
              for(let key in colorItem){
                this.colorTitle =`_${colorItem[key][0].value}`;
                this.selectRef = `_${key}`;
              }
              for(let key in sizeItem){
                this.attrvalueRef = key;
              }

            }else{
              let colorItem = this.skuattrs.find((item,index)=>index==0);
              for(let key in colorItem){
                this.attrvalueRef = key;
              }
            }
            if ((this.shopproduct && this.shopproduct.specialgoods == 2) || (this.skuinfos.specailgoods == 2)) {
              this.checkFlag = true;
            }
            this.isLoading = false;
            // //seo优化
            // this.optimizePageHandle(res)
            /*获取价格*/
            this.getProductPriceHandle();
          }else{
            this.isLoading = false;
            this.isEmpty = true;
          }


        })
      },
      getProductPriceHandle(){
        productPriceApi({
          productid:this.productInfo.productID,
          key:this.colorTitle,
        }).then(res=>{
          this.priceBasicInfo= res;
          if(res.skuinfos.skuinfo && res.skuinfos.skuinfo.length!=0){
            res.skuinfos.skuinfo = res.skuinfos.skuinfo.map((item,index)=>{
              item.price = item.price?item.price:item.referencePrice;
              item.qty= 0;
              item.index=index;
              return item;
            })
          }
          if(!this.selectedItem[this.colorTitle]){
            this.selectedItem[this.colorTitle] = res.skuinfos.skuinfo || [];
          }
          for(let key in this.selectedItem){
            let firstItem = this.selectedItem[key].find((item,index)=>index==0);
            if(firstItem && firstItem.skupic){
              this.productImgUrl = firstItem.skupic
            }else{
              this.productImgUrl = this.productInfo.images[0];
            }
          }
        })
      },


    },
    created() {
      this.$EventBus.$on('remarkEvent',result=>{
        this.remarkInfo = result;
      })
      this.$EventBus.$on('confirmEvent',result=>{
        this.removeBoxConfirmHandle(result)
      })

    },
    mounted() {

      this.getProductDetailHandle();
      this.getProductDescriptionHandle();
      window.addEventListener('scroll', this.handleScroll, true)
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'下单页面',
        operate:'close',
        spm:`a0001.下单页面.close.${getCurrentPageSpmID()}`,
        resultdata:to.query.productid,
      })
      next();
    },
    beforeRouteEnter(to,from,next){
      if(to.query.sf==1){
        to.meta.isQuestion = false;
      }
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      loginRegisterPageBury({
        p:'下单页面',
        operate:'page',
        spm:to.query.spm,
        resultdata:to.query.productid,
        refspm:to.query.spm
      })
      next();
    },
    async asyncData ({ query }) {
      let productID = '';
      let {productid,categoryid,sf,spm,url} = query;
      if(!productid && url){
        let newValue =["detail.1688.com/offer/", "detail.1688.com/pic/", "m.1688.com/offer/"];
        let startIndex =0;
        for(let key in newValue){
          if(url.indexOf(newValue[key])!=-1){
            startIndex = url.indexOf(newValue[key])+newValue[key].length;
            break;
          }
        }
        if(startIndex==0 || url.indexOf('.html')==-1){
          this.$router.replace('/');
        }
        productID =  url.substring(startIndex,url.indexOf('.html'))
      }else{
        productID = productid
      }
      const { data } = await axios.get(`${process.env.baseUrl}/api/product/search?ticket=${getUserTicket()}&productid=${productID}&categoryid=${categoryid}&spm=${spm}&sf=${sf?sf:0}`)
      if(data.status==0){
        let {skuinfos,productInfo,seokeywords,content} = data.data;
        let titleValue = content!=null ?seokeywords: skuinfos.productnameen;
        let productImg = productInfo.images[0];
        let seoSetting={
          title:`${titleValue}`,
          productImg
        }
        return {
          seoSetting
        }
      }
    }

  }
</script>

<style scoped lang="less">
  .choose-store-content{
    .choose-store-list{
      max-height:50vh;
      padding:5px;
    }
    .choose-store-footer{
      padding:8px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      /*border-top:1px solid #EEEEED;*/
      /deep/.van-button{
        border-radius: 6px;
        font-size:16px;
      }
    }
  }
  .icon-shopify{
    color:darkgreen;
  }
  .item-count{
    padding:8px 0;
  }

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
  /deep/.van-field__body{
    background:#EEEEED;
  }
  /deep/ .van-divider{
    margin:2px 0;
  }
  /deep/ .van-field__control{
    padding:2px 8px 0 8px;
    border-radius: 10px;
  }

  /*分享结束*/
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .color-price{
    color:#ff6000
  }

  /*价格弹框开始*/
  /deep/.van-tab{
    font-size:15px;
  }
  /deep/.van-tabs__line{
    background-color: #ff6000 !important;
  }
  /deep/.van-popup{
    overflow-y: inherit;
  }
  .product-price-dialog{
    .priceScrollHeight{
      max-height:62vh;
      overflow-y: scroll;
      overflow-x: hidden;
      /deep/.van-notice-bar__content{
        font-size:18px;
      }
    }
    .product-price-dialog-title{
      padding:10px 15px 25px;
      margin-bottom: 4px;
      position: relative;
      .image-content{
        position: absolute;
        top:-20px;
        left:20px;
        z-index:1;
        /*margin-top: -40px;*/
        .image-content-inner{
          width:90px;
          height:90px;
          overflow: hidden;
          border:1px solid #EEEEED;
          border-radius: 4px;
          img{
            max-width: 100%;
            height:auto;
          }
        }
        .size-tag{
          background-color: #fcc900;
          text-align: center;
          padding:4px 0;
          border-radius: 4px;
        }

      }
      .price-range{
        padding:6px 0;
        font-size:15px;
        line-height:1.5;
        color:#ff6000;
      }
    }
    .price-range-list{
      padding:10px 0;
      .price-item-range{
        color:#666;
        margin-top: 10px;
        .price-item{
          font-size: 16px;
          margin-bottom: 6px;
        }
        .price-count{
          font-size: 14px;
        }
      }
      .price-active{
        color:#ff6000
      }
    }
    .product-price-color-content{
      padding:10px 15px;
      .product-price-color-content-title{
        font-size:17px;
        margin-bottom: 15px;

      }
      /deep/.van-loading{
        margin:30% auto;
      }

      .tag-color-item{
        padding:8px 12px;
      }

    }
    .color-tag{
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .size-count-item{
      margin-bottom: 10px;
      .size-count-item-stock{font-size:13px;}
      .size-count-item-size{
        p{line-height:1.5;}
        .color_normal{
          font-size:15px;
        }
        .color_intro{font-size:12px;}
      }
    }
    .product-price-footer{
      position: fixed;
      background-color: #fff;
      bottom:15px;
      left:0;
      right:0;
      z-index: 10;
      border-top:1px solid #EEEEED;
      .product-price-total{
        padding: 6px 15px;
        font-size:14px;
        .color-price{
          font-size:18px;
        }
        .color-qty{
          color:#ff6000;
          font-size:18px;
        }
      }
      .product-price-btn{
        margin-top: 10px;
        /deep/.van-button{
          height:42px !important;
          line-height:42px !important;
        }
        .cart-btn{
          background:linear-gradient(90deg, rgb(255, 115, 0), rgb(255, 96, 0));
          color:#fff;
          font-size:18px;
          /*font-weight: bold;*/
          width:45%;
          border-radius: 4px;
        }
        .remark-btn{
          border:1px solid #ff6000;
          color:#ff6000;
          font-size:18px;
          /*font-weight: bold;*/
          width:45%;
          border-radius: 4px;
        }
      }
    }
  }
  /*价格弹框结束*/


  /deep/.van-action-sheet__header{
    font-size:18px;
    line-height:1.4;
    text-align: left;
    color:#000;
    padding: 8px 10px 4px 16px;
  }
  .btn-to-top {
    width: 60px;
    height: 60px;
    padding: 10px 16px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
  }
  .product_description{
    /*padding:10px 15px;*/
    margin:12px 6px;
    .product-inner{
      width:100%;
      overflow: hidden;
    }
  }
  .sea-tag{
    color:#0000FF;
  }
  .rate-content{
    flex:1;
  }
  .common-price{
    font-size:24px;
    color:#ff7300;
  }
  .top-box{
    position: fixed;
    width:40PX;
    height:40PX;
    background-color: #fcc900;
    right:15px;
    bottom:8%;
    border-radius: 50%;
    color:#fff;
    font-weight: bold;
    font-size:14px;
    font-style: italic;
    transition: 0.5s;
    .top-box_inner{
      width:40PX;
      height:40PX;
    }

  }
  .product_shopify_inner{
    padding:4px 10px;
    /deep/.van-button{
      border-radius: 4px;
    }
  }
  .product_footer{
    background: #EEEEED;
    position: fixed;
    bottom:0;
    right:0;
    left:0;
    z-index:10;
    /*height:49px;*/
    .product_footer-inner{
      padding:7px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .cart_btn{
        flex:1;
        margin-right:15px;
        border-radius: 5px;
        background-color: #fcc900;
      }
      .like_btn{
        flex:1;
        border-radius: 5px;
        border:1px solid #FF6A6A;
        color:#FF6A6A;
        background-color: transparent;
      }
      .collection_btn{
        background-color: #FF6A6A;
        color:#2A2A2A;
        flex:1;
        border-radius: 5px;
        border:1px solid #FF6A6A;
      }
    }
  }
  .product-detail-wrapper{
    .scrollGoodDetail{
      position: relative;
      height:calc(100vh - 49PX);
      overflow-y: scroll;
      background-color: #EEEEED;
    }
    /deep/.van-nav-bar{
      background: transparent;
      box-shadow: none;
    }
    /deep/.van-nav-bar__content:after{
      content: "";
      position: absolute;
      height: 2.5rem;
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
    /deep/.van-dialog{
      width:90vw;
      top:49%;
    }
  }
  .top_100_img{
    width: 40PX;
    height: 40PX;
    position: absolute;
    z-index:1;
    bottom: 3px;
    left: 0;
    background: url('~assets/images/top100/tag.png');
    background-size:40PX 40PX;
    border-radius: 0 0 8px 0 ;

  }
  .product-detail-title{
    display: flex;
    padding:10px 15px;
    background-color:   transparent;
    justify-content: space-between;
    align-items: center;
  }
  .icon-fenxiang1{
    font-size:22px;
    color:#fff;

  }
  .icon-shenglvehao1{
    font-size:26px;
    color:#fff;
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
  .popover-item{
    font-size: 15px;
    line-height: 40px;
    border-bottom: 1px solid #EEEEED;
    height: 40px;
    text-align: center;
    padding: 0 25px;
    width:100px;
  }
  /*  轮播图开始*/
  .custom-indicator {
    position: absolute;
    right: 10px;
    color:#fff;
    bottom: 15px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 14PX;
    background: rgba(0, 0, 0, 0.3);
  }
  /deep/.van-swipe-item{
    img{
      width:100%;
    }
  }
  /*  轮播图结束*/
  /*  商品信息开始*/
  .product-detail-card{
    background-color: #fff;
    .product-detail-card-title{
      padding:15px;
      h2{
        margin-bottom: 15px;
        font-weight: normal;
      }

    }
  }
  .product-other-card{
    /*margin:6px 6px 12px;*/
    margin-bottom: 6px;
    background-color:#fff;
    padding:8px 0;
    border-radius: 5px;
    font-size:15px;
  }
  .product-data-card{
    /*margin:6px 6px 12px;*/
    margin-bottom: 6px;
    background-color:#fff;
    padding:8px 10px;
    border-radius: 5px;
    font-size:15px;
    .product-data-title{
      padding-bottom:10px;
      font-size:18px;
      /*font-weight: bold;*/
      border-bottom: 1px solid lightgrey;
    }
  }
  .data-item{

    .data-item-count{
      font-size:18px;
      margin:6px 0;
    }
  }
  .data-item-left{
    border-right:1px dashed #9e9e9e;
    padding-right:8px;
  }
  .product-name-card{
    background-color:#fff;
    padding:10px;
    border-radius: 5px;
    margin-bottom: 6px;
    /*margin:6px 6px 12px;*/
    font-size:15px;
    /deep/.van-notice-bar{
      padding:4px 0;
      background-color: #fff;
      font-size:13px;
    }
  }
  .old-price{
    font-size:14px;color: #999;background-color: unset;
  }
  .product-price{
    .product-price-item{
      flex:1;
      .item-price{
        font-size:18px;
        color:#ff7300;
        font-weight: 500;


      }

    }
  }
  .product-name{
    font-size: 18px;
    line-height:1.5;
    color: rgb(34, 34, 34);
    font-weight: bold;
    margin-bottom:8px
  }
  .product-price{
    margin-bottom: 8px;
  }
  .product-weight{
    line-height:1.5;
  }
  .product-banner{
    img{width:100%;}
    margin:10px 0;
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
  .scrollHeight {
    height: 80vh;
  }
  /*  商品信息结束*/
</style>
