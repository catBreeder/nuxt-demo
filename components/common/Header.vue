<template>
  <div class="s3_nav_header" :style="{background: bgColor }" :class="isBorder?'b_border':''">
    <div class="s3_nav_header_left" @click="clickLeft">
      <slot name="left"></slot>
    </div>
    <div class="s3_nav_header_content">
      <slot name="content"></slot>
    </div>
    <div class="s3_nav_header_right" @click="clickRight">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props:{
    bgColor:{
      type:String,
      default:'#fff'
    },
  //  是否有底部边框
    isBorder:{
      type:Boolean,
      default:true
    }
  },
  methods:{
    clickLeft(){
      this.$emit('clickLeft')
    },
    clickRight(){
      this.$emit('clickRight')
    }
  }
}
</script>

<style scoped lang="less">
.s3_nav_header{
  position: fixed;
  background-color: #fff;
  top:0;
  left:0;
  right:0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  &_left, &_right{
    width:50px;
    text-align: center;
    line-height:43px;
  }
  &_content{
    flex:1;
    height:43px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
