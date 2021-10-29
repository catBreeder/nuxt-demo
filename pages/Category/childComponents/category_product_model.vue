<template>
  <div class="category_product_model" ref="productRef" v-if="item">
    <div class="category_product_model_title d_flex_between d_flex">
      <div class="van-ellipsis title_tag">{{item.ename}}</div>
      <div  class="model_link "
            :class="{'link_active':selectAllID ==  item.id}"
            v-login-register-track="{triggerType:'click',page:'Category',operate:item &&item.ename}"
            @click="goAllHandle">All</div>
    </div>
    <van-row gutter="12" class="category_product_model_list">
      <van-col span="8" class="category_product_model_info"
               v-login-register-track="{triggerType:'click',page:'Category',operate:product && product.ename}"
               @click="goAllItemHandle(product,index)"
               v-for="(product ,index1) in item.child"  :key="index1" >
        <div class="info-img">
          <img  :src="product.images?product.images:emptyImg"  />
        </div>
        <div class="info-title text_ellipsis_2">{{product && product.ename?product.ename:''}}</div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import emptyImg from '@/assets/images/wrong.png';
export default {
  name: "category_product_model",
  props:{
    item:{
      type:Object,
      default:()=>{}
    },
    index:Number,
    categoryId:Number | String
  },
  data(){
    return{
      emptyImg,
      selectAllID:0
    }
  },
  methods:{
    goAllHandle(){
      this.$router.push({
        path:'/shoppingmall/categoryproduct',
        query:{
          categoryID:this.categoryId,
          operate:'category',
          name:this.item.ename,
          thirdid:this.item.id
        }
      })
    },
    goAllItemHandle(product,index){
      this.$router.push({
        path:'/shoppingmall/categoryproduct',
        query:{
          categoryID:this.item.id,
          operate:'categoryItem',
          name:product.ename,
          thirdid:product.id
        }
      })
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
.category_product_model{
  background-color: #fff;
  border-radius: 6px;
  margin-top: 6px;
  &_title{
    padding: 10px;
    font-size:14px;
    border-bottom: 1px solid #EEEEED;
    .title_tag{
      flex:5;
    }
    .model_link{
      flex:2;
      text-align: right;
      font-size:12px;
      color:#fcc900
    }

  }
}
.icon-biaoqian{
  font-size:10px;
  margin-right: 5px;
  color:red;
}
/deep/ .van-grid-item__text{
  font-size:12px;
  margin: 0 10px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.category_product_model_list{
  padding:10px 4px;
  .category_product_model_info{
    margin-bottom: 8px;
    .info-img{
      width:100%;
      height:82px;
      img{
        max-height:100%;
        max-width: 100%;
      }
    }
    .info-title{
      font-size:12px;
      margin:2px;
      height:30px;
    }
  }
}

</style>
