<template>
    <div class="edit-mark-wrapper">
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #title><div class="navbar-title">Custom Remarks</div></template>
          <template #left>
            <van-icon name="arrow-left" size="24" color="#8B8989"/>
          </template>
        </van-nav-bar>
      </van-sticky>
      <div class="edit-mark-content">
        <div class="form-content">
          <section class="input_area">
            <van-field
              border
              :label="mobile"
              type="number"
              maxlength="20"
              label-width="4em"
              v-model="user.cellphone"
              name="username"
              :placeholder="!user.cellphone?'Cellphone(whatsapp)':user.cellphone"
            >
              <template #label>
                <div @click="isVisible = true" class="d_flex">
                  <div class="g_mr-s">{{mobile}}</div>
                  <van-icon name="arrow-down"  size="12"/></div>
              </template>
            </van-field>
          </section>
          <div class="error_msg" v-if="cellphoneError.visible">{{cellphoneError.content}}</div>
          <div class="textarea-area">
            <van-field
              v-model="user.name"
              rows="2"
              type="textarea"
              maxlength="20"
              placeholder="remark"
              show-word-limit
            />
          </div>

          <div class="operate-btn-area">
            <van-button  class="cancel-btn"
                         v-click-track="{triggerType:'click',fun:'cancel'}"
                         @click="operateHandle('cancel')" >
              Cancel
            </van-button>
            <van-button  class="confirm-btn"  v-click-track="{triggerType:'click',fun:'confirm'}"
                         @click="operateHandle('confirm')" >
              Confirm
            </van-button>
          </div>
        </div>
      </div>
      <!--    选择区号-->
      <van-popup v-model="isVisible" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          value-key="countryCode"
          cancel-button-text="cancel"
          confirm-button-text="confirm"
          @cancel="isVisible = false"
          @confirm="choseMobileTypeHandle"
        />
      </van-popup>
      <van-overlay :show="isWaiting" >
        <div class="wrapper" @click.stop>
          <van-loading type="spinner" color="#fcc900" size="45" />
        </div>
      </van-overlay>
    </div>
</template>

<script>
  import {shopOrderEditMarkApi} from '@/api/orders';
  import {removeAllSpace} from '@/utils';
  import {isPureNumberValidate} from '@/utils/validate'
    export default {
      head(){
        return {
          title:'Orders - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            mobile:'27',
            user:{
              cellphone:'',
              cellphoneConfirm:'',
              name:''
            },
            isVisible:false,
            shopOrderId:'',
            isWaiting:false,
            cellphoneError:{visible:false,content:''},
            countryCount:9,
          }
        },
        computed:{
          columns(){
            return this.$config.commonCountryList;
          },
        },
        methods:{
          goBackHandle(){
           this.$router.back()
          },
          //选择区号
          choseMobileTypeHandle(event){
            if(event){
              this.isVisible = false;
              this.mobile = event.countryCode;
              this.countryCount = event.count;
            }
          },
          formValidate(){
            this.cellphoneError={visible: false,content:''};
            if(!this.user.cellphone){
              this.cellphoneError={
                visible: true,
                content:'Please enter cellphone.'
              }
              return false
            }
            //1.去除空格
            this.user.cellphone = removeAllSpace(this.user.cellphone);
            this.user.cellphoneConfirm = this.user.cellphone;
            //2.判断是否是纯数字
            if(!isPureNumberValidate(this.user.cellphone)){
              this.cellphoneError={
                visible: true,
                content:'Please enter digital numbers.'
              }
              return false;
            }
            //3.判断是否以区号开头
            if(this.user.cellphone.indexOf(this.mobile)!=0){
              //不以区号开头
              //3.1判断是否以0 开头
              if(this.user.cellphone.indexOf(0)==0){
                this.cellphoneError={
                  visible: true,
                  content:`${this.user.cellphone} The number cannot start with "0". `
                }
                return false;
              }
              //3.2 不以为0开头，判断位数
              if(this.user.cellphone.length != this.countryCount){
                this.cellphoneError={
                  visible: true,
                  content:'Digits of number don\'t match. '
                }
                return false;
              }
            }else{
              //以区号开头
              //1.去除区号
              this.user.cellphoneConfirm = this.user.cellphoneConfirm.substring(this.mobile.toString().length);
              //2.判断是否以0 开头
              if(this.user.cellphoneConfirm.indexOf(0)==0){
                this.cellphoneError={
                  visible: true,
                  content:`${this.user.cellphoneConfirm} The number cannot start with "0". `
                }
                return false;
              }
              //3不是0开头，判断位数
              if(this.user.cellphoneConfirm.length != this.countryCount){
                this.cellphoneError={
                  visible: true,
                  content:'Digits of number don\'t match. '
                }
                return false;
              }
            }
            return true;
          },
          operateHandle(type){
            switch (type) {
                case 'cancel':
                  this.goBackHandle()
                  break;
                case 'confirm':
                  if(this.formValidate()){
                    if(!this.shopOrderId ){
                      this.goBackHandle()
                      this.$EventBus.$emit('remarkEvent',{...this.user,countrycode:this.mobile});
                    }else{
                      this.isWaiting = true;
                      let  value =`{"shoporderid":"${this.shopOrderId}","countrycode":"${this.mobile.substring(1)}","cellphone":"${this.user.cellphone}","name":"${this.user.name}"}`
                      shopOrderEditMarkApi(value).then(res=>{
                        if(res.status==200){
                          if(res.data.status==500){
                            this.isWaiting = false;
                            this.$toast({message:res.data.message});
                          }else if(res.data.status==0){
                            this.goBackHandle()
                            // this.$toast({message:'Edit Success'});
                            this.isWaiting = false;

                          }
                        }
                      })
                    }

                  }

                  break;
            }
          }
        },
      mounted() {
        let {id,cellphone,name,countrycode} = this.$route.query;
        this.shopOrderId = id?id:'';
        this.user.cellphone = cellphone;
        this.user.name = name;
        this.mobile =countrycode? `${countrycode}`:'27';
        console.log(this.shopOrderId )
      }

    }
</script>

<style scoped lang="less">
  .error_msg{
    margin:2px 4px 6px ;
    color:#f00;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
.edit-mark-wrapper{
  .edit-mark-content{
    .form-content{
      padding:5px 20px 0;
      .input_area{
        border-bottom:1px solid #bebebe;
        margin-bottom:8px;
        .username_input{
          font-size:15px;
          color:#2a2a2a;
        }
      }
      .textarea-area{
        /deep/.van-cell{
          background-color: #eee;
          border-radius: 6px;
        }
      }
      .operate-btn-area{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
        font-size:15px;
        .cancel-btn{
          background-color: lightgrey;
          color:#2A2A2A;
          margin-right:10px;
          border-radius: 4px;
        }
        .confirm-btn{
          background-color: #fcc900;
          color:#2A2A2A;
          border-radius: 4px;
        }
      }

    }

  }
}
</style>
