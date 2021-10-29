<template>
  <div class="remove-box-wrapper">
    <van-nav-bar border @click-left="removeBoxOperateHandle('cancel')">
      <template #left>
        <van-icon name="arrow-left" size="24" color="#fff"/>
      </template>
      <template #title> <div class="remove-box-wrapper-title">Service Choice</div></template>
    </van-nav-bar>

    <div class="remove-box-wrapper-content">
      <div v-if="showReceiver">
        <div class="receiver-info-content">
          <div class="receiver-info-content-title">Receiver Info:</div>
          <van-row >
            <van-col :span="19">
              <van-field  readonly
                          :style="{borderColor:errorVisible?'#f00':'#eeeeed'}"
                          clickable right-icon="arrow-down" :value="receiverName" placeholder="Please Choose Receiver" @click="showPicker = true"/>
            </van-col>
            <van-col :span="2" :offset="1"> <van-button @click="addressOperateHandle(0)" type="primary" size="mini">Add</van-button></van-col>
          </van-row>
          <div class="color_warning error_msg" v-if="errorVisible">{{errorMsg}}</div>
          <div class="client-list-item font_size_15 g_mb_l" v-if="receiverValue.id">
            <div class="item-content">
              <div class="d_flex d_flex_between">
                <div class="item-title d_flex g_mb_m">
                  <div class="item-name  font_size_16">{{receiverValue.receiver}}&nbsp; |</div>
                  <div class="item-tel color_intro font_size_14">{{receiverValue.receivetelephone}}</div>
                </div>
                <div class="color_blue" @click="addressOperateHandle(receiverValue.id)">Update</div>
              </div>
              <div class="item-detail">
                <span class="color_intro">suburb/postcode :</span>&nbsp;
                <span>{{receiverValue.receivepostcode}} / {{receiverValue.receivesuburb}}</span>
              </div>
              <div class="item-detail">
                <div class="color_intro">Address :&nbsp;</div>
                <div class="van-multi-ellipsis--l2 item-address">
                  {{receiverValue.address}} {{receiverValue.address2}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="removeshoeflg ==1">
        <van-radio-group v-model="radio">
          <div class="g_mb_big">
            <van-radio name="1"><div class="color_normal">Remove Shoebox</div></van-radio>
            <div class="color_intro g_mt_s g_ml_l font_size_12">
              R{{data7.remove_shoebox?data7.remove_shoebox.value:''}}/Order,R{{data7.remove_shoebox_5more?data7.remove_shoebox_5more.value:''}}/pair from the 6th
            </div>
          </div>
          <van-radio name="2"> Keep Shoebox</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="remove-box-wrapper-footer">
      <van-button type="primary" size="small" @click="removeBoxOperateHandle('cancel')">Back</van-button>
      <van-button type="primary" size="small" @click="removeBoxOperateHandle('create')">Add to Cart</van-button>
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        value-key="customername"
        title="Choose Receiver"
        :columns="receiveaddress"
        cancel-button-text="Cancel"
        confirm-button-text="Confirm"
        @cancel="showPicker = false"
        @confirm="chooseReceiverHandle"
      />
    </van-popup>
  </div>
</template>

<script>
  import {productDetailApi} from '@/api/product'
  export default {
    head(){
      return {
        title:'service choice - shopshipshake'
      }
    },
    name: "index",
    data(){
      return{
        radio:'',
        receiverValue:'',
        receiverName:'',
        showPicker:false,
        errorVisible:false,
        errorMsg:'',
        productInfo:{},
        data7:{},
        receiveaddress:[],
        removeshoeflg:0

      }
    },
    computed:{
      showReceiver(){
        return this.productInfo.platform !=null && this.productInfo.platform ==2;
      }
    },
    activated() {
      this.getAddressList()
    },
    methods:{
      addressOperateHandle(id){
        this.$router.push(`/client/edit/${id}`)
      },
      //选中receiver
      chooseReceiverHandle(event){
        if(event){
          this.receiverName = event.customername;
          this.receiverValue = event;
          this.errorMsg ='';
          this.errorVisible = false;
        }
        this.showPicker = false;
      },
      removeBoxOperateHandle(type){
        console.log(type);
        switch (type) {
          case "cancel":
            console.log('116')
            this.$router.back()
            break;
          case 'create':
            this.errorVisible=false;
            this.errorMsg =''
            if(this.showReceiver){
              if(!this.receiverValue.id){
                this.errorVisible = true;
                this.errorMsg='Please Choose Receiver Info';
                return;
              }
              if(!this.receiverValue || !this.receiverValue.address || !this.receiverValue.receivesuburb || !this.receiverValue.receivepostcode || !this.receiverValue.receiver || !this.receiverValue.receivetelephone){
                this.errorVisible = true;
                this.errorMsg='Please complete the Receiver address information'
                return;
              }
            }
            // this.$emit('createEmit',{
            //   serviceValue:this.radio,
            //   receiver:this.receiverValue
            // });
            this.$EventBus.$emit('confirmEvent',{
              serviceValue:this.radio,
              receiver:this.receiverValue
            })
            this.$router.back();
            break;
        }
      },
      getAddressList() {
        const {productID} = this.$route.params;
        productDetailApi({
          productid:productID,
          sf: 0
        }).then(res => {
          const {productInfo,receiveaddress,data7} = res;
          this.receiveaddress =receiveaddress || [];
          this.productInfo = productInfo || {};
          this.data7 = data7 || {};
          this.removeshoeflg =res.removeshoeflg?res.removeshoeflg:0;
          console.log(this.removeshoeflg);
        })
      },
    },
    mounted() {
      this.getAddressList();
    }
  }
</script>

<style scoped lang="less">
  .error_msg{
    margin-top: 6px;
    padding-left: 3px;
  }
  .remove-box-wrapper{
    /deep/.van-radio__icon--checked .van-icon{
      background-color: #fcc900;
      border-color:#fcc900;
    }
    /deep/.van-nav-bar{
      background-color: #f8ac59;
      border-color: #f8ac59;

    }
    .remove-box-wrapper-title{
      color: #ffffff;
      font-size:16px;
    }
    .remove-box-wrapper-content{
      padding:30px 15px 10px;
      /deep/.van-cell{
        padding:4px 10px;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
      }
      /deep/.van-button{
        height:32px !important;
        line-height:32px !important;
        padding:0 14px;
      }
    }
    .receiver-info-content-title{
      font-size:16px;
      margin-bottom: 15px;

    }
    .client-list-item{
      border:1px solid #EEEEED;
      margin-top: 10px;
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
        /*max-width:98%;*/
        font-size:12px;
      }
    }
    .remove-box-wrapper-footer{
      margin-top: 20px;
      padding:15px ;
      border-top:1px solid #EEEEED;
      display: flex;
      justify-content: space-around;
      align-items: center;
      /deep/.van-button{
        color:#2A2A2A;
        padding:0 20px;
      }
    }
  }
</style>
