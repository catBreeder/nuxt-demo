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
          <van-field v-model="country"  label-width="3rem"
                     input-align="right"
                     readonly
                     @click-right-icon="showActionHandle('country')"
                     label="Country"
                     placeholder="Country"
                     right-icon="arrow" />
          <van-field v-model="addressInput.receiver" label-width="3rem"  input-align="right"  label="Consigee's Name" required placeholder="Consigee's Name"/>
          <van-field v-model="addressInput.receivecompany" label-width="3rem"  input-align="right"  label="Company Name" placeholder="Company Name"/>
          <van-field v-model="addressInput.receivetelephone" label-width="3rem"  type="digit" input-align="right"  label="Mobile" required placeholder="Mobile"/>
          <van-field v-model="addressInput.receiveemail" label-width="3rem"  input-align="right"  label="E-mail" placeholder="E-mail"/>
          <van-field v-model="addressInput.receivepostcode" label-width="3rem"  input-align="right"  required label="Postal Code"
                     placeholder="Postal Code" right-icon="arrow" readonly  @click-right-icon="showActionHandle('postal')"/>
          <van-field v-model="addressInput.receivesuburb"
                     label-width="3rem"  input-align="right" readonly  required label="Suburb" placeholder="Suburb" right-icon="arrow"
                     @click-right-icon="showActionHandle('suburb')"/>
          <van-field v-model="addressInput.address"
                     label-width="3rem"  input-align="right"  required label="Street Address" placeholder="Street Address"/>
          <van-field
            v-model="addressInput.address2"
            rows="2"
            type="textarea"
            maxlength="50"
            placeholder="Additional address information."
            show-word-limit
          />
          <van-field name="switch" label-width="6rem" input-align="right" label="Set as Default Address">
            <template #input>
              <van-switch v-model="addressInput.def" size="20" />
            </template>
          </van-field>
          <div class="operate-btn-area">
            <van-button
              @click="formValidateHandle"
              v-click-track="{triggerType:'click',fun:'save'}" block class="save-btn">Save</van-button>
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
        @cancel="visible.country = false"
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
  import ScrollView from "@/components/common/ScrollView";
  import config from '@/config'
  import {clientAddressEditApi ,clientAddressEditInfoApi } from '@/api/client'
  import { searchPostcodeApi  } from '@/api/help';
  import {receiverValidate} from '@/utils/validate'
  import CommonDialog from '@/components/common/CommonDialog'
  export default {
    computed:{
      operateID(){return this.$route.params.id},
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
        addressIntro:''
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
      formValidateHandle(){
        if(!this.addressInput.receiver){
          return this.$toast({message:'Consigee\'s Name is requires !'})
        }
        if(!receiverValidate(this.addressInput.receiver)){
          return this.$toast({message:' only enter Chinese, English and Spaces!'})
        }
        if(!this.addressInput.receivetelephone){
          return this.$toast({message:'Mobile is require!'})
        }
        if(!this.addressInput.receivepostcode){
          return this.$toast({message:'Postal Code is require!'})
        }
        if(!this.addressInput.receivesuburb){
          return this.$toast({message:'Suburb is require!'})
        }
        if(!this.addressInput.address){
          return this.$toast({message:'Street Address is require!'})
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
                        ids:this.$route.query.id,
                        receiverid:item.id
                      }
                    })
                    break;
                  case 'combine':
                    this.$router.push({
                      name:'deliveryCombine',
                      query:{
                        ids:this.$route.query.id,
                        receiverid:this.$route.query.id
                      }
                    })
                    break;
                }
              }else{
                this.$router.back()
                this.$toast({message:this.$route.params.id>0?'Edit Success !':'Add Success'})
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
            def:res.receiver.def==1?true:false,
            id:this.$route.params.id,
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
      if(this.$route.params.id!=0){
        this.getEditInfo(this.$route.params.id)

      }
    }


  }
</script>

<style scoped lang="less">
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
      height:330px;
    }
    /deep/.van-empty{
      padding:30px 0;
    }
  }
  .addressOperateScroll{
    height:calc(100vh - 50PX - 46PX);
    background-color: #EEEEED;
  }
  .address-operate-content{
    .form-content{
      margin:8px;
      border-radius: 6px;
      padding:10px 0;
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
      padding:20px;
      .save-btn{
        background-color: #fcc900;
        border-radius: 4px;
      }
    }
  }
</style>
