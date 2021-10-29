<template>
  <div class="orderValue-popup">
    <van-tabs v-model="tagIndex" sticky >
      <van-tab v-for="(item,index) in tagList" :title="item.name" :key="index" />
    </van-tabs>
    <div class="orderValue-content">
      <template v-if="tagIndex===0">
        <scroll-view class="scrollHeight">
          <template v-if="avaliableList.length > 0">
            <div class="coupon-list">
              <div class="coupon-item" v-for="(item,index) in avaliableList" :key="index">
                <div class="coupon-item-top" @click="chooseCouponHandle(item)">
                  <van-row type="flex" align="center" >
                    <van-col span="18" >
                      <div class="coupon-item-left d_flex">
                        <h4>R{{item.money}}</h4>
                        <h6>OFF</h6>
                        <h6>{{item.usetype}}</h6>
                      </div>
                    </van-col>
                    <van-col span="2" offset="3" class="coupon-item-right">
                      <div class="coupon-item-radio">
                        <van-radio  shape="round"
                                    :name="item.id"
                                    v-model="chooseIndex"
                        />
                      </div>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="24"><div class="coupon-intro">Your order of R{{item.minmoney }} or more</div></van-col>
                  </van-row>
                </div>
                <div class="coupon-item-bottom border-active">{{item.dateinfo}}</div>
              </div>
            </div>

          </template>
          <template v-else>
            <van-empty description="No coupons are available" >
              <img src="~assets/images/common/empty.png" alt="" slot="image">
            </van-empty>
          </template>
        </scroll-view>
      </template>
      <template v-else-if="tagIndex===1">
        <scroll-view class="scrollHeight">
          <template v-if="unAvaliableList.length > 0">
            <div class="coupon-list">
              <div class="coupon-item" v-for="(item,index) in unAvaliableList" :key="index">
                <div class="coupon-item-diable-top ">
                  <van-row type="flex" align="center" >
                    <van-col span="18" >
                      <div class="coupon-item-left d_flex">
                        <h4>R{{item.money}}</h4>
                        <h6>OFF</h6>
                        <h6>{{item.usetype}}</h6>
                      </div>
                    </van-col>
                    <van-col span="2" offset="3" class="coupon-item-right">
                      <van-radio disabled/>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="24"><div class="coupon-intro">Your order of R{{item.minmoney }} or more</div></van-col>
                  </van-row>
                </div>
                <div class="coupon-item-bottom border_disable">Reason for Unavailability: The order amount is not satisfied</div>
              </div>
            </div>
          </template>
          <template v-else>
            <van-empty description="No coupons are available" >
              <img src="~assets/images/common/empty.png" alt="" slot="image">
            </van-empty>
          </template>
        </scroll-view>
      </template>

    </div>
    <div class="orderValue-btn d_flex d_flex_between">
      <van-button type="warning" block round @click="closeHandle">Don’t use coupons</van-button>
    </div>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";

  export default {
    name: "index",
    components:{ScrollView},
    props:{
      avaliableList:{
        type:Array,
        default:()=>[]
      },
      unAvaliableList:{
        type:Array,
        default:()=>[]
      },
      isChoose:{type:Boolean,default:false}
    },
    data(){
      return{
        chooseIndex:0,
        chosenCoupon:0,
        useCouponFlag:false,
        tagList:[{name:'Avaliable',id:1},{name:'Not available',id:2}],
        tagIndex:0
      }
    },
    methods:{
      chooseCouponHandle(item){
        this.chooseIndex = item.id;
        this.$emit('chooseCouponEmit',{
          id: item.id,money:item.money
        });
        this.chooseIndex = null;
      },
      closeHandle(){
        this.$emit('chooseCouponEmit',{
          id:-1,money:0
        });
      },

    },
    mounted() {
      if(this.isChoose){
        this.chooseIndex = this.avaliableList[0]?this.avaliableList[0].id:0;
      }
    }
  }
</script>

<style scoped lang="less">
  .orderValue-btn{
    background: #EEEEED;
  }
  .coupon-list{
    margin:10px 20px;
    .coupon-item{
      margin-bottom: 10px;
      font-size:15px;
      .coupon-item-left {
        justify-content: space-between;

        h4 {
          font-size: 18px;
        }

        h6 {
          font-size: 15px;
          font-weight: normal;
        }
      }
      .coupon-intro{
        font-size:15px;
        margin-top: 10px;
      }
      .coupon-item-top {
        border-radius:  6px 6px 0 0 ;
        background-color: #fcc900;
        padding:10px 15px;

      }
      .coupon-item-diable-top{
        border-radius:  6px 6px 0 0 ;
        background-color: grey;
        padding:10px 15px;
      }
      .coupon-item-bottom{
        border-radius:  0 0 4px  4px;

        border-top:transparent;
        padding:10px 15px;
        font-size:15px;
        color:#bebebe;
        background-color: #FFF;
      }
      .border_active{
        border:1px solid #FCC900;
      }
      .border_disable{
        border:1px solid #FFF8DB;
      }
      .coupon-item-radio{
        width:20px;
        height:20px;
        border-radius: 50%;
        background-color: #fff;
      }
      /deep/.van-radio__icon--checked .van-icon{
        color: grey;
        background-color: grey;
        border-color: grey;
      }
      /deep/.van-icon-success::before{
        content:''
      }
    }

  }
  /deep/.van-tab{
    font-size:15px;
  }
  /deep/.van-empty{
    padding:20px 0 ;
  }
  .scrollHeight{
    height:50vh;
    background-color: #EEEEED;
  }
</style>
