<template>
  <div class="notice-dialog">
    <div class="add-to-cart-notice-popup">
      <div class="notice-header">
        Two things you must know before shopping
      </div>
      <scroll-view class="cartNoticeScroll">
        <div class="notice-content">
          <p>1.At ShopShipShake we assist you to import directly from China, the purchasing experience is quite different
            from other e-commerce platforms.
            <br>

            Kindly note that at SSS payments, there are TWO steps for payment. In the FIRST step, you pay for the products,
            and separately, in the SECOND step you pay for the international shipping cost.
            <br>
            The exact shipping cost will be calculated according to the actual weight and volume of the parcel (purchased products)
            when we collect it at our warehouse.
          </p>
          <p>
            2.Before paying for the products ShopShipShake´s international freight estimation tool will help you make better purchasing
            decisions by giving you an estimation of the shipping cost.
            <br>

            International air freight has been greatly influenced by the epidemic. To reduce shipping costs, we suggest to combine many
            shopping orders into one single shipment (since the more a parcel weights, the cheaper the shipping costs, per kg)

          </p>
        </div>
      </scroll-view>

      <div class="notice-footer">
        <div class="d_flex g_mb_s">
          <van-checkbox icon-size="14" v-model="confirmChecked" shape="square" > I have confirmed reading and agreeing content above</van-checkbox>
        </div>
        <div class="d_flex g_mb_s">
          <van-checkbox icon-size="14" v-model="ignoreChecked" shape="square" > No longer remind </van-checkbox>
        </div>
        <div class="d_flex d_flex_around g_pt_m g_mb_l">
          <van-button type="default" @click="operateHandle('view')">View Guidance</van-button>
          <van-button type="primary" @click="operateHandle('agree')">I Understand</van-button>
        </div>
      </div>
    </div>
    <van-dialog v-model="isVisible" :show-confirm-button="false" :show-cancel-button="false">
      <common-dialog
        title="Error"
        @okEmit="closeHandle"
        type="error" intro="Please ensure that you read the agreement and agree to the agreement"/>
    </van-dialog>
  </div>

</template>

<script>
  import {productSetRemindTimesApi} from '@/api/product'
  import CommonDialog from '@/components/common/CommonDialog';
  import ScrollView from "@/components/common/ScrollView";
    export default {
        name: "index",
      components:{CommonDialog,ScrollView},
      data(){
          return{
            confirmChecked:false,
            ignoreChecked:true,
            isVisible:false
          }
      },
      methods:{
        closeHandle(){
          this.isVisible = false;
        },
        operateHandle(type){
          switch (type) {
              case 'view':
                this.$emit('cancelEmit')
                this.$router.push('/helpcenter/userguidance');
                break;

              case 'agree':
                if(!this.confirmChecked){
                  this.isVisible = true;
                  return;
                }
                productSetRemindTimesApi(this.$config.noticeDialogType.ADDTOCART).then(res=>{})
                this.$emit('remindEmit')
                break;
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .cartNoticeScroll{
    height:62vh;
  }
  .notice-dialog{
    /deep/.van-dialog{
      width:85vw;
    }
  }
.add-to-cart-notice-popup{
  /deep/ .van-button{
    border-radius: 4px;
    font-size:15px;
  }
  .notice-header{
    height: 60px;
    background: #ffcc00;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
  .notice-content{
    color:#3d4145;
    line-height: 2;
    padding:0 10px;
    font-size: 14px;
    background-color: #fff;
    overflow-y: auto;
    p{
      margin:10px 0;
      font-size:13px;
    }
  }
  .notice-footer{
    background: #f7f7f8;
    padding:15px 10px;
  }
}
</style>
