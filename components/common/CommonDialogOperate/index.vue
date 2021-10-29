<template>
  <section>
    <div class="common-dialog">
<!--      图片-->
      <transition name="van-slide-down" v-if="isShowImg">
        <div class="common-dialog-icon" >
          <img :src="imgSrc" alt="">
        </div>
      </transition>
<!--      图片-->
      <div class="common-dialog-title" :class="{'title_marge':isTitleMarge}"><slot name="title"></slot></div>
      <div class="common-dialog-intro"><slot name="intro"></slot></div>
      <div class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </section>

</template>

<script>
  export default {
    name: "index",
    props:{
      isShowImg:{type:Boolean,default:true},
      isTitleMarge:{type:Boolean,default:true}
    },
    computed:{
      imgSrc(){
        switch (this.type){
          case 'success':return require('../../../assets/images/common/success.png');
          case 'fail': return require('../../../assets/images/common/fail.png');
          case 'info':return require('../../../assets/images/common/info.png');
          case 'error':return require('../../../assets/images/common/error.png');
          default:return require('../../../assets/images/common/success.png')
        }
      },
    },
    data(){
      return{
        isShow:false
      }
    },

    methods:{

    },

  }
</script>

<style scoped lang="less">
  .common-dialog{
    padding: 40px 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .common-dialog-icon{
      img{
        height:50px;
        width: auto;
      }
    }
    .title_marge{
      margin:20px 0;
    }
    .common-dialog-title{
      color: #575757;
      font-size: 30px;
      font-weight: bold;
      line-height:1.5;
    }
    .common-dialog-intro{
      width:100%;
      padding-bottom: 15px;
      text-align: center;
      margin: 0 -15px;
      line-height:1.8;
    }
    .dialog-footer{
      padding:10px 0;
      width:100%;
    }
  }

</style>
