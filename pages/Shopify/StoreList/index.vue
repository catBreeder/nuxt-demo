<template>
  <div>
    <scroll-view class="shopifyScrollView">
      <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
      <template v-else>
        <div class="create-content">
          <van-tag size="large" @click="createStoreHandle">Add Store</van-tag>
        </div>
        <div class="store-list-content " v-if="storeList.length">
          <div class="store-item-card" v-for="(item,index) in storeList" :key="index">
            <div class="store-name d_flex d_flex_between">
              <div class="d_flex">
                <div class="store-img">
                  <img src="~assets/images/shopify/icon-shopify.svg" alt="">
                </div>
                {{item.name}}
              </div>
              <van-tag class="bg_active" size="large" @click="deleteHandle(item.id)">Delete</van-tag>
            </div>
            <div class="store-url"><a :href="item.shopUrl">{{item.shopUrl}}</a></div>
          </div>
        </div>
        <van-empty description="No data at present....."  v-else>
          <img src="~assets/images/common/empty.png" alt="" slot="image">
        </van-empty>
      </template>

    </scroll-view>
    <van-dialog v-model="dialogVisible" class="dialog-content" :show-confirm-button="false" :show-cancel-button="false">
      <common-dialog
        type="info" v-if="dialogType==='delete'"
        :fontSize="15" :hasTwoBtn="true"
        title="Warning"
        @cancelEmit="dialogVisible = false"
        @confirmEmit="confirmDeleteHandle"
        :intro="`Are you sure you want to delete ?`" />
    </van-dialog>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import CommonDialog from '@/components/common/CommonDialog'
  import {getShopifyStoreListApi,shopifyStoreDeleteApi} from '@/api/shopify'

    export default {
        name: "index",
      components:{
        ScrollView,CommonDialog
      },
      data(){
          return{
            storeList:[],
            page:1,
            isLoading:false,
            dialogVisible:false,
            deleteID:'',
            dialogType:'',
            isWaiting:false
          }
      },
      methods:{
        createStoreHandle(){
          if(process.browser){
            window.open('https://apps.shopify.com/shopshipshake')
          }

        },
          getStoreListHandle(){
            this.isLoading = true;
            getShopifyStoreListApi(this.page).then(res=>{
              if(res){
                res = res.map(item=>{
                  item.shopUrl = `https://${item.shopurl}.myshopify.com`;
                  return item;
                })

              }
              this.storeList =res || [];
              this.isLoading = false;
            })
          },
          deleteHandle(id){
            this.dialogVisible= true;
            this.dialogType = 'delete';
            this.deleteID= id;
          },
          confirmDeleteHandle(){
            this.dialogVisible = false;
            this.isWaiting= true;
            shopifyStoreDeleteApi(this.deleteID).then(res=>{
              this.isWaiting= false;
              if(res.status==0){

                this.$toast({message:'Delete Success!'});
                this.page=1;
                this.getStoreListHandle()
              }else{
                this.$toast({message:res.message})
              }
            })
          }
      },
      mounted() {
          this.getStoreListHandle()
      }
    }
</script>

<style scoped lang="less">
  .shopifyScrollView{
    height:calc(100vh - 85px);
    background-color: #fff;
  }
  .store-list-content,.create-content{
    margin:15px 10px;
  }
  .create-content{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .store-item-card{
    padding:10px ;
    border-radius: 4px;
    border:1px solid #EEEEED;
    margin-bottom: 10px;
    .store-name{
      font-size:16px;
      margin-bottom: 8px;
      .store-img{
        width:28px;
        height:28px;
        margin-right: 10px;
      }
    }
    .store-url{
      font-size:15px;
      a{
        color:dodgerblue;
        text-decoration: underline;
      }
    }

  }
  /deep/.van-tag--default{
    background-color: #FCC900;
    color:#2a2a2a;
  }
</style>
