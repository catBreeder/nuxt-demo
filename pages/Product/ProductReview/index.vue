<template>
    <div class="review-wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Review</template>
        </van-nav-bar>
        <van-tabs  v-model="tabIndex" @click="tabbarChangeHandle">
          <van-tab v-for="(item,index) in reviewTabList" :title="item.name" :key="index"/>
        </van-tabs>
      </van-sticky>
    <mescroll-vue ref="mescrollRef" :down="mescrollDownOption" :up="mescrollUpOption" @init="mescrollInitHandle">
      <product-review-item v-for="(item,index) in dataList" :key="index" :item="item" :index="index"/>
      <div id="emptyID"></div>
    </mescroll-vue>

    </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import ScrollView from "@/components/common/ScrollView";
  import {productReviewApi} from '@/api/product'
  import emptyImg from '@/assets/images/common/empty.png'
  import ProductReviewItem from '../childComponent/ProductReviewItem'
    export default {
      head(){
        return {
          title:'Product Review - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView,MescrollVue,ProductReviewItem},
        data(){
          return{
            emptyImg,
            mescroll:null,//muscroll实例对象
            mescrollDownOption:{
              textOutOffset:'Release updates....',
              textLoading:'in loading.....',
              htmlLoading:'<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">in loading..</p>',
              callback: this.mescrollDownHandle
            },//下拉刷新的配置
            mescrollUpOption: { // 上拉加载的配置.
              textLoading:'in loading.....',
              callback: this.mescrollUpHandle, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
              //以下是一些常用的配置,当然不写也可以的.
              page: {
                num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                size: 10 //每页数据条数,默认10
              },
              htmlNodata: '<p class="icon iconfont icon-end" style="color:#FCC900;"></p>',
              noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
              // toTop: {
              //   //回到顶部按钮
              //   src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
              //   offset: 1000 //列表滚动1000px才显示回到顶部按钮
              // },
              empty: {
                //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                warpId: "emptyID", //父布局的id (1.3.5版本支持传入dom元素)
                icon: emptyImg, //图标,默认null,支持网络图
                tip: "No data at present....." //提示
              }
            },
            dataList: [], // 列表数据
            reviewTabList:[
              {name:'All',id:0},
              {name:'Good',id:1},
              {name:'Normal',id:2},
              {name:'Bad',id:3},
              {name:'Photo',id:4},
            ],
            tabIndex:0,
            page:1,
            isLoading:false,
            pageCount:0
          }
        },
        beforeRouteEnter(to,from,next){
          /*如果没有配置顶部按钮或者isBounce，则可以不写*/
          next(vm=>{
            vm.$refs.mescrollRef && vm.$refs.mescrollRef.beforeRouteEnter()
          })
        },
        beforeRouteLeave(to,from,next){
          // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
          this.$refs.mescrollRef && this.$refs.mescrollRef.beforeRouteLeave();
          next()
        },
        methods:{
          /*mescroll组件初始化回调，可以获取到mescroll对象*/
          mescrollInitHandle(mescroll){
            this.mescroll = mescroll;//如果this.mescroll对象没有用到，则不用配置
          },
          //上拉回调，page ={num:1,size:15} num:当前页，size,每页的数据
          mescrollUpHandle(page,mescroll){
            productReviewApi({
              filter:this.tabIndex,
              page:page.num,
              productid:this.$route.params.productID
            }).then(res=>{
              const {pageinfo} = res;
              this.pageCount = pageinfo.pageCount;
              let datas = pageinfo.list || [];
              datas = datas.map(item=>{
                if(item.images){
                  item.images = item.images.split(',')
                }
                return item;
              })
              if(page.num==1){
                this.dataList =[]
              }
              this.dataList = this.dataList.concat(datas);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(datas.length)
              })

            }).catch(e=>{
              mescroll.endErr();
            })
          },
          mescrollDownHandle(mescroll){
            this.refreshHandle(mescroll)

          },
          refreshHandle(mescroll){
            this.mescroll.resetUpScroll();
          },
          tabbarChangeHandle(){
            this.page =1;
            this.mescrollDownHandle()

          },
          goBackHandle(){this.$router.back()},
          getReviewList(){
            this.isLoading = true;
            productReviewApi({
              filter:this.tabIndex,
              page:this.page,
              productid:this.$route.params.productID
            }).then(res=>{
              const {pageinfo} = res;
              this.pageCount = pageinfo.pageCount;

            })
          },
          loadMoreHandle(){

          },
        },
      mounted() {

        // this.getReviewList()
      },
      created() {
          this.tabIndex = this.$route.query.type;
      }

    }
</script>

<style scoped lang="less">
.review-wrapper{
  .mescroll{
    position: fixed;
    top: 90px;
    /*background-color: lightpink;*/
    bottom: 0;
    height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
  }
  .icon-end{
    color:#FCC900;
  }
}

</style>
