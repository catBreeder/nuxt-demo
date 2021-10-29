<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title><div class="navbar-title">S Coin Transactions</div></template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollHeightNoBar" @reachBottom="loadModeHandle">
        <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
        <template v-else>
          <div class="view-list-content">
            <div class="view-list-item d_flex d_flex_between" v-for="(item,index) in list" :key="index">
              <div>
                <p class="item-title">{{item.typename}}</p>
                <p class="font_size_14">
                  <span v-if="item.type == 10 || item.type == 40">	Order No:</span>
                  <span v-if="item.type == 20 || item.type == 50 || item.type == 80 ">Express No : </span>
                  {{item.orderno}}
                </p>
                <p class="color_intro">{{item.createtime | timeFormat('YMDHMS')}}</p>
              </div>
              <div class="item-money font_size_16" :class="{'item-jian':item.changescoin<0,'item-add':item.changescoin>0}">
                {{item.changescoin}}
              </div>
            </div>

          </div>
          <div class="s3_home_end font_size_15">Only show recently 6 months</div>
        </template>
      </scroll-view>
    </div>
</template>

<script>
    import {accountScoinListApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Scoin - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            isLoading:false,
            page:1,
            pageCount:1,
            list:[]
          }
        },
        methods:{
          loadModeHandle(){
            if(this.page > this.pageCount) return;
            this.page++;
            accountScoinListApi(this.page).then(res=>{
              this.list = [...this.list,...res.list];
            })
          },
          goBackHandle(){this.$router.back()},
          getScoinDetails(){
            this.isLoading = true;
            accountScoinListApi(this.page).then(res=>{
              this.pageCount = res.pageCount;
              this.list = res.list;
              this.isLoading = false;
            })
          }
        },
        mounted() {
          this.getScoinDetails()
        }
    }
</script>

<style scoped lang="less">
.view-list-item{
  padding:10px 15px;
  background-color: #fff;
  border-bottom:1px solid #EEEEED;
  .item-title{
    font-size:16px;
  }
  p{

    margin-bottom: 6px;
  }
  .item-jian{
    color:#65AC06
  }
  .item-add{
    color:#fcc900;
  }

}
.s3_home_end{
  color:#ccccd0;
  text-align: center;
  margin:20px ;
}
</style>
