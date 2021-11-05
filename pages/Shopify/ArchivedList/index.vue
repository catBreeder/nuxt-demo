<template>
  <scroll-view class="shopifyScrollView">
    <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
    <div class="product-item-card" v-else>
      <div v-if="archivedList.length">
        <div class="item-card" v-for="(item,index) in archivedList" :key="index" >
            <van-row>
              <van-col :span="8">
                <div class="product-img" @click="detailSkipHandle({item,index})">
                  <img :src="item.image" :alt="item.productname" :title="item.productname">
                </div>
              </van-col>
              <van-col :span="16">
                <div class="product-info">
                  <div class="product-name van-multi-ellipsis--l2" @click="detailSkipHandle({item,index})">{{item.productname}}</div>
                  <div class="product-price-content ">
                    <div class="product-price">R {{item.price}}</div>
                  </div>
                  <div class="product-price-content d_flex d_flex_between">
                    <div class="product-count">
                      Orders：<strong class="color_active">{{item.ordercount?item.ordercount:0}}</strong>
                    </div>
                    <div class="product-count">
                      Cart：<strong class="color_active"> {{item.cartCount?item.cartCount:0}}</strong>
                    </div>
                  </div>
                  <div class="product-tag-content">
                    <van-tag color="gray" plain size="large">{{item.shopname}}</van-tag>
                  </div>
                </div>
              </van-col>
            </van-row>
            <div class="item-operate">
              <van-tag size="large" v-if="tabindex==1"  @click="archiveItemHandle(item.id,'Archive')" type="primary">Archive</van-tag>
              <van-tag size="large" v-else-if="tabindex==2"  @click="archiveItemHandle(item.id,'List')" type="primary">List</van-tag>
            </div>
        </div>
      </div>
      <van-empty description="No data at present....."  v-else>
        <img src="~assets/images/common/empty.png" alt="" slot="image">
      </van-empty>
    </div>
    <van-dialog v-model="dialogVisible" class="dialog-content" :show-confirm-button="false" :show-cancel-button="false">
      <common-dialog v-if="visibleType=='confirm'"
        type="info"
        :fontSize="15" :hasTwoBtn="true"
        title="Warning"
        @cancelEmit="dialogVisible = false"
        @confirmEmit="confirmArchiveHandle"
        :intro="`Are you sure you want to archive ?`" />
      <common-dialog
        v-else
        :type="visibleType=='error'?'error':'success'"
                     :title="visibleType=='error'?'Error':'Success'"
                     :intro="dialogContent"
                     :isFont="false"
                     cancelText="Confirm"
                     @okEmit="closeHandle"
      />
    </van-dialog>
    <van-overlay :show="isWaiting" >
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#fcc900" size="45" />
      </div>
    </van-overlay>
  </scroll-view>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {getArchivedListApi,shopifyArchiveApi,shopifyArchiveToListApi} from '@/api/shopify'
  import CommonDialog from '@/components/common/CommonDialog'
    export default {
        name: "index",
      components:{
        ScrollView,
        CommonDialog
      },
      props:{
          searchValue:String,
          tabindex:String | Number
      },
      data(){
          return{
            isLoading:false,
            archivedList:[],
            page:1,
            dialogVisible:false,
            visibleType:'',
            selectID:'',
            isWaiting:false,
            dialogContent:''
          }
      },
      watch:{
        searchValue:{
          deep:true,
          immediate:true,
          handler(newValue){
            this.getArchivedListHandle()

          }
        },
        tabindex:{
          deep:true,
          immediate:true,
          handler(){
            this.getArchivedListHandle()
          }
        }
      },
      methods:{
        //查看详情
        detailSkipHandle(event){
          const {item,index} = event;
          this.$router.push(`/search?sf=1&productid=${item.shopproducid}`)
        },
        closeHandle(){
          this.dialogVisible = false;
          this.page =1;
          this.getArchivedListHandle()
        },
        confirmArchiveHandle(){
          this.dialogVisible = false;
          this.isWaiting = true;

          shopifyArchiveApi(this.selectID).then(res=>{
            this.isWaiting = false;
            if(res.status==0){
              this.dialogVisible = true;
              this.visibleType ='success';
            }else{
              this.dialogVisible = true;
              this.visibleType ='error'
              this.dialogContent=res.message;
            }
          })
        },
        archiveItemHandle(id,type){
          this.selectID= id;
          if(type=='Archive'){

            this.dialogVisible = true;
            this.visibleType= 'confirm'
          }else if(type=='List'){
            this.isWaiting = true;
            shopifyArchiveToListApi(this.selectID).then(res=>{
              if(res.status==0){
                this.isWaiting = false;
                this.getArchivedListHandle()
              }
            })
          }


        },
          getArchivedListHandle(){
            this.isLoading= true;
            getArchivedListApi({
              name:this.searchValue,
              status:this.tabindex==1?0:10,
              page:this.page
            }).then(res=>{
              this.archivedList = res || [];
              this.isLoading = false;
            })
          }
      },
      // mounted() {
      //     this.getArchivedListHandle()
      // }
    }
</script>

<style scoped lang="less">
  .shopifyScrollView{
    height:calc(100vh - 85PX);
    background-color: #fff;
  }
  .product-item-card{
    margin:15px 6px;
  }
  .item-card{
    padding:6px;
    border:1px solid #EEEEED;
    border-radius: 4px;
    margin-bottom: 12px;
    .product-img{
      width: 96px;
      position: relative;
      height: 96px;
      background:#EEEEED;
      .count-tag{
        position: absolute;
        right:0;
        top:0;
        background:#FCC900;
        z-index: 1;
      }
      img{
        width:100%;
        border-radius: 4px ;
        height:100%;
      }
    }
    .product-info{
      .product-name{
        font-size: 13px;
        line-height: 1.4;
      }
      .product-price-content{
          margin:4px 0;
        .product-price{
          font-size:16px;
          font-weight: bold;
          color:#f00;
        }
        .product-count{
          strong{
            font-size:16px;
          }
        }
      }
    }
    .item-operate{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top:1px solid #EEEEED;
      padding:6px 10px;
      margin-top:8px;
    }
  }
  /deep/ .van-tag--large{
    max-width:120px;
    overflow: hidden;       //这个是设置隐藏的。还有其他的，例如scroll，是超出固定长度，底部显示滚动条的。
    text-overflow: ellipsis;   //这个就是设置直接隐藏掉文字，还是显示...的。当前是显示省略号。直接省略是clip
    display: inline-block;     //根据不同标签display值，有的不用加。
    white-space: nowrap;/**不换行**/
  }
  /deep/.van-tag--primary{
    background-color: #FCC900;
    color:#2a2a2a;
  }
  /deep/.van-tag--round{
    border-radius: 4px;
  }
</style>
