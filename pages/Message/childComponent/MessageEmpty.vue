<template>
  <div class="empty-content">

      <template v-if="tabIndex==$config.messageType.ORDER">
        <div class="empty-inner">
           when you have a order,you'll see your order processing messages here
        </div>
      </template>
      <template v-else-if="tabIndex == $config.messageType.MEMBERSHIP">
        <div class="empty-inner">
            when you are a member,you'll see message about the member here
            <div class="g_mt_l"><van-button class="become-btn" @click="operateHandle">Become a member</van-button></div>
        </div>
      </template>
      <template v-else>
        <van-empty description="No data at present....."/>
      </template>


  </div>
</template>

<script>

export default {
  name: "MessageEmpty",
  props:{
    tabIndex:Number
  },
  methods:{
    operateHandle(){
      this.$router.push('/membership/index')
    }
  }
}
</script>

<style scoped lang="less">
.empty-content{
  text-align: center;
  font-weight: 600;
  line-height: 1.6;
  font-size:16px;
  color:gray;
  position: relative;
  .empty-inner{
    margin:200px auto;
  }
}
.become-btn{
  background-color:#FCC900;
  color:#222222;
  font-weight: 500;
  font-size:14px;
  border-radius: 4px;
}
/deep/.van-empty{
  margin:200px auto;
}
</style>
