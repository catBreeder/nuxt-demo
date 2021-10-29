<template>
    <div class="colume_popup_box" v-if="seasys">
      <div class="g_mb_l">R{{seasys.seabaseprice }}/m³</div>
      <div class="g_mb_l">Minimum shipping volume from {{seasys.seamin}}m³</div>
      <div class="g_mb_l">The parts less than {{seasys.seabase}}m³ will be charged as {{seasys.seabase}}m³</div>
      <div class="colume-eg">
        <van-row>
          <van-col span="8">
            <div>E.g:</div>
          </van-col>
          <van-col span="16">
            <div>{{seasys.seaegdata10}}m³ = {{seasys.seaegdata11}}m³</div>
            <div>{{seasys.seaegdata20}}m³ = {{seasys.seaegdata21}}m³</div>
          </van-col>
        </van-row>


      </div>
      <div class="g_mb_m">sliver:5% off;</div>
      <div class="g_mb_m">gold:10% off;</div>
      <div class="g_mb_m">platinum:15% off;</div>
      <div class="operate-btn d_flex ">
        <div class="ok-btn" @click="closeHandle">OK</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
      props:{
        seasys:{type:Object,default:()=>{}}
      },
      methods:{
        closeHandle(){this.$emit('closeEmit')}
      }
    }
</script>

<style scoped lang="less">
.colume_popup_box{
  padding:20px;
  color:#2A2A2A;
  line-height:1.5;
  font-size:16px;
}
  .colume-eg{
    color:gray;
    padding:10px 0;
    font-weight: normal;
    font-size:16px;
  }
  .operate-btn{
    padding-top:20px;
    justify-content: center;
    padding-bottom: 20px;
    .ok-btn{
      color:#2A2A2A;
      padding: 6px 30px;
      background:lightskyblue;
      border-radius: 6px;
      font-weight: normal;
    }
  }
</style>
