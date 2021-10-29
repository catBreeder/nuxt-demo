<template>
  <div class="big_customer_edit_wrapper">
    <div class="edit_input">
      <van-field v-model="account"
                 placeholder="Whatsapp no" />
      <div class="g_mt_m error-msg" v-if="isError">{{errorMsg}}</div>
    </div>
    <div class="edit_btn_area">
      <van-button class="cancel_btn" @click="operateHandle('cancel')">Cancel</van-button>
      <van-button class="confirm_btn" @click="operateHandle('confirm')">Share</van-button>
    </div>
  </div>
</template>

<script>
  import {cartGoodsShareApi} from '@/api/cart'
  export default {
    name: "index",
    props:['id'],
    data(){
      return{
        account:null,
        errorMsg:'',
        isError:false
      }
    },
    mounted() {
      console.log(this.id);
    },
    methods:{
      operateHandle(type){
        switch (type) {
          case 'cancel':
            this.$emit('cancelEmit')
            break;
          case 'confirm':
            this.isError = false;
            this.errorMsg = ''
            if(!this.account){
              this.isError= true;
              this.errorMsg = 'enter the cellphone of the team member.'
            }else{
              cartGoodsShareApi({
                ids:this.id.join(','),
                account:this.account
              }).then(res=>{
                if(res.status==0){
                  this.$emit('confirmEmit')
                }else{
                  this.isError= true;
                  this.errorMsg =res.message
                }
              })

            }

            break;

        }
      }
    }
  }
</script>

<style scoped lang="less">
  .big_customer_edit_wrapper{

    padding:20px 0;
    .edit_input{
      padding:10px;
      /*margin-bottom: 10px;*/
      /deep/.van-cell{
        padding:6px ;
        border-radius: 4px;
        border:1px solid lightgray;
      }
      .error-msg{
        color:#f00;
      }
    }
    .edit_btn_area{
      padding:10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .cancel_btn{
        background-color: #f0f0f0;
        border-radius: 4px;

      }
      .confirm_btn{
        background-color: #fcc900;
        border-radius: 4px;
      }
    }
  }
</style>
