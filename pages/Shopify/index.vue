<template>
  <div>
    <van-sticky>
      <div class="d_flex header_content">
        <router-link to="/shopify/tutorial"> <i class="icon iconfont icon-kaitongxuzhi"
        /></router-link>
        <van-search class="flex_1" background="#FFDEAD"
                    @clear="clearHandle"
                    show-action v-model="searchValue" placeholder="Search ">
          <template #action>
            <van-button :disabled="tabIndex==3" @click="searchHandle" type="warning" round size="mini">Search</van-button>
          </template>
        </van-search>
      </div>
      <van-tabs v-model="tabIndex" @change="tabChangeHandle">
        <van-tab :title="item.name" v-for="(item,index) in tabList" :key="index" />
      </van-tabs>
      <van-dropdown-menu active-color="#fcc900" v-if="tabIndex==0 || tabIndex==4" >
        <van-dropdown-item v-model="categoryID"
                           @change="categorySelectHandle"
                           :options="categoryList" >
          <template #title><div class="g_pt_m g_pb_m">{{categoryName}}</div></template>
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>
    <products :categoryid="categoryID" :categoryRank="categoryRank" :searchValue="searchKey" v-if="tabIndex==0"/>
    <archived-list :searchValue="searchKey" :tabindex="tabIndex" v-else-if="tabIndex==1 || tabIndex==2"/>
    <store-list v-else-if="tabIndex==3"/>
    <private-list v-else-if="tabIndex==4" :categoryid="categoryID" :categoryRank="categoryRank" :searchValue="searchKey"/>
    <div class="contact_btn" @click="contactHandle"><i class="icon iconfont icon-email-1" /></div>


    <van-dialog v-model="showAuthorVisible"
                width="94%"
                title="Are you sure to add the store to the website?" :show-cancel-button="false" :show-confirm-button="false">
      <author-popup @cancelEmit="cancelHandle" :queryInfo="queryInfo" @successEmit="successHandle"/>
    </van-dialog>
  </div>
</template>

<script>
  const commonList =[{text:'All Categories',value:0,rank:0}]
  import Products from './Products';
  import ArchivedList from './ArchivedList';
  import StoreList from './StoreList';
  import PrivateList from './PrivateList'
  import AuthorPopup from './ChildComponent/AuthorPopup'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {shopifyCategoryListApi} from '@/api/shopify'
  import {setRefer,setRefSpm,getCurrentPageSpmID} from '@/utils/memory'
  import config from '@/config'
  export default {
    name: "index",
    data(){
      return{
        searchValue:'',
        tabIndex:0,
        searchKey:'',
        tabList:[
          {name:'Products',value:0},
          {name:'Listed',value:1},
          {name:'Archived',value:2},
          {name:'Store',value:3},
          {name:'Private',value:4},
        ],
        showAuthorVisible:false,//是否显示验证
        queryInfo:{
          code:'',
          shop:'',
          email:''
        },
        categoryList:[],
        categoryID:0,
        categoryName:'All Categories',
        categoryRank:''
      }
    },
    components:{Products,ArchivedList,StoreList,AuthorPopup,PrivateList},
    methods:{
      categorySelectHandle(val){
        this.categoryName= this.categoryList.find(item=>item.value == val).text;
        this.categoryRank= this.categoryList.find(item=>item.value == val).rank;
      },
      cancelHandle(){
        this.showAuthorVisible = false;
        this.$router.replace('/')
      },
      successHandle(){
        this.showAuthorVisible = false;
        this.tabIndex = 3;
      },
      clearHandle(){
        this.searchValue ='';
        this.searchKey = ''

      },
      tabChangeHandle(){
        this.categoryName ='All Categoried';
        this.categoryRank = 0;
        this.categoryID = 0
      },
      searchHandle(){
        if(!this.searchValue){
          return this.$toast({message:'Please fill the content'})
        }
        this.searchKey = this.searchValue;
      },
      contactHandle(){
        this.$router.push('/shopify/contact')
      },
      getCategoryList(){
        if(this.tabIndex ==0){
          let newValue =[];
          shopifyCategoryListApi().then(res=>{
            res.forEach(item=>{
              if(item.title){
                newValue.push(item)
              }
            })
            newValue = newValue.map(item=>{
              item.text = item.ename;
              item.value = item.id;
              return item;
            })
            this.categoryList = [...commonList,...newValue]
          })
        }
      }
    },
    mounted() {
      this.getCategoryList();
    },
    created() {
      this.queryInfo = this.$route.query || {}
      if(this.queryInfo  && this.queryInfo.verifyflg && this.queryInfo.verifyflg ==1){
        this.showAuthorVisible = true;
      }
    },
    beforeRouteLeave(to,from,next){
      loginRegisterPageBury({
        p:'shopify',
        operate:'close',
        spm:`a0001.shopify.close.${getCurrentPageSpmID()}`
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
      loginRegisterPageBury({
        p:'shopify',
        operate:'page',
        spm:`a0001.shopify.page.-1`
      })
      next();
    },
  }
</script>

<style scoped lang="less">
  /deep/.van-dropdown-menu__bar{
    height:46px;
  }
  /deep/.van-cell{
    padding:5px 20px;
  }
  .contact_btn{
    position: fixed;
    bottom:15%;
    right:10px;
    width:42px;
    height:42px;
    line-height:42px;
    text-align: center;
    background:#FCC900;
    border-radius: 50%;
    .icon-email-1{
      font-size:22px;
      color:#fff;
    }
  }
  .header_content{
    padding:0 4px;
    background:#FFDEAD;
  }
  .icon-kaitongxuzhi{
    font-size:24px;
    color:gray;
    text-shadow: 1px 1px 10px rgba(0,0,0,0.2);
    margin-right: 5px;
  }

  /deep/.van-field__left-icon{
    display: none;
  }
  /deep/.van-search__action{
    line-height: 1;
    padding:0 2px 0 6px;
  }
  /deep/.van-button--mini{
    height:30px !important;
    line-height: 30px;
    border-radius: 5px;
    padding:0 10px;
    font-size:14px;
  }
  /deep/.van-search{
    padding:4px 0;
  }
</style>
