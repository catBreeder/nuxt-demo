<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left" size="24" color="#8B8989"/>
       </template>
       <template #title><div class="navbar-title">Package</div></template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="combineScroll">
     <template v-if="isRemoved">
       <div class="remove_content d_flex d_flex_center">
         <div class="remove-box"><img src="~assets/images/common/error-cart.png" alt=""></div>
         <div class="g_mb_l g_mt_l remove-intro">The product have been removed or expired</div>
         <div  class="color_active  look_link" @click="findHandle">Looking for other products</div>
       </div>
     </template>
     <template v-else>
       <van-loading type="spinner" color="#fcc900" size="45px" v-if="isLoading"/>
       <div class="order_combine_content" v-else>
         <!--       地址-->
         <div class="order-ship-info-box order-ship-box-common">
           <van-row type="flex" align="center">
             <van-col span="5">
               <div class="info-box-img">
                 <img :src="country.image" alt="">
               </div>
             </van-col>
             <van-col span="19">
               <div class="info-box-center">
                 <div class="box-name d_flex d_flex_between">
                   {{country.name}}
                 </div>
                 <div><span class="g_mr_l"> {{receiver.receiver }} </span><span>{{receiver.receivetelephone }}</span> </div>
                 <div class="color_intro van-multi-ellipsis--l3">Address :{{receiver.address }} {{receiver.address2}}</div>
               </div>
             </van-col>
           </van-row>
         </div>
         <!--        商品信息 start-->
         <div class="order-ship-good-info ">
           <div v-for="(product,index) in shoporders" :key="product.id">
             <van-notice-bar class="b_border"

                             :scrollable="false" color="#2A2A2A" background="#fff" >
               <template #right-icon>
                 <van-icon  @click="showDetailListHandle(product.id)" :name="product.isOpen?'arrow-up':'arrow-down'" />
               </template>
               <div class="navbar-good-info d_flex">
                 <van-icon name="delete-o" size="16" class="g_mr_m" color="#f00"  @click="deleteItemHandle(product)"/>
                 <span class="g_mr-s">No.{{index+1}}</span>
                 <span class="g_mr_l">{{product.waybillno }}</span>
                 <span class="g_mr_l">{{product.weight }}Kg</span>
                 <span >{{product.length }}CM*{{product.width}}CM*{{product.height}}CM</span>
               </div>
             </van-notice-bar>
             <div v-if="product.isOpen">
               <product-ship-card
                 v-for="(detail,detailIndex) in details[product.id]"
                 :key="detailIndex"
                 :product="detail"
                 :order="product">
                 <div slot="thumb">
                   <template v-if="detail.images">
                     <img :src="detail.images" alt="" >
                   </template>
                   <template v-else>
                     <img  :src="orderImg" alt="">
                   </template>
                 </div>
                 <strong slot="origin" class="product-price" v-if="detail.priceold >0">
                   <del class="del-price">R{{detail.productoldcostzar}}</del>
                 </strong>
                 <div slot="count">X{{detail.qty}}</div>
               </product-ship-card>
             </div>


           </div>

         </div>
         <!--        商品信息 end-->
         <div class="order-info-limit order-ship-box-common">
<!--           <p>Lower limit is <span class="limit-big">{{maxInfo.minvolume}}</span> cubic meters</p>-->
           <div>
             <span v-if="Number(maxInfo.minvolume)>0">Lower limit is <span class="limit-big">{{maxInfo.minvolume}}</span> cubic meters</span>
             <span v-if="Number(maxInfo.minvolume)>0 && Number(maxInfo.minweight)>0">and</span>
             <span v-if="Number(maxInfo.minweight)>0">the actual weight cannot under <span class="limit-big">{{maxInfo.minweight}}</span> kg.</span>
           </div>
           <div>
             <span v-if="Number(maxInfo.maxvolume)>0">Upper limit is <span class="limit-big">{{maxInfo.maxvolume}}</span> cubic meters</span>
             <span v-if="Number(maxInfo.maxvolume)>0 && Number(maxInfo.maxweight)>0">and</span>
             <span v-if="Number(maxInfo.maxweight)>0">the actual weight cannot over <span class="limit-big">{{maxInfo.maxweight}}</span> kg.</span>
           </div>
         </div>
         <div class="order-info-weight order-ship-box-common">
           <div class="d_flex d_flex_between g_mb_m">
             <div>Volume</div>
             <div class="color_warning " :class="{
             'color_normal':volumeLimit
           }">{{Number(totalVolume).toFixed(2)}} m³</div>
           </div>
           <div class="d_flex d_flex_between">
             <div>Weight</div>
             <div class="color_warning" :class="{
             'color_normal':weightLimit
           }">{{Number(totalWeight).toFixed(3)}}kg</div>
           </div>
         </div>
       </div>
     </template>

   </scroll-view>
   <div class="operate-btn-area">
     <van-button block class="combine_btn" @click="combineHandle">CONFIRM</van-button>
   </div>
   <van-dialog v-model="isVisible" class="dialog-content">
     <common-dialog v-if="visibleType=='delete'"
       type="info"
       :fontSize="15" :hasTwoBtn="true"
       title="Warning"
       @cancelEmit="isVisible = false"
       @confirmEmit="confirmDeleteHandle"
       :intro="`Are you sure  delete ?`" />
     <common-dialog v-else
                    type="error"
                    :fontSize="15"
                    title="Error"
                    okText="Confirm"
                    @okEmit="isVisible = false"
                    :intro="errorMsg" />
   </van-dialog>
   <van-overlay :show="isShow">
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="30"/>
     </div>
   </van-overlay>
 </div>
</template>
<script>
  import ProductShipCard from '../childComponents/ProductShipCard'
  import {setCombineList,getCombineList ,removeCombineList} from '@/utils/memory'
import ScrollView from "@/components/common/ScrollView";
import {deliveryorderCombineApi ,deliveryorderSaveApi} from '@/api/orders'
  import CommonDialog from '@/components/common/CommonDialog'
 export default {
   head(){
     return {
       title:'Orders Combine - shopshipshake'
     }
   },
    computed:{
      totalVolume(){
        return this.shoporders.reduce((pre,cur)=>{
          return pre + (cur.length * cur.width * cur.height)/1000000
        },0)

      },
      totalWeight(){
        return this.shoporders.reduce((pre,cur)=>{
          return pre + (cur.weight)
        },0)
      },
      volumeLimit(){
        return parseInt( Number(this.totalVolume)*100) >= parseInt(Number(this.maxInfo.minvolume)*100) &&
          parseInt( Number(this.totalVolume)*100) <= parseInt(Number(this.maxInfo.maxvolume)*100)
      },
      weightLimit(){
        return parseInt(Number(this.totalWeight*100))  <= parseInt(Number(this.maxInfo.maxweight)*100) &&
          parseInt(Number(this.totalWeight*100))  >= parseInt(Number(this.maxInfo.minweight)*100)
      }},
   data(){
      return{
        isVisible:false,
        visibleType:'',
        errorMsg:'',
        isLoading:false,
        country:{},
        receiver:{},
        shoporders:[],
        details:{},
        receiverid: "",
        balance:'',
        supplierModeVos:{},
        maxInfo:{
          maxvolume:0,
          maxweight: 0,
          minvolume: 0,
          minweight:0
        },
        selectItem:{},
        isShow:false,
        isRemoved:false
      }
   },
   components:{ScrollView,ProductShipCard ,CommonDialog},
    methods:{
      findHandle(){
        this.$router.replace('/')
      },
      //合并
      combineHandle(){
         let finalVolume = parseInt( Number(this.totalVolume)*100);
         let finalWeight = parseInt(Number(this.totalWeight*100));
        let canship =
          (finalVolume >= parseInt(Number(this.maxInfo.minvolume)*100)&&
            finalVolume <= parseInt(Number(this.maxInfo.maxvolume)*100))  ||
          (finalWeight >= parseInt(Number(this.maxInfo.minweight)*100)&&
            finalWeight <= parseInt(Number(this.maxInfo.maxweight)*100));
        if(!canship){
          return this.$toast({message:'Weight or volume not in accordance with combine rules'})
        }
        // if(!this.receiverid){
        //   return this.$toast({message:'Please set the address!'})
        // }
        let valueID = this.shoporders.map(item=>item.id);
        if(valueID.length==0){
          return this.$toast({message:'No order can be combined'})
        }
        this.supplierModeVos={
          ...this.supplierModeVos,
          ...{
            ordertype:10,
            ids:valueID?valueID.join(','):'',
            receivedid:this.receiver.id,
            bigcustomerdeclarednamemap:{}
          }
        }
        this.isShow = true;
        deliveryorderSaveApi(this.supplierModeVos).then(res=>{
          if(res.status==0){
            this.$toast({message:'Order combine success !'})
            this.$router.replace('/shoporder/2/index?tagIndex=transit')
            this.isShow = false;
          }else{
            this.isShow = false;
            this.isVisible = true;
            this.visibleType = 'error'
            this.errorMsg = res.message;
          }
        })
      },
      //点击删除商品
      deleteItemHandle(item){
        this.selectItem = item;
        this.isVisible = true;
        this.visibleType = 'delete'
      },
      //确定删除
      confirmDeleteHandle(){
        this.shoporders = this.shoporders.filter(item=>item.shopexpressdetailid !=this.selectItem.shopexpressdetailid);
        this.isVisible = false;
        setCombineList(this.shoporders);//保存起来
      },
      //点击查看商品列表
      showDetailListHandle(id){
        this.shoporders = this.shoporders.map(item=>{
          if(item.id == id){
            item.isOpen = !item.isOpen;
          }
          return item;
        })
      },
      goBackHandle(){
        this.$router.back()
      },
      //修改地址
      changeAddressHandle(){
        this.$router.push({
          path:'/client/2/index',
          query:{
            type:'combine',
            receiverid:this.$route.query.receiverid,
          }
        })
      },
      getCombineInfo(){
        this.isLoading = true;
        deliveryorderCombineApi({
          ids:this.$route.query.ids,
          // receiverid:this.receiverid
          isocean:this.$route.query.isOcean
        }).then(res=>{
          if(res.status==0){
            const { details ,country ,receiver ,shoporders ,balance,vo,maxvolume,maxweight,minvolume,minweight,isocean} = res.data;
            let index = -1*isocean;
            if(getCombineList()){
              this.shoporders=getCombineList()
            }else{
              this.shoporders = shoporders.map(item=>{
                item.isOpen =false;
                return item;
              });
            }
            setCombineList(this.shoporders)
            this.details = details;
            this.country =country;
            this.receiver = receiver;
            this.balance = balance;
            this.maxInfo.maxvolume = maxvolume?maxvolume:0;
            this.maxInfo.maxweight = maxweight?maxweight:0;
            this.maxInfo.minvolume = minvolume?minvolume:0;
            this.maxInfo.minweight = minweight?minweight : 0;
            let supplierMode = vo.supplierModeVos[-1] ||[];
            this.supplierModeVos = supplierMode.find(item=>item.servicepriceid==index);
            this.isLoading = false;
          }else{
            this.isLoading = false;
            this.isRemoved= true;
          }
          // removeOrderShipAddressID();

        })
      }
    },
   beforeRouteEnter(to,from,next){
     if(from.path=='/shoporder/2/index'){
       removeCombineList()
     }
     next()
   },
    mounted(){
        // this.receiverid = getOrderShipAddressID()?getOrderShipAddressID():this.$route.query.receiverid; 用于地址可以修改的情况
        // this.receiverid = this.$route.query.receiverid;
        this.getCombineInfo()
    }

 }
</script>

<style scoped lang="less">
  .remove_content{
    margin:90px auto;
    flex-direction: column;
    .remove-box{
      width:90px;
      height:90px;
      img{
        max-width: 100%;
        height:auto;
      }
    }
    .look_link{
      border-bottom:1px solid #fcc900;
      font-size:18px;
    }
    .remove-intro{
      font-size:16px;
      margin:30px 0;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/.van-dialog__footer{
    display: none;
  }
.order_combine_content{
  margin:4px;
}
.limit-big{
  font-size:17px;
}
.order-ship-box-common{
  padding:10px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}
.order-ship-info-box{
  .info-box-img{
    width:60px;
    height:60px;
    img{
      width:100%;
      height:100%;
    }
  }
  .info-box-center{
    font-size:14px;
    line-height:1.5;
    color:#333;
    .box-name{
      font-size:16px;
    }
  }
  .info-box-right{
    font-size:14px;
  }
}
.order-info-limit{
  margin-top:8px;
  font-size:15px;
  line-height:1.7;
  background:#fff;
  color:orange;

}
.order-info-weight{
  font-size:15px;
  line-height:1.4;
}
/*定位 开始*/
.operate-btn-area{
  position: fixed;
  z-index:1;
  bottom:54px;
  left:10px;
  right:10px;
  .combine_btn{
    background-color: #fcc900;
    color:#FFF;
    font-size:16px;
    border-radius: 6px;
  }
}
/*定位 结束*/
/*  商品信息 start*/
.order-ship-good-info{
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
  /deep/.van-notice-bar__content{
    font-size:12px;
  }
  .del-price{
    font-size:13px;
    font-weight: normal;
  }
  .product-price{
    font-size:16px;
  }
  .product-bottom{
    color:orange;
    padding:8px 20px 8px 0 ;
    border-top:1px solid #EEEEED;
    .product-bottom-count{

      margin:0 6px;
      font-size:15px;
    }
  }
}
/*  商品信息 end*/
  .combineScroll{
    height:calc(100vh - 50PX - 90PX);
    background-color: #EEEEED;
  }
</style>
