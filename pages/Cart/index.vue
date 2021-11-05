<template>
  <div class="s3-cart-wrapper">
    <template v-if="cartTab == 0">
      <cart-component @goToPayEmit="goToPayHandle"/>
    </template>
    <template v-else-if="cartTab == 1">
      <toPay-component @goCarEmit="changeToCartHandle" @changeToCartEmit="changeToCartHandle"/>
    </template>

  </div>
</template>

<script>
import CartComponent from './childComponent/CartComponent';
import ToPayComponent from './childComponent/ToPayComponent'
import config from '@/config'
import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
import {setCurrentPage} from "@/utils/memory";
export default {
  head(){
    return {
      title:'Cart - shopshipshake'
    }
  },
  name: "index",
  components:{CartComponent ,ToPayComponent },
  data(){
    return{
      cartTab:0,
    }
  },
  beforeRouteLeave(to,from,next){
    loginRegisterPageBury({
      p:'cart',
      operate:'close',
      spm:`a0001.cart.close.${getCurrentPageSpmID()}`
    })
    next();
  },
  beforeRouteEnter(to,from,next){
    if(from.path!='/'){
      setRefer(config.jianweiDomain +from.path)
    }
    if(to.query.spm){
      setRefSpm(to.query.spm);
    }
    setCurrentPage(to.name)
    loginRegisterPageBury({
      p:'cart',
      operate:'page',
      spm:`a0001.cart.page.-1`
    })
    next();
  },
  methods:{
    goToPayHandle(){
      this.cartTab=1;
      this.$router.replace('/shoporder/cart?tab=1')
      console.log('59')
    },
    changeToCartHandle(){
      this.cartTab=0;
      this.$router.replace('/shoporder/cart?tab=0')

    },
  },
  mounted() {
    if(this.$route.query.tab){
      this.cartTab =this.$route.query.tab;
    }
  },

}
</script>

<style scoped lang="less">
/deep/.van-tab__text--ellipsis{
  font-weight: bold;
  font-size: 16px;
}
</style>
