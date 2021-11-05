<template>
  <div>
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>Clearance</template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollHeightNoBar" style="background-color: #fff;"  @reachBottom="loadMoreHandle">
      <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
      <div class="detain-list-content" v-else>
        <van-notice-bar
          :scrollable="false"
          wrapable
          mode="closeable"
          text="Statement: This product is already in SA warehouse. It has been displayed in the warehouse over six month. And we will sell that in an unexpected cheap price. But this products we will not take any refund or return once it has been sold. You will pay extra service fee for the Ambassador."
        />
        <template v-if="detainList.length">
          <common-product-vertical
            btnText="Checked" v-for="(item,index) in detainList" :key="index" :item="item"
            :index="index" @goOtherURLEmit="productOperateHandle">
            <div class="d_flex" slot="price">
              <strong class="color_orange_red">{{item.pricezar/100 | moneyFormat}}</strong>
            </div>
            <div class="d_flex" slot="rank">
              <del class="color_intro font_size_13" v-show="item.originalpricezar>0">{{item.originalpricezar/100 | moneyFormat}}</del>
            </div>
          </common-product-vertical>
          <div class="list_bottom" v-show="detainList.length>8">
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </template>
        <common-empty v-else/>
      </div>
    </scroll-view>
  </div>
</template>

<script>
    import CommonEmpty from '@/components/common/CommonEmpty'
    import ScrollView from "@/components/common/ScrollView";
    import CommonProductVertical from '@/components/common/CommonProductVertical';
    import {homeAbandonOrderListApi} from '@/api/home'
    import {getUserID} from "@/utils/memory";
    export default {
        name: "index",
        components:{ScrollView,CommonProductVertical,CommonEmpty},
        data(){
          return{
            page:1,
            isLoading:false,
            detainList:[],
            pageCount:1,
            status:1
          }
        },
        methods:{
          goBackHandle(){this.$router.back()},
          loadMoreHandle(){
            if(this.status==this.$config.loadingType.FINISHED) return;
            if(this.page >this.pageCount) return;
            this.page ++;
            homeAbandonOrderListApi(this.page).then(res=>{
              if(!res.list || res.list.length==0){this.status=this.$config.loadingType.FINISHED}
              res.list = res.list.map(item=>{
                if(item.images.indexOf(',')){
                  item.images = item.images.split(',')[0]
                }
                return item;
              })
              this.detainList =[...this.detainList,...res.list]
            })
          },
          getDetainListHandle(){
            this.isLoading = true;
            homeAbandonOrderListApi(this.page).then(res=>{
              this.isLoading = false;
              this.pageCount = res.pageCount;
              this.detainList = res.list.map(item=>{
                if(item.images.indexOf(',')){
                  item.images = item.images.split(',')[0];
                }
                return item;
              })
            })
          },
          productOperateHandle(event){
            if(!getUserID()){
              this.$router.replace(`/login?origUrl=${this.$config.jianweiDomain}/shop${this.$route.fullPath}`)
              return;
            }
            this.$router.push(`/clearance/detail/${event.item.id}`)
          },
        },
      mounted() {
        this.getDetainListHandle()
      }
    }
</script>

<style scoped lang="less">
  /deep/.van-notice-bar{
    align-items: baseline;
  }
.detain-list-content{
  padding:15px 8px;
}
.list_bottom{
  padding:15px 0 ;
  /deep/.van-loading{
    margin: 0 !important;
  }
}
</style>
