<template>
  <section>
    <div class="common-dialog">
      <transition name="van-slide-down" v-if="isShowImg">
        <div class="common-dialog-icon" v-show="isShow">
          <img :src="imgSrc" alt="">
        </div>
      </transition>
      <div class="common-dialog-title " v-if="showTitle" :class="{'text-align':isCenter,'font_w':isFont}" v-html="title"></div>
      <div class="common-dialog-intro" :style="{fontSize:fontSize+'px',color:introColor}" v-html="intro"></div>
      <div class="dialog-footer">
        <template v-if="hasTwoBtn">
          <div v-if="btnIsBig" class="d_flex d_flex_between spacial_btn_area">
            <div class="ok_btn" @click="cancelHandle">{{ cancelText }}</div>
            <div class="special_btn"
                        @click="confirmHandle">{{ confirmText }}</div>
          </div>
          <div class=" d_flex d_flex_between" :class="{'two-btn-area':isWrap}" v-else>
            <van-button class="cancel-btn" :style="{background:cancelBg,color:cancelColor}" size="large" @click="cancelHandle">{{ cancelText }}</van-button>
            <van-button class="confirm-btn"
                        :style="{background:confirmBg,color:confirmColor,borderColor:confirmBorder,fontSize:confirmFont+'px'}"
                        size="large"
                        @click="confirmHandle">{{ confirmText }}</van-button>
          </div>
        </template>
        <template v-else>
          <div class="text-align">
            <van-button class="ok-btn" @click="okHandle">{{okText}}</van-button>
          </div>
        </template>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: "index",
  props:{
    type:{type:String,default:'success'},
    title:{type:String,default:'Success'},
    intro:String,
    fontSize:{type:Number,default:15},
    hasTwoBtn:{type:Boolean,default:false},
    showTitle:{type:Boolean,default:true},
    cancelText:{type:String,default:'Cancel'},
    confirmText:{type:String,default:'Confirm'},
    confirmBg:{type:String,default:'#CD5C5C'},
    confirmBorder:{type:String,default:'#CD5C5C'},
    confirmColor:{type:String,default:'#2A2A2A'},
    cancelColor:{type:String,default:'#fff'},
    introColor:{type:String,default:'gray'},
    cancelBg:{type:String,default:'#D0D0D0'},
    okText:{type:String,default:'OK'},
    isShowImg:{type:Boolean,default:true},
    confirmFont:{type:Number,default:15},
    isWrap:{type:Boolean,default:false},
    isCenter:{type:Boolean,default:false},
    isFont:{type:Boolean,default:true},
    btnIsBig:{type:Boolean,default:false}
  },
  data(){
    return{
      isShow:false
    }
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
    dialogTitle(){
      switch (this.type){
        case 'success':return 'Success';
        case 'fail': return 'Fail';
        case 'info':return 'Warning';
        case 'error':return 'Error';
        default:return 'Success'
      }
    }
  },
  methods:{
    cancelHandle(){
      this.$emit('cancelEmit')
    },
    confirmHandle(){this.$emit('confirmEmit')},
    okHandle(){this.$emit('okEmit')}
  },
  mounted() {
    this.isShow = true;
  }
}
</script>

<style scoped lang="less">
.common-dialog{
  padding:30px;
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
  .common-dialog-title{
    margin:20px 0;
    font-size:18px;
    line-height:1.5;
  }
  .common-dialog-intro{
    padding-bottom: 30px;
    text-align: center;
    margin: 0 -15px;
    line-height:1.8;
  }
  .dialog-footer{
    padding:10px 0 0;
    width:100%;
    /deep/.van-button{
      height:40px !important;
      line-height:40px !important;
      font-size:15px;
    }
    .two-btn-area{
      flex-wrap: wrap;
    }
    .spacial_btn_area{
      margin:0 -20px;
    }
    .ok_btn{
      width:50PX;
      height:36PX;
      margin-right: 10px;
      line-height:36PX;
      text-align: center;
      border-radius: 5px;
      font-size:14px;
      background-color: #D0D0D0;
      box-shadow:0 8px 10px #EEEEED;
      border:1px solid #D0D0D0;

    }
    .special_btn{
      flex:1;
      height:36PX;
      font-size:14px;
      line-height:36PX;
      border-radius: 5px;
      text-align: center;
      background-color: #AEDEF4;
      box-shadow:0 8px 10px #EEEEED;
      border:1px solid #D0D0D0;
    }
    .cancel-btn{

      margin-right: 10px;
      border-radius: 6px;
      box-shadow:0 8px 10px #EEEEED;
      border:1px solid #D0D0D0;
    }
    .confirm-btn{
      border-radius: 6px;
      color:#2A2A2A;
      box-shadow:0 8px 10px #EEEEED;
      border-width: 1px;

    }
    .ok-btn{
      width:60%;
      background-color: #ECBD07;
      border-radius: 6px;
      border: 1px solid #ECBD07;
      box-shadow:0 8px 10px #EEEEED;
    }
  }
}

</style>
