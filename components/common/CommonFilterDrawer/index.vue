<template>
  <section>
    <div class="popup-top">
      Filter
    </div>
    <div class="popup-item">
      <div class="popup-item-name">Price</div>
      <div class="popup-item-input d_flex ">
        <div class="input-left"><input type="number" v-model="minPrice" @keydown="handleInput"  placeholder="Min price"></div>
        <div class="input-center"></div>
        <div class="input-right"><input type="number" v-model="maxPrice" @keydown="handleInput"  placeholder="Max Price"></div>
      </div>
    </div>
    <div class="popup-bottom d_flex">
      <van-button block class="reset-btn"
                  v-click-track="{triggerType:'click',fun:'Reset'}"
                  @click="resetHandle" >Reset</van-button>
      <van-button block class="done-btn"
                  v-click-track="{triggerType:'click',fun:'Done'}"
                  @click="doneHandle">Done</van-button>
    </div>
  </section>
</template>

<script>
  import { gTagFun } from '@/utils/buryPoint/gTag'
  export default {
    name: "index",
    data(){
      return{
        minPrice:null,
        maxPrice:null
      }
    },
    methods:{
      resetHandle(){
        this.maxPrice =null;
        this.minPrice =null;
        // this.$emit('resetEmit')
      },
      handleInput(e) {
        // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },
      doneHandle(){
        if(this.minPrice <0 || this.maxPrice <0){
          return this.$toast({message:'Price must be greater than 0 !'})
        }
        if(Number(this.maxPrice) < Number(this.minPrice)){
          [this.minPrice,this.maxPrice] = [this.maxPrice,this.minPrice]
          // return this.$toast({message:'The price range must be from low to high'})
        }
        gTagFun('OK','Filter','查询结果页面')
        this.$emit('doneEmit',{
          maxPrice:this.maxPrice,
          minPrice:this.minPrice
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .popup-top{
    padding:20px 10px;
    background-color: #eeeeed;
    font-weight: bold;
    font-size:15px;
    color:gray;
  }
  .popup-item{
    padding:10px;
    color:gray;
    .popup-item-name{
      color:#2a2a2a;
      font-size:16px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .popup-item-input{
      .input-left,.input-right{
        input{width:90px;height:30px;border-radius: 8px;border:0.5px solid #FCC900;padding:0 8px;}
      }
      .input-center{width:12px;border:0.5px solid gray;margin:0 8px;}
    }
  }
  .popup-bottom{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    /deep/.van-button{
      height:42px !important;
    }
    .reset-btn{
      background-color:#EEEEED;
      border-color:#EEEEED;
    }
    .done-btn{
      background-color: #FCC900;
    }
  }
</style>
