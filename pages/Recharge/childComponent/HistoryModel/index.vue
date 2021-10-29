<template>
  <div class="history-wrapper">
    <scroll-view class="scrollViewHeight"
                  @reachBottom="scrollToEndHandle">
      <template v-if="isLoading">
        <van-loading type="spinner" color="#fcc900" class="loading_custome" size="50px"/>
      </template>
      <template v-else>
        <template v-if="rechargeList.length">
          <div class="recharge-item" v-for="(item,index) in rechargeList" :key="index">
           <div class="recharge-item-top">
             <div class="recharge-item-left">
               <div class="item-price">R {{Number(item.amount/100).toFixed(2)}}</div>
               <div class="item-time">{{item.createtime}}</div>

             </div>
             <div class="recharge-item-right">
               <div :class="{
              'color_active':Number(item.status) === $config.rechargeCheckOutStatus.UNAPPROVED,
              'color_warning': Number(item.status) === $config.rechargeCheckOutStatus.GIVEUP,
              'color_blue':Number(item.status) === $config.rechargeCheckOutStatus.UNDERREVIEW
            }" >{{item.statusstr}}</div>
             </div>
           </div>
            <div class="item-intro" v-if="item.status == $config.rechargeCheckOutStatus.UNAPPROVED">System does not have this recharge record</div>
          </div>
          <div class="list-empty">
            <div class="icon iconfont icon-end color_intro"></div>
          </div>
        </template>
        <van-empty description="No data at present....." v-else />
      </template>
    </scroll-view>
  </div>
</template>

<script>
import { paymenToucherListApi } from '@/api/recharge'
import ScrollView from "@/components/common/ScrollView";
export default {
  name: "index",
  components:{ScrollView },
  data(){
    return{
      rechargeList:[],
      page:1,
      isLoading:false
    }
  },
  methods:{
    scrollToEndHandle(){
      this.page++;
      paymenToucherListApi(this.page).then(res=>{
        setTimeout(()=>{
          this.isLoading = false;
          this.rechargeList = [...this.rechargeList,...res.datas];
        },800)
      })
    },
    getHistoryList(){
      this.isLoading = true;
      paymenToucherListApi(this.page).then(res=>{
        setTimeout(()=>{
          this.isLoading = false;
          this.rechargeList = res.datas || [];
        },800)
      })
    }
  },
  mounted() {
    this.getHistoryList()
  }
}
</script>

<style scoped lang="less">


.history-wrapper{
  //padding:10px 0;
  .recharge-item{
    background-color: #fff;
    padding:10px;
    border-top:10px solid #EEEEED;
    .item-intro{
      color:coral;
    }
    .recharge-item-top{
      position: relative;

      display: flex;
      justify-content: space-between;
      .recharge-item-left{
        flex:1;
        .item-price{
          font-weight: bold;
          font-size:17px;
        }
        .item-time{
          color:gray;
          font-size:14px;
          margin:10px 0 6px;
        }

      }

      .recharge-item-right{
        font-size:15px;
        min-width: 100px;
        font-weight: 500;
        text-align: right;
      }
    }
  }
  .list-empty{
    background: #EEEEED;
    text-align: center;
    margin:20px 0;
  }
}
.scrollViewHeight{
  overflow:hidden;
  overflow-y: scroll;
  height:calc(100vh - 100px - 40px);
  background-color: #EEEEED;

}
.loading_custome{
  position: fixed;
  top:30%;
  left:45%;
  transform: translate(-30%,-45%);
}
</style>
