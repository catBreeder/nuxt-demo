<template>
    <div>
      <div class="count-title">
        <div class="d_flex">
          <img src="~assets/images/help/cost.png" alt="" class="cost-img">
          How is it using the parameter
        </div>
        <div>{{kgCount}} to calculate Volumetric Weight?</div>
      </div>
      <div class="count-content">
        <div class="cube"><img src="~assets/images/help/cube.png" alt=""></div>
        <div>
          <strong>V = a(cm) * b(cm) * h(cm)</strong>
          <strong>Weight Volume = V / {{kgCount}} kg</strong>
        </div>
        <div class="content-mdeium">
          <div> E.g.:</div>
        </div>
        <div>
          <div>a=80cm,b=50cm,h=10cm</div>
          <br>
          <div style="line-height: 1.6">
            Weight Volume = 80*50*10 / {{kgCount}}  = {{kgCount==8000?5:10}} kg
          </div>
          <br>
          <div>
            Actual Weight:4kg
          </div>
          <br>
          <div>Chargeable Weight:  {{kgCount==8000?5:10}} kg</div>
        </div>
      </div>
      <div class="count-bottom d_flex d_flex_end">
        <van-button class="close-btn" @click="closeHandle">Close</van-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
      props:{
          kgCount:{type:Number,default:8000}
      },
      methods:{
        closeHandle(){
          this.$emit('closeEmit')
        }
      }
    }
</script>

<style scoped lang="less">
  .count-title{
    border-bottom: 1px solid #EEEEED;
    padding:10px 8px;
    .cost-img{
      width:35px;
      height:35px;
      margin-right: 8px;
      img{width:100%;height:100%;vertical-align: middle}
    }
    font-size:18px;
    line-height:1.8;
  }
  .count-content{
    padding:15px 30px;
    font-size:17px;
    border-bottom: 1px solid #EEEEED;
    strong{
      line-height:2;
    }
    .content-mdeium{
      margin:15px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .count-bottom{
    padding:10px;
    .close-btn{
      border-radius: 5px;
    }
  }
</style>
