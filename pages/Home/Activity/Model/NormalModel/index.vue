<template>
  <div>
    <scroll-view class="activityScroll" @reachBottom="loadMoreHandle" >
      <div class="activity-content" ref="activityRef">
        <div class="activity-banner">
          <img :src="activityBanner"  alt="">
        </div>
        <div class="activity-area">
          <van-sticky :container="activityRef" :offset-top="44" class="g_mb_m">
            <van-tabs @change="tabChangeHandle" v-model="tabIndex">
              <van-tab  v-for="(item,index) in categoryList"  :key="item.categoryid" >
                <template #title>
                  <div v-g-tag-track="{triggerType:'click',
                event_action:item.name,
                event_category:item.name,
                event_label:activityTitle
              }"  >{{item.name}}</div>
                </template>

              </van-tab>
            </van-tabs>
            <template v-if="fromType=='via' || fromType=='kilo'">
              <div class="filter-area-box">
                <div class="filter-left">
                  <van-dropdown-menu active-color="#fcc900" >
                    <van-dropdown-item class="category-btn"
                                       v-model="categoryFilter"
                                       @change="categorySelectHandle"
                                       :options="categoryFilterList" >
                      <template #title><div class="g_pt_m g_pb_m">{{categoryName}}</div></template>
                    </van-dropdown-item>
                    <van-dropdown-item v-model="recommendFilter"
                                       class="recommend-btn"
                                       @change="recommendSelectHandle"
                                       :options="recommendOption" />
                  </van-dropdown-menu>
                </div>
                <div class="filter-right"
                     @click="showFilterHandle">
                  <div class="filter-btn" >
                    <div class="filter-title">
                      <i class="icon iconfont icon-xuankeshaixuantubiaoimg g_mr-s" />
                      Filter
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <filter-two-area @recommendSelectEmit="recommendSelectHandle" @showFilterEmit="showFilterHandle"/>
            </template>
          </van-sticky>

          <van-loading type="spinner" color="#fcc900"  size="50px" v-if="isLoading"/>
          <template v-else>
            <div  class="list_content">
              <van-row gutter="6" class="scrollContent" >
                <van-col span="12" v-for="(item,index) in productList" :key="index">
                  <common-product-detail
                    @shareProductEmit="shareProductHandle"
                    @goDetailEmit="goDetailHandle"
                    :item="item" :index="index"
                    :isShowWeight="fromType=='kilo'"
                    v-exp-dot
                    :data-info='`productid@${ item.platformproductid || null }^action@offerlist^totalcount@${ pageCount || null }^position@${index}^page@${$route.params.type}^query@{"categoryid":${categoryID?categoryID:null },"sortby":${ recommendFilter?recommendFilter: null},"minprice":${ minPrice?minPrice: null},"maxprice":${ maxPrice ?maxPrice:null}}`'
                  >
                    <van-tag slot="new"
                             type="warning"
                             size="medium"
                             v-if="item.specialgoods == 2 && fromType=='kilo'">Sea Shipping</van-tag>
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
              <div class="list_bottom" v-show="productList.length>4">
                <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
                <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
              </div>
            </div>
<!--            <common-empty v-else/>-->
          </template>
        </div>
      </div>
    </scroll-view>
    <van-popup v-model="isFilter" position="right"   :style="{ height: '100%',width:'70%' }" >
      <filter-drawer
        @doneEmit="doneHandle"
        />
    </van-popup>
  </div>
</template>

<script>
  const commonList =[{id:0,ename:'All'}]
  import {thematicactivitiesCategorylistApi ,thematicactivitiesCategoryproductApi,thematicactivitiesCategoryDetailListApi} from '@/api/home'
  import CommonEmpty from '@/components/common/CommonEmpty'
  import FilterDrawer from "@/components/content/FilterDrawer";
  import ProductListItem from '@/components/content/product_list_item';
  import ScrollView from "@/components/common/ScrollView";
  import FilterTwoArea from '../../../childComponent/FilterTwoArea'
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  export default {
    name: "SourceModel",
    components:{CommonEmpty,FilterDrawer,ProductListItem ,ScrollView,FilterTwoArea,CommonProductDetail},
    props:{
      fromType:String
    },
    data(){
      return{
        activityRef:'',
        categoryFilter:{id:0, rank:0},
        recommendFilter:5,
        recommendOption:[
          {text:'Recommend',value:5},
          {text:'Price:low to high',value:2},
          {text:'Price:high to low',value:3},
        ],
        isFilter:false,
        isLoading:false,
        minPrice:null,
        maxPrice:null,
        pageCount:0,
        productList:[],
        page:1,
        categoryID:0,
        categoryList:[],
        categoryName:'Categories',
        tabIndex:0,
        activityBanner:'',
        activityTitle:'',
        status:1,
        pageoffset:0,
        categoryFilterList:[],

      }
    },
    methods:{
      categorySelectHandle(value){
        this.categoryFilter = this.categoryFilterList.find(item => item.id == value);
        this.categoryName  =  this.categoryFilter.ename;
        this.update();
      },
      //加载更多
      loadMoreHandle(){
        if(this.status==this.$config.loadingType.FINISHED) return;
        this.page += this.pageoffset;
        this.page++;
        let option={
          type:this.$config.themeActivityTypeEn[this.$route.params.type],
          pageNum:this.page,
          thematiccategoryid:this.categoryID,
          sortby:this.recommendFilter,
          minprice:this.minPrice,
          maxprice:this.maxPrice,
          categoryid:this.categoryFilter.id,
          rank:this.categoryFilter.rank,
          goodreviewsearch:0
        }
        thematicactivitiesCategoryproductApi(option).then(res=>{
          this.pageCount = res.pageCount;
          this.pageoffset = res.pageoffset;
          if(!res.shopproductlist || res.shopproductlist.length==0) {this.status= this.$config.loadingType.FINISHED}
          if(res.shopproductlist && res.shopproductlist.length){
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.productList = [...this.productList,...res.shopproductlist];
          }

        })
      },
      recommendSelectHandle(val){
        this.recommendFilter =val;
        this.update()
      },
      //tab切换
      tabChangeHandle(){
        this.page=1;
        this.status = this.$config.loadingType.LOADING;
        this.productList=[];
        this.categoryFilter={id:0, rank:0}
        this.categoryName = 'All';
        if(this.fromType=='via' || this.fromType =='kilo'){
          //重量和运输方式，要获取分类列表
          this.getCategoryFilterListHandle()
        }
        this.update()
      },
      getProductList(){
        this.isLoading = true;
        let option={
          type:this.$config.themeActivityTypeEn[this.$route.params.type],
          pageNum:this.page,
          thematiccategoryid:this.categoryID,
          sortby:this.recommendFilter,
          minprice:this.minPrice,
          maxprice:this.maxPrice,
          categoryid:this.categoryFilter.id,
          rank:this.categoryFilter.rank,
          goodreviewsearch:0
        }
        thematicactivitiesCategoryproductApi(option).then(res=>{
          if(res && res.shopproductlist){
            res.shopproductlist = res.shopproductlist.map(item=>{
              if(item.images.indexOf(',')){
                item.images = item.images.split(',')[0]
              }
              return item;
            })
            this.productList = res.shopproductlist || [];
            this.pageCount = res.pageCount;
            this.pageoffset= res.pageoffset;
            this.isLoading = false;
          }else{
            this.productList = []
            this.isLoading = false;
          }

        })
      },
      //显示filter
      showFilterHandle(){
        this.isFilter = true;
      },
      doneHandle(value){
        this.isFilter = false;
        this.minPrice = value.minPrice;
        this.maxPrice  = value.maxPrice;
        this.update()
      },
      shareProductHandle(item){
        this.$emit('shareProductEmit',item)    //获取图片信息
      },
      goDetailHandle(item,index){
        this.$emit('goOtherURLEmit',{
          item,index
        })

      },
      //更新数据
      update(){
        this.page =1;
        this.categoryID = this.categoryList[this.tabIndex].id;
        this.getProductList()
      },
      //获取分类数据
      getCategoryList(){
        thematicactivitiesCategorylistApi({type:this.$config.themeActivityTypeEn[this.$route.params.type]}).then(res=>{
          this.$emit('activityTitleEmit',res.title)
          this.activityTitle = res.title;
          this.activityBanner = res.image;
          this.categoryList = res.list;
          this.categoryID = this.categoryList[0]? this.categoryList[0].id:'';
          if(this.fromType=='via' || this.fromType =='kilo'){
            //重量和运输方式，要获取分类列表
            this.getCategoryFilterListHandle()
          }
          this.getProductList();

        })
      },
      //获取筛选数据
      getCategoryFilterListHandle(){
        thematicactivitiesCategoryDetailListApi({
          type:this.$config.themeActivityTypeEn[this.$route.params.type],
          thematiccategoryid:this.categoryList && this.categoryList[this.tabIndex]?this.categoryList[this.tabIndex].id:0
        }).then(res=>{
          if(res &&　res.list){
            res.list=[...commonList,...res.list];
            res.list = res.list.map(item=>{
              item.text = item.ename;
              item.value = item.id;
              item.rank = item.rank;
              return item;
            })
            this.categoryFilterList = res.list || [] ;
          }else{
            this.categoryFilterList =[]
          }

        })
      },
    },
    mounted() {
      this.getCategoryList();

    }
  }
</script>

<style scoped lang="less">

  .filter-area-box{

    display: flex;
    align-items: center;
    /deep/.van-dropdown-menu__bar{
      height:44PX;
    }
    /deep/.van-dropdown-item__option{
      height:46PX;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      overflow:hidden;
      font-size: 14px;
      padding:0 5px;
      border-bottom: 1px solid lightgrey;
    }
    .icon-xuankeshaixuantubiaoimg{
      font-size:16px;
    }
    /deep/.van-dropdown-menu__title{
      font-size:14px;
      padding: 0 6px 0 0;
      max-width: 85%;
    }
    /deep/.van-dropdown-menu__title::after{
      border-color: transparent transparent #222 #222;
    }
    /deep/.van-dropdown-menu__item{
      border-right:0.5px solid #EEEEED;
      max-width: 150px;
      border-bottom:0.5px solid #eeeeed;
    }
    /deep/.van-cell__value{
      display: none;
    }
    .filter-left{
      /*border-top:1px solid #EEEEED;*/
      flex:2;
      .category-btn{
        /deep/.van-popup--top{
          width:40%;
        }
      }
      .recommend-btn{
        /deep/.van-popup--top{
          width:35%;
          left:33%;
        }
      }
    }
    .filter-right{
      flex:1;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      height: 46PX;
      width:44PX;
      background-color: #fff;
      box-shadow: 0 2px 12px rgba(100,101,102,0.1);
      .filter-btn{
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        min-width: 0;
        border-bottom: 0.5px solid #EEEEED;
        cursor: pointer;
        .filter-title{
          position: relative;
          box-sizing: border-box;
          max-width: 100%;
          font-weight: 500;
          padding: 0 6px 0 0;
          color: #323233;
          font-size: 14px;
          line-height: 48px;
        }
      }
    }
  }

.list-empty{
  padding:15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
  .list_content{
    /deep/.van-loading{
      margin:10px 0 !important;
    }
  }
  /deep/.van-tab__text--ellipsis{
    -webkit-line-clamp: 2
  }
  /deep/.van-tab{
    max-width:66.67vw;
    min-width: 26vw;
    font-size:14px;
    text-align: center;
  }



  .activityScroll{
    height:calc(100vh - 46PX );
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
    }
  }

</style>
