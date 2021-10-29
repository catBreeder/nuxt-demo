<template>
    <div class="other_shop_wrapper">
<!--      big tree 页面-->
      <van-nav-bar  border  @click-left="introBtn" @click-right="checkMessageHandle">
        <template #left>
          <i class="icon iconfont icon-kaitongxuzhi demo-intro" />
        </template>
        <template #title>
          <div class="home-navbar-input">
            <input type="text" class="navbar-input-area card-demo" readonly
                   placeholder="paste keyword or 1688 link" @click="goSearchHandle" >
            <van-uploader :after-read.stop="afterReadHandle"
                          accept="image/gif, image/jpeg ,image/png"
                          v-img-upload="{triggerType:'click',p:'首页'}"
                          max-count="1" class="camera_search card-demo-2"  v-intro="'The content of tooltip'"
                          v-intro-step="2">
              <i class="icon iconfont icon-zhaoxiangji s3_header_input_camera"  ></i>
            </van-uploader>
          </div>
        </template>
        <template #right>
          <van-badge  :content="unReadCount || ''" max="99">
            <i class="icon iconfont icon-xiaoxi" />
          </van-badge>

        </template>
      </van-nav-bar>
      <scroll-view class="scrollCommonHeightView">
        <van-notice-bar
          wrapable
          background="#FFFBF2"
          :scrollable="false"
          text="Buy products yourself in China and send to our partner's warehouse, we collect and deliver to your door."
        />
        <div class="other_shop_base_content">
          <van-notice-bar :scrollable="false" background="#fff" >
            <div class="color_normal base_title">Base Info</div>
          </van-notice-bar>
          <div class="other_shop_form">
            <div class="form_input_area">
              <div class="form_input_item" id="intro_1">
                <div class="input_label d_flex" @click="showVisibleHandle('form')">
                  <span class="color_warning">*</span>&nbsp;Express No (Custom No)&nbsp;
                  <van-icon name="question" size="14"/>
                </div>
                <van-field v-model="inputValue.express"  placeholder="Express No (Custom No)" />
                <div class="error_msg" v-if="expressError.visible">{{expressError.msg}}</div>
              </div>
              <div class="form_input_item" id="intro_2">
                <div class="input_label d_flex" >
                  <span class="color_warning">*</span>&nbsp;Receiver Info
                </div>
                <van-field  right-icon="arrow-down" v-model="inputValue.receiveName" readonly @click="showPopupHandle('receiver')" placeholder="Please Choose Receiver info" />
                <div class="error_msg" v-if="receiveError.visible">{{receiveError.msg}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="other_shop_base_content">
          <van-notice-bar :scrollable="false" background="#fff" >
            <div class="color_normal base_title">Product Info</div>
          </van-notice-bar>
          <div class="other_shop_form" >
            <div id="intro_3">
              <div class="form_input_area"  v-for="(item,index) in productInfoList" :key="index">
                <div class="form_input_item">
                  <div class="input_label d_flex">
                    <span class="color_warning">*</span>&nbsp;Product Name&nbsp;
                  </div>
                  <van-field v-model="item.name"   placeholder="Product" />
                  <div class="error_msg" v-if="item.nameErrorShow">{{item.nameErrorMsg}}</div>
                </div>
                <div class="form_input_item">
                  <div class="input_label d_flex">
                    <span class="color_warning">*</span>&nbsp;Qty&nbsp;
                  </div>
                  <van-field v-model="item.qty" type="digit"  />
                  <div class="error_msg" v-if="item.qtyErrorShow">{{item.qtyErrorMsg}}</div>
                </div>
                <div class="form_input_item">
                  <div class="input_label d_flex" >
                    <span class="color_warning">*</span>&nbsp;declaredvalue(USD)&nbsp;
                  </div>
                  <van-field v-model="item.value"  type="digit" />
                  <div class="error_msg"  v-if="item.valueErrorShow">{{item.valueErrorMsg}}</div>
                </div>
                <div class="form_input_item">
                  <div class="input_label d_flex" >
                    <span class="color_warning">*</span>&nbsp;Magnet/Battery&nbsp;
                  </div>
                  <van-field right-icon="arrow-down" v-model="item.magnetName"
                             readonly @click="showMagnetHandle(index)"
                             placeholder="Choose Please" />
                  <div class="error_msg" v-if="item.magnetErrorShow">{{item.magnetErrorMsg}}</div>
                </div>
                <div class="form_input_item" v-if="index!=0">
                  <van-button type="primary"  block size="mini" @click="deleteHandle(index)">Delete</van-button>
                </div>
              </div>
            </div>

          </div>
          <div class="other_shop_info">
            <div class="d_flex_end d_flex">
              <van-button type="primary" @click="productCreateHandle">Add Product</van-button>
            </div>
            <div class="other_shop_info_title">
              Please Send you parcel to：
            </div>
            <div class="other_shop_address">
              <div class="d_flex d_flex_between address_info">
                <div class="address_item">
                  城市:<span>{{JSON.stringify(shouse) !== "{}" ?shouse.city:'深圳'}}</span>
                </div>
                <div class="address_item">
                  区域:<span>{{JSON.stringify(shouse) !== "{}"  ?shouse.county: '龙岗区'}}</span>
                </div>
                <div class="address_item">
                  邮编:<span>{{JSON.stringify(shouse) !== "{}"  ?  shouse.post:'518116'}}</span>
                </div>
              </div>
              <div class="d_flex d_flex_between address_info address_info_next">
                <div class="address_item">
                  City:<span>{{JSON.stringify(shouse) !== "{}" ?shouse.cityen: '深圳' }}</span>
                </div>
                <div class="address_item">
                  Area:<span>{{JSON.stringify(shouse) !== "{}"  ? shouse.countyen:'龙岗区'}}</span>
                </div>
                <div class="address_item">
                  Postcode:<span>{{JSON.stringify(shouse) !== "{}"  ? shouse.post: '518116'}}</span>
                </div>
              </div>
              <div class="address_info">
                地址：{{JSON.stringify(storehouse) !== "{}" ? storehouse.address : '深圳市龙岗区岗头风门坳村亚洲工业园15栋1楼左侧'}}
              </div>
              <div class="address_info address_info_next">
                Address：{{ JSON.stringify(storehouse) !== "{}" ? storehouse.address : 'Left side of floor 1, building 15, Asia Industrial Park, Fengmen\'ao village, Longgang, Shenzhen, 518116'}}
              </div>
              <div class=" d_flex d_flex_between address_info">
                <div class="address_item">
                  收件人 ：转运{{JSON.stringify(storehouse) !== "{}" ? storehouse.fullname : '周德三' }} {{customer.code}}
                </div>
                <div class="address_item text_align_r">
                  电话 ：{{JSON.stringify(storehouse) !== "{}" ? storehouse.mobilephone : '15068113703' }}
                </div>
              </div>
              <div class=" d_flex d_flex_between address_info">
                <div class="address_item">
                  Receiver ：转运{{JSON.stringify(storehouse) !== "{}" ? storehouse.fullname : '周德三' }} {{customer.code}}
                </div>
                <div class="address_item text_align_r">
                  TEL ： {{JSON.stringify(storehouse) !== "{}" ? storehouse.mobilephone : '15068113703'}}
                </div>
              </div>
            </div>
          </div>
          <div class="other_shop_checked">
            <van-checkbox v-model="checked" shape="square" icon-size="15" @change="checkChangeHandle">
              I have confirmed that I have read and agree to the
            </van-checkbox>
            <span class="control_link" @click="checkVisible = true">《EXPRESS TERMS AND CONDITIONS OF CARRIAGE》</span>
            <div class="submit_area" id="intro_4">
              <van-button type="primary" @click="submitHandle">Submit</van-button>
            </div>
          </div>
        </div>
      </scroll-view>
      <van-dialog v-model="isVisible" :show-confirm-button="false" :show-cancel-button="false">
        <common-dialog
          type="info" v-if="visibleType=='form'"
          :fontSize="15"
          :isShowImg="false"
          :isFont="false"
          title="The express tracking number from your supplier"
          :isCenter="true"
          @okEmit ="hideVisibleHandle"
        />
        <common-dialog
          type="error" v-else-if="visibleType=='term'"
          :fontSize="14"
          :isFont="false"
          title="Error"
          intro="Please read and agree to the《EXPRESS TERMS AND CONDITIONS OF CARRIAGE》"
          @okEmit ="hideVisibleHandle"
        />
        <common-dialog
          type="error" v-else-if="visibleType=='error'"
          :fontSize="14"
          :isFont="false"
          title="Error"
          :intro="errorMsg"
          @okEmit ="hideVisibleHandle"
        />
        <common-dialog-operate v-else-if="visibleType=='success'">
          <div slot="title">Success</div>
          <div slot="intro" class="color_intro">Cost of goods:</div>
          <div slot="footer">
            <div class="d_flex color_gray">
              <div @click="orderOperateHandle('create')">New another order</div>
              <div class="g_mr_m g_ml_m">|</div>
              <div @click="orderOperateHandle('view')">View order list</div>
            </div>
          </div>
        </common-dialog-operate>
      </van-dialog>
      <van-popup v-model="popupVisible" round position="bottom">
        <van-picker
          :title="getTitle"
          show-toolbar
          :columns="columns"
          cancel-button-text="cancel"
          confirm-button-text="confirm"
          @confirm="confirmSelectHandle"
          @cancel="popupHideHandle"
        />
      </van-popup>
      <van-dialog v-model="checkVisible"
                  theme="'round-button"
                  class="stand-pop" show-cancel-button :show-confirm-button="false" cancelButtonText="close"
                  @cancel="checkVisible=false"
                  >
        <template #title>
          <div class="modal_title">EXPRESS TERMS AND CONDITIONS OF CARRIAGE ("Terms and Conditions")</div>
        </template>
        <scroll-view class="scrollHeight">
          <term-popup v-if="checkVisible"/>
        </scroll-view>
      </van-dialog>
      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
    </div>
</template>

<script>
    const productList =[
      { name:'',
        nameErrorMsg:'',
        nameErrorShow:false,
        qty:'',
        qtyErrorShow:false,
        qtyErrorMsg:'',
        value:'',
        valueErrorShow:false,
        valueErrorMsg:'',
        magnetID:'',
        magnetName:'',
        magnetErrorShow:false,
        magnetErrorMsg:'',},
    ]
    import {getUserID,getUserTicket} from '@/utils/memory';
    import { uploadImageApi,remindTimesApi} from '@/api/common'
    import TermPopup from './ChildComponent/TermPopup'
    import ScrollView from "@/components/common/ScrollView";
    import CommonDialog from '@/components/common/CommonDialog';
    import CommonDialogOperate from '@/components/common/CommonDialogOperate'
    import { otherShopInfoApi,unReadMessageApi}  from '@/api/home'
    export default {
        head(){
          return {
            title:'Shipping Agency - shopshipshake'
          }
        },
        name: "index",
        components:{ScrollView,CommonDialog,TermPopup,CommonDialogOperate},
        computed:{
          getTitle(){
            return this.popupType=='receiver'?'Receiver Info' :'Magnet/Battery'
          },
          columns(){
            if(this.popupType=='receiver'){
              return this.receiveAddressList.map(item => {
                item.text =item.customername;
                return item;
              });
            }else if(this.popupType =='magnet'){
              return [
                {id:0,text:'Normal'},
                {id:1,text:'Magnet/Battery'},
                {id:2,text:'Powder/Liquid'},
              ]
            }

          },
        },
        data(){
          return{
            isWaiting:false,
            checkVisible:false,
            inputValue:{
              receiveID:'',
              express:'',
              receiveName:null,
            },
            expressError:{visible:false, msg:''},
            receiveError:{ visible:false,msg:''},
            isVisible:false,
            visibleType:'',
            popupVisible:false,
            popupType:'',
            checked:false,
            shouse:{},
            receiveAddressList:[],
            storehouse:{},
            customer:{},
            productInfoList:productList,
            selectIndex:0,
            errorMsg:'',
            unReadCount:0
          }
        },
        methods:{
          getMessageCount(){
            if(getUserID()){
              unReadMessageApi().then(res=>{
                this.unReadCount =res? res.count:0
              })
            }
          },
          orderOperateHandle(type){
            switch (type) {
                case 'create':
                  this.isVisible = false;
                  this.visibleType ='';
                  this.inputValue={
                    receiveID:'',
                    express:'',
                    receiveName:null,
                  };
                  this.productInfoList= productList.map(item=>{
                      item.name='';
                      item.nameErrorMsg='';
                      item.nameErrorShow=false;
                      item.qty='';
                      item.qtyErrorShow=false;
                      item.qtyErrorMsg='';
                      item.value='';
                      item.valueErrorShow=false;
                      item.valueErrorMsg='';
                      item.magnetID='';
                      item.magnetName='';
                      item.magnetErrorShow=false;
                      item.magnetErrorMsg='';
                      return item;
                  });
                  this.getBasicInfoHandle();
                  break;
                case 'view':
                  this.$router.replace("/shoporder/2/index");
                  this.$EventBus.$emit("toOrder");
                  break;
            }
          },
          checkChangeHandle(){
            if(this.checked){
              this.checkVisible = true;
            }
          },
          showMagnetHandle(index){
            this.selectIndex= index;
            this.popupVisible = true;
            this.popupType = 'magnet';
          },
          //表单验证
          formValidateHandle(){
            if(!this.checked){
              this.showVisibleHandle('term')
              return false;
            }
            let msg='';
            if(!this.inputValue.express){
              msg='Please fill the Express No';
              this.expressError ={visible: true,msg}
              this.$toast({message:msg})
              return false;
            }
            if(!this.inputValue.receiveID){
              msg='Please Choose Receiver info';
              this.receiveError ={visible: true,msg}
              this.$toast({message:msg})
              return false;
            }
            this.productInfoList = this.productInfoList.map(item=>{
              if(!item.name){
                item.nameErrorShow = true;
                item.nameErrorMsg = 'Please fill the Product Name';
              }
              if(!item.qty){
                item.qtyErrorShow = true;
                item.qtyErrorMsg = 'Please fill the Qty';
              }else if(item.qty<=0){
                item.qtyErrorShow = true;
                item.qtyErrorMsg = 'Minimum value is 1';
              }
              if(!item.value){
                item.valueErrorShow = true;
                item.valueErrorMsg = 'Please fill the declaredvalue';
              }else if(item.value < 0.05){
                item.valueErrorShow = true;
                item.valueErrorMsg = 'Minimum value is 0.05';
              }
              if(!item.magnetName){
                item.magnetErrorShow = true;
                item.magnetErrorMsg = 'Please Choose Magnet/Battery'
              }
              return item;
            })
            let flag = this.productInfoList.some(item=>{return !item.name || !item.value || !item.magnetName || !item.qty})
            if(flag){
              this.$toast({message:'Please fill the product info'}) ;
              return false;
            }
            return true;
          },
          clearValidateHandle(){
            this.expressError ={visible: false,msg:''};
            this.receiveError ={visible: false,msg:''};
            this.productInfoList = this.productInfoList.map(item=>{
              item.nameErrorShow = false;
              item.nameErrorMsg ='';
              item.qtyErrorMsg='';
              item.qtyErrorShow = false;
              item.valueErrorMsg ='';
              item.valueErrorShow = false;
              item.magnetErrorMsg ='';
              item.magnetErrorShow = false;
              return item;
            })
          },
          //表单提交
          submitHandle(){
            this.clearValidateHandle()
            if(this.formValidateHandle()){
              this.isWaiting = true;
              let name = this.productInfoList.map(item=>item.name);
              let declaredvalue = this.productInfoList.map(item=>item.value);
              let qty = this.productInfoList.map(item=>item.qty);
              let specialgoods= this.productInfoList.map(item=>item.magnetID);
              this.$axios({
                url:`${this.$config.jianweiDomain}/api/shoporder/othershop/save?ticket=${getUserTicket()}`,
                method:'post',
                headers: {
                  "X-Requested-With":"XMLHttpRequest",
                  'Content-Type': 'application/json',
                },
                data:{
                  thirdnumber:this.inputValue.express,
                  shipperinfoid:this.inputValue.receiveID,
                  name,
                  declaredvalue,
                  qty,
                  specialgoods
                },
              }).then(res=>{
                if(res.status==200){
                  this.isWaiting = false
                  if(res.data.status==0){
                    this.isVisible = true;
                    this.visibleType = 'success';

                  }else{
                    this.isVisible = true;
                    this.visibleType = 'error';
                    this.errorMsg = res.data.message;
                  }
                }
              })
            }
          },
          //删除表单
          deleteHandle(index){
            this.productInfoList.splice(index,1);
          },
          //添加form表单
          productCreateHandle(){
            let obj ={name:'',
                nameErrorMsg:'',
                qty:null,
                qtyErrorMsg:'',
                value:'',
                valueErrorMsg:'',
                magnetID:'',
                magnetName:'',
                magnetErrorMsg:''};
            this.productInfoList = [...this.productInfoList,obj];
          },
          popupHideHandle(){
            this.popupVisible = false;
            this.popupType =''
          },
          showPopupHandle(type){
            this.popupVisible = true;
            this.popupType = type;
          },
          showVisibleHandle(type){this.isVisible = true;this.visibleType =type; },
          hideVisibleHandle(){this.isVisible = false;this.visibleType = ''},
          confirmSelectHandle(event){
            if(event){
              if(this.popupType=='receiver'){
                this.inputValue.receiveName = event.customername;
                this.inputValue.receiveID = event.id;
              }else if(this.popupType =='magnet'){
                this.productInfoList = this.productInfoList.map((item,index)=>{
                  if(index == this.selectIndex){
                    item.magnetID = event.id;
                    item.magnetName = event.text;
                  }
                  return item;
                })
              }
            }

            this.popupVisible = false;
          },
          introBtn(){
            let introJS = require('intro.js')
            introJS().setOptions({
              showStepNumbers: false,
              tooltipClass: 'customTooltip',
              showProgress:false,
              showBullets:false,
              nextLabel:"<div >Next</div>", //下一步骤按钮的文字
              doneLabel:"<div>Done</div>", //下一步骤按钮的文字
              prevLabel:"<div>Back</div>", //下一步骤按钮的文字
              steps: [
                {
                  element: document.getElementById('intro_1'),
                  intro:'<p style="font-size:13px;margin: -18px -10px">Fill in the waybill number provided to you by the Chinese merchant.</p>',
                  position:'bottom'
                },
                {
                  element: document.getElementById('intro_2'),
                  position:'bottom',
                  intro:'<p style="font-size:13px;margin: -18px -10px">Choose your address in South Africa.</p>'
                },
                {
                  element: document.getElementById('intro_3'),
                  position:'right',
                  intro: '<p  style="font-size:13px;margin: -18px -10px">Filling out the information what must to be filled.</p>'
                },{
                  element: document.getElementById('intro_4'),
                  intro:'<p style="font-size:13px;margin: -18px -10px">After check-the-box and Submit,Check the status of your parcel under "Purchase Order"</p>',
                  position: 'top'
                }]
            }).onbeforeexit(()=>{

            }).start().oncomplete(()=>{
                this.remindTimesHandle()
            }) ;
          },
          remindTimesHandle(){
            remindTimesApi(this.$config.noticeReadType.ship).then(res=>{})
          },
          checkMessageHandle(){
            this.$router.push('/message/index')
          },
          //前往search页面
          goSearchHandle(){
            this.$router.push(`/shoppingmall/search/index`)
          },
          //  图片上传
          afterReadHandle(file){
            if(!getUserID()){
              this.$router.replace('/login')
            }else{
              this.isLoading = true;
              uploadImageApi(file).then(res=>{
                if(res.data.status==0){
                  this.isLoading = false;
                  this.$router.push({
                    path:'/shoppingmall/imagesearch',
                    query:{
                      key:res.data.data.key,
                      picurl:res.data.data.picurl,
                      fromType:'index',
                      spm:'a0001.p0001.imgsearch.r0'
                    }
                  })
                }else{
                  this.isLoading = false;
                  return this.$toast({message:res.data.message})
                }
              })
            }
          },
          getBasicInfoHandle(){
            otherShopInfoApi().then(res=>{
              const {receiveaddress,storehouse ,customer,shouse} = res;
              this.receiveAddressList = receiveaddress || [];
              this.storehouse = storehouse || {};
              this.customer = customer || {};
              this.shouse = shouse || {};

            })
          },
          getPopupInfo(){
            this.$EventBus.$on('introBtnEmit',(result)=>{
              if(result==1){
                this.introBtn()
              }
            })
          },
        },
      mounted() {
          this.getPopupInfo()
          this.getBasicInfoHandle()
      }
    }
</script>

<style scoped lang="less">
  .customTooltip{
    .introjs-tooltip-header{display: none !important}
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .stand-pop {
      width:340px;
    .modal_title{
      text-align: center;
      font-weight: 600;
      color:#3d4145;
      padding-bottom: 10px;
      border-bottom: 1px solid #EEEEED;
    ;
    }
    .scrollHeight {
      height: 60vh;
    }
    /deep/ .van-dialog__footer {
      display: block;
    }

    /deep/ .van-dialog__footer {
      height: 40px;
      padding: 10px 0;
    }

    /deep/ .van-button__content {
      justify-content: flex-end;
    }

    /deep/ .van-button__text {
      border: 1px solid #eeeeed;
      display: block;
      padding: 2px 20px;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
  .error_msg{
    font-size:13px;
    color:#f00;
    padding:0 6px;
  }
  /deep/.van-cell::after{
    border-bottom:none;
  }
  /deep/.van-cell{
    padding :4px 0 ;
  }
  /deep/.van-button{
    border-radius: 4px;
  }
.other_shop_wrapper{
  /deep/.van-picker__cancel, .van-picker__confirm{
    font-size:15px;
  }
  /*头部开始*/
  .icon-kaitongxuzhi{
    font-size:24px;
    color:#FCC900;
  }
  .home-navbar-input{
    position: relative;
  }
  /deep/ .van-nav-bar__title{
    min-width:270px;
  }
  .camera_search{
    position:absolute;
    top:50%;
    right:10px;
    transform: translateY(-50%);

  }
  .s3_header_input_camera{
    font-size:22px;
  }
  .icon-xiaoxi{
    font-size:24px;
    color:gray;
  }
  .navbar-input-area{
    width:94%;
    height:32px;
    padding:0 6px;
    font-size:14px;
    border-radius: 20px;
    background-color: #FFFFFF;
    border:1px solid #e5e6e7;
  }
  /*头部结束*/

  /deep/.van-notice-bar{
    font-size:16px;
  }
/*  base info 开始 */

  .other_shop_base_content{
    background-color: #fff;
    margin-top:20px;

  }
  .base_title{
    font-size: 18px;
    font-weight:bold;
  }
  .other_shop_info{
    padding:15px 6px;
    .other_shop_info_title{
      font-size:16px;
    }
  }
  .other_shop_form{
    border-top:1px solid #EEEEED;
    padding:0 8px 10px;
    .form_input_area{
      padding:8px 2px;
      margin-top: 15px;
      border:1px solid #d8d0d0;
      border-radius: 4px;
      .form_input_item{
          padding:4px 6px;
           margin-bottom: 4px;
          .color_warning{
            font-size:15px;
          }
        /deep/.van-field__value {
          border: 1px solid #e5e6e7;
          margin: 4px;
          padding: 6px 4px;
          border-radius: 4px;
        }
      }
    }

    /*/deep/.van-cell{*/
    /*  padding:4px 0;*/
    /*}*/
  }
/*  base info 结束 */
  .other_shop_address{
    margin-top: 10px;
    font-size:13px;
    color:#2A2A2A;
    border:1px solid #d8d0d0;
    border-radius: 4px;
    padding: 8px 4px;
  }
  .address_info_next{
    margin-bottom: 15px;
  }
  .address_info{
    padding-top:10px;
    .address_item{
      flex:1
    }
  }
  .other_shop_checked{

    display: flex;
    align-items: center;
    flex-direction: column;
    .control_link{
      font-size:12px;
      color:dodgerblue;
      border-bottom: 1px solid dodgerblue;
      margin-top: 2px;
      margin-left: 10px;
    }
    .submit_area{
      margin:20px 0;
      width:90%;
      text-align: center;

    }
  }
}
/deep/.van-button{
  font-size:16px;
  color:#000;
}
</style>
