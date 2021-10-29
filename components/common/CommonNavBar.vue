<template>
  <div class="navbar-content">
      <div class="navbar-left" @click="clickLeftEvent">
        <slot name="left"></slot>
      </div>
      <div class="navbar-content"  :style="{justifyContent:jc_center}">
        <slot name="content"></slot>
      </div>
      <div class="navbar-right"
        :style="{justifyContent:jc_right,width:jc_width+'px'}"
      >
        <slot name="right"></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "CommonNavBar",
  props:{
    'jc_right':{type:String,default:'center'},
    'jc_center':{type:String,default:'space-between'},
    'jc_width':{type:Number,default:68},
  },
  methods:{
    clickLeftEvent(){
      this.$emit('clickLeftEvent')
    },
    clickRightEvent(){
      this.$emit('clickRightEvent')
    }
  }
}
</script>

<style scoped lang="less">
.navbar-content{
  box-shadow: 0 0.5px 0 rgba(24, 24, 24, 0.1);
  display: flex;
  z-index:1;
  background-color: #fff;
  align-items: center;
  .navbar-left{
    height:46px;

    width:46px;
    display: flex;
    align-items: center;
    justify-content: center;
    //border-bottom:0.5px solid #EEEEED;
  }
  .navbar-right{
    height:46px;
    display: flex;
    justify-content: center;
    align-items: center;
    //border-bottom:0.5px solid #EEEEED;
  }
  .navbar-content{
    flex:1;
    min-width: 60%;
    height:45px;
    box-sizing: border-box;
    line-height:45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
