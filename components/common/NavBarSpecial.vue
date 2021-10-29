<template>
<!--  头部只有两部分，没有右边部分-->
  <div class="s3_navbar_no_right_wrapper">
    <div class="navbar_back" @click="clickLeft">
      <slot name="left"></slot>
    </div>
    <div class="navbar_content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBarSpecial",
  methods:{
    clickLeft(){
      this.$emit('clickLeft')
    }
  }
}
</script>

<style scoped lang="less">
.s3_navbar_no_right_wrapper{
  //position:fixed;
  //top:0;
  //left:0;
  //right:0;
  //z-index:10;
  height:46px;
  line-height:46px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .navbar_back{
    width:45px;
    cursor: pointer;
    display: flex;
    height:46px;
    line-height:46px;
    justify-content: center;
    align-items: center;
  }
  .navbar_content{
    flex:1;
    padding-right: 20px;

  }
}
</style>
