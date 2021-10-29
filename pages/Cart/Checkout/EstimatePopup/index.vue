<template>
  <div class="estimate-wrapper">
    <div class="estimate-content">
      <div class="estimate-tip">

        Tips:The cost of paying for the goods in the shopping cart does not include this estimated International Freight Cost. You will pay for Int'l Freight Cost after your parcels are collected

      </div>
      <div class="estimate-choose-wrapper">
        <van-radio-group v-model="transferType" direction="horizontal">
          <van-radio name="1" class="g_mr_l" checked-color="#FCC900" icon-size="16">Air</van-radio>
          <van-radio name="2" icon-size="16" checked-color="#FCC900">Sea Shipping</van-radio>
        </van-radio-group>
        <template v-if="transferType==='1'">
          <div class="estimate-subtotal">Subtotal：{{subTotal}}</div>
          <div class="estimate-intro" >This result is <span class="color_warning">estimated</span> and <span class="color_warning">for reference</span> only</div>
          <div class="estimate-intro intro-link">
            <router-link to="/helpcenter/userguidance"> Click here to understand SSS operation porcess &gt;</router-link>
           </div>
          <template v-if="orderDetail">
            <div class="estimate-intro">
              Since there is no data in the system, the estimated total freight does not include the orders below
            </div>
            <div class="estimate-intro">order : <span v-html="orderDetail" ></span></div>
          </template>

        </template>
        <template v-else-if="transferType==='2'">
          <div class="estimate-intro estimate-sea">Being prepared, please wait...</div>
        </template>

      </div>
    <van-button block class="close-btn" @click="closeHandle">Close</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return{
      subTotal:'',
      orderDetail:'',
      transferType:'1'
    }
  },
  props:{
    estimateResult:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    estimateResult:{
      immediate:true,
      deep:true,
      handler(newVal){
        if(newVal){
           let   total = '';
          let nodatahtml = ''
          for(let i =0;i<newVal.length;i++){
            let order = newVal[i];
            let value = "R"+order.mincost+'~'+order.maxcost;
            if(order.nodata===1){
               value ="no data";
               if(order.id){
                 nodatahtml += '<a  class="esorder" style="color:#3597FF;" target="_blank" href="'+this.$config.jianweiDomain+'/shoporder/2/detail/'+order.id+'">' + order.orderno + "</a>;";
               }
            }
            if(!order.id){
               total = value;
            }
          }
          this.subTotal = total;
          this.orderDetail = nodatahtml
        }

      }
    }
  },
  methods:{
    closeHandle(){
      this.$emit('closeEmit')
    }
  }
}
</script>

<style scoped lang="less">
.estimate-wrapper{
  .estimate-title{
    height:50px;
    line-height:50px;
    padding:0 20px;
    font-size:16px;
    border-bottom:1px solid #EEEEED;
  }
  .estimate-content{
    padding:10px 8px;
    .estimate-tip{
      color:red;
      font-size:13px;
      line-height:1.4;
      margin-bottom: 8px;
    }
    .estimate-choose-wrapper{
      padding-left: 20px;
      font-size:14px;
      .estimate-subtotal{
        padding:15px 0;
        font-size:16px;
        color:#000;
        /*font-weight: bold;*/
      }
      .estimate-intro{
        margin-bottom: 20px;
      }
      .intro-link{
        text-decoration: underline;
        color:#0D0D0D;
        padding-bottom: 10px;
      }
      .estimate-sea{
        padding-top:20px;
      }
    }
  }
  .close-btn{
    background-color: #FCC900;
    border-radius: 6px;
  }
}
</style>
