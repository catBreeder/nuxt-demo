<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Rewards history</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView" @reachBottom="loadMoreHandle">
        <div class="award-list-content">
          <div class="award-list-item" v-for="(item,index) in awardList" :key="index">
            <van-row>
              <van-col :span="16">
                <div class="item-title">{{item.display}}</div>
                <div class="item-type">{{item.typename}}</div>
                <div class="item-time">{{item.createtime}}</div>
              </van-col>
              <van-col :span="8">
                <van-tag size="medium" round :color="item.dflg==1?'#ecbd07':'#f5f5f5'">
                  {{item.zf }} {{item.money/100 | moneyFormat}}
                </van-tag>
              </van-col>
            </van-row>
          </div>
        </div>
        <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" ></div>
      </scroll-view>
    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    import {accountCustomerAwardListApi} from '@/api/account'
    export default {
        name: "index",
        components:{ScrollView},
        data(){
          return{
            page:1,
            awardList:[],
            pageCount:0,
          }
        },
        methods:{
          goBackHandle(){this.$router.back()},
          getAwardList(){
            accountCustomerAwardListApi(this.page).then(res=>{
              if(res){
                let {resultMap} = res;
                this.awardList=resultMap.list || [];
                this.pageCount = resultMap.pageCount;
              }

            })
          },
          loadMoreHandle(){
            if(this.page > this.pageCount) return
            this.page ++;
            accountCustomerAwardListApi(this.page).then(res=>{
              if(res){
                let {resultMap} = res;
                this.addressList =[...this.awardList,...resultMap.list]
              }

            })
          }
        },
      mounted() {
          this.getAwardList()
      }
    }
</script>

<style scoped lang="less">
.scrollCommonHeightView{
  background-color: #eee;
}
  .award-list-content{
    margin:15px 10px;
    border-radius: 4px;
    padding:8px;
    background-color: #fff;
    .award-list-item{
      border-radius: 6px ;
      border:1px solid #EEEEED;
      margin-bottom: 12px;
      padding:8px 10px;
      .item-title{
        font-size:16px;
        font-weight: normal;
      }
      .item-type{
        margin:8px 0;
      }
      .item-time{
        font-size:13px;
        color:grey;
      }
    }
  }
</style>
