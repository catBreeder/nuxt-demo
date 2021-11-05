<template>
 <div>
   <van-sticky>
     <van-nav-bar @click-left="goBackHandle">
       <template #left>
         <van-icon name="arrow-left"  size="24" color="#8B8989"/>
       </template>
       <template #title>
         <div class="navbar-title">{{operateID!=0?'Edit':'Add'}} Address</div>
       </template>
     </van-nav-bar>
   </van-sticky>
   <scroll-view class="addressOperateScroll">
      <div class="address-operate-content">
        <div class="form-content">
          <van-notice-bar :scrollable="false" background="#fff" color="#ff7300" wrapable>According to Shipping Laws and Regulations, you must fill the Surname and Forename.According to Shipping Laws and Regulations, you must fill the name.</van-notice-bar>
          <div class="d_flex country_content">
            <div class="b_border g_mr_l">
              <van-field v-model="country"
                         readonly
                         @click="showActionHandle('country')"
                         placeholder="Country"
                         right-icon="arrow" />
            </div>
            <div><van-image width="65" height="65" src="https://static.shopshipshake.com/2020/09/3simgs/3520a6fd99dbddb0d767d781a7c85e86.jpg" alt="" /></div>
          </div>
          <van-field
            :class="{
              'b_border_error':nameError.visible,
              'b_border_normal':!nameError.visible
            }"
            v-model="addressInput.receiver" label-width="3rem"     label="Name" required placeholder="Name"/>
          <div class="error_content" v-if="nameError.visible">{{nameError.msg}}</div>
          <van-field v-model="addressInput.receivetelephone"
                     :class="{
                          'b_border_error':telError.visible,
                          'b_border_normal':!telError.visible
                      }"
                     type="number" label-width="3rem"
                     label="Tel" required placeholder="Tel"/>
          <div class="error_content" v-if="telError.visible">{{telError.msg}}</div>
          <van-field v-model="addressInput.receivepostcode" label-width="3rem"
                     :class="{
                          'b_border_error':postCodeError.visible,
                          'b_border_normal':!postCodeError.visible
                      }"
                     required label="Postal Code"
                     placeholder="Postal Code" right-icon="arrow" readonly  @click="showActionHandle('postal')"/>
          <div class="error_content" v-if="postCodeError.visible">{{postCodeError.msg}}</div>
          <van-field v-model="addressInput.receivesuburb"
                     :class="{
                          'b_border_error':suburbError.visible,
                          'b_border_normal':!suburbError.visible
                      }"
                     label-width="3rem"   readonly  required label="Suburb" placeholder="Suburb" right-icon="arrow"
                     @click="showActionHandle('suburb')"/>
          <div class="error_content" v-if="suburbError.visible">{{suburbError.msg}}</div>
          <van-field v-model="addressInput.address"
                     rows="2"
                     label-width="3rem"
                     type="textarea"
                     maxlength="50"
                     show-word-limit
                     :class="{
                          'b_border_error':addressError.visible,
                          'b_border_normal':!addressError.visible
                      }"
                     required
                     label="Address"
                     placeholder="Street Address" />
          <div class="error_content" v-if="addressError.visible">{{addressError.msg}}</div>
          <van-field
            v-model="addressInput.address2"
            rows="2"
            type="textarea"
            maxlength="50"
            class="b_border_normal"
            label="Address"
            placeholder="Additional address information"
            show-word-limit
          />
          <div class="d_flex d_flex_between set-content">
            <div>Set as Default Address</div>
            <van-switch active-color="#fcc900" inactive-color="#dcdee0" v-model="addressInput.def" size="20" />
          </div>
          <div class="operate-btn-area d_flex d_flex_around">
            <van-button
              v-prevent-re-click
              @click="CancelHandle"
               >Cancel</van-button>
            <van-button
              type="primary"
              v-prevent-re-click

              @click="formValidateHandle"
              >Save Changes</van-button>
          </div>
        </div>

      </div>
   </scroll-view>
   <van-action-sheet v-model="isVisible" :title="actionTitle">
     <div class="content">内容</div>
   </van-action-sheet>
   <van-popup v-model="visible.suburb" round  position="bottom" :style="{ height: '50%' }" >
     <div class="postal-popup-content">
       <div class="postal-popup-search">
         <van-search  shape="round" @input="searchInputSuburbHandle" v-model="searchInput.suburb" placeholder="Suburb" />
       </div>
       <div class="postal-popup-list">
         <template v-if="subrubList.length">
           <scroll-view class="cellScrollHeight" @reachBottom="loadMorePostalHandle">
             <van-cell v-for="(item,index) in subrubList"
                       @click="chooseSuburbItem(item)"
                       :key="index" :title="item.text" />
           </scroll-view>
         </template>
         <van-empty description="No results found" v-else>
           <img src="~assets/images/common/empty.png" alt="" slot="image">
         </van-empty>
       </div>

       <!--          列表数据-->

     </div>
   </van-popup>
   <van-popup v-model="visible.postal" round  position="bottom" :style="{ height: '50%' }" >
     <div class="postal-popup-content">
       <div class="postal-popup-search">
         <van-search  shape="round" @input="searchInputPostalHandle" v-model="searchInput.postal" placeholder="Postal Code" />
       </div>
       <div class="postal-popup-list">
         <template v-if="postalList.length">
           <scroll-view class="cellScrollHeight" @reachBottom="loadMorePostalHandle">
             <van-cell v-for="(item,index) in postalList"
                       @click="choosePostalItem(item)"
                       :key="index" :title="item.text" />
           </scroll-view>
         </template>
         <van-empty description="No results found" v-else>
           <img src="~assets/images/common/empty.png" alt="" slot="image">
         </van-empty>
       </div>

       <!--          列表数据-->

     </div>
   </van-popup>
   <van-popup v-model="visible.country" round position="bottom">
     <van-picker
       title="Choose Country"
       confirm-button-text="Confirm"
       cancel-button-text="Cancel"
       show-toolbar
       :columns="columns"
       @confirm="onConfirm"
     />
   </van-popup>

   <van-overlay :show="isWaiting" >
     <div class="wrapper" @click.stop>
       <van-loading type="spinner" color="#fcc900" size="45" />
     </div>
   </van-overlay>
   <van-dialog v-model="addressVisible" :showConfirmButton="false">
     <common-dialog type="info" v-if="addressType=='close'"
                    title="Notification"
                    :intro="addressIntro"
                    :isFont="false"
                    :isShowImg="false"
                    cancelText="OK"
                    @okEmit="addressVisible = false"
     />
     <common-dialog type="info" v-if="addressType=='confirm'"
                    :hasTwoBtn="true"
                    confirmText="This is a specific physical address"
                    title="Notification"
                    :intro="addressIntro"
                    :btnIsBig="true"
                    :isFont="false"
                    confirmBtnW="'30%'"
                    cancelBtnW="'30%'"
                    :isShowImg="false"
                    cancelText="Close"
                    @cancelEmit="addressVisible = false"
                    @confirmEmit="saveHandle"
     />
   </van-dialog>
 </div>
</template>

<script>
  //
import ScrollView from "@/components/common/ScrollView";
import config from '@/config'
  import {clientAddressEditApi ,clientAddressEditInfoApi } from '@/api/client'
  import { searchPostcodeApi  } from '@/api/help';
import {receiverValidate} from '@/utils/validate'
import CommonDialog from '@/components/common/CommonDialog'
 export default {
   head(){
     return {
       title:'Purchase Order - shopshipshake'
     }
   },
    computed:{
      operateID(){return this.$route.query.id},
      actionTitle(){
        switch (this.selectType) {
            case 'country': return 'Choose Country'
        }
      },
      country(){
        return config.countryCodeZn[1]
      },
      columns(){
        let arr=[];
        for(let k in config.countryCodeZn){
          arr=[...arr,config.countryCodeZn[k]]
        }
        return arr;
      }
    },
   data(){
      return{
        addressInput:{
          countryid:1,
          receiver:'',
          receivepostcode:'',
          receivesuburb:'',
          receivecompany:'',
          receivetelephone:'',
          receiveemail:'',
          address:'',
          address2:'',
          def:false,
          id:'',
          customername:''
        },
        isVisible:false,//是否显示面板
        selectType:'',
        searchKey:{
          postal:'',
          suburb:'',
        },
        visible:{
          postal:false,
          suburb:false,
          country:false,
        },
        postalPage:1,
        suburbPage:1,
        searchInput:{
          postal:'',
          suburb:'',
        },
        postalList:[],
        subrubList:[],
        isWaiting:false,
        addressVisible:false,
        addressType:'',
        addressIntro:'',
        nameError:{visible: false, msg:''},
        telError:{visible: false, msg:''},
        postCodeError:{visible: false, msg:''},
        suburbError:{visible: false, msg:''},
        addressError:{visible: false, msg:''}
      }
   },
   components:{ScrollView,CommonDialog},
    methods:{

      onConfirm(event){
        if(event){
          this.addressInput.country = event;
          this.addressInput.countryid = this.$config.countryCode[event];
          this.visible.country = false;
        }
      },
      CancelHandle(){
        this.$router.back()
      },
      clearHandle(){
        this.nameError ={visible: false,msg: ''};
        this.telError ={visible: false,msg: ''};
        this.postCodeError ={visible: false,msg: ''};
        this.suburbError ={visible: false,msg: ''};
        this.addressError ={visible: false,msg: ''};
      },
      formValidateHandle(){
        this.clearHandle()
        if(!this.addressInput.receiver){
         this.nameError={
           msg:'According to the Shipping Laws, you must fill the Surname and Forename.',
           visible: true
         }
          return false;
        }
        if(!receiverValidate(this.addressInput.receiver)){
          this.nameError={
            msg:'Only spaces and English letters are allowed!',
            visible: true
          }
          return false
        }
        if(!this.addressInput.receivetelephone){
          this.telError={
            visible: true,
            msg: 'Tel is require!'
          }
          return false;
        }
        if(!this.addressInput.receivepostcode){
          this.postCodeError={
            visible: true,
            msg:'Postal Code is require!'
          }
          return false;
        }
        if(!this.addressInput.receivesuburb){
          this.suburbError={
            msg: 'Suburb is require!',
            visible: true
          }
          return false;
        }
        if(!this.addressInput.address){
          this.addressError={
            visible: true,
            msg: 'Address is require!'
          }
          return false;
        }
        if(!(/^((?!plaas|plot|po box|posbus|private bag|privaat sak|box).)*$/i.test(this.addressInput.address))){
          this.addressVisible= true;
          this.addressType='close';
          this.addressIntro= `Please fill in your specific physical address (street name & building number, suburb and building number if applicable), any one of the addresses provided are <span style='color:red;'>undeliverable: Plaas/Plot/Farm/PO box/Posbus/Private Bag/Privaat sak/Box</span>`
          return false
        }
        if(!(/^((?!farm).)*$/i.test(this.addressInput.address))){
          this.addressVisible= true;
          this.addressType='confirm';
          this.addressIntro =`Please fill in your specific physical address (street name & building number, suburb and building number if applicable), any one of the addresses provided are <span style='color:red;'>undeliverable: Plaas/Plot/Farm/PO box/Posbus/Private Bag/Privaat sak/Box</span>`
          return false
        }
        this.saveHandle()
      },
      saveHandle(){
        this.isWaiting = true;
        clientAddressEditApi({
          ...this.addressInput,
          ...{def:this.addressInput.def?1:0}
        }).then(res=>{
          if(res.status==200){
            if(res.data.status==0){
              if(this.$route.query.type=='orderShip'){
                switch (this.$route.query.orderType) {
                  case 'ship':
                    this.$router.push({
                      path:'/deliveryorder/2/index',
                      query:{
                        ids:this.$route.query.shopIds,
                        receiverid:this.$route.query.id
                      }
                    })
                    break;
                    case 'combine':
                      this.$router.push({
                        name:'deliveryCombine',
                        query:{
                          ids:this.$route.query.shopIds,
                          receiverid:this.$route.query.id
                        }
                      })
                      break;
                }
              }else{
                this.$router.back()
                this.$toast({message:this.$route.query.id>0?'Edit Success !':'Add Success'})
                this.isWaiting = false;
              }
            }else{
              this.isWaiting = false;
              this.$toast({message:res.data.message});

            }
          }
        })


      },
      getEditInfo(id){
        clientAddressEditInfoApi(id).then(res=>{
          this.addressInput={
            countryid:1,
            receiver:res.receiver.receiver,
            receivepostcode:res.receiver.receivepostcode,
            receivesuburb:res.receiver.receivesuburb,
            receivecompany:res.receiver.receivecompany,
            receivetelephone:res.receiver.receivetelephone,
            receiveemail:res.receiver.receiveemail,
            address:res.receiver.address,
            address2:res.receiver.address2,
            def:res.receiver.def==1,
            id:this.$route.query.id,
            customername:''
          }
        })
      },
      //显示postallist
      chooseSuburbItem(item){
        let value = item.text.split(',');
        this.addressInput.receivepostcode = value[1];
        this.addressInput.receivesuburb = value[2];
        this.visible.suburb = false;
      },
      choosePostalItem(item){
        let value = item.text.split(',');
        this.addressInput.receivepostcode = item.id;
        this.addressInput.receivesuburb = value[1];
        this.visible.postal = false;

      },
      loadMorePostalHandle(){
        this.postalPage++;
        searchPostcodeApi({
          search:this.searchInput.postal,
          type:'postcode',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = [...this.postalList,...res.list];
        })
      },
      loadMoreSuburbHandle(){
        this.suburbPage++;
        searchPostcodeApi({
          search:this.searchInput.suburb,
          type:'suburb',
          page:this.suburbPage,
        }).then(res=>{
          this.subrubList =[...this.subrubList,... res.list];
        })

      },
      getPostalList(){
        searchPostcodeApi({
          search:this.searchInput.postal,
          type:'postcode',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = res.list;
        })
      },
      getSurburbList(){
        searchPostcodeApi({
          search:this.searchInput.suburb,
          type:'suburb',
          page:this.suburbPage,
        }).then(res=>{
          this.subrubList = res.list;
        })
      },
      searchInputSuburbHandle(){
        this.postalPage =1;
        this.getSurburbList()
      },
      goBackHandle(){
        this.$router.back();
      },
      showActionHandle(type){
          switch (type) {
            case 'country':this.visible.country = true;break;
            case 'postal':
              this.visible.postal = true;
              this.postalPage = 1;
              this.getPostalList()
              break;
            case 'suburb':
              this.visible.suburb = true;
              this.suburbPage =1;
              this.getSurburbList()
              break;

          }

      },
      searchInputPostalHandle(){
        this.postalPage =1;
        this.getPostalList()
      },
    },

    mounted(){
      console.log(this.$route.query);
      //id是收件人id
      if(this.$route.query.id != 0){
          this.getEditInfo(this.$route.query.id)

        }
    }


 }
</script>

<style scoped lang="less">
  .b_border_normal{
    border-bottom:1px solid lightgrey;
  }
  .b_border_error{
    border-bottom:1px solid #f00;
  }
  .error_content{
    color:#f00;
    padding:2px 15px 0;
    font-size:14px;
  }
  /deep/.van-button{
    color:#2A2A2A;
  }
  .set-content{
    padding:10px 15px;
  }
  .country_content{
    padding:0 15px;
  }
  /deep/.van-cell::after{
    border-bottom:0px solid #8B8989;
  }
  /deep/.van-cell{
    margin-bottom: 3px;
  }
  /deep/.van-icon-search{
    display: none;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/.van-switch--on{
    background-color: #fcc900;
  }
  .postal-popup-content{
    padding:0 10px 10px;
    position: relative;
    .postal-popup-search{
      background:#fff;
      padding-top:10px;
      padding-bottom: 8px;
      border-bottom:1px solid #EEEEED;
      position: fixed;
      left:10px;
      right:10px;
      z-index: 10;

    }
    .postal-popup-list{
      padding-top: 50px;
    }
    .cellScrollHeight{
      max-height:340px;
    }
    /deep/.van-empty{
      padding:30px 0;
    }
  }
  .addressOperateScroll{
    height:calc(100vh - 50PX - 46PX);
    background-color: #fff;
  }
  .address-operate-content{
    .form-content{
      padding:10px 15px;
      background-color: #fff;
    }
    .area-right{
      width:64px;
      height:64px;
      img{
        width:100%;
        height:auto;
      }
    }
    .operate-btn-area{
      margin-top: 10px;
      padding:20px;
      .save-btn{
        background-color: #fcc900;

        font-size:15px;
      }
    }
  }
</style>
