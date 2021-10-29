<template>
  <div class="share-title-description b_border">
    <div><span class="color_blue">Tip : </span>Just share pictures and descriptions,your friends won't see the actual price of the goods and shipshopshake's website</div>
    <div class="share-product-info">
      <div class="share-product-info-img">
        <van-swipe  @change="swiperChangeHandle" height="180" v-if="shareItem.images && shareItem.images.length">
          <van-swipe-item v-for="(item, index) in shareItem.images" :key="index">
            <img :src="item" style="border-radius: 10px;max-width: 100%"/>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="share-product-info-img-description">
        <van-divider content-position="left">Commodity Description(you can edit it)</van-divider>
        <van-field
          v-model="shareItem.title"
          rows="2"
          ref="inputRef"
          @blur="changeDespHandle"
          autosize
          type="textarea"
          :placeholder="shareItem.title"
          show-word-limit
        />
      </div>
    </div>
  </div>
</template>

<script>
import { shareInitApi} from '@/api/home'
export default {
  name: "ShareProductModal",
  props:{
    productID:Number | String
  },
  data(){
    return{
      shareItem:{},
      imgList:[],
      imgIndex:0
    }
  },
  methods:{
    changeDespHandle(){
      this.$emit('changeDespEmit',this.shareItem)
    },
    shareInitHandle(){
      shareInitApi(this.productID).then(res=>{
        this.shareItem = res.data;
      })
    },
    swiperChangeHandle(event){
      this.imgIndex = event;
    }
  },
  mounted() {
    this.shareInitHandle();
    this.$nextTick(()=>{
      this.$refs.inputRef.focus()
    })
  }
}
</script>

<style scoped lang="less">
.share-title-description{
  color:#2A2A2A;
  .share-product-info{
    padding:10px 0;
    .share-product-info{
      .share-product-info-img{
        height:300px;
      }
      .share-product-info-img-description{
        padding:10px 0;
      }
    }

  }
}
/deep/ .van-divider{
  margin:5px 0;
}
/deep/ .van-field__control{
  background-color: #eeeeee;
  padding:2px 8px 0 8px;
  border-radius: 10px;
}
/deep/.van-cell{
  padding:0;
}
/deep/ .van-swipe{
  border-radius: 10px;
}
</style>
