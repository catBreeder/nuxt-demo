<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle" @click-right="addHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="navbar-title">Address</div>
       </template>
       <template #right>
         <div class="d_flex color_blue navbar-right">Add</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="orderAddressScroll" @reachBottom="loadMoreHandle">
     <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
     <template v-else>
       <div class="order-address-content" v-if="addressList.length">
         <van-radio-group v-model="addressIndex">
           <div class="address-item g_mb_l" v-for="(item,index) in addressList" :key="index">
             <div class="address-item-top d_flex">
               <div class="item-img" v-if="item.country">
                 <img :src="item.country.image" alt="">
               </div>
               <div class="item-info">
                 <div class="d_flex d_flex_between">
                   <div class="item-name">{{item.country.name}}<van-tag
                     v-if="item.def==1" class="g_ml_m"
                     type="warning" round>Default</van-tag></div>
                   <van-icon name="delete-o" size="16" color="#f00"
                             @click="chooseItemHandle(item,'delete')" class="g_mr_l"/>
                 </div>
                 <div class="color_blue font_size_12 g_mt_s g_mb_s">{{item.customername}}</div>
                 <div class="item-user d_flex g_mb_m">
                   <div class="g_mr_l">{{item.receiver }}</div>
                   <div>{{item.receivetelephone  }}</div>
                 </div>
                 <div class="item-address g_mt_m">Address:{{item.address}} {{item.address2}}</div>
               </div>
             </div>
             <div class="address-item-bottom d_flex d_flex_between">
               <div v-if="item.select==0">
                 <van-radio :disabled="item.select==1"  :name="item.id" @click="chooseItemHandle(item,'choose')" />
               </div>
               <div v-else class="color_warning">
                 Incomplete information, need to be supplemented
               </div>
               <div class="d_flex">
                 <div class="d_flex   edit-tag" @click="chooseItemHandle(item,'edit')" ><van-icon name="edit" color="#3597FF"/>Edit</div>
               </div>
             </div>
           </div>
         </van-radio-group>
       </div>
       <van-empty  v-else description="No Date at Present..." >
         <img src="~assets/images/common/empty.png" alt="" slot="image">
       </van-empty>
     </template>
   </scroll-view>
   <van-dialog v-model="isVisible">
     <common-dialog  :isShowImg="false" :hasTwoBtn="true" v-if="dialogType=='confirm'"
                     title="Are you sure Delete?"
                     cancelText="No"
                     confirmText="Yes"
                     confirmBg="#fcc900"
                     confirmBorder="#fcc900"
                     @cancelEmit="isVisible = false" @confirmEmit="confirmDeleteHandle"/>
       <common-dialog type="error" v-else-if="dialogType=='intro'"
                    okText="OK"
                      title="Error"
                    @okEmit="isVisible = false"
                    :intro="introMsg"/>
   </van-dialog>
   <van-overlay :show="isWaiting" >
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="45" />
     </div>
   </van-overlay>
 </div>
</template>
<script>

import {clientAddressListApi ,clientAddressDelApi} from '@/api/client'
import {shopOrderUpdateOrderApi} from '@/api/orders'
import ScrollView from "@/components/common/ScrollView";
import CommonDialog from '@/components/common/CommonDialog'
import {setOrderShipAddressID} from '@/utils/memory'
 export default {
   head(){
     return {
       title:'Purchase Order - shopshipshake'
     }
   },
    computed:{
      //从那个页面来的标志
      fromType(){return this.$route.query.type},
      shoporderid(){return this.$route.query.shoporder}
    },
   data(){
      return{
        addressIndex:'',
        addressList:[],
        page:1,
        pageCount:0,
        isLoading:false,
        isVisible:false,
        selectItem:{},
        dialogType:'',
        introMsg:'',
        isWaiting:false,
      }
   },
   components:{ScrollView ,CommonDialog},
    methods:{
      chooseItemHandle(item,type){
          this.selectItem = item;
          switch (type) {
              case 'delete':
                this.isVisible = true;
                this.dialogType = 'confirm';
                break;
              case 'edit':
                this.$router.push(`/client/2/edit?id=${item.id}`)
                break;
              case 'choose':
                //选择地址
                if(item.select ==1) return;
                this.isWaiting = true;
                if(this.fromType=='orderDetail'){
                  shopOrderUpdateOrderApi({
                    id:this.shoporderid,
                    key:'receivedid',
                    value:item.id
                  }).then(res=>{
                    this.$router.back()
                    this.$toast({message:'Change Success !'})
                    this.isWaiting = false;
                  })
                }else if(this.fromType=='orderShip'){
                  //跳到toShip页面
                    switch (this.$route.query.orderType) {
                        case 'ship':
                          this.$router.push({
                            path:'/deliveryorder/2/index',
                            query:{
                              ids:this.$route.query.shopIds,
                              receiverid:item.id
                            }
                          })
                          break;
                         case 'combine':
                           this.$router.push({
                             name:'deliveryCombine',
                             query:{
                               ids:this.$route.query.shopIds,
                               receiverid:item.id
                             }
                           })
                           break;
                    }
                }else{
                  setOrderShipAddressID(item.id);
                  this.$router.back();
                  this.isWaiting = false;
                }

                break;
          }
      },
      //添加地址
      addHandle(){
        this.$router.push(`/client/2/edit?id=0`)
      },
      //删除地址
      confirmDeleteHandle(){
        clientAddressDelApi(this.selectItem.id).then(res=>{
          this.isVisible = false;
          if(res.status==400){
            this.isVisible = true;
            this.dialogType = 'intro';
            this.introMsg = res.message;
          }else if(res.status==0){
            this.getAddressList()
          }
        })
      },
      //加载更多
      loadMoreHandle(){
          if(this.page <=this.pageCount){
            this.page++;
            clientAddressListApi({
              page:this.page
            }).then(res=>{
              this.addressList =[...this.addressList,...res.datas ];
            })
          }
      },
        goBackHandle(){
          this.$router.back()
        },
      getAddressList(){
          this.isLoading = true;
          clientAddressListApi({
            page:this.page
          }).then(res=>{
            this.pageCount = res.pageCount;
            this.addressList = res.datas || [];
            if(this.addressList.find(item=>item.def==1)){
              this.addressIndex =this.addressList.find(item=>item.def==1).id
            }
            setTimeout(()=>{
              this.isLoading = false;
            },this.$config.duringWait)
          })
      },
    },

    mounted(){
        /*
        * 会返回3个值：type(从那个页面来的) shoporderid(如果是订单详情，会有shoporderid) receiveid(如果是订单详情，会有receiveid)
        * */
        this.getAddressList()
    }

 }
</script>

<style scoped lang="less">
  /deep/.van-radio__icon--checked .van-icon{
    background-color: #fcc900;
    border-color: #fcc900;
  }
  /deep/.van-dialog__footer{
    display: none ;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
.navbar-right{font-size:18px;}
  .orderAddressScroll{
    height:calc(100vh - 50PX - 49PX);
    background-color:#efeff4 ;
  }
  .order-address-content{
    margin:15px 10px;
    .address-item{
      background-color: #fff;
      border-radius: 6px;
      padding:10px 8px;
      .address-item-top{
        padding-bottom:10px;
        border-bottom:1px dashed #EEEEED;
      }
      .item-img{
        width:64px;
        height:64px;
        border:1px solid lightgrey;
        img{
          width:100%;
          height:auto;
        }
      }
      .item-info{
        flex:1;
        padding-left:15px;
        .item-name{font-size:16px;}
        .item-user{font-size:14px;margin:4px 0;}
        .item-address{font-size:13px;word-break: break-all}
      }
      .delete-tag{
        font-size:15px;
        color:#f00;
      }
      .address-item-bottom{
        padding:8px;
        .edit-tag{
          font-size:15px;
          color:#3597FF;
          margin-right: 20px;
        }

      }
    }
  }
</style>
