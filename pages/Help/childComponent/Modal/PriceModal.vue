<template>
  <div class="price-info">
    <strong>{{title}}</strong>
    {{ intro }}
  </div>
</template>

<script>
export default {
  name: "PriceModal",
  props:['title','intro']
}
</script>

<style scoped lang="less">
.price-info{
  font-size:13px;
  line-height:2.5;
  color:#3d4145
}
</style>
