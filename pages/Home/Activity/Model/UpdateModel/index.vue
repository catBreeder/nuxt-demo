<template>
  <div>
    <scroll-view class="activityScroll" @reachBottom="loadMoreHandle">
      <div class="activity-content" ref="activityRef">
        <div class="activity-banner">
          <img :src="activityBanner" alt="">
        </div>
        <div class="activity-area">
          <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
          <template v-else>
            <div class="update_content" >
                <div v-for="(item,index) in productList" :key="index">
                  <van-divider
                    :style="{ color: 'orange', borderColor: 'orange', padding: '5px 16px' ,background:'#FFF8DC',margin:'4px 0'}"
                  >
                    <van-icon name="like-o" color="#f00" size="16"/> <span class="date-title">{{item.categoryname}}</span>
                  </van-divider>
                  <van-row gutter="6" class="scrollContent" >
                    <van-col span="12" v-for="(item,index) in item.shopproductlist" :key="index">
                      <common-product-detail
                        @shareProductEmit="shareProductHandle"
                        @goDetailEmit="goDetailHandle"
                        :item="item" :index="index"
                        v-exp-dot
                        :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@1^position@${index}^page@${$route.params.type}`'
                      >
                        <div slot="price" class="d_flex d_flex_between">
                          <p class="price-normal">
                            <template v-if="item.price">
                              {{item.price / 100 | moneyFormat}}
                            </template>
                            <template v-else>
                              {{item.finalprice / 100 | moneyFormat}}
                            </template>
                            <del class="discount_price" v-if="item.oprice>0"> R{{item.oprice}}</del>
                          </p>

                        </div>
                      </common-product-detail>
                    </van-col>
                  </van-row>
                </div>
              <div class="list_bottom">
                <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
                <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </scroll-view>
  </div>
</template>

<script>
  import {thematicactivitiesCategorylistApi ,thematicactivitiesNewProductListApi} from '@/api/home'
  import CommonEmpty from '@/components/common/CommonEmpty'
  import ProductListItem from '@/components/content/product_list_item';
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  import ScrollView from "@/components/common/ScrollView";
  export default {
    name: "SourceModel",
    components:{CommonEmpty,ProductListItem ,ScrollView,CommonProductDetail},
    data(){
      return{
        isLoading:false,
        productList:[],
        page:1,
        activityBanner:'',
        categoryList:[],
        status:1,
        activityTitle:''
      }
    },
    methods:{
      loadMoreHandle(){
        if(this.status==this.$config.loadingType.FINISHED) return;
        this.page ++;
        thematicactivitiesNewProductListApi({pageNum:this.page}).then(res=>{
          res.shopproductlist = res.shopproductlist.map(item=>{
            if(item.images.indexOf(',')){
              item.images = item.images.split(',')[0]
            }
            return item;
          })
          if(!res.shopproductlist || res.shopproductlist.length==0) {this.status= this.$config.loadingType.FINISHED}
          if(res.categoryname){
            this.productList = [...this.productList,res];
          }else{
            this.productList = this.productList.map((item,index)=>{
              if(index==this.productList.length-1){
                item.shopproductlist = [...item.shopproductlist,...res.shopproductlist]
              }
              return item;
            })
          }
        })
      },
      getProductList(){
        this.isLoading = true;
        thematicactivitiesNewProductListApi({pageNum:this.page}).then(res=>{
          if(res && res.shopproductlist){
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.productList =[res];
            if(res.shopproductlist && res.shopproductlist.length<16){
              this.loadMoreHandle();
            }
          }

          this.isLoading  = false;
        })
      },
      collectionHandle(item){

      },
      shareProductHandle(item){
        this.$emit('shareProductEmit',item)    //获取图片信息
      },
      goDetailHandle(item,index){
        this.$emit('goOtherURLEmit',{
          item,index
        })
      },
      //获取分类数据
      getCategoryList(){
        thematicactivitiesCategorylistApi({type:this.$config.themeActivityTypeEn[this.$route.params.type]}).then(res=>{
          this.$emit('activityTitleEmit',res.title)
          this.activityTitle = res.title;
          this.activityBanner = res.image;
          this.categoryList = res.list;
          this.getProductList();
        })
      }
    },
    mounted() {
      this.getCategoryList();

    }
  }
</script>

<style scoped lang="less">

  .date-title{
    font-size:18px;
    margin-left:4px;
    color:#f00;
  }
  /deep/.van-notice-bar{
    font-size:18px;
  }
  .activityScroll{
    height:calc(100vh - 46px );
    background-color: #EEEEED;
  }

  .activity-content{
    .activity-banner{
      height:128px;
      background-color: #fcc900;
      padding:6px 10px 50px;
      /*border-radius: 0 0 70px 70px;*/
      img{
        max-height:128px;
        width:100%;
        border-radius: 10px;
      }
    }
    .activity-area{
      margin-top:-30px;
      .update_content{
        /deep/.van-loading{
          margin:10px 0 !important;
        }
      }
      .activity-filter{
        /deep/.van-cell__value{
          display: none;
        }
        /deep/.van-cell__title{
          text-align: center;
        }

      }
    }
  }
  /*.filter-btn{*/
  /*  display: -webkit-box;*/
  /*  display: -webkit-flex;*/
  /*  display: flex;*/
  /*  -webkit-box-flex: 1;*/
  /*  -webkit-flex: 1;*/
  /*  flex: 1;*/
  /*  -webkit-box-align: center;*/
  /*  -webkit-align-items: center;*/
  /*  align-items: center;*/
  /*  -webkit-box-pack: center;*/
  /*  -webkit-justify-content: center;*/
  /*  justify-content: center;*/
  /*  min-width: 0;*/
  /*  background-color: #fff;*/
  /*  border-bottom: 0.5px solid #EEEEED;*/
  /*  border-top:0.5px solid #EEEEED;*/
  /*  cursor: pointer;*/
  /*  .filter-title{*/
  /*    position: relative;*/
  /*    box-sizing: border-box;*/
  /*    max-width: 100%;*/
  /*    font-weight: 500;*/
  /*    padding: 0 6px 0 0;*/
  /*    color: #323233;*/
  /*    font-size: 15px;*/
  /*    line-height: 38px;*/
  /*  }*/
  /*}*/
</style>
