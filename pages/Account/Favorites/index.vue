<template>
 <div class="favorite-wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle" @click-right="changeDelFlagHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="d_flex"><van-icon name="like-o" color="#f00" size="18" class="g_mr_m"/> Favorites</div>
       </template>
       <template #right>
         <div v-if="likeList.length>=1">
           <div v-if="showDelFlag">Finish</div>
           <van-tag plain class="edit_tag" v-else>Batch Delete</van-tag>
         </div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view  class="favoriteScroll"  @reachBottom="loadMoreHandle">
     <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
     <div class="favorites-content" v-else>
        <div v-if="likeList.length">
          <van-row gutter="6">
            <van-col span="12" v-for="(item,index) in likeList" :key="index">
              <div class="goods_item" >
                <div class="goods_img loading_bg_120 " >
                  <img class="J_dynamic_img fill_img" :src="item.images" alt="" @click="goProductDetailHandle(item)">
                </div>
                <div class="goods_info">
                  <div class="name_box" @click="goProductDetailHandle(item)">
                    <div class="name_tags">
                      <div class="goods_name twoline" >{{item.nameen}}</div>
                    </div>
                  </div>
                  <div class="bot_box d_flex_between d_flex">
                    <strong class="price-normal color_warning">R{{item.price/100.0}}</strong>
                    <div class="d_flex" v-if="item.platformstarlevel>0">
                      <van-icon name="star" size="14" color="#fcc900" class="start_tag"/>
                      {{item.platformstarlevel/10}}</div>
                  </div>
                </div>
                <div class="goods_mask" v-if="showDelFlag"></div>
<!--                -->
                <div class="check_box" v-if="showDelFlag">
                  <van-checkbox v-model="item.isChecked" shape="square" icon-size="16"/>
                </div>
              </div>
            </van-col>
          </van-row>
          <div class="list_bottom" v-show="likeList.length>=5">
            <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
          </div>
        </div>
       <common-empty v-else/>
     </div>
   </scroll-view>
<!--   定位-->
   <div class="btn_pos_area" v-if="showDelFlag">
      <div class="pos_left">
        <van-checkbox v-model="allChecked" label-disabled>Select all</van-checkbox>
      </div>
      <div class="pos_right"  @click="showDelPopupHandle">
        <van-icon name="delete-o" color="#f00" size="17"/>delete
      </div>
   </div>
   <van-dialog v-model="isVisible" :showConfirmButton="false">
     <common-dialog type="info"
                    title="Warning"
                    cancelText="Cancel"
                    confirmText="Confirm"
                    :hasTwoBtn="true"
                    @confirmEmit="confirmDelHandle"
                    @cancelEmit="isVisible = false"
                    :intro="`Are you sure to delete the selected ${chooseLength} record${chooseLength>1?'s':''}?`"/>
   </van-dialog>
 </div>
</template>
<script>

import ScrollView from "@/components/common/ScrollView";
import {selectCollectionApi,deleteCollectionApi} from '@/api/account';
import CommonEmpty from '@/components/common/CommonEmpty'
import CommonDialog from '@/components/common/CommonDialog'
 export default {
   head(){
     return {
       title:'Favorites - shopshipshake'
     }
   },
    computed:{
      allChecked:{
        set(value){
          this.likeList = this.likeList.map(item=>{
            item.isChecked = value;
            return item;
          })
        },
        get(){
          let value = this.likeList.filter(item=>item.isChecked);
          return value.length == this.likeList.length ;
        }
      },
      chooseLength(){
        let value = this.likeList.filter(item=>item.isChecked);
        return value.length
      }
    },
   data(){
      return{
        page:1,
        pageCount:1,
        isLoading:false,
        likeList:[],
        isDelete:false,
        result:[],
        showDelFlag:false,
        status:1,
        isVisible:false
      }
   },
   components:{ScrollView,CommonEmpty,CommonDialog},
    methods:{
      goProductDetailHandle(item){
        window.open(`${this.$config.jianweiDomain}/search?productid=${item.platformproductid}`,'online')
      },
      confirmDelHandle(){
        let value =this.likeList.filter(item=>item.isChecked).map(item=>item.platformproductid);
        deleteCollectionApi(value.join(',')).then(res=>{
          this.isVisible = false;
          this.page =1;
          this.getLikeList();
        })
      },
      showDelPopupHandle(){
        if(this.chooseLength ==0){
          return this.$toast({message:'Please check at least one goods'})
        }
        this.isVisible = true;
      },
        loadMoreHandle(){
          if(this.status==this.$config.loadingType.FINISHED) return;
          let value =[]
          if(this.page <= this.pageCount){
            this.page++;
            selectCollectionApi(this.page).then(res=>{
              if(res.status==0){
                if(!res.data.shopproductlist || res.data.shopproductlist.length==0){this.status= this.$config.loadingType.FINISHED}
                value = res.data.shopproductlist.map(item=>{
                  if(item.images.indexOf(',')){
                    item.images = item.images.split(',')[0]
                  }
                  item.isChecked = false;
                  return item;
                })
                this.likeList = [...this.likeList,...value];
              }
            })
          }
        },
        goBackHandle(){
          this.$router.go(-1)
        },
        changeDelFlagHandle(){
          this.showDelFlag = !this.showDelFlag;
        },
          getLikeList(){
          this.isLoading = true;
            selectCollectionApi(this.page).then(res=>{
              if(res.status==0){
                this.isLoading = false;
                this.pageCount = res.data.pageCount;
                this.likeList = res.data.shopproductlist.map(item=>{
                  if(item.images.indexOf(',')){
                    item.images = item.images.split(',')[0]
                  }
                  item.isChecked = false;
                  return item;
                })
              }
            })
          }
    },

    mounted(){
        this.getLikeList()
    }

 }
</script>

<style scoped lang="less">
  /deep/.van-checkbox__icon .van-icon{
    border:1px solid grey
  }
  .goods_item{
    overflow: hidden;
    display: block;
    margin-bottom: 8px;
    background: #fff;
    position: relative;
  }
  .goods_mask{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: #fff;
    opacity: 0.7;
  }
  .check_box{
    position: absolute;
    top:4px;
    left:4px;
    z-index:10;
  }
  .goods_item .goods_img{
    position:relative;
    width:100%;
    height:176px;
    overflow:hidden;
  }
  .goods_item .goods_img .tag-img{
    position: absolute;
    width:40px;
    height:40px;
    border-radius: 0  0 8px 0;
  }
  .goods_item .goods_img .tag_new{
    position:absolute;
    right:0;
    top:0;
    font-size:15px;
    color:red;
    z-index:1;
  }
  .goods_item .goods_name{
    width: 100%;
    max-height: 40px;
    line-height:1.5;
    font-size: 14px;
    color: #333;
    overflow: hidden;
  }
  .goods_item .goods_info{
    padding:10px 8px;
  }
  .goods_item .goods_info .name_box{
    height:40px;
  }
  .goods_item .goods_info .name_box .name_tags{
    height:40px;
    width: 100%;
    overflow: hidden;
  }
  .loading_bg_120{
    background: #e5e5e5!important
  }
  .goods_img .J_dynamic_img{
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 100%;
    transform: translateX(-50%);
  }
  .start_tag{
    margin-right: 3px;
  }
  .bot_box{
    height:30px;
    padding:2px 0;
  }
  .list_bottom{
    padding-top: 5px;
    /deep/.van-loading{
      margin:10px 0 0;
    }
  }
  .favorite-wrapper{
    position: relative;
    .btn_pos_area{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:46px;
      line-height:46px;
      background-color: #fff;
      position:absolute;
      padding:0 10px;
      bottom:0;
      right:0;
      left:0;
      .pos_right{
        display: flex;
        align-items: center;
        color:#f00;
      }
    }
  }

  .edit_tag{
    font-size:13px;
    color:grey;
    padding:4px;
    border-radius: 4px;
  }
  /deep/.van-nav-bar{
    background:#eee;
  }
  .favoriteScroll{
    height:calc(100vh - 46PX);
    background-color: #eee;
  }
  .editScroll{
    height:calc(100vh - 50px - 40px);
    background-color: #eee;
  }
.favorites-content{
  background-color: #EEEEED;
  border-radius: 6px;
  padding-bottom: 46px;
}
.margin_b{
  padding-bottom: 46px;
}
  /*
  .check_box{
    margin-right:4px;
  }
  .product-item{
    display: flex;
    align-items: center;
    padding:10px 8px;
    background-color: #fff;
    margin:4px;
    border-radius: 4px;
  }
  .product-img{
    width:100PX;
    height:100PX;
    border-radius: 10px;
    img{
      width:100%;
      height:auto;
      border-radius: 10px;
    }
  }
  .product-info{
    margin-top:10px;
    padding-left:10px;
    flex:1;
    .product-name{
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 100%;
      max-height: 40px;
      line-height:1.4;
      font-size: 14px;
      color: #333;
      overflow: hidden;
    }
    .product-intro{
      margin-top: 15px;
      padding:0 8px 0 0;
      font-size:15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      strong{
        color:#f00;
      }

    }
  }

  */
</style>
