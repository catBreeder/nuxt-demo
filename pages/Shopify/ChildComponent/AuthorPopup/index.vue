<template>
    <div class="author-popup-content">
      <van-notice-bar color="#2a2a2a" background="#fff" text="The Shopshipshake account is"/>
      <div class="email-content">
        <van-notice-bar color="#2a2a2a"  :text="queryInfo && queryInfo.email"/>
      </div>
      <div class="account-content">
        <van-notice-bar color="#2a2a2a" background="#fff" @click="logoutHandle">
          This account is not mine? sign in
        </van-notice-bar>
      </div>
      <div class="notice-content">
        <van-notice-bar color="#2a2a2a"  background="#F5F5F5" wrapable >
          we have our new services that synchronizing the shopshipshake products to your shopify store /
          and synchronizing order date back to your shopshipshake account.
          <br>
          After your customer pays,the goods will appear in your 3S shopping cart,After you have paid,
          we will arrange the purchase for you.The product will have a corresponding code,so that you can
          handle the received package more clearly.Save you more time and make more money.
        </van-notice-bar>
      </div>
      <div class="author-footer d_flex d_flex_end">
        <van-button class="g_mr_l" @click="operateHandle('cancel')">Cancel</van-button>
        <van-button type="primary" @click="operateHandle('add')">Add</van-button>
      </div>
    </div>
</template>

<script>
    import {shopifyAuthorVerifyApi} from '@/api/shopify'
    export default {
        name: "index",
        props:{
          queryInfo:{type:Object,default:()=>{}}
        },
        methods:{
          operateHandle(type){
            switch (type) {
              case 'cancel':
                this.$emit('cancelEmit')
                break;
              case 'add':
                shopifyAuthorVerifyApi(this.queryInfo.shop,this.queryInfo.code).then(res=>{
                  if(res.status==0){
                    this.$toast({message:'Success'})
                  }else{
                    this.$toast({message:res.message})
                  }
                  this.$emit('successEmit')
                })
                break;
            }
          },
          logoutHandle(){
            let origUrl=this.$config.jianweiDomain+this.$route.fullPath;
            this.$router.replace(`/login?origUrl=${origUrl}`)
          }
        }
    }
</script>

<style scoped lang="less">
.author-popup-content{
  padding:15px 8px;
  .email-content{
    border:1px solid #FCC900;
    border-radius: 4px;
    /deep/.van-notice-bar__wrap{
      justify-content: center;
    }
  }
  .account-content{
    /deep/.van-notice-bar__wrap{
      justify-content: flex-end;
    }
  }
  .notice-content{

    /deep/.van-notice-bar{
      border-radius: 6px;
      font-size:15px;
    }
  }
  .author-footer{
    padding:10px 15px 4px;
    /deep/.van-button{
      margin-right:15px;
      border-radius: 4px;
    }
  }
}
</style>
