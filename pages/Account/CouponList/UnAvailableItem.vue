<template>
  <div class="coupon-list-item" >
    <van-row v-if="item">
      <van-col :span="7">
        <div class="item-money item-money-invalid">R <span>{{item.money}}</span></div>
        <div class="item-use">
          <p>{{item.typename}}</p>
          <p>{{item.usetype}}</p>
        </div>
      </van-col>
      <van-col :span="16" class="text_align_r">
        <div class="item-time">{{item.dateinfo}}</div>
        <div class="d_flex d_flex_around g_pl_l">
          <div class="status-name" v-if="item.useflg==1">{{item.statusname}}</div>
          <van-tag @click="checkDetailHandle" color="#fcc900" size="large" >Details</van-tag>
        </div>
      </van-col>
    </van-row>
    <van-dialog v-model="isVisible"
                show-cancel-button
                theme="'round-button"
                class="order-content"
                cancelButtonText="close"
                @cancel="hideDialogHandle"
                width="92%" title="Order no"  :show-confirm-button="false">
      <scroll-view class="scrollHeightOrder">
        <van-cell :title="item.no" is-link
                  @click="checkOrderHandle(item)"
                  v-for="(item,index) in orderList" :key="index"/>
      </scroll-view>
    </van-dialog>
  </div>
</template>

<script>
  import {accountCouponUseDetailApi} from '@/api/account';
  import ScrollView from "@/components/common/ScrollView";
  export default {
    name: "un-available-item",
    components:{ScrollView},
    props:{
      item:{type:Object,default:()=>{}},
      index:String | Number
    },
    data(){
      return{
        isVisible:false,
        orderList:[]
      }
    },
    methods:{
      checkOrderHandle(item){
        let routeData={};
        if(item.type == "shoporder") {
          routeData = this.$router.resolve({
            path: `/shoporder/2/detail/${item.id}`,
          });
          // this.$router.push(`/shoporder/2/detail/${item.id}`)
        } else {
          routeData = this.$router.resolve({
            path:`/deliveryorder/detail/${item.id}`,
          });
          // this.$router.push(`/deliveryorder/detail/${item.id}`)
        }
        window.open(routeData.href, 'online',);
      },
      hideDialogHandle(){
        this.isVisible = false;
      },
      checkDetailHandle(){
        accountCouponUseDetailApi(this.item.id).then(res=>{
          this.orderList= res;
          this.isVisible = true;

        })
      }
    },
  }
</script>

<style scoped lang="less">
  .scrollHeightOrder{
    min-height:20vh;
    max-height:60vh;
    width:98%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  /deep/.van-dialog__header{
    font-size:18px;
    color:#2A2A2A;
    padding:15px 0;
    border-bottom:1px solid #EEEEED;
  }
  /deep/.van-dialog__content{
    padding:8px 0;

  }
  .order-content{


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
  .order-dialog-bottom{
    padding:10px;
    text-align: center;
    /deep/.van-button{
      color:#000;
      font-size:15px;
    }
  }
  .coupon-list-item{
    border-radius: 8px;
    position: relative;
    font-size:15px;
    background-color: #fff;
    padding:20px 15px;
    color:#999;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px 0 rgb(190,190,190,0.1);
    .status-name{
      font-style: italic;
      font-size:18px;
    }
    .item-top{
      margin-bottom: 10px;
    }
    .item-money-invalid{
      color:#999
    }
    .item-money{
      text-align: center;
      margin-bottom: 8px;
      span{
        font-weight: bold;
        font-size:28px;
      }
    }
    .item-use{
      font-size:15px;
      p{
        text-align: center;
        margin-bottom: 5px;
      }
    }
    .item-time{
      padding:10px 0 15px;
    }
  }
</style>
