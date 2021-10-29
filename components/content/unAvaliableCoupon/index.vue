<template>
  <div class="wrapper">
    <div class="content">
      <div class="money">
        <slot name="money"></slot>
      </div>
      <div class='co'>
        <div class='co_w'></div>
        <div class="conditions">
          <slot name="leftBottomSlot"></slot>
        </div>
        <div class='co_l'></div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="tip">
      <div class="tip-time g_mb_l">
        <slot name="rightTopSlot"></slot>
      </div>
      <slot name="rightBottomSlot"></slot>
      <!--      <van-button class="useNow">立即使用</van-button>-->
    </div></div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped lang="less">
  .conditions{
    color:#fff;
    margin-top: 4px;
  }
  .wrapper {
    margin: 0 auto 12px;
    width: 100%;
    display: flex;
    background:linear-gradient(-90deg,#C1C1C1,#9e9e9e);
    /*实现颜色渐变 */
  }
  .title{
    color:#eee;
    font-size:14px;
  }
  /*前半部分样式*/
  .content {
    position: relative;
    flex: 1;
    padding:8px 6px;
    text-align: center;
  }
  /*后半部分样式*/
  .tip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 0 0 200px;
    text-align: center;
  }
  /*中间竖直虚线样式*/
  .split-line {
    position: relative;
    flex: 0 0 0;
    margin: 0 6px 0 4px;
    border-left: 3px dashed #eee;
  }
  /*给虚线加两个伪类，基本样式如下*/
  .split-line:before, .split-line:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 8px;
    background: #fff;
    left: -8px;
    z-index: 1;
  }
  /*给前半部分加两个伪类，基本样式如下*/
  .content:before, .content:after{
    content: '';
    position: absolute;
    width: 16px;
    height: 8px;
    background: #fff;
    left: -8px;
    z-index: 1;
  }

  /*给前半部分加两个伪类，基本样式如下*/
  .tip:before, .tip:after{
    content: '';
    position: absolute;
    width: 16px;
    height: 8px;
    background: #fff;
    right: -8px;
    z-index: 1;
  }
  /*几个伪类化成的圆弧的样式以及位置（置于顶部）我把它放在一起了*/
  .content:before, .tip:before, .split-line:before{
    border-radius: 0 0 8px 8px;
    top: -1px;
  }

  /*几个伪类化成的圆弧的样式以及位置（置于底部）我把它放在一起了*/
  .content:after, .tip:after, .split-line:after{
    border-radius: 8px 8px 0 0;
    bottom: -1px;
  }

  .money {
    font-size:30px;
    color: #eee;
  }
  .useNow{
    background-color: #fcc900;
    color:#fff;
    border:1px solid #FCC900;
    font-size: 15px;
    box-shadow: 2px 2px 5px gray;
    border-radius: 10px;
    margin-top: 10px;
  }
  .tip-time{
    color:grey;
    margin-top: 8px;
  }
</style>
