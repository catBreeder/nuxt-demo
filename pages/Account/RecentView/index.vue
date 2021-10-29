<template>
  <div class="favorite-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle" @click-right="changeDelFlagHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="d_flex"><div class="common_title">Recent View</div></div>
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
      <div class="favorites-content" :class="{'margin_b':showDelFlag}" v-else>
        <div v-if="likeList.length">
          <div class="product-item" v-for="(item,index) in likeList" :key="index">
            <div class="check_box" v-if="showDelFlag">
              <van-checkbox v-model="item.isChecked" />
            </div>
            <div class="product-img">
              <img :src="item.images" alt="">
            </div>
            <div class="product-info">
              <div class="product-name" @click="goProductDetailHandle(item)">{{item.nameen}}</div>
              <div class="product-intro">
                <strong class="color_warning"> R{{item.price/100.0}}</strong>
                <div class="d_flex" v-if="item.platformstarlevel>0">
                  <van-icon name="star" size="14" color="#fcc900" class="start_tag"/>
                  {{parseInt(item.platformstarlevel)}}</div>
              </div>
            </div>
          </div>
          <div class="list_bottom" v-show="likeList.length>=5">
            <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
          </div>
        </div>
        <common-empty v-else/>
      </div>
    </scroll-view>
    <!--   定位-->
    <div class="btn_pos_area" v-if="showDelFlag && likeList.length">
      <div class="pos_left">
        <van-checkbox v-model="allChecked" label-disabled>Select all</van-checkbox>
      </div>
      <div class="pos_right"  @click="showDelPopupHandle">
        <van-icon name="delete-o" color="#fff" size="18" class="g_mr-s"/>delete
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
        title:'View - shopshipshake'
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

  .check_box{
    margin-right: 12px;
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
      bottom:0;
      right:0;
      left:0;
      .pos_left{
        padding-left:20px;
        font-size:16px;
      }
      .pos_right{
        display: flex;
        align-items: center;
        background-color: red;
        color:#fff;
        width:40%;
        justify-content: center;
        font-size:18px;
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
    height:calc(100vh - 46px);
    background-color: #eee;
  }
  .editScroll{
    height:calc(100vh - 50px - 40px);
    background-color: #eee;
  }
  .favorites-content{
    background-color: #EEEEED;
    border-radius: 6px;

  }
  .margin_b{
    padding-bottom: 46px;
  }

  .check_box{
    margin-right:4px;
  }
  .product-item{
    display: flex;
    position: relative;
    align-items: center;
    padding:10px 8px;
    background-color: #fff;
    margin:4px;
    border-radius: 4px;
  }
  .product-img{
    width:100PX;
    height:100PX;
    border-radius: 8px;
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

</style>
