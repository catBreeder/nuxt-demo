<template>
  <div class="activity-filter" >
    <van-row>
      <van-col span="12" class="filter-recommend">
        <van-dropdown-menu active-color="#fcc900">
          <van-dropdown-item v-model="recommendFilter"
                             class="recommend-btn"
                             @change="recommendSelectHandle"
                             :options="recommendOption" />
        </van-dropdown-menu>
      </van-col>
      <van-col span="12">
        <div class="filter-btn" >
          <div class="filter-title" @click="showFilterHandle">
            <i class="icon iconfont icon-xuankeshaixuantubiaoimg g_mr-s" />
            Filter
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return{
            recommendFilter:5,
            recommendOption:[
              {text:'Recommend',value:5},
              {text:'Price:low to high',value:2},
              {text:'Price:high to low',value:3},
            ],
          }
        },
      methods:{
        recommendSelectHandle(val){
          this.$emit('recommendSelectEmit',val)
        },
        showFilterHandle(){
          this.$emit('showFilterEmit')
        }
      }
    }
</script>

<style scoped lang="less">
  .activity-filter{
    /deep/.van-cell__value{
      display: none;
    }
    /deep/.van-cell__title{
      text-align: center;
    }
    /deep/.van-dropdown-menu__bar{
      height:41PX;
    }
    /deep/.van-dropdown-menu__title{
      font-size:14px;
    }
    /deep/.van-dropdown-item__option{
      height:46PX;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      overflow:hidden;
      font-size: 14px;
      padding:0 5px;
      border-bottom: 1px solid lightgrey;
    }
    /deep/.van-tabs--line .van-tabs__wrap{
      border-radius: 8px 8px 0 0 ;
    }
    .filter-btn{
      height:41PX;
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
      background-color: #fff;
      border-bottom: 0.5px solid #EEEEED;
      border-top:0.5px solid #EEEEED;
      cursor: pointer;
      .filter-title{
        position: relative;
        box-sizing: border-box;
        max-width: 100%;
        font-weight: 500;
        padding: 0 6px 0 0;
        color: #323233;
        font-size: 14px;
        line-height: 38px;
      }
    }
  }

</style>
