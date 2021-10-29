<template>
    <div class="list_item" v-if="item">
        <div class="list_item_top d_flex d_flex_between">
          <div class="d_flex">
            <img :src="`${$config.jianweiDomain}/resources/images/logo-head.png`"  class="avatar g_mr_m">
            <div>
              <p class="g_mb_s">{{item?item.username:''}}</p>

            </div>
          </div>
          <div><van-rate v-model="item.score3" color="#FF8416"/></div>
        </div>
        <div v-if="item.images && item.images.length" class="g_mt_l">
          <van-row :gutter="8" >
            <van-col  :span="8" v-for="(image ,imageIndex) in item.images" :key="imageIndex">
              <div class="item-image" v-if="image">
                <van-image :src="image" />
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="list_item_bottom">
          {{item.description}}
        </div>
      <div class="d_flex d_flex_end"><p class="color_intro font_size_12">{{item.createtime | timeFormat('YMD')}}</p></div>
    </div>
</template>

<script>

    export default {
        name: "index",
        props:{
          item:{type:Object,default:()=>{}},
          index:String | Number
        }
    }
</script>

<style scoped lang="less">
.list_item{
  padding:10px 15px;
  margin:0 4px 10px;
  border-bottom:1px solid #EEEEED;
  .list_item_top{
    .avatar{
      width:40PX;
      height:40PX ;
      border-radius: 50%;
    }
  }
  .list_item_bottom{
    margin:12px 0;
    line-height:1.6;
  }
  .item-image{
    border:1px solid #EEEEED;
    margin-bottom: 8px;
    width:100%;
    background:#f4f4f4;
    min-height:110px;
  }
}
  /deep/.van-image__error, .van-image__loading{
    top:40px;
    left:50px;
    transform: translate(-50%,-50%);
  }
</style>
