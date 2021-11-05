<template>
  <div class="s3-category-wrapper">
    <van-sticky>
      <!--      头部-->
      <nav-bar-special @clickLeft="goBackHandle">
        <van-icon name="arrow-left" size="24" color="#8B8989" slot="left"/>

        <div slot="content">
          <div class="home-search-input">
            <van-search
              @click="goSearchHandle" readonly placeholder="paste keyword or 1688 link" shape="round" />
            <van-uploader :after-read.stop="afterReadHandle"
                          v-img-upload="{triggerType:'click',p:'首页',position:'category_product'}"
                          max-count="1" class="camera_search">
              <i class="icon iconfont icon-zhaoxiangji s3_header_input_camera"   ></i>
            </van-uploader>
          </div>
        </div>
      </nav-bar-special>
      <!--    类别-->
    </van-sticky>
    <div class="s3-category-content">
      <template v-if="isLoading">
        <van-loading type="spinner" color="#fcc900" size="45px"/>
      </template>
      <div class="main" v-else>
        <div class="sidebar">
          <scroll-view class="scrollHeight">
            <div class="category_item "
                 v-login-register-track="{triggerType:'click',page:'Category',operate:item.name}"
                 @click="chooseCategoryNameHandle(item,index)"
                 :class="{'category_item_active':categoryActive===index}"
                 v-for="(item,index) in categoryName" :key="index"><p>{{item.name}}</p></div>
          </scroll-view>
        </div>
        <div class="content scrollContent" ref="wrapper" @scroll="getScrollHandle">
          <template v-if="productList.length">
            <category-product-model
              :categoryId="categoryId"
              v-for="(item,index) in productList" :key="index" :item="item" :index="index"/>
            <div class="icon iconfont icon-end color_intro" v-show="productList && productList.length"></div>
          </template>
          <van-empty description="No data at present....." v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import NavBarSpecial  from "@/components/common/NavBarSpecial";
  import CategoryProductModel from './childComponents/category_product_model'
  import { categoryListApi } from '@/api/home';
  import {setCategoryScroll ,getCategoryScroll ,setCategoryID ,getCategoryID} from '@/utils/memory'
  import ScrollView from "@/components/common/ScrollView";
  import {getUserTicket,getCurrentPageSpmID,setRefer,setRefSpm,setCurrentPage} from '@/utils/memory'
  import { uploadImageApi } from '@/api/common'
  import config from '@/config'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  export  default {
    head(){
      return {
        title:'Category - shopshipshake'
      }
    },
    name: "index",
    components:{NavBarSpecial,CategoryProductModel ,ScrollView},
    data(){
      return{
        isLoading:false,
        categoryActive: 0,
        categoryName:[],
        productList:[],
        categoryId:null,
      }
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'Category',
        operate:'close',
        spm:`a0001.Category.close.${getCurrentPageSpmID()}`
      })
      next();
    },
    beforeRouteEnter(to,from,next){
      if(from.path!='/'){
        setRefer(config.jianweiDomain +from.path)
      }
      if(to.query.spm){
        setRefSpm(to.query.spm);
      }
      setCurrentPage(to.name)
      loginRegisterPageBury({
        p:'Category',
        operate:'page',
        spm:`a0001.Category.page.-1`
      })
      next();
    },
    methods:{
      goBackHandle(){
        this.$router.replace('/')
      },
      getScrollHandle(event){
        setCategoryScroll(event.target.scrollTop);
        this.$refs.wrapper.scrollTop = event.target.scrollTop;
      },
      //  图片上传
      afterReadHandle(file){
        if(!getUserTicket()){
          this.$router.replace('/login')
        }else{
          uploadImageApi(file).then(res=>{
            if(res.data.status==0){
              this.$router.push({
                path:'/shoppingmall/imagesearch',
                query:{
                  key:res.data.data.key,
                  picurl:res.data.data.picurl,
                  fromType:'category',
                  spm:`a0001.category_product.imgsearch.r0`
                }
              })
            }else{
              return this.$toast({message:res.data.message})
            }
          })
        }
      },
      //前往search页面
      goSearchHandle(){
        this.$router.push('/shoppingmall/search/category')
      },
      //获取数据
      getCategoryList(){
        this.isLoading = true;
        categoryListApi().then(res=>{
          res.forEach(item=>{this.categoryName.push({id:item.id,name:item.ename})})
          this.allList = res;
          if(!getCategoryID()){
            this.categoryId = res[0].id;
            this.getProductList(res[0].id)
          }else{
            this.categoryActive =getCategoryID().index;
            this.categoryId = getCategoryID().id;
            this.getProductList(this.categoryId)
          }
          setTimeout(()=>{
            this.isLoading = false;
          },this.$config.duringWait)

        })
      },

      //获取右边数据
      getProductList(id){
        this.productList = this.allList.find(item=>item.id===id).child || [];
        this.$nextTick(()=>{
          if(getCategoryScroll() && this.$refs.wrapper){
            this.$refs.wrapper.scrollTop=getCategoryScroll()
          }
        })
      },
      //左边类别选择
      chooseCategoryNameHandle(item,index){
        setCategoryID({
          index,
          id:item.id
        })
        this.categoryActive = index;
        this.categoryId = item.id;
        this.$nextTick(()=>{
          this.$refs.wrapper.scrollTop = 0;
        })
        this.getProductList(item.id)
      },
    },
    mounted() {
      this.getCategoryList();
    },
  }
</script>
<style scoped lang="less">
  /deep/.van-icon-search{
    display:none;
  }
  .home-search-input{
    position:relative;
    .camera_search{
      position:absolute;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      .s3_header_input_camera{
        font-size:22px;
      }
    }
    /deep/.van-search__content{
      background-color: #fff;
      border:1px solid #EEEEED;
    }
  }

  .main {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    height:100%;
  }
  .sidebar {
    width: 100px;
    background-color: #fff;
  }
  .content {
    padding-left: 10px;
    padding-right:8px;
    flex:1;
    background-color: #eee;
  }
  .scrollContent{
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 50PX - 46PX);
    /deep/.van-empty{
      padding:0;
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
  }
  .category_item{
    font-size: 12px;
    border: 0px solid black;
    min-height: calc((100vh - 88PX)/12);
    overflow: hidden;
    border-bottom: 1px solid #fff;
    padding: 0px 8px;
    line-height: calc(((100vh - 88px)/12 - 18px)/2);
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -webkit-box-flex: 1;
    p{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }
  }
  .category_item_active{
    border-left:5px solid #FCC900;
    font-weight: 500;
    background:#eee;
  }
  .icon-end{
    margin:20px auto;
    text-align: center;
    color:#ccc;

  }
  .space-area{
    height:50px;
  }
  .scrollHeight{
    height:calc(100vh - 50PX - 60PX)
  }
</style>
