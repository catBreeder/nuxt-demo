<template>
  <div class="help-detail-title g_mb_l">{{title}}：</div>
</template>

<script>
export default {
  name: "ModalTitle",
  props:['title']
}
</script>

<style scoped lang="less">
@import "~assets/less/help.less";
</style>
