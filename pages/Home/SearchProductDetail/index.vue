<template>
  <div class="s3-home-search-product-info-wrapper">
    <van-sticky>
      <van-nav-bar  @click-right="goMessageHandle" @click-left="goBack">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#8B8989"/>
        </template>
        <template #title>
          <div class="home-navbar-input">
            <input type="text" class="navbar-input-area card-demo" readonly
                   placeholder="paste keyword or 1688 link" @click="goSearchHandle" >
          </div>
        </template>
        <template #right>
          <van-badge   :content="unReadCount || ''" max="99">
            <i class="icon iconfont icon-xiaoxi"/>
          </van-badge>

        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="s3-home-search-product-info-content">
      <scroll-view class="scrollHeight" @reachBottom="loadMoreHandle">
        <div class="s3-home-search-product-info-top-left">
          <img :src="imgSrc" />
          <div class="select-tag" @click="showCropperHandle"><i class="icon iconfont icon-jietu">
          </i>Select Image Region</div>
        </div>
<!--        分类-->

        <van-notice-bar :scrollable="false"
                        left-icon="volume-o" color="#2a2a2a">
          Tips：You can do <span class="color_orange">{{ limitcount }}</span> more searches this month
        </van-notice-bar>
        <!--         筛选区域-->
        <van-sticky :offset-top="44">
          <van-tabs v-model="searchCategoryID"  @change="tabChangeHandle">
            <van-tab  v-for="(item,index) in categoryNameList"  :key="item.value" :title="item.name" :name="item.value"/>
          </van-tabs>
          <div class="filter-area-box">
            <div class="filter-left">
              <van-dropdown-menu active-color="#fcc900" >
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
        </van-sticky>
        <template v-if="isLoading">
          <van-loading type="spinner" color="#fcc900" size="45px"/>
        </template>
        <template v-else>
          <div class="s3-home-search-product-list" v-if="otherImgList.length">
            <van-row>
              <van-col :span="12" class="product-info-item"
                       v-for="(item,index) in otherImgList" :key="index"  >
                <div @click="goOtherURL(item,index)">
                  <div class="product-img bg_white " >
                    <van-tag color="#ded9d9" size="medium" class="sea-tag animate__animated animate__fadeInRight"
                             v-if="item.specialgoods==2"
                             >Sea Shipping</van-tag>
                    <img src="~assets/images/top100/tag.png" v-if="item.type==1"  alt="" class="tag-img" @click.stop="goSupplierHandle">
                    <van-image fit="fill"  class="img_tag" :src="item.image"/>
                    <div class="start_tag" v-if="item.platformstarlevel/10 >4">
                      <div class="start_count d_flex">
                        <van-icon name="star" color="#fcc900" class="g_ml_s"/>
                        <span class=" color_orange">{{item.platformstarlevel/10}}</span>

                      </div>
                    </div>
                  </div>
                  <div class="product-info d_flex_between d_flex">
                    <div class="product-info-price" >R{{item.price}}</div>
                    <div class="product-info-sale">min Qty <span>{{item.bookedCount}}</span></div>
                  </div>
                </div>
              </van-col>
            </van-row>
            <div class="list_bottom" v-show="otherImgList.length>8">
              <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading"> in loading...</span></van-loading>
              <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
            </div>
          </div>
          <van-empty v-else
                     class="custom-image"
                     image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                     description="No data at present......"
          />
        </template>
      </scroll-view>
    </div>
    <van-dialog v-model="isSelect" title="Select Image Region" show-cancel-button>
      <div class="select_wrapper">
        <div class="select-camera-content">
          <div class="select-img">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :fixed="option.fixed"
              :mode="option.mode"
              :fixedNumber="option.fixedNumber"
              :centerBox="option.centerBox"
              :infoTrue="option.infoTrue"
              :fixedBox="option.fixedBox"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
            ></vueCropper>
          </div>
        </div>
        <div class="select-btn">
          <van-button class="btn_select" @click="selectImageHandle">Select</van-button>
          <van-button class="cancel_btn" @click="cancelHandle">Cancel</van-button>
        </div>
      </div>
    </van-dialog>
    <van-popup v-model="isFilter" position="right"   :style="{ height: '100%',width:'70%' }" >
      <filter-drawer
        @doneEmit="doneHandle"
        />
    </van-popup>
  </div>
</template>

<script>
  import JsCookie from 'js-cookie'
  import {keywordOption} from '@/utils'
  import {getUserID} from "@/utils/memory";
  import {spmLogApi} from '@/api/common';
  const commonList =[{value:-1,name:'All'}]
  import CommonIndexHeader  from "@/components/common/CommonIndexHeader";
  import {imagesearchlistApi ,searchcountApi,searchImgCategoryApi ,unReadMessageApi} from '@/api/home'
  import CommonEnd from '@/components/common/CommonEnd'
  import { gTagFun } from '@/utils/buryPoint/gTag'
  import config from '@/config/index'
  import ScrollView from "@/components/common/ScrollView";
  import {clickPointFun } from '@/utils';
  import {getUserTicket,setRefer,setRefSpm,setCurrentPage} from '@/utils/memory'
  import FilterDrawer from '@/components/content/FilterDrawer'
  export default {
    head(){
      return {
        title:'Shop for me - shopshipshake'
      }
    },
    components:{CommonEnd ,CommonIndexHeader,ScrollView,FilterDrawer},
    name: "index",
    data(){
      return{
        recommendFilter:0,
        isFilter:false,
        searchKey:'',
        page:1,
        pageCount:0,
        otherImgList:[],//其他图片列表
        limitcount:0,//剩余搜索次数
        unreadMessage:0,
        imgSrc:'',
        imgKey:'',
        isLoading:false,
        isSelect:false,//截图
        previews: {},
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'png',//裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: false, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          high: true,
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          mode:'100% auto'
        },
        status:1,
        maxPrice:null,
        minPrice:null,
        newAddress:'',//截图上传的key
        recommendOption:[
          {text:'Recommend',value:0},
          {text:'Bestselling',value:1},
          {text:'Price:low to high',value:2},
          {text:'Price:high to low',value:3},
        ],
        categoryNameList:[],
        searchCategoryID:-1,
        unReadCount:''
      }
    },
    methods:{
      goSupplierHandle(){
        window.open('https://shopshipshake.co.za/business-service/launch-of-top100-suppliers-plan/','online')
      },
      recommendSelectHandle(value){
        this.recommendFilter = value;
        this.update()
      },
      update(){
        this.page =1;
        this.getImgCategoryList()
      },
      doneHandle(value){
        this.isFilter = false;
        this.minPrice = value.minPrice;
        this.maxPrice  = value.maxPrice;
        this.update()
      },
      showFilterHandle(){
        this.isFilter = true;
      },
      cancelHandle(){
        this.isSelect = false;
      },
      selectImageHandle(){
        this.searchCategoryID = -1;
        this.$refs.cropper.getCropBlob((data) => {
          //这个data就是我们截取后的blob图片
          var name= this.imgKey;
          let file ='';
          if(process.client){
            file = new window.File([data], name, {type: data.type})
          }
          let formData = new FormData();
          formData.append('file',file);
          formData.append('ticket',getUserTicket());
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          };
          this.$axios.post(`${this.$config.jianweiDomain}/api/search/uploadimage`,formData,config).then(res=>{
            if(res.data.status==0){
              this.page =1;
              this.getSearchCount();
              this.newAddress = res.data.data.key;
              this.getImgCategoryListByCropper()
              this.isSelect = false;
            }else{
              this.isSelect = false;
              return this.$toast({message:res.data.message})
            }
          })
        })
      },
      getImgCategoryListByCropper(){
        this.isLoading = true;
        let option={imageAddress:this.imgKey,
          page:this.page,categoryId:0,
          newAddress:this.newAddress,
          minPrice:this.minPrice,
          maxPrice:this.maxPrice,
          sortType:this.recommendFilter,
          classify:this.searchCategoryID<0?'':this.searchCategoryID
        };
        imagesearchlistApi(option).then(res=>{
          if(res.data){
            let result = res.data;
            if(result && result['offerList']){
              this.otherImgList = result['offerList'];
              this.pageCount =result['pageCount'] ;
            }else{
              this.newAddress ='';
              this.getImgCategoryList()
            }
          }


          setTimeout(()=>{
            this.isLoading = false;
          },this.$config.duringWait)
        })
      },
      showCropperHandle(){
        this.$nextTick(()=>{
          this.isSelect = true;
          this.option.img = this.imgSrc;
        })

      },
      getMessageCount(){
        if(getUserID()){
          unReadMessageApi().then(res=>{
            this.unReadCount =res? res.count:0
          })
        }
      },
      loadMoreHandle(){
        if(this.status==this.$config.loadingType.FINISHED) return;
        if(this.page >this.pageCount) return;
        this.page ++;
        let option={imageAddress:this.imgKey,
          page:this.page,categoryId:0,
          newAddress:this.newAddress,
          minPrice:this.minPrice,
          maxPrice:this.maxPrice,
          sortType:this.recommendFilter,
          classify:this.searchCategoryID<0?'':this.searchCategoryID
        };
        imagesearchlistApi(option).then(res=>{
          const {offerList} = res.data;
          if(offerList.length==0){this.status=this.$config.loadingType.FINISHED}
          this.otherImgList = [...this.otherImgList,...offerList];
        })
      },
      //前往search页面
      goSearchHandle(){
        this.$router.push('/shoppingmall/search/index')
      },
      tabChangeHandle(){
        this.page=1;
        this.status = this.$config.loadingType.LOADING;
        this.getImgCategoryList()
      },
      goMessageHandle(){
        this.$router.push('/message/index')
      },
      goOtherURL(item,index){
        //埋点
        gTagFun('商城品类名','商品详情','产品列表页面')
        clickPointFun({
          resultdata:this.$route.query.picurl,
          p:'', spm:`a0001.p0004.imgofferlist.${index}.${JsCookie.get('imgSearchSpmID')}`})
        //谷歌埋点
        window.open(`${this.$config.jianweiDomain}/search?productid=${item.id}&spm=a0001.p0004.imgofferlist.${index}.${JsCookie.get('imgSearchSpmID')}`,'online')
      },
      goBack(){
        this.$router.back()
      },
      //获取图片类别接口
      getImgCategoryList(){
        this.isLoading = true;
        let option={imageAddress:this.imgKey,
          page:this.page,categoryId:0,
          minPrice:this.minPrice,
          maxPrice:this.maxPrice,
          sortType:this.recommendFilter,
          classify:this.searchCategoryID<0?'':this.searchCategoryID
        };
        imagesearchlistApi(option).then(res=>{
          const {offerList,pageCount} = res.data;
          this.otherImgList = offerList;
          this.pageCount = pageCount;
          setTimeout(()=>{
            this.isLoading = false;
          },this.$config.duringWait)
        })
      },
      //获取图片剩余搜索次数
      getSearchCount(){
        searchcountApi().then(res=>{

          if(res.status==0){
            this.limitcount = res.data.limitcount - res.data.count;
          }

        })
      },
      //获取类别
      getCategoryList(){
        searchImgCategoryApi().then(res=>{
          this.categoryNameList = [...commonList,...res];

        })
      },
    },
    beforeRouteEnter(to,from,next){
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      if(from.path=='/shoppingmall/categorylist' || from.path=='/shoppingmall/index' || from.path=='/shoppingmall/categoryproduct'){
        let option ={};
        switch (to.query.fromType) {
          case 'category':
            option = keywordOption({
              p: '',
              spm: `a0001.category_product.imgsearch.r0.-1`,
              resultdate:to.query.picurl
            })
            break;
          case 'index':
            option = keywordOption({
              p: '',
              spm: `a0001.p0001.imgsearch.r0.-1`,
              resultdata:to.query.picurl
            })
            break;
          case 'keyword':
            option = keywordOption({
              p: '',
              spm: `a0001.p0003.imgsearch.r0.-1`,
              resultdata:to.query.picurl
            })
            break;
          default:
            option = keywordOption({
              p: '',
              spm: `a0001.p0001.imgsearch.r0.-1`,
              resultdata:to.query.picurl
            })
            break;
        }
        spmLogApi(option).then(res=>{
          JsCookie.set('imgSearchSpmID',res.spmid)
        })
      }
      next()
    },
    created() {
      this.imgSrc = this.$route.query.picurl;
      this.imgKey = this.$route.query.key;
      this.getImgCategoryList();
      this.getSearchCount();
      this.getCategoryList();
    }

  }
</script>

<style scoped lang="less">
  /deep/.van-tab__text--ellipsis{
    -webkit-line-clamp: 2
  }
  /deep/.van-tab{
    max-width:66.67vw;
    min-width: 26vw;
    font-size:15px;
    text-align: center;
  }
  .tag_title{
    background-color: #fff;
    border:1px solid #fff;
    padding:4px 10px;
    border-radius: 4px;
    font-size:13px;
    max-width:90px;
  }
  .tag_title:after{
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 200px 200px;
    border-color: transparent transparent #007bff transparent;
  }
  /deep/.van-tabs__line{
    display: none;
  }
  /deep/.van-tabs__nav--complete{
    padding-left: 0px;
  }
  .color_orange{
    font-size:18px;
    margin:0 4px;
  }

  /deep/ .van-dropdown-menu__bar{
    height:46PX;
  }
  /deep/.van-dropdown-item__option{
    height:46PX;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    overflow:hidden;
    font-size: 15px;
    padding:0 5px;
  }
  .filter-area-box{
    display: flex;
    align-items: center;
    .filter-left{
      flex:1;
      .recommend-btn{
        /deep/.van-popup--top{
          width:50%;
        }
      }
    }
    .filter-right{
      flex:1;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      height:46PX;
      background-color: #fff;
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
        border-bottom: 0.5px solid #EEEEED;
        cursor: pointer;
        .filter-title{
          position: relative;
          box-sizing: border-box;
          max-width: 100%;
          font-weight: 500;
          padding: 0 6px 0 0;
          color: #323233;
          font-size: 15px;
          line-height: 48px;
        }
      }
    }
  }
  .icon-xuankeshaixuantubiaoimg{
    font-size:16px;
  }
  /deep/.van-dropdown-menu__title{
    font-weight: 500;
    padding: 0 6px 0 0;
    max-width: 85%;
  }
  /deep/.van-dropdown-menu__title::after{
    border-color: transparent transparent #222 #222;
  }
  /deep/.van-dropdown-menu__item{
    border-right:0.5px solid #EEEEED;
    border-bottom:0.5px solid #eeeeed;
    border-top:0.5px solid #EEEEED;
  }
  /deep/.van-cell__value{
    display: none;
  }
  /*筛选*/
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  /deep/ .van-dialog__footer{
    display: none !important;
  }
  .select-img{
    border:1px solid #EEEEED;
    width: 240px;
    height: 240px;
  }
  .select_wrapper{
    padding:10px 20px;
  }
  .select-camera-content{

    display: flex;
    justify-content: center;
    align-items: center;

  }
  .select-btn{
    padding-top:15px;
    text-align: center;
  }
  .btn_select{
    background-color: #fcc900;
    margin-right: 15px;
    border-radius: 4px;
    color:#fff;
  }
  .cancel_btn{
    background-color: #EEEEED;
    border-radius: 4px;
  }
  .scrollHeight{
    height:calc(100vh - 46PX);
    background-color: #EEEEED;
  }
  .home-navbar-input{
    position: relative;
    .camera_search{
      position:absolute;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      .s3_header_input_camera{
        font-size:22px;
      }
    }
  }

  /deep/.van-field__control{
    height:34px;
  }
  .icon-xiaoxi{
    font-size:24px;
    color:gray;
  }
  /deep/ .van-nav-bar__title{
    min-width:280px;
  }
  .icon-kaitongxuzhi{
    font-size:24px;
    color:#FCC900;
  }
  .s3-home-search-product-info-top-left{
    margin:10px 15px;
    width:160PX;
    height:160PX;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    img{
      max-height: 160PX;
      max-width:160PX;
      display: block;
      margin: 0 auto;
    }
    .select-tag{
      position:absolute;
      bottom:0;
      left:0;
      right:0;
      color:#fff;
      font-size:13px;
      text-align: center;
      padding:6px 0;
      background-color: rgba(0,0,0,0.4);
    }
    .icon-jietu{
      color:#fff;
      font-size:12px;
      margin-right: 2px;
    }
  }
  .s3-home-search-product-info-wrapper{
    .s3-home-search-product-info-content{
      .s3-home-search-product-info-top{
        padding:10px 0 15px;
        .s3-home-search-product-info-top-right{
          height:200px;
          overflow: auto;
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }
      .s3-home-search-product-info-tip{
        padding:10px 8px;
      }
      .s3-home-search-product-list{
        padding-top:10px;
        .product-info-item{
          border:1px solid #EEEEED;
          margin-bottom: 10px;
          padding:2px;
          .product-img{
            height:182px;
            overflow: hidden;
            position: relative;
            .sea-tag{
              position: absolute;
              bottom:0;
              padding:4px ;
              left:2px;
              z-index:1;
              color:#2a2a2a;
            }
            .tag-img{
              position: absolute;
              width:40PX;
              height:40PX;
              border-radius: 0  0 8px 0;
              z-index:1;
            }
            .start_tag{
              position:absolute;
              z-index:1;
              bottom:0;
              right:0;
            }
            .color_orange{
              font-size:13px;
            }
            .start_count{
              position: absolute;
              bottom: 0;
              right: 0;
              background: #f3f3f3;
              padding: 2px 4px;
            }
          }
          .product-info{
            padding:10px 6px;
            background-color: #fff;
            .product-info-price{
              font-weight: bold;
              font-size:17px;
              color:#f00;
            }
            .product-info-sale{
              font-size:14px;
              color:gray;
              span{
                font-weight: bold;
                color:#fcc900
              }
            }
          }
        }
      }
    }

  }
  .btn_mb{
    margin:0 0 10px 0;
    font-size:12px;
    border-radius: 6px;
  }
  /deep/ .van-empty__image{
    width:80px;
    height:80px;

  }
  .navbar-input-area{
    width:94%;
    height:32px;
    padding:0 6px;
    font-size:14px;
    border-radius: 20px;
    background-color: #FFFFFF;
    border:1px solid #e5e6e7;
  }
</style>
