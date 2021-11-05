<template>
  <div class="s3-search-wrapper">
    <!--头部navbar start....-->
    <van-nav-bar  left-arrow fixed border z-index="10" @click-left="goBack" @click-right="searchHandle">
      <template #left>
        <van-icon name="arrow-left" size="24" color="#8B8989"/>
      </template>
      <template #title>
        <van-search
          @search="searchInputHandle"
          :clearable="false"
          @input="searchLineHandle"
          v-model="searchKey"
          placeholder="paste keyword or 1688 link" shape="round" />
      </template>
      <template #right>
        <i class="icon iconfont icon-sousuo"></i>
      </template>
    </van-nav-bar>
    <!--头部navbar end....-->

    <template v-if="showSearchLine">
      <van-cell border  @click="goTopRankHandle(item,'list')"
                :value="item.keyword" v-for="(item,index) in searchlinkList"
                :key="index"/>
    </template>
    <template v-else>
      <div class="s3-search-container">
        <scroll-view class="scrollHeight">
          <!--显示category start....-->
          <van-cell  is-link  border   @click="goCategoryHandle">
            <template #title>
              <div class="search-cell-title d_flex"> <van-icon name="apps-o" class="icon-category" size="20"/> Categories </div>
            </template>
          </van-cell>
          <!--显示category end....-->
          <!--热搜start.....-->
          <div class="hot-search-content">
            <div class="hot-search-title">
              Hot Search
            </div>
            <div class="hot-search-tag">
              <van-tag class="hot-search-tag-item" round v-for="(item,index) in hotTagList"
                       @click="goTopRankHandle(item,'hot')"
                       :key="index"  color="#EEEEED" text-color="#2a2a2a" size="large">{{item.hotword}}</van-tag>
            </div>
            <div class="hot-search-title color_orange">
              Good Reviews Products：
            </div>
            <div class="hot-search-tag ">
              <van-tag round class="tag-item"   @click="searchProductHandle('comments')" color="#bebebe"  size="large">Comments</van-tag>
              <van-tag round class="tag-item"  @click="searchProductHandle('photo')" color="#bebebe" size="large">Photos</van-tag>
            </div>
            <div class="hot-search-history">
              <van-cell >
                <template #title>
                  <div class="hot-search-title b_border">
                    Search History
                  </div>
                </template>
                <template #right-icon>
                  <div class="hot-history-removeIcon d_flex"
                       v-if="searchHistoryList.length"
                       @click="removeHistoryHandle"> <van-icon name="delete-o" /> <span>remove all</span></div>
                </template>
              </van-cell>
              <div class="hot-search-history-list">

                <div class="hot-search-history-list-item b_border d_flex_between d_flex"
                     v-for="(item,index) in searchHistoryList" :key="index">
                  <div class="hot-search-history-list-item-name van-ellipsis"
                       @click="goTopRankFromHistory(item)">{{item}}</div>
                  <div class="hot-search-history-list-item-btn"><van-icon name="cross" size="16" color="#CCC"  @click="deleteItem(item)"/></div>
                </div>
              </div>

            </div>
          </div>

          <!--热搜end.....-->
        </scroll-view>

      </div>
    </template>
  </div>
</template>

<script>
  import { hotKeyWordApi ,searchProductUrlSearchApi ,searchlinkApi } from '@/api/home';
  import { getSearchHistory ,setSearchHistory ,removeSearchHistory,setCurrentPage} from '@/utils/memory';
  import { url1688Validate ,otherUrlValidate} from '@/utils/validate'
  import {clickPointFun } from '@/utils';
  import ScrollView from "@/components/common/ScrollView";

  import { gTagFun } from '@/utils/buryPoint/gTag'
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  export default {
    head(){
      return{
        title:'Search Result - shopshipshake'
      }
    },
    name: "index",
    components:{ScrollView},
    data(){
      return{
        searchKey:'',
        hotTagList:[],
        searchHistoryList:[],
        showSearchLine:false,//是否模糊搜索
        searchlinkList:[],//模糊搜索列表
        page:1
      }
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'HomeSearch',
        operate:'close',
        spm:`a0001.HomeSearch.close.${getCurrentPageSpmID()}`
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
        p:'HomeSearch',
        operate:'page',
        spm:`a0001.HomeSearch.page.-1`
      })
      next();
    },

    beforeDestroy() {
      if(this.searchKey){
        if(this.searchHistoryList.indexOf(this.searchKey)!=-1){
          let index = this.searchHistoryList.indexOf(this.searchKey);
           this.searchHistoryList.splice(index,1)
        }
        this.searchHistoryList =[this.searchKey,...this.searchHistoryList]
        setSearchHistory(this.searchHistoryList);
      }

    },
    methods:{
      searchProductHandle(type){
        switch (type) {
          case 'comments':
            gTagFun('GoodReviewcomments','点击好评下的comments按钮','搜索关键词输入页面')

            break;
          case 'photo':
            gTagFun('GoodReviewphotos','点击好评下的photos按钮','搜索关键词输入页面')
            break;
        }
        this.$router.push(`/shoppingmall/comments/${type}`)
      },
      goCategoryHandle(){
        this.$router.push(`/shoppingmall/categorylist?spm=a0001.p0001.searchkey.0`)
      },
      searchLineNoSave(event){
        this.showSearchLine = false;
        //添加谷歌埋点
        if(!event){
          return ;
        }
        gTagFun('（1.1688链接；2.关键字；3.第三方网站链接)','Search','查询页面')
        if(url1688Validate(event)){
          // return;
          /*
            如果是1688链接,
            GET /api/search/urlsearch
            userid: 1304779281533512
            spm:
            spmvalue: 6d21f4b3d3b34
            resultdata: 543392997262
            referer: https://shop.shopshipshake.com/shoppingmall/index
            opeation: page
            refspm:
            p: 下单页面
          */
          clickPointFun({
            resultdata:this.searchKey,
            p:'首页',
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchurl.0.${getCurrentPageSpmID()}`
          })

          window.open(`${this.$config.jianweiDomain}/search?spm=a0001.p0001.searchurl.0.${getCurrentPageSpmID()}&url=${event}`,'online')

        }else if(otherUrlValidate(event)){
          console.log('163其他网址',)
          /*
            1.判断是否登录,如果没有登录就登录，如果登录就调producturlSearch接口
          * */
          clickPointFun({
            resultdata:this.searchKey,
            p:'首页',
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchotherurl.0.${getCurrentPageSpmID()}`
          })
          searchProductUrlSearchApi(event).then(res=>{
            this.$toast({message:res.message})
          })
        }else{
          //是关键词，
          if(event.indexOf('http')!==-1){
            //  如果有http，就输出错误地址 please pull 1688 produt detail link
            this.$toast({message:'please pull 1688 produt detail link'})
          }else if(event.length>50){
            //如果超出50，就输出 keyword length can't exceed 50
            this.$toast({message:'keyword length can\'t exceed 50'})
          }
          //  最后确定是关键词 ->掉关键词的接口
          /*
          * 1.调用keywordSearch接口获取第一层类目，作为catagories类目
          * 2.调用keysearchList获取商品列表，往下滑动，如果商品列表没有数据，就调用keysearchlist1688接口，获取数据
          * 3.如果输入的是big tree就调到专有的商铺页面
          * */
          if(event.toLowerCase() =='big tree'){
            //确定是big tree，到店铺页面
            console.log('确定是big tree，到店铺页面')
            clickPointFun({
              resultdata:this.searchKey,
              p:'首页',
              spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0.${getCurrentPageSpmID()}`
            })
            this.$router.push(`/home/shopStore?spm=a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0`)
          }else{
            //  到top-rank页面
            clickPointFun({
              resultdata:event,
              p:'首页',
              spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0.${getCurrentPageSpmID()}`
            })
            this.$router.push({
              path:'/shoppingmall/categoryproduct',
              query:{
                categoryID:0,
                operate:'keyword',
                keyword:event,
                spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0`
              }
            })
          }
        }
      },
      //关键词搜索
      searchInputHandle(event){
        this.showSearchLine = false;
        //添加谷歌埋点
        if(!event){
          return ;
        }
        gTagFun('（1.1688链接；2.关键字；3.第三方网站链接)','Search','查询页面')
        this.searchKey = event;
        if(url1688Validate(event)){
          //1688埋点
          clickPointFun({
            resultdata:this.searchKey,
            p:'首页',
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchurl.0.${getCurrentPageSpmID()}`
          })
          // this.searchHistoryList =[...this.searchHistoryList,{id:this.searchHistoryList.length,name:this.searchKey}]
          if(this.searchHistoryList.indexOf(this.searchKey)!=-1){
            let index = this.searchHistoryList.indexOf(this.searchKey);
            this.searchHistoryList.splice(index,1)
          }
          this.searchHistoryList = [this.searchKey,...this.searchHistoryList]
          setSearchHistory(this.searchHistoryList);
          // return;
          /*
            如果是1688链接,
            GET /api/search/urlsearch
            userid: 1304779281533512
            spm:
            spmvalue: 6d21f4b3d3b34
            resultdata: 543392997262
            referer: https://shop.shopshipshake.com/shoppingmall/index
            opeation: page
            refspm:
            p: 下单页面
          */
          window.open(`${this.$config.jianweiDomain}/search?spm=a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchurl.0.${getCurrentPageSpmID()}&url=${event}`,'online')

        }else if(otherUrlValidate(event)){
          /*
            1.判断是否登录,如果没有登录就登录，如果登录就调producturlSearch接口
          * */
          clickPointFun({
            resultdata:this.searchKey,
            p:'首页',
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchotherurl.0.${getCurrentPageSpmID()}`
          })
          searchProductUrlSearchApi(event).then(res=>{
            this.$toast({message:res.message})
          })
        }else{
          //是关键词，
          if(event.indexOf('http')!==-1){
            //  如果有http，就输出错误地址 please pull 1688 produt detail link
            this.$toast({message:'please pull 1688 produt detail link'})
          }else if(event.length>50){
            //如果超出50，就输出 keyword length can't exceed 50
            this.$toast({message:'keyword length can\'t exceed 50'})
          }
          //  最后确定是关键词 ->掉关键词的接口
          /*
          * 1.调用keywordSearch接口获取第一层类目，作为catagories类目
          * 2.调用keysearchList获取商品列表，往下滑动，如果商品列表没有数据，就调用keysearchlist1688接口，获取数据
          * 3.如果输入的是big tree就调到专有的商铺页面
          * */
          if(event.toLowerCase() =='big tree'){
            clickPointFun({
              resultdata:this.searchKey,
              p:'首页',
              spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0.${getCurrentPageSpmID()}`
            })
            //确定是big tree，到店铺页面
            this.$router.push(`/home/shopStore?spm=a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0`)
          }else{
            clickPointFun({
              resultdata:event,
              p:'首页',
              spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0.${getCurrentPageSpmID()}`
            })
            this.$router.push({
              path:`/shoppingmall/categoryproduct`,
              query:{
                categoryID:0,
                operate:'keyword',
                keyword:event,
                spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.0`
              }
            })
          }
        }

      },
      //关键词模糊搜索
      searchLineHandle(event){
        if(event){
          this.showSearchLine = true;
          searchlinkApi(event).then(res=>{
            this.searchlinkList= res;
          })
        }else{
          this.showSearchLine =false;
        }

      },
      goBack(){
        this.$router.go(-1);
      },
      searchHandle(){
        if(this.searchKey){
          this.searchInputHandle(this.searchKey)
        }
      },
      goTopRankHandle(item,type){
        this.searchKey = item.hotword  || item.keyword;
        //谷歌埋点
        if(type==='list'){
          gTagFun('Search-Categories','Search-Categories','查询页面')
          clickPointFun({
            p:'查询结果页面',
            resultdata:item.keyword,
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.link.${getCurrentPageSpmID()}`
          })
          this.$router.push({
            path:`/shoppingmall/categoryproduct`,
            query:{
              categoryID:0,
              operate:'link',
              keyword:item.keyword,
              spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.searchkey.link`
            }
          })
        }else if(type==='hot'){
          gTagFun('Search History','Search History','查询页面')
          clickPointFun({
            p:'首页',
            spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.hot_search.${item.hotword}.${getCurrentPageSpmID()}`
          })
          if(item.hotword.toLowerCase() =='big tree'){
            //确定是big tree，到店铺页面
            console.log('确定是big tree，到店铺页面')
            this.$router.push(`/home/shopStore?spm=a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.hot_search.${item.hotword}`)
          }else{
            this.$router.push({
              path:`/shoppingmall/categoryproduct`,
              query:{
                categoryID:0,
                operate:'hotword',
                keyword:item.hotword,
                spm:`a0001.${this.$route.params.type=='index'?'p0001':'p0003'}.hot_search.${item.hotword}`
              }
            })
          }
        }
      },
      goTopRankFromHistory(item){
        this.searchLineNoSave(item)
      },
      //获取热搜列表
      getHotWordListHandle(){
        hotKeyWordApi().then(res=>{
          this.hotTagList = res;
        })
      },
      //删除全部
      removeHistoryHandle(){
        this.searchHistoryList =[];
        removeSearchHistory();
        this.getSearchHistoryList()
        //添加谷歌埋点
        gTagFun('Search History Remove All','Search History Remove All','查询页面')
      },
      //获取搜索历史
      getSearchHistoryList(){
        this.searchHistoryList = getSearchHistory() ||[];
      },
      //删除其中的一个
      deleteItem(item){
        this.searchHistoryList = this.searchHistoryList.filter(its=>its!=item);
        setSearchHistory(this.searchHistoryList);
        this.getSearchHistoryList();
        //添加谷歌埋点
        gTagFun('Search History Remove','Search History Remove','查询页面')
      }
    },
    mounted() {
      this.getHotWordListHandle();
      this.getSearchHistoryList();
    },

  }
</script>

<style scoped lang="less">
  /deep/.van-search__content{
    background-color: #fff;
    border:1px solid #EEEEED;
  }
  .icon-sousuo{
    font-size:24px;
    color:gray;
  }
  /deep/.van-field__left-icon{
    display: none;
  }
  /deep/ .van-nav-bar__title{
    min-width:280px;
  }
  .s3-search-wrapper{
    padding-top:50px;
    .s3-search-container{
      .search-cell-title{
        font-size:15px;
      }
      .icon-category{
        margin-right: 6px;
        color:#FCC900;
      }

      /*热搜*/
      .hot-search-content{
        padding-top:20px;
        padding-left:15px;
        .hot-search-title{
          padding-bottom:15px;
          font-weight: bold;
          font-size:18px;
          color: #FCC900;
        }
        .color_orange{
          color:orange !important;
        }
        .hot-search-tag{
          .hot-search-tag-item{
            padding:4px 10px;
            font-size:12px;
            margin-right:15px;
            margin-bottom: 15px;
          }
          .tag-item{
            padding:8px 20px ;
            margin-right: 10px;
            font-size:16px;
            /*border:1px solid gray;*/
          }
        }
        .hot-search-history{
          padding-top: 20px;
          /deep/.van-cell{
            padding:0 20px 0 0 ;
          }
          .hot-history-removeIcon{
            color:#CCC;
            span{
              margin-left: 6px;
            }
          }
          .hot-search-history-list{
            padding:5px 15px 5px 0;
            .hot-search-history-list-item{
              padding:8px 0;
              .hot-search-history-list-item-name{
                font-size:18px;
                font-weight: 500;
                color:#2A2A2A;
                flex:1;
              }
              .hot-search-history-list-item-btn{
                width:60px;
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
  /deep/ a.van-cell__value--alone{
    font-size:15px
  }
  .scrollHeight{
    height:calc(100vh - 50PX )
  }
</style>
