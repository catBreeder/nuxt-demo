<template>
    <div class="decleared_product_content" >

      <scroll-view class="scrollDeclearHeight">
        <van-notice-bar :scrollable="false" wrapable text="Please fill the the products name in the grey blank. And the one showing in the black is the declared name.
" />
        <van-notice-bar :scrollable="false" class="g_mb_m" wrapable text="And if you need to change the declared name, you can click edit button."/>
        <div class="decleared_product_list" v-for="(item,index) in nameList" :key="index">
          <div class="item_product_name color_intro">{{item.productname}}</div>
          <div class="item_category_name d_flex ">
            <template v-if="item.isEdit">
              <van-field v-model="item.nameEdit" />
              <van-icon name="cross" size="16"  class="color_intro g_ml_l"  @click="cancelItemHandle(item.orderid)"/>
            </template>
            <template v-else >
              {{item.categoryen}}
              <van-icon name="edit" size="20"  class="color_blue g_ml_l" @click="editItemHandle(item.orderid)"/>
            </template>

          </div>
        </div>
      </scroll-view>
      <div class="declear_footer">
          <van-button class="confirm_btn" @click="confirmEditHandle">Confirm</van-button>
      </div>
    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    export default {
        name: "DecleareProductName",
        components:{ScrollView},
        data(){
          return{
            nameList:[]
          }
        },
        props:{
          declarednamemaplist:{type:Array,default:()=>[]}
        },
        methods:{
          editItemHandle(orderid){
            this.nameList = this.nameList.map(item=>{
              if(item.orderid == orderid){
                item.isEdit = true;

              }
              return item;
            })
          },
          cancelItemHandle(orderid){
            this.nameList = this.nameList.map(item=>{
              if(item.orderid == orderid){
                item.isEdit = false;
              }
              return item;
            })
          },
          confirmEditHandle(){
            let newValue = this.nameList.filter(item=>item.isEdit) || [];
            let option ={};
            newValue.forEach(item=>{
              option[item.orderid] = item.nameEdit
            })
            this.$emit('confirmEditEmit',option)
          }
        },
        created() {
          this.nameList= this.declarednamemaplist.map(item=>{
            item.isEdit = false;
            item.nameEdit = '';
            return item;
          })
        },

    }
</script>

<style scoped lang="less">
  .scrollDeclearHeight{
    border-top:1px solid #EEEEED;
    padding-top: 15px;
    height:65vh;
    margin-bottom: 50px;
    /deep/.van-notice-bar--wrapable{
      padding:2px 6px;
    }
  }
  .declear_footer{
    position: absolute;
    bottom:0 ;
    right:0;
    left:0;
    background-color: #fff;
    border-top:1px solid #EEEEED;
    padding:10px 25px 15px;
    text-align: right;
    .confirm_btn{
      background-color: #FCC900;
      border-radius: 4px;
      font-size:15px;
    }

  }
.decleared_product_content{
  padding:15px 4px;
  .decleared_product_list{
    margin-bottom: 12px;
    border-radius: 4px;
    border:1px solid #EEEEED;
    padding:8px;
    .item_product_name{
      font-size:13px;
      line-height:1.4;
    }
    .item_category_name{
      margin-top: 4px;
      padding:6px 10px 6px 0 ;
      font-size:13px;
    }
  }
}
</style>
