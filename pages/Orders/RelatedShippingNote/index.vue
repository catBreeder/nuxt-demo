<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Shipping Note</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollViewHeight">
        <div class="shipping_note_wrapper">
            <div class="note_card">
              <div class="note_card_title ">
                <div class="g_mb_s">Ship No: {{express.expressnumber}}</div>
                <div class="color_blue text_align_r">{{basicInfo.status}}</div>
              </div>
              <div class="note_card_info">
                <van-row>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Create Time</p>
                      <p class="color_content">{{express.createtime | timeFormat('YMD')}}</p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Actual Weight</p>
                      <p  class="color_content">{{shopexpressCost.ascertainedweight}} KG</p>
                    </div>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col :span="12">
                    <div class="info_item" >
                      <template v-if="basicInfo.isOcean">
                        <p class="color_label">Chargeable Volume</p>
                        <p  class="color_content">{{basicInfo.volume}} m³</p>
                      </template>
                      <template v-else>
                        <p class="color_label">Chargeable Weight</p>
                        <p  class="color_content">{{shopexpressCost.finalweight}} KG</p>
                      </template>

                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Freight Charge</p>
                      <p class="color_content">
                        <template v-if="chargeBigFlag">
                          {{FreightCharge | moneyFormat(false)}} ZAR
                        </template>
                        <template v-else>
                          0.00 ZAR
                        </template>
                      </p>
                    </div>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Coupon Fee</p>
                      <p class="color_content">{{shopexpressCost.couponmoney/100 | moneyFormat(false)}} ZAR</p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Actual Charge</p>
                      <p class="color_content">
                        <template v-if="shopexpressCost.cost >= 0">
                          {{(shopexpressCost.cost/100) | moneyFormat(false)}} ZAR
                        </template>
                        <template v-else>
                          0.00 ZAR
                        </template>
                      </p>
                    </div>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Purchase Fee</p>
                      <p class="color_content">
                        <template v-if="shopexpressCost.orderamount >= 0 ">
                          {{shopexpressCost.orderamount/100 | moneyFormat(false)}} ZAR
                        </template>
                        <template v-else>
                          0.00 ZAR
                        </template>
                      </p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label d_flex">
                        Total Amount&nbsp;
                        <van-popover v-model="showPopover"  placement="top" trigger="click" theme="dark">
                          <div class="pop-intro">Actual Charge + Purchase Fee</div>
                          <template #reference>
                            <van-icon name="question-o" size="15" color="#999"/>
                          </template>
                        </van-popover>
                      </p>

                      <p class="color_content">
                        <template v-if="totalAmountFlag">
                          {{totalAmount | moneyFormat(false)}} ZAR
                        </template>
                        <template v-else>
                          0.00 ZAR
                        </template>
                      </p>
                    </div>
                  </van-col>
                </van-row>
              </div>
              <div class="note_card_info">
                <van-row>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Client</p>
                      <p class="color_content">{{receiver.customername  }}</p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Transport Service</p>
                      <p  class="color_content">
                        <template v-if="basicInfo.isOcean"> Ocean - {{basicInfo.transport}}</template>
                        <template v-else>Air - {{basicInfo.isSelf ? 'Self Pick-up':'Door to Door'}}</template>
                      </p>
                    </div>
                  </van-col>
                </van-row>
                <van-row v-if="shopexpressCost.taxpeople != 3">
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Tax Payer</p>
                      <p class="color_content">{{shopexpressCost.taxpeople == 1? 'Receiver':'My Balance'}}</p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item" >
                      <template v-if="shopexpressCost.withholdtax != 0">
                        <p class="color_label">Estimated Tax</p>
                        <p  class="color_content">
                          {{shopexpressCost.withholdtax | moneyFormat(false)}} ZAR
                        </p>
                      </template>
                      <template v-else>
                        <p class="color_label">Actual Tax</p>
                        <p  class="color_content">
                          {{expressCost.receivedtax | moneyFormat(false)}} ZAR
                        </p>
                      </template>
                    </div>
                  </van-col>
                </van-row>
              </div>
              <div class="note_card_info">
                <van-row>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">Receiver</p>
                      <p class="color_content">{{express.receiver }}</p>
                    </div>
                  </van-col>
                  <van-col :span="12">
                    <div class="info_item">
                      <p class="color_label">TEL</p>
                      <p  class="color_content">{{express.receivetelephone}}</p>
                    </div>
                  </van-col>
                </van-row>
                  <div class="g_mb_l info_item">
                    Receiver Address
                    <div class="van-multi-ellipsis--l2  color_content g_mt_m">
                      {{express.receiveaddress }} {{express.receiveaddress2}}
                    </div>
                  </div>
                  <div class="g_mb_l info_item" v-if="express.transportmode == 15">
                    Self Pick-up Address
                    <div class="color_content van-multi-ellipsis--l2 g_mt_m">
                      Unit 3 106 Loper Avenue, Spartan X2, Kempton Park, 1619. Johannesburg +27105934710/+27870953451
                    </div>
                  </div>
              </div>
            </div>
            <div class="note_track" v-if="recordlist.length">
              <div class="note_track_item note_track_item_bottom" v-for="(item,index) in recordlist" :key="index">
                <div class="item_left ">
                  <div class="item_left_link " :class="{
                    'item_left_link_first':index!=recordlist.length-1,
                    'item_left_link_next':index==recordlist.length-1}"/>
                  <div class="icon iconfont " :class="{'icon-wenzhang':index==0,'icon-chenggong':index!=0}"></div>
                </div>
                <div class="item_right">
                  <div class="item_right_inner">
                    <strong :class="{'color_active':index==0}">{{item.displaytime}}</strong>
                    <div class="g_mt_m" :class="{'color_active':index==0}">{{item.content}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="note_goods_detail">
              <div v-for="(order ,orderIndex) in shoporders" :key="orderIndex" class="detail_item bg_white">
                <div class="detail_title d_flex d_flex_between">
                  <div>Purchase No:{{order.orderno }} </div>
                  <div class="color_blue" @click="checkDetailHandle(order.id)">Detail</div>
                </div>
                <div class="goods_detail" v-for="(item,index) in shoporderDetailMap[order.id]" :key="index">
                  <div class="goods_item">
                    <div class="goods_item_inner">
                      <div class="goods_item_img">
                        <img :src="item.images?item.images:OrderImg" alt="">
                      </div>
                      <div class="goods_item_info">
                        <div class="goods_item_title text_ellipsis_2">{{item.productnameen}}</div>
                        <div class="text_align_r g_mt_m color_intro">X{{item.qty}}</div>
                        <div clarecordlistss="d_flex d_flex_between " style="font-size:13px;" v-if="shopexpressCost.taxpeople !=3">
                          <div>Declear Value(USD):</div>
                          <div>{{(item.declaredvalue/100) | moneyFormat(false)}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="goods_item_cost" v-if="scostmap[order.id]">
                  Shipping Cost: <span class="count_tag">R{{scostmap[order.id]?scostmap[order.id]:0}}</span> of <span class="count_tag">{{(shopexpressCost.cost/100) | moneyFormat}}</span></div>
              </div>
            </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
    import OrderImg from '@/assets/images/common/goods_empty.png';
    import ScrollView from "@/components/common/ScrollView";
    import {orderDeliveryDetailApi} from '@/api/orders'
    export default {
        name: "index",
        components:{ScrollView},
        computed:{
          chargeBigFlag(){
            return Number(this.shopexpressCost.cost?this.shopexpressCost.cost:0) +
              Number(this.shopexpressCost.couponmoney?this.shopexpressCost.couponmoney:0) >=0;
          },
          FreightCharge(){
            return (Number(this.shopexpressCost.cost?this.shopexpressCost.cost:0) +
              Number(this.shopexpressCost.couponmoney?this.shopexpressCost.couponmoney:0))/100
          },
          totalAmountFlag(){
            return Number(this.shopexpressCost.orderamount?this.shopexpressCost.orderamount:0) +
              Number(this.shopexpressCost.cost?this.shopexpressCost.cost:0) >= 0
          },
          totalAmount(){
            return (Number(this.shopexpressCost.orderamount?this.shopexpressCost.orderamount:0) +
              Number(this.shopexpressCost.cost?this.shopexpressCost.cost:0))/100
          }
        },
        data(){
          return{
            OrderImg,
            showPopover:false,
            basicInfo:{
              status:'',
              isOcean:false,
              isSelf:false,
              volume:0,
              transport:''
            },
            express:{},
            shopexpressCost:{},
            expressCost:{},
            receiver:{},
            shoporderDetailMap:{},
            recordlist:[],
            shoporders:[],
            scostmap:{}
          }
        },
        methods:{
          checkDetailHandle(id){
            this.$router.push(`/shoporder/2/detail/${id}`)
          },
          goBackHandle(){this.$router.back()},
          getShippingNoteInfo(){
            orderDeliveryDetailApi(this.$route.params.id).then(res=>{
              const {status,express,shopexpressCost,expressCost,isOcean ,scostmap,volume ,receiver,transport,isSelf,recordlist,shoporders,shoporderDetailMap} = res.data;
              this.basicInfo ={
                status,isOcean,volume,transport,isSelf
              }
              this.express = express || {}
              this.receiver = receiver || {}
              this.shopexpressCost = shopexpressCost || {};
              this.expressCost = expressCost || {};
              this.recordlist= recordlist ||[];
              this.shoporders= shoporders ||[];
              this.shoporderDetailMap=shoporderDetailMap|| {};
              this.scostmap = scostmap;
            })
          },
        },
        mounted() {
          this.getShippingNoteInfo()
        }
    }
</script>

<style scoped lang="less">
 .pop-intro{
   font-size: 12px;
   padding:6px;
 }
  .color_label{
    color:#2a2a2a;
  }
  .color_content{
    color:#000;
    font-size: 13px;
  }
.scrollViewHeight{
  height:calc(100vh - 46px - 48px);
  background-color: #f5f6f9;
}
.count_tag{
  font-size:16px;
  margin:0 5px;
  color:orange;
}
.icon-wenzhang{
  font-size:30px;
  color:orange;
}
.icon-chenggong{
  font-size:30px;
  color:#fcc900;
}
.shipping_note_wrapper{
  padding:4px;
  margin-bottom: 30px;
  .note_card{
    border-radius: 6px;
    padding:15px 10px;
    background-color: #fff;
    .note_card_title{
      font-size:15px;
      padding-bottom: 6px;
      border-bottom:1px solid lightgrey;
    }
    .note_card_receiver{
      padding:10px;
      font-size:14px;
      border-bottom: 1px solid lightgray;
      line-height:1.7;
      .self_card{
        border-top: 1px solid lightgrey;
        padding-top: 10px;
      }
      span{
        margin-left: 10px;
      }
    }
    .note_card_info{
      padding:10px;
      font-size:14px;
      /*display: flex;*/
      /*flex-wrap: wrap;*/
      /*align-items: center;*/
      /*justify-content: space-between;*/
      border-bottom: 1px solid lightgray;
      .info_item{
        margin-bottom: 15px;
        p{
          margin-bottom: 8px;
        }
        .color_content{
          font-weight: bold;
        }
      }
      /*.info_item_last{*/
      /*  width: 35%;*/
      /*}*/
    }
  }
  .note_track{
    margin: 15px 0;
    background-color: #fff;
    padding:20px 20px 20px 0;
    border-radius: 4px;
    .note_track_item_bottom{
      margin-bottom: 30px;
    }
    .note_track_item{
      display: flex;
      align-items: center;
      .item_left{
        width:100PX;
        text-align: center;
        position: relative;
        height:70PX;
      }
      .item_left_link_first{
        bottom:-32PX;
      }
      .item_left_link_next{
        bottom:0;
      }
      .item_left_link{
        width:3px ;
        top:30PX;
        left:50%;
        background-color:#f1f1f1;
        position: absolute;
      }
      .item_right{
        flex:1;
        max-height:90PX;
        overflow-y: scroll;
        .item_right_inner{
          padding:15px 10px;
          background-color: #f5f5f5;
          color:#3d4145;
          position: relative;
          border-radius: 4px;
        }
        .item_right_inner:before{
          content: '';
          position: absolute;
          top: 15PX;
          right: 100%;
          height: 0;
          width: 0;
          border: 7px solid transparent;
          border-right: 7px solid white;
          border-color: transparent #f5f5f5 transparent transparent;
        }
      }
    }
  }
  .note_goods_detail{
    .detail_item{
      padding:15px 10px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .goods_item_cost{
      font-size:14px;
      border-top:1px dashed lightgrey;
      text-align: right;
      margin-top: 8px;
      padding-top: 10px;
    }
    .detail_title{
      font-size:14px;
      padding-bottom: 15px;
      border-bottom:1px solid lightgrey;
    }
    .goods_detail{
      .goods_item{
        .goods_item_inner{
          display: flex;
        }

        padding:10px 8px;
        .goods_item_img{
          width:96PX;
          height:96PX;
          img{
            display: block;
            max-width: 100%;
            height: auto;
          }
        }
        .goods_item_info{
          flex:1;
          padding-left:10px;
          .goods_item_title{
            font-size:15px;
            line-height:1.5;
          }
        }

      }
    }
  }
}
</style>
