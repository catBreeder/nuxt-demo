<template>
  <div class="exchange-wrapper">
    <van-sticky>
      <van-nav-bar border>
        <template #title>
          <strong>Change Commodity</strong>
        </template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollViewHeight">
      <div class="price-change-box" v-if="priceList.length">
        <div class="change-title">
          <div class="title-name">Price changed</div>
          <div class="title-intro">Price changeed compared to adding to cart</div>
        </div>
        <div class="exchange-list">
          <div class="exchange-list-title" v-for="(item,index) in priceList" :key="index">
            <div  @click="choosePriceItemHandle(item)">
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
      <div class="price-change-box" v-if="outList.length">
        <div class="change-title">
          <div class="title-name">Sold out</div>
          <div class="title-intro">The following goods are Sold out,<strong class="color_warning">do NOT buy it !</strong></div>
        </div>
        <div class="exchange-list">
          <div class="exchange-list-title">
            <van-card v-for="(item,index) in outList" :key="index"
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
      <div class="price-change-box" v-if="blackList.length">
        <div class="change-title">
          <div class="title-name">Poor quality</div>
          <div class="title-intro">The following goods are Poor quality,<strong class="color_warning">do NOT buy it !</strong></div>
        </div>
        <div class="exchange-list">
          <div class="exchange-list-title">
            <van-card v-for="(item,index) in blackList" :key="index"
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
      <div class="price-change-box" v-if="proList.length">
        <div class="change-title">
          <div class="title-name">May have quality problem</div>
          <div class="title-intro"> The following goods may be
            problematic, tick it if you still to buy.</div>
        </div>
        <div class="exchange-list">
          <div class="exchange-list-title" v-for="(item,index) in proList" :key="index">
            <div  @click="chooseProItemHandle(item)">
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
    </scroll-view>
    <div class="bottom-area">
      <van-checkbox v-model="allChoose" @change="buyAllHandle" v-if="proList.length || priceList.length">Buy All</van-checkbox>
      <div class="color_intro"
           @click="backToHandle"> Back to Cart</div>
      <van-button :disabled="payflg===0" class="continue-btn"
           @click="continueHandle"
      >Continue <span v-if="proList.length || priceList.length">({{selectID.length}})</span></van-button>
    </div>
    <!--    确认弹出框-->
    <van-overlay :show="isWait" z-index="9999" >
      <div class="loading-wrapper">
        <van-loading color="#fcc900" type="spinner" size="45" vertical class="loading_btn">wait a moment......</van-loading>
      </div>
    </van-overlay>
  </div>


</template>

<script>
import ScrollView from "@/components/common/ScrollView";
import GoodItem from "../childComponent/GoodItem";


import { cartCheckoutApi} from '@/api/cart'
export default {
  head(){
    return {
      title:'Check out - shopshipshake'
    }
  },
  name: "index",
  components:{ScrollView , GoodItem},
  data(){
    return{
      priceList:[],
      outList:[],
      blackList:[],
      proList:[],
      errorList:[],
      allChoose:false,//全选
      selectID:[],
      payids:[],
      outids:[],
      blackids:[],
      qids:[],
      payflg:0,//0表示所有的都不能支付，1，有可支付的订单
      isWait:false
    }
  },
  beforeDestroy() {
    this.$store.commit('removeCheckoutErrorInfo')
  },
  methods:{
    //选择其中一个
    choosePriceItemHandle(event){
     this.priceList= this.priceList.map(item=>{
       if(item.id ===event.id ){
         item.isChecked = !item.isChecked;
       }
       return item;
     })
      if(this.selectID.includes(event.id)){
        this.selectID = this.selectID.filter(order=>order !== event.id);
      }else{
        this.selectID =[...this.selectID,event.id]
      }

    },
    //选择prolist其中一个
    chooseProItemHandle(event){
      this.priceList= this.priceList.map(item=>{
        if(item.id ===event.id ){
          item.isChecked = !item.isChecked;
        }
        return item;
      })
      if(this.selectID.includes(event.id)){
        this.selectID = this.selectID.filter(order=>order !== event.id);
      }else{
        this.selectID =[...this.selectID,event.id]
      }
    },
    //全选
    buyAllHandle(){
      if(this.priceList.length){
         this.priceList=this.priceList.map(item=>{
           item.isChecked = this.allChoose;
           return item;
         })
        if(this.allChoose){
          let value = this.priceList.map(item=>item.id);
          this.selectID =[...this.selectID,...value] ;
        }else{
          this.selectID =[]
        }

      }
      if(this.proList.length){
        this.proList=this.proList.map(item=>{
          item.isChecked = this.allChoose;
          return item;
        })
        if(this.allChoose){
          let proId = this.proList.map(item=>item.id)
          this.selectID =[...this.selectID,...proId] ;
        }else{
          this.selectID =[]
        }
      }

    },
    continueHandle(){
      this.isWait = true;
      let value = [...this.selectID,...this.payids];
      cartCheckoutApi({
        ids:value?value.join(','):'',
        qids:this.qids.join(','),
        blackids:this.blackids.join(','),
        outids:this.outids.join(','),
        go:1
      })
      .then(res=>{
        if(res.torisk===0){
          this.isWait = false;
          // this.$router.push('/shoporder/paysuccess')
          //保存返回信息，到checkout页面
          this.$store.commit('setCheckoutInfo',res)
          this.$router.push('/shoporder/checkpaynew')
        }else{
          this.isWait = false;
        }
      }).catch(err=>{
        this.isWait = false;
      })

    },
    backToHandle(){

       this.$router.replace('/shoporder/cart')

    },
    goBackHandle(){
      this.$router.back()
    },
  },
  mounted() {
    const { blackids,payids,qids,blacklist,outlist,prolist,pricelist,outids,payflg} =this.$store.state.checkoutErrorInfo;
    this.priceList = pricelist.length? pricelist.map(item=>{item.isChecked = false;return item}):[];
    this.outList = outlist || [];
    this.blackList =blacklist || [];
    this.proList =prolist.length?prolist.map(item=>{item.isChecked = false;return item}):[];
    this.payids = payids?payids.split(','):[];
    this.outids =outids?outids.split(','):[];
    this.blackids = blackids?blackids.split(','):[];
    this.qids = qids?qids.split(','):[];
    this.payflg =payflg;
  },
}
</script>

<style scoped lang="less">
  .product-desc{
    background-color: #eee;
    padding:4px 6px;
    border-radius: 4px;
    font-size:13px;
    margin:4px 0 8px;
    font-weight: 400;
    word-wrap: break-word;
    word-break: normal;
    max-height: 28px;
    overflow-y: scroll;
    color:#8F8E94FF
  }
  .product-price{
    font-size:15px;
    .discount-price{
      color:gray;
      font-weight: 400;
      text-decoration:line-through;
      font-size:13px;
    }
  }
.exchange-wrapper{
  padding-bottom: 60px;
  position: relative;
  .bottom-area{
    display: flex;
    justify-content: space-between;
   align-items: center;
    position: fixed;
    bottom:50px;
    left:0;
    right:0;
    height:50px;
    padding:0 10px;
    box-shadow: 10px 0 10px #eeeeed;
    background-color: #fff;
    .continue-btn{
      font-size:16px;
      background-color: #fcc900;
      padding:0 20px;
      border-radius: 4px;
    }
  }
}
.scrollViewHeight{
  height:calc(100vh - 50PX - 90PX);
  background-color: #EEEEED;
}
.price-change-box{
    border-bottom:12px solid #EEEEED;
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
</style>
