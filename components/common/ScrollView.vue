<template>
  <div class="scroll_container" @scroll="getScroll">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ScrollView",
  data() {
    return {
      scrollTop: 0
    };
  },
  methods:{
    //滚动事件
    getScroll(e) {
      let wScrollY = e.target.scrollTop; // 当前滚动条位置
      this.scrollTop = wScrollY;
      this.$emit('getScrollTop',{scrollTop:this.scrollTop});
      let wInnerH = e.target.clientHeight; // 设备窗口的高度（不会变）
      let bScrollH = e.target.scrollHeight; // 元素总高度
      if (wScrollY + wInnerH >= bScrollH - 1) {
        this.$emit("reachBottom");
      }
    },
    activated() {
      this.$el.scrollTop = this.scrollTop;
      this.$emit('getScrollTop',{scrollTop:this.scrollTop});
    }
  }
}
</script>

<style scoped lang="less">
.scroll_container{
  width: 100%;
  overflow-x:hidden;
  overflow-y:scroll;

}

</style>
