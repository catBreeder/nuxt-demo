<template>
  <div>
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>Address</template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollViewHeight">
      <div class="edit_content">
        <div class="edit_title">Address</div>
        <div class="edit_form">
          <van-form >
            <van-field
              v-model="receiver.receiver"
              placeholder="Name"
            />
            <van-field
              v-model="receiver.receivecompany"
              placeholder="Company"
            />
            <van-field
              v-model="receiver.receivetelephone"
              placeholder="Telephone"
            />
            <van-field
              v-model="receiver.receiveemail"
              placeholder="E-mail"
            />
            <van-field
              v-model="receiver.receivepostcode"
              placeholder="PostCode"
            >
              <template #right-icon>
                <div @click="visibleOperateHandle('postcode')">
                  <i class="icon iconfont icon-sanjiaoxing1" v-if="visible.postal"/>
                  <i class="icon iconfont icon-sanjiaoxing" v-else/>
                </div>
              </template>
            </van-field>
            <van-field
              v-model="receiver.receivesuburb"
              placeholder="Suburb"
            >
              <template #right-icon>
                <div @click="visibleOperateHandle('suburb')">
                  <i class="icon iconfont icon-sanjiaoxing1" v-if="visible.suburb"/>
                  <i class="icon iconfont icon-sanjiaoxing" v-else/>
                </div>

              </template>
            </van-field>
            <van-field :border="false"
                       v-model="receiver.address"
                       rows="1"
                       maxlength="50"
                       show-word-limit
                       class="address_input"
                       type="textarea"
                       placeholder="address"
            />
            <van-field
              v-model="receiver.address2"
              rows="1"
              maxlength="50"
              show-word-limit
              class="address_input"
              type="textarea"
              placeholder="Additional address information."
            />
            <div class="form_btn">
              <van-button block class="save_btn" @click="formValidateHandle">Save</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </scroll-view>
    <van-popup v-model="visible.suburb" round  position="bottom" :style="{ height: '50%' }" >
      <div class="postal-popup-content">
        <div class="postal-popup-search">
          <van-search  shape="round" @input="searchInputSuburbHandle" v-model="searchInput.suburb" placeholder="Suburb" />
        </div>
        <div class="postal-popup-list">
          <template v-if="suburbList.length">
            <scroll-view class="cellScrollHeight" @reachBottom="loadMoreSuburbHandle">
              <van-cell v-for="(item,index) in suburbList"
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
  import CommonDialog from '@/components/common/CommonDialog'
  import {clientAddressEditInfoApi,clientAddressEditApi} from '@/api/client'
  import { searchPostcodeApi  } from '@/api/help';
  export default {
    name: "index",
    components:{ScrollView,CommonDialog},
    data(){
      return{
        receiver:{},
        visible:{
          postal:false,
          suburb:false
        },
        searchInput:{
          postal:null,
          suburb:null
        },
        postalPage:1,
        suburbPage:1,
        postalList:[],
        suburbList:[],
        searchKey:{
          postal:null,
          suburb:null
        },
        addressVisible:false,
        addressType:'',
        addressIntro:''
      }
    },
    methods:{
      formValidateHandle(){
        if(!(/^((?!plaas|plot|po box|posbus|private bag|privaat sak|box).)*$/i.test(this.receiver.address))){
          this.addressVisible= true;
          this.addressType='close';
          this.addressIntro= `Please fill in your specific physical address (street name & building number, suburb and building number if applicable), any one of the addresses provided are <span style='color:red;'>undeliverable: Plaas/Plot/Farm/PO box/Posbus/Private Bag/Privaat sak/Box</span>`
          return
        }
        if(!(/^((?!farm).)*$/i.test(this.receiver.address))){
          this.addressVisible= true;
          this.addressType='confirm';
          this.addressIntro =`Please fill in your specific physical address (street name & building number, suburb and building number if applicable), any one of the addresses provided are <span style='color:red;'>undeliverable: Plaas/Plot/Farm/PO box/Posbus/Private Bag/Privaat sak/Box</span>`
          return
        }
        this.saveHandle()
      },
      saveHandle(){
        clientAddressEditApi(this.receiver).then(res=>{
          if(res.data.status==0){
            this.$toast({message:'Edit Success !'});
            this.$router.back();
          }else{
            this.$toast({message:res.data.message})
          }
        })
      },
      choosePostalItem(item){
        let value = item.text.split(',');
        this.receiver.receivepostcode = item.id;
        this.receiver.receivesuburb = value[1];
        this.visible.postal = false;

      },
      //显示postallist
      chooseSuburbItem(item){
        let value = item.text.split(',');
        this.receiver.receivepostcode = value[1];
        this.receiver.receivesuburb = value[0];
        this.visible.suburb = false;
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
      searchInputSuburbHandle(){
        this.suburbPage =1;
        this.getSuburbList()
      },
      searchInputPostalHandle(){
        this.postalPage =1;
        this.getPostalList()
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
      getSuburbList(){
        searchPostcodeApi({
          search:this.searchInput.suburb,
          type:'suburb',
          page:this.suburbPage,
        }).then(res=>{
          this.suburbList = res.list;
        })
      },
      visibleOperateHandle(type){
        switch (type) {
          case 'postcode':
            this.visible.postal =true;
            this.postalPage = 1;
            this.getPostalList()
            break;
          case 'suburb':
            this.visible.suburb = true;
            this.suburbPage =1;
            this.getSuburbList()
            break;
        }
      },
      goBackHandle(){
        this.$router.go(-1)
      },
      getClientInfo(){
        clientAddressEditInfoApi(this.$route.query.receiverid).then(res=>{
          this.receiver = res.receiver;
        })
      }
    },
    mounted() {
      this.getClientInfo()
    }
  }
</script>

<style scoped lang="less">
  /*弹出框开始*/
  /deep/.van-icon-search::before{
    content:''
  }
  .postal-popup-content{
    padding:0 10px 10px;
    position: relative;
    /deep/.van-cell{
      padding:4px 4px;
    }
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
      height:270px;
    }
    /deep/.van-empty{
      padding:30px 0;
    }
  }
  /*弹出框结束*/
  .active{
    background-color: #337ab7;
    color:#fff;
  }

  .scrollViewHeight{
    height:calc(100vh - 46PX - 46PX);
  }
  .edit_content{
    padding:10px 0;
    .edit_title{
      padding:10px 20px;
      font-size:18px;
      margin-bottom:20px;
    }
  }
  .icon-sanjiaoxing,.icon-sanjiaoxing1{
    font-size:13px;
    color:#9e9e9e;
  }
  .address_input{
    /deep/.van-field__value{
      background-color: #EEEEED;
      padding:5px 10px;
      border-radius: 4px;
    }

  }
  .form_btn{
    margin-top:20px;
    padding:0 20px;
    .save_btn{
      border-radius: 10px;
      background-color: #fcc900;
      font-size:16px;
    }
  }
</style>
