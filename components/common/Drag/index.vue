<template>
  <div class="floatball font_size_15" id="floatball"
       @click="goOtherURL"
       @mousedown="down" @touchstart.stop="down"
       @mousemove="move" @touchmove.stop="move"
       @mouseup="end" @touchend.stop="end"
       :style="{top:position.y+'px', left:position.x+'px','background':bgColor}">
    {{title}}
  </div>
</template>

<script>
// 鼠标位置和div的左上角位置 差值
var dx,dy
var screenWidth;
var screenHeight
if(process.client){
  screenHeight =window.screen.width;
  screenHeight= window.screen.height;
}


export default {
  props:{
    title:{type:String,default:'Q&A'},
    bgColor:{type:String,default:'#fcc900'}
  },
  data() {
    return {
      flags: false,
      position: {
        x: null,
        y: null
      },
    }
  },
  methods: {
    goOtherURL(){
      if(this.title=='Q&A'){
        // window.open(`${this.$config.jianweiDomain}/question/index`)
        this.$router.push('/question/index')
      }else{
        this.$emit('operateEmit')
      }

    },
    // 实现移动端拖拽
    down(event){
      this.flags = true;
      var touch ;
      if(event.touches){
        touch = event.touches[0];
      }else {
        touch = event;
      }
      dx = touch.clientX - event.target.offsetLeft
      dy = touch.clientY - event.target.offsetTop
    },
    move() {
      if (this.flags) {
        var touch ;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        // 定位滑块的位置
        this.position.x = touch.clientX - dx;
        this.position.y = touch.clientY - dy;
        // 限制滑块超出页面
        if (this.position.x < 0) {
          this.position.x = 0
        } else if (this.position.x > screenWidth - touch.target.clientWidth) {
          this.position.x = screenWidth - touch.target.clientWidth
        }
        if (this.position.y < 0) {
          this.position.y = 0
        } else if (this.position.y > screenHeight - touch.target.clientHeight) {
          this.position.y = screenHeight - touch.target.clientHeight
        }
        //阻止页面的滑动默认事件
        document.addEventListener("touchmove",function(){
          event.preventDefault();
        },false);
      }
    },
    //鼠标释放时候的函数
    end(){
      this.flags = false;
    },

  }

}
</script>

<style scoped lang="less">
.floatball{
  color:white;
  height:50px;
  width: 50px;
  top:50%;
  left:80%;
  text-align: center;
  line-height: 50px;
  z-index: 990;
  position: fixed;
  border-radius: 50%;
}

</style>
