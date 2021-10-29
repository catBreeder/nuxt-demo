<template>
    <div class="activity-box">
      <div style="white-space:pre-wrap" v-html="memo"></div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props:{
          memo:String
        }
    }
</script>

<style scoped lang="less">
.activity-box{
  padding:10px 15px;
  font-size:15px;
  line-height:1.5;
}
</style>
