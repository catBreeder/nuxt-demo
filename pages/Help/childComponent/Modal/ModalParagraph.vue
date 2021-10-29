<template>
  <div class="help-detail-parage" :class="{'isSpace':isSpace}">{{content}}</div>
</template>

<script>
export default {
  name: "ModalParagraph",
  props:['content','isSpace']
}
</script>

<style scoped lang="less">
@import "~assets/less/help.less";
.isSpace{
  text-indent: 20px;
}
</style>
