<template>
    <div class="big_customer_edit_wrapper">
      <div class="edit_input">
        <van-field v-model="orderNo" placeholder="Input shopify order No. here" />
      </div>
      <div class="edit_btn_area">
        <van-button class="cancel_btn" @click="operateHandle('cancel')">Cancel</van-button>
        <van-button class="confirm_btn" @click="operateHandle('confirm')">Confirm</van-button>
      </div>
    </div>
</template>

<script>
  import {cartEditShopifyOrderNoApi} from '@/api/cart'
    export default {
        name: "index",
        props:['shopifyorderno','id'],
        data(){
          return{
            orderNo:null
          }
        },

      mounted() {

          if(this.shopifyorderno){
            this.orderNo = this.shopifyorderno
          }
      },
      methods:{
        operateHandle(type){
          switch (type) {
              case 'cancel':
                this.$emit('cancelEmit')
                break;
              case 'confirm':
                cartEditShopifyOrderNoApi(this.id,this.orderNo).then(res=>{

                  if(res.status==0){
                    this.$emit('successEmit',{
                      id:this.id,
                      orderNo:this.orderNo
                    });
                    this.$toast({message:'Edit Success '})
                  }
                })
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
      margin-bottom: 20px;
      /deep/.van-cell{
        padding:6px ;
        border-radius: 4px;
        border:1px solid lightgray;
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
