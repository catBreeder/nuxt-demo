<template>
  <div class="filter-area-box">
    <div class="filter-left">
      <van-dropdown-menu active-color="#fcc900" >
        <van-dropdown-item class="category-btn"
                           v-model="categoryFilter"
                           @change="categorySelectHandle"
                           :options="categoryNameList" >
          <template #title><div class="g_pt_m g_pb_m">{{categoryName}}</div></template>
        </van-dropdown-item>
        <van-dropdown-item v-model="recommendFilter"
                           class="recommend-btn"
                           @change="recommendSelectHandle"
                           :options="recommendOption" />
      </van-dropdown-menu>
    </div>
    <div class="filter-right"
         v-click-track="{triggerType:'click',fun:'filter'}"
         @click="showFilterHandle">
      <div class="filter-btn" >
        <div class="filter-title">
          <i class="icon iconfont icon-xuankeshaixuantubiaoimg g_mr-s" />
          Filter
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {objectTranToArray} from '@/utils';
import { gTagFun } from '@/utils/buryPoint/gTag'

export default {
  name: "FilterArea",
  props:{
    categoryNameList:{type:Array,default:()=>[]}
  },
  computed:{
    recommendOption(){
      let newVal =objectTranToArray(this.$config.sortBy);
      newVal = newVal.map(item=>{
        item.text = item.name;
        item.value = item.id;
        return item;
      })
      return newVal;
    }
  },
  data(){
    return{
      categoryFilter:-1,
      categoryName:'Categories',
      recommendFilter:5,
    }
  },
  methods:{
    categorySelectHandle(val){
      gTagFun(this.categoryName,'Categories','产品列表页面');
      this.categoryName= this.categoryNameList.find(item=>item.id === val).text;

      this.$emit('categorySelectEmit',val);
    },
    recommendSelectHandle(val){
      gTagFun(val,'排序','产品列表页面')

      this.$emit('recommendSelectEmit',val)
    },
    showFilterHandle(){
      gTagFun('Filter','Filter','产品列表页面')
      this.$emit('showFilterEmit')
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-dropdown-item__option{
    height:46PX;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    overflow:hidden;
    font-size: 15px;
    padding:0 5px;
  }
.filter-area-box{
  display: flex;
  align-items: center;
  .filter-left{

    border-top:1px solid #EEEEED;
    flex:2;
    .category-btn{
      /deep/.van-popup--top{
        width:40%;
      }

    }
    .recommend-btn{
      /deep/.van-popup--top{
        width:35%;
        left:33%;
      }
    }
  }
  .filter-right{
    flex:1;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 48PX;
    width:48px;
    background-color: #fff;
    .filter-btn{
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      min-width: 0;
      cursor: pointer;
      .filter-title{
        position: relative;
        box-sizing: border-box;
        max-width: 100%;
        font-weight: 500;
        padding: 0 6px 0 0;
        color: #323233;
        font-size: 15px;
        line-height: 48px;
      }
    }
  }
}
.icon-xuankeshaixuantubiaoimg{
  font-size:16px;
}
/deep/.van-dropdown-menu__title{
  font-weight: 500;
  padding: 0 6px 0 0;
  max-width: 85%;
}
/deep/.van-dropdown-menu__title::after{
  border-color: transparent transparent #222 #222;
}
/deep/.van-dropdown-menu__item{
  border-right:0.5px solid #EEEEED;
  max-width: 150px;
  border-bottom:0.5px solid #eeeeed;
}
/deep/.van-cell__value{
  display: none;
}
</style>
