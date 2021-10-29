<template>
    <div>
      <van-tabs v-model="tagIndex" swipeable @change="tabChangeHandle">
        <van-tab v-for="(item,index) in tagList" :key="index" :name="item.val" #title>
          <van-badge :content="item.count>0?item.count:''"   max="99">
            <div :class="{'color_active':tagIndex==item.val,'color_black':tagIndex!=item.val}">
              {{item.name}}
            </div>
          </van-badge>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
    export default {
        name: "index",
      data(){
          return {
            tagIndex:'all'
          }
      },
        props:{
          tagList: {
            type: Array,
            default: () => []
          },
          tabIndexProp:{
            type:String,
          }
        },
      watch:{
        tabIndexProp(value){
          if(value){
            this.tagIndex = value;
          }
        }
      },
      methods:{
        tabChangeHandle(){
          this.$emit('tabChangeEmit',this.tagIndex)
        }
      },
    }
</script>

<style scoped lang="less">
/deep/.van-tabs__wrap--scrollable .van-tab{
  font-size:17px;
  line-height:1.5;
}
.color_black{
  color:#000;
}
</style>
