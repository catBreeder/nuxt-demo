<template>
  <div>
    <scroll-view class="activityScroll" @reachBottom="loadMoreHandle">
      <div class="activity-content" ref="activityRef">
        <div class="activity-banner">
          <img :src="bannerImg" alt="shopshipshake">
        </div>
        <div class="activity-area">
          <van-sticky :container="activityRef" :offset-top="44">
            <van-tabs v-model="tabIndex" @change="tabChangeHandle">
              <van-tab    v-for="(item,index) in tabList"  :index="index" :key="index">
                <template #title>
                  <div v-g-tag-track="{triggerType:'click',
                    event_action:item.title,
                    event_category:item.title,
                    event_label:activityTitle
                }">{{item.title}}</div>
                </template>
              </van-tab>
            </van-tabs>
          </van-sticky>
          <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
          <template v-else>
            <div class="sale-content">
              <div class="favorites-content">
                <common-product-vertical v-for="(item,index) in saleList" :key="index" :item="item" :index="index" :categoryid="categoryid" @goOtherURLEmit="goOtherURLHandle">
                  <div class="d_flex"  slot="price">
                    <strong class="color_orange_red">R{{item.price/100}}</strong>
                    <del class="price-tag" v-if="item.oprice>0">R{{item.oprice}}</del>
                  </div>
                  <div class="d_flex" v-if="item.platformstarlevel>0" slot="rank">
                    <van-icon name="star" color="#fcc900" class="g_mr-s"/>
                    {{item.platformstarlevel/10}}
                  </div>
                </common-product-vertical>

              </div>
              <van-notice-bar background="#eeeeed" text="Guess you like"/>
              <div v-if="likeList.length" class="list_content">
                <van-row gutter="6" >
                  <van-col span="12" v-for="(item,index) in likeList" :key="index">
                    <common-product-detail
                      @shareProductEmit="shareProductHandle"
                      @goDetailEmit="goDetailHandle"
                      :item="item" :index="index"
                      v-exp-dot
                      :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@1^position@${index}^page@${$route.params.type}^query@{"categoryid":${categoryid?categoryid:null }}`'
                    >
                      <i slot="new" class="icon iconfont icon-new" v-if="item.isnewproduct"></i>
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
                <div class="list_bottom" v-show="likeList.length>16">
                  <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
                  <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
                </div>
              </div>


            </div>
          </template>

        </div>

      </div>
    </scroll-view>

  </div>
</template>

<script>
  const likeID = 26796493531570000;

  import {thematicactivitiesHotCategorynamelistApi ,thematicactivitiesHotCategoryListApi,thematicactivitiesCategorylistApi} from '@/api/home'
  import CommonEmpty from '@/components/common/CommonEmpty'
  import ProductListItem from '@/components/content/product_list_item';
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  import ScrollView from "@/components/common/ScrollView";
  import CommonProductVertical from '@/components/common/CommonProductVertical';
  export default {
    name: "SourceModel",
    components:{CommonEmpty,ProductListItem ,ScrollView,CommonProductDetail,CommonProductVertical},
    data(){
      return{
        activityRef:'',
        isLoading:false,
        saleList:[],
        page:1,
        tabList:[],
        tabIndex:0,
        categoryid:0,
        likeList:[],
        bannerImg:'',
        activityTitle:'',
        status:1,
        productversion:0,//版本号
      }
    },
    methods:{
      getBasicInfo(){
        thematicactivitiesCategorylistApi({type:this.$config.themeActivityTypeEn[this.$route.params.type]}).then(res=>{
          this.$emit('activityTitleEmit',res.title)
          this.activityTitle = res.title
          this.bannerImg = res.image;
        })
      },
      goSupplierHandle(){
        window.open('https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/','online')
      },
      loadMoreHandle(){

        if(this.status==this.$config.loadingType.FINISHED) return;
       this.page ++;
        thematicactivitiesHotCategoryListApi({
          pageNum:this.page,
          categoryid:likeID,
          productversion:this.productversion
        }).then(res=>{
          if(!res || res.length==0) {this.status= this.$config.loadingType.FINISHED}

          if(res){
            res= res.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.likeList = [...this.likeList,...res];
          }else{

          }

        })
      },
      tabChangeHandle(){
        this.page =1;
        this.status = this.$config.loadingType.LOADING;
        this.categoryid = this.tabList[this.tabIndex].categoryid;
        this.getProductList()
      },
      //获取like列表
      getLikeList(){
        thematicactivitiesHotCategoryListApi({
          pageNum:this.page,
          categoryid:likeID,
          productversion:this.productversion
        }).then(res=>{
          if(res){
            res = res.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.likeList = res || [];
          }

        })
      },
      //获取分类列表
      getCategoryNameList(){
        thematicactivitiesHotCategorynamelistApi().then(res=>{
          this.productversion = res.productversion;
          this.tabList = res.voList.splice(0,res.voList.length-1);
          this.getLikeList()
          this.getProductList();
        })
      },
      getProductList(){
        this.isLoading = true;
        thematicactivitiesHotCategoryListApi({
          pageNum:this.page,
          categoryid:this.categoryid,
          productversion:this.productversion
        }).then(res=>{
          if(res){
            res = res.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.saleList = res || [];
          }

          this.isLoading = false;
        })
      },
      shareProductHandle(item){
        this.$emit('shareProductEmit',item)    //获取图片信息
      },
      goDetailHandle(item,index){
        this.$emit('likeDetailEmit',{
          item,index
        })
      },
      goOtherURLHandle(item,index){
        this.$emit('goOtherURLEmit',{
          item,index
        })
      },
    },
    mounted() {
      this.getBasicInfo()

      this.getCategoryNameList()

    }
  }
</script>

<style scoped lang="less">
  .list_content{
    /deep/.van-loading{
      margin:0 !important;
    }
  }
  /deep/.van-tab__text--ellipsis{
    -webkit-line-clamp: 2
  }
  /deep/.van-tab{
    max-width:66.67vw;
    font-size:14px;
    min-width: 26vw;
    text-align: center;
  }
  .sale-content{
    /deep/.van-loading{
      margin:10px 0 !important;
    }
  }
  /deep/.van-tabs--line .van-tabs__wrap{
    border-radius: 8px 8px 0 0 ;
  }
  /deep/.van-notice-bar{
    font-size:18px;
    color:#F00;
  }
  /deep/.van-tab{
    font-size:15px;
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
  .favorites-content{
    background-color: #fff;
  }
</style>
