<template>
 <div class="after-sale-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>After-Sale Service</template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="scrollCommonHeightView" @reachBottom="loadMoreHandle">
     <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
     <template v-else>
       <div class="after-sale-content"  v-if="orderList.length">
         <div class="after-sale-item g_mb_l" v-for="(item,index) in orderList" :key="index">
           <div class="item-title d_flex d_flex_between">
             <div class="item-title-no">{{item.shoporderno}}</div>
             <div class="item-title-time">
               <span class="color_intro font_size_12">{{item.createtime}}</span>
               <van-icon name="edit" @click="editHandle(item.shoporderid)" v-if="item.status==10"
                         color="#3597FF"
                         size="14" class="g_ml_m">Edit</van-icon>
             </div>
           </div>
           <div class="item-content">
             <van-row >
               <van-col span="4"><div class="item-intro  g_pt_m">Type:</div></van-col>
               <van-col span="20"><div class="item-content">{{item.type}}</div></van-col>
             </van-row>
             <van-row >
               <van-col span="4"><div class="item-intro  g_pt_m">Status:</div></van-col>
               <van-col span="20"><div class="item-content">{{item.statustr}}</div></van-col>
             </van-row>
             <van-row >
               <van-col span="4"><div class="item-intro  g_pt_m">Remark:</div></van-col>
               <van-col span="20"><div class="item-content">{{item.content}}</div></van-col>
             </van-row>
             <div class="item-img g_mb_l g_mt_l" v-if="item.images &&　item.images.length">
               <van-grid  :column-num="3" :gutter="10" square>
                 <van-grid-item style="overflow:hidden"
                   @click="checkImageHandle(item)"
                   v-for="(image,imageIndex) in item.images" :key="`image_${imageIndex}`">
                   <van-image :src="image"  fit="contain"/>
                 </van-grid-item>
               </van-grid>
             </div>
           </div>
         </div>
         <div class="s3_home_end"><i class="icon iconfont icon-end"></i></div>
       </div>
       <van-empty description="No data at present....."  v-else >
         <img src="~assets/images/common/empty.png" alt="" slot="image">
       </van-empty>
     </template>
   </scroll-view>
   <van-image-preview v-model="previewVisible" :images="imgList"  :closeable="true"/>
 </div>
</template>

<script>
import ScrollView from "@/components/common/ScrollView";
import {accountWorkOrderListApi} from '@/api/account'
 export default {
   head(){
     return {
       title:'After Sales - shopshipshake'
     }
   },
   components:{ScrollView},
    data(){
     return{
       page:1,
       orderList:[],
       isLoading:false,
       pageCount:1,
       previewVisible:false,
       imgList:[]
     }
    },
    methods:{
      checkImageHandle(item){
        if(item.images && item.images.length!=0){
          this.previewVisible = true;
          this.imgList = item.images;
        }
      },
      loadMoreHandle(){
        if(this.page > this.pageCount) return;
        this.page++;
        accountWorkOrderListApi(this.page).then(res=>{
          this.orderList = [...this.orderList,...res.datas];
        })
      },
      goBackHandle(){
        this.$router.back()
      },
      editHandle(id){
          this.$router.push(`/shoporder/workorder/${id}`)
      },
      getWorkOrderList(){
        this.isLoading = true;
        accountWorkOrderListApi(this.page).then(res=>{
          this.pageCount = res.pageCount;
          this.orderList = res.datas || [];
          setTimeout(()=>{
            this.isLoading = false;
          },500)
        })
      }
    },

    mounted(){
      this.getWorkOrderList()
    }

 }
</script>

<style scoped lang="less">
  /deep/.van-grid-item__content{
    overflow: hidden;
  }
  .s3_home_end{
    text-align: center;
    color:#ccc;
    margin:20px auto;
  }
  .afterSaleScroll{
    height:calc(100vh - 50px - 48px);
    background-color:#EFEFF4
  }
.after-sale-wrapper{
  .after-sale-content{
    padding:10px 6px;
    .after-sale-item{
      background-color: #fff;
      border-radius: 6px;
      .item-title{
        border-bottom:1px solid #EEEEED;
        padding:10px ;
        .item-title-no{
          font-size:15px;
        }
      }
      .item-content{
        padding:10px ;
        word-break: break-all;
        .item-intro,.intro-content{
          font-size:15px;
        }
      }
    }
  }
}
</style>
