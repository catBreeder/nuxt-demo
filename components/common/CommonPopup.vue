<template>
 <section>
   <div class="s3-message-popup-container">
     <div class="s3-message-popup-container-header">
       <slot name="header"></slot>
     </div>
     <div class="s3-message-popup-container-content" :style="{background:content_bg}" :class="{'content_margin':content_margin}">
       <slot name="content"></slot>
     </div>

   </div>
   <slot name="footer"></slot>
 </section>
</template>

<script>
    export default {
        name: "Popup",
         props:['title','footer_bg','content_bg','content_margin'],
        methods:{
          hidePopup(){
            this.$emit('hide')
          }
        }
    }
</script>

<style scoped lang="less">
  /*弹出框*/
  .s3-message-popup-container{
    padding:8px 10px 0px;
    min-width:310px;
    background-color: #fff;
  .s3-message-popup-container-header{
    border-bottom:1px solid #EEEEED;
    box-sizing: border-box;
    .notice-icon{
      font-size:16px;
      color:#FCC900;
      margin-right: 8px;
    }
  }
    .s3-message-popup-container-content{
      padding:20px 8px;
      height:260px;
      overflow-y: scroll;
      //text-indent: 1rem;
    }

  }

  /deep/.van-popup--center.van-popup--round{
    border-radius: 10px;
  }
  .content_margin{
    margin:0px -8px;
  }
</style>
