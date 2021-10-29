<template>
  <div>

    <customer-level v-if="vipLevel==0" />
    <vip-level  v-else/>
  </div>
</template>
<script>
  import CustomerLevel  from "./VipModel/CustomerLevel";
  import VipLevel from "./VipModel/VipLevel";
  import {accountBasicInfoApi} from '@/api/account'
  export default {
    head(){
      return {
        title:'Member Info - shopshipshake'
      }
    },
    name:'index',
    components:{CustomerLevel,VipLevel},
    data(){
      return {
        vipLevel:0,
      }
    },
    methods:{
      getBasicInfo(){
        accountBasicInfoApi().then(res=>{
          this.vipLevel = res.viplevel
        })
      },
    },
    created() {
      this.getBasicInfo()
    }
  }
</script>
<style lang="less" scoped>

</style>
