<template>
 <div class="client_wrapper">
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>
         Client Management
       </template>
       <template #right>
         <van-tag size="large" text-color="#fff" color="#ff976a" @click="createClientHandle">Add New</van-tag>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="scrollCommonHeightView" @reachBottom="loadMoreHandle">
     <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
     <template v-else>
       <div class="client_content " v-if="addressList.length">
         <div class="client-list-item font_size_15 g_mb_l" v-for="(item,index) in addressList" :key="index">
           <div class="item-content">
             <div class="item-title d_flex g_mb_m">
               <div class="item-name  font_size_16">{{item.receiver}}&nbsp; /</div>
               <div class="item-tel color_intro font_size_14">{{item.receivetelephone}}
               </div>
             </div>
             <div class="item-detail">
               <span class="color_intro">suburb/postcode :</span>&nbsp;
               <span>{{item.receivepostcode}} / {{item.receivesuburb}}</span>
             </div>
             <div class="item-detail">
               <div class="color_intro">Address :&nbsp;</div>
               <div class="van-multi-ellipsis--l2 item-address">
                 {{item.address}} {{item.address2}}
               </div>
             </div>
           </div>
           <div class="item-bottom d_flex d_flex_between">
             <div>
               <van-tag v-if="item.def==1" color="#fcc900" text-color="#fff" size="large">Default</van-tag>
             </div>
             <div>
               <van-tag type="primary" plain size="large" class="g_mr_l" @click="operateItemHandle(item,'edit')"> <van-icon name="edit" /> Edit</van-tag>
               <van-tag type="danger" plain size="large" @click="operateItemHandle(item,'delete')"> <van-icon name="delete-o" /> Delete</van-tag>
             </div>
           </div>
         </div>
         <div class="list_bottom" v-show="addressList.length>6">
           <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
           <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
         </div>
       </div>
       <van-empty description="No Data are available" v-else>
         <img src="~assets/images/common/empty.png" alt="" slot="image">
       </van-empty>
     </template>

   </scroll-view>
   <van-dialog v-model="isVisible" :show-cancel-button="false" :show-confirm-button="false">
     <common-dialog   :hasTwoBtn="true" v-if="dialogType=='confirm'"
                     title="Are you sure Delete?"
                     cancelText="No"
                     type="info"
                     confirmText="Yes"
                     confirmBg="#fcc900"
                     confirmBorder="#fcc900"
                     @cancelEmit="isVisible = false" @confirmEmit="confirmDeleteHandle"/>
     <common-dialog :isShowImg="false" v-else-if="dialogType=='intro' || dialogType=='success'"
                    okText="OK" @okEmit="hideVisibleHandle"
                    :intro="introMsg"/>
   </van-dialog>

 </div>
</template>
<script>
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
  import {clientAddressListApi ,clientAddressDelApi} from '@/api/client'
  import ScrollView from "@/components/common/ScrollView";
import CommonDialog from '@/components/common/CommonDialog'
  import {setCurrentPage} from "../../../utils/memory";
 export default {
   head(){
     return {
       title:'Customer Management - shopshipshake'
     }
   },
   data(){
      return{
        isVisible:false,
        selectItem:{},
        isLoading:false,
        addressList:[],
        status:1,
        pageCount:1,
        page:1,
        dialogType:'',
        introMsg:''
      }
   },
   beforeRouteLeave(to,from,next){
     loginRegisterPageBury({
       p:'clientIndex',
       operate:'close',
       spm:`a0001.clientIndex.close.${getCurrentPageSpmID()}`
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
       p:'clientIndex',
       operate:'page',
       spm:`a0001.clientIndex.page.-1`
     })
     next();
   },
   components:{ScrollView,CommonDialog},
    methods:{
        loadMoreHandle(){
            if(this.page > this.pageCount) {
              this.status = this.$config.loadingType.FINISHED;
              return;
            }
            this.page++;
          clientAddressListApi({
            page:this.page
          }).then(res=>{
              if(res.datas.length==0){
                this.status = this.$config.loadingType.FINISHED;
              }
              this.addressList =[...this.addressList,...res.datas]

          })
        },
      hideVisibleHandle(){
          this.isVisible = false;
          if(this.dialogType=='success'){
            this.page =1;
            this.getAddressList()
          }
      },
        goBackHandle(){
          this.$router.back()
        },
        createClientHandle(){
          this.$router.push(`/client/edit/0`)
        },
      operateItemHandle(item,type){
          this.selectItem = item;
          switch (type) {
            case 'delete':
              this.isVisible = true;
              this.dialogType = 'confirm'
              break;
            case 'edit':
              this.$router.push(`/client/edit/${item.id}`)
              break;
          }
      },
      //删除地址
      confirmDeleteHandle(){
        clientAddressDelApi(this.selectItem.id).then(res=>{
          this.isVisible = false;
           if(res.status==0){
            this.isVisible = true;
            this.dialogType = 'success';
            this.introMsg = 'successfully delete';

          }else{
            this.isVisible = true;
            this.dialogType = 'intro';
            this.introMsg = res.message;
          }
        })
      },
      getAddressList(){
        this.isLoading = true;
        clientAddressListApi({
          page:this.page
        }).then(res=>{
          this.pageCount = res.pageCount;
          this.addressList = res.datas || [];
          this.isLoading = false;
        })
      }
    },

    mounted(){
      this.getAddressList()
    }

 }
</script>

<style scoped lang="less">
  .list_bottom{
    padding-top: 5px;
    /deep/.van-loading{
      margin:10px 0 0;
    }
  }
  .client_wrapper{
    position: relative;
  }
  .client_content{
    padding:10px 4px;
    font-size:14px;
    .client-list-item{
      border-radius: 4px;
      background-color: #fff;
      padding:10px ;
      .item-title{
        font-size:16px;
        margin-right:4px;
        .item-tel{
          padding: 0 6px;
        }
      }
      .item-bottom{
        border-top:1px solid #EEEEED;
        padding:6px 10px 0;
      }
      .item-detail{
        line-height:1.8;
        margin-bottom: 4px;
      }
      .item-address{
        max-width:96%;
        font-size:14px;
      }
    }
  }
</style>
