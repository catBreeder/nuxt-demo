<template>
  <van-swipe @change="swiperChangeHandle" :loop="false">
    <van-swipe-item v-for="(item,index) in images" :key="index">
      <img :src="item" :alt="imgAlt" :title="imgAlt"/>
      <div class="top_100_img" v-if="isShowTop100"/>
    </van-swipe-item>
    <template #indicator>
      <div class="custom-indicator">{{ current + 1 }}/{{images.length}}</div>
    </template>
  </van-swipe>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        current: 0,
      }
    },
    props:{
      images:{type:Array,default:()=>[]},
      isShowTop100:{type:Boolean,default:false},
      imgAlt:{type:String}
    },
    methods:{
      swiperChangeHandle(index) {
        this.current = index;
      },
    }
  }
</script>

<style scoped lang="less">
  /deep/.van-swipe{
    min-height: 360px;
  }
  .top_100_img{
    width: 40PX;
    height: 40PX;
    position: absolute;
    z-index:1;
    bottom: 3px;
    left: 0;
    background: url('~assets/images/top100/tag.png');
    background-size:40PX 40PX;
    border-radius: 0 0 8px 0 ;

  }
  /*  轮播图开始*/
  .custom-indicator {
    position: absolute;
    right: 10px;
    color:#fff;
    bottom: 15px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 14PX;
    background: rgba(0, 0, 0, 0.3);
  }
  /deep/.van-swipe-item{
    img{
      width:100%;
    }
  }
  /*  轮播图结束*/
</style>
