<template>
  <div class="product-list-content">
    <scroll-view class="shopifyScrollView" @reachBottom="loadMoreHandle">
      <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
      <template v-else>
        <van-empty description="No data at present....."  v-if="productList.length==0">
          <img src="~assets/images/common/empty.png" alt="" slot="image">
        </van-empty>
        <template v-else>
          <van-row gutter="6" >
            <van-col span="12" v-for="(item,index) in productList" :key="index" >
              <common-product-detail
                @goDetailEmit="detailSkipHandle"
                :isShowShare="item.listed!=1"
                @shareProductEmit="uploadToStoreHandle"
                @otherBtnEmit="removePrivateHandle"
                :isShowOtherBtn="item.listed!=1"
                shareText="List"
                otherBtnText="Remove"
                :item="item" :index="index" :shareSize="16" :isShowLike="false" >
                <div slot="price" class="d_flex d_flex_between">
                  <p class="price-normal">
                    <template v-if="item.price">
                      {{item.price / 100 | moneyFormat}}
                    </template>
                  </p>

                </div>
                <van-tag slot="new" size="large" color="#fcc900" v-if="item.listed==1"><span style="font-style: italic">LISTED</span></van-tag>
              </common-product-detail>
            </van-col>
          </van-row>
          <div class="list_bottom" v-show="productList.length>8">
            <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
            <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
          </div>
        </template>

      </template>

    </scroll-view>
    <van-dialog v-model="dialogVisible" class="dialog-content" :show-confirm-button="false" :show-cancel-button="false">

      <common-dialog
        type="info" v-if="dialogType=='choose'"
        :fontSize="15"
        title="Warning"
        @okEmit ="dialogVisible = false"
        intro="Please select at least one shopify shop" />
      <common-dialog
        type="info" v-else-if="dialogType=='delete'"
        :fontSize="15" :hasTwoBtn="true"
        title="Warning"
        @cancelEmit="dialogVisible = false"
        @confirmEmit="confirmDeleteHandle"
        :intro="`Are you sure you want to remove the product?`" />
      <common-dialog v-else-if="dialogType=='removeSuccess'"
                     :type="dialogType=='removeFail'?'error':'success'"
                     :title="dialogType=='removeFail'?'Error':'Success'"
                     :intro="dialogContent"
                     :isFont="false"
                     cancelText="Ok"
                     @okEmit="removeSuccessHandle"
      />
      <common-dialog v-else
                     :type="dialogType=='error'?'error':'success'"
                     :title="dialogType=='error'?'Error':'Success'"
                     :intro="dialogContent"
                     :isFont="false"
                     cancelText="Confirm"
                     @okEmit="dialogVisible = false"
      />
    </van-dialog>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
    <van-dialog v-model="isShowStore" title="Please select the shopify shop" :show-cancel-button="false" :show-confirm-button="false">
      <div class="choose-store-content">
        <div class="choose-store-list">
          <van-checkbox-group v-model="storeResult">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in storeList"
                clickable
                :key="index"
                :title="item['shopurl']"

              >
                <template #right-icon>
                  <van-checkbox :name="item.id" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
        <div class="choose-store-footer">
          <van-button size="small" type="default" plain @click="chooseOperateHandle('cancel')">Cancel</van-button>
          <van-button size="small" type="primary" @click="chooseOperateHandle('confirm')">Confirm</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import CommonProductDetail from '@/components/common/CommonProductDetail'
  import ScrollView from "@/components/common/ScrollView";
  import CommonDialog from '@/components/common/CommonDialog'
  import {shopifyPrivateListApi,shopifyPrivateRemoveApi,shopifyPrivateShareToStoreApi,shopifyStoreCountApi,getShopifyStoreListApi} from '@/api/shopify'

  export default {
    name: "index",
    components:{
      CommonProductDetail,
      ScrollView,
      CommonDialog
    },
    props:{
      categoryid:String | Number,
      categoryRank:String | Number,
      searchValue:String

    },
    data(){
      return{
        isWaiting:false,
        page:1,
        productList:[],
        isLoading:false,
        status:1,
        storeCount:0,
        storeID:'',
        dialogVisible:false,
        dialogType:'',
        dialogContent:'',
        isShowStore:false,//多个store会显示
        storePage:1,
        storeList:[],
        storeResult:[],
        chooseProductID:''
      }
    },
    watch:{
      searchValue:{
        deep:true,
        immediate:true,
        handler(newValue){
          this.getShopifyListHandle()
        }

      },
      categoryid:{
        deep:true,
        immediate:true,
        handler(newValue){
          this.getShopifyListHandle()
        }
      }
    },
    methods:{
      chooseOperateHandle(type){
        if(type=='cancel'){
          this.isShowStore = false;
        }else if(type=='confirm'){
          if(this.storeResult.length==0){
            this.dialogType = 'choose';
            this.dialogVisible = true;
          }else{
            this.storeID = this.storeResult.join(',');
            this.isShowStore = false;
            this.saveHandle()
          }
        }
      },
      saveHandle(){
        this.isWaiting = true;
        shopifyPrivateShareToStoreApi(this.chooseProductID,this.storeID).then(res=>{
          this.isWaiting = false;
          if(res.status==0){
            this.dialogVisible = true;
            this.dialogType ='success';
            this.dialogContent = 'Success';
            this.dialogContent='The product has been successfully listed in your store.'
          }else{
            this.dialogVisible = true;
            this.dialogType ='error';
            this.dialogContent = res.message;
          }
          this.page =1;
          this.getShopifyListHandle()
        })
      },
      removeSuccessHandle(){
        this.dialogType = '';
        this.dialogVisible = false;
        this.page = 1;
        this.getShopifyListHandle()
      },
      confirmDeleteHandle(){
        this.dialogVisible  = false;
        this.dialogType = '';
        this.isWaiting = true;
        shopifyPrivateRemoveApi(this.chooseProductID).then(res=>{
          console.log(res);
          this.isWaiting = false;
          this.dialogVisible = true;
          if(res.status==0){
            this.dialogType='removeSuccess';
            this.dialogContent = 'remove Success'
          }else{
            this.dialogVisible = true;
            this.dialogType='removeFail'
            this.dialogContent = res.message
          }
        })
      },
      //删除操作
      removePrivateHandle(item){
        this.dialogVisible = true;
        this.dialogType = 'delete'
        this.chooseProductID = item.platformproductid;
      },
      //上架操作
      uploadToStoreHandle(result){
        this.chooseProductID = result.platformproductid;
        if(this.storeCount==1){
          this.saveHandle()
        }else{
          //选择商店
          this.getStoreListHandle('all')
        }
      },
      //查看详情
      detailSkipHandle(item,index){
        this.$router.push(`/search?sf=1&productid=${item.platformproductid}`)
      },
      getShopifyListHandle(){
        this.isLoading = true;
        shopifyPrivateListApi({
          name:this.searchValue,
          page:this.page,
          categoryid:this.categoryid,
          rank:this.categoryRank
        }).then(res=>{
          this.productList= res ||[];
          this.isLoading = false;
        })
      },
      //获取商店数量
      getShopifyStoreCountHandle(){
        shopifyStoreCountApi().then(res=>{
          if(res.status==0){
            this.storeCount = res.data;
            if(this.storeCount ==1){
              this.getStoreListHandle('only')
            }
          }
        })
      },
      //获取商品列表
      getStoreListHandle(type){
        switch (type) {
          case 'only':
            this.storePage=1;
            getShopifyStoreListApi(this.storePage).then(res=>{
              if(res && res.length){
                this.storeID = res[0].id;
              }
            })
            break;
          case 'all':
            this.isShowStore = true;
            getShopifyStoreListApi(this.storePage).then(res=>{
              if(res && res.length){
                this.storeList = res;
              }
            })
            break;
        }

      },
      loadMoreHandle(){
        this.page++;
        shopifyPrivateListApi({
          name:this.searchValue,
          page:this.page,
          categoryid:this.categoryid,
          rank:this.categoryRank
        }).then(res=>{
          if(!res || res.length==0){this.status = this.$config.loadingType.FINISHED;return}
          this.productList=[...this.productList,...res];

        })
      }
    },
    mounted() {
      this.getShopifyListHandle();
      this.getShopifyStoreCountHandle()
    }
  }
</script>

<style scoped lang="less">
  .shopifyScrollView{
    height:calc(100vh - 85px);
    background-color: #EEEEED;
  }
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .choose-store-content{
    .choose-store-list{
      max-height:50vh;
      padding:5px;
    }
    .choose-store-footer{
      padding:8px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      /*border-top:1px solid #EEEEED;*/
      /deep/.van-button{
        border-radius: 6px;
        font-size:16px;
      }
    }
  }
</style>
