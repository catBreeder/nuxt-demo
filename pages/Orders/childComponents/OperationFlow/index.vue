<template>
    <div class="operation-flow-wrapper">
      <van-cell>
        <template #title><div class="operate-title">Operation Flow</div></template>
        <template #label>
          <template v-if="tagActive==='all' || tagActive==='fail'">
            <van-row style="overflow:hidden;">
              <van-col span="6">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag"
                           :class="{'item-title-active':tagActive==='all' ||  tagActive==='fail'}">1</div>
                      <div class="item-title">Recharge& <br> Pay</div>
                      <div class="item-line" :class="{'item-title-active':tagActive==='fail'}"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="6">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag" :class="{'item-title-active':tagActive==='fail'}">2</div>
                      <div class="item-title">Purchase</div>
                      <div class="item-line"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="4">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag">3</div>
                      <div class="item-title">Collect<br>Parcels</div>
                      <div class="item-line"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="8">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag">4</div>
                      <div class="item-title">Recharge&Pay&Pay<br>Int'l Shipping Fee</div>
                      <div class="item-line"></div>
                    </div>
                  </div>
                </div>
              </van-col>
            </van-row>
          </template>
          <template v-else>
            <van-row style="overflow:hidden;">
              <van-col span="6">
                <div class="step-box">
                  <div class="steps-items step-item-one">
                    <div class="step-item" >
                      <div class="item-line-left item-title-active"></div>
                      <div class="item-circle item-title-active flow-tag">2</div>
                      <div class="item-title">Purchase</div>
                      <div class="item-line" :class="{'item-title-active':tagActive==='ship' || tagActive==='transit' || tagActive==='complete' || tagActive=='combine'}"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="5">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag" :class="{'item-title-active':tagActive==='ship' || tagActive==='transit' || tagActive==='complete' ||  tagActive=='combine'}">3</div>
                      <div class="item-title">Collect<br>Parcels</div>
                      <div class="item-line" :class="{'item-title-active':tagActive==='ship' || tagActive==='transit' || tagActive==='complete' || tagActive=='combine'}"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="8">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag" :class="{'item-title-active':tagActive==='transit' || tagActive==='complete'}">4</div>
                      <div class="item-title">Recharge&Pay&Pay<br>Int'l Shipping Fee</div>
                      <div class="item-line" :class="{'item-title-active':tagActive==='transit' || tagActive==='complete'}"></div>
                    </div>
                  </div>
                </div>
              </van-col>
              <van-col span="5">
                <div class="step-box">
                  <div class="steps-items">
                    <div class="step-item">
                      <div class="item-circle flow-tag" :class="{'item-title-active':tagActive==='transit' || tagActive==='complete'}">5</div>
                      <div class="item-title">Int’l Shipping <br> to Door</div>
                    </div>
                  </div>
                </div>
              </van-col>
            </van-row>
          </template>
        </template>
      </van-cell>
    </div>
</template>

<script>
    export default {
        name: "index",
        props:['tagIndex'],
        watch:{
            tagIndex:{
              immediate:true,
              deep:true,
              handler(value){
               this.tagActive= value;
              }
            }
        },
        data(){
            return{
              tagActive:null
            }
        },

    }
</script>

<style scoped lang="less">
.operation-flow-wrapper{
  /deep/.van-cell{
    padding:10px 4px;
  }
  border-bottom:8px solid #EEEEED;
  .operate-title{
    font-size:16px;
    padding-left: 12px;
  }
  .step-box{

    background-color: #fff;
    .steps-items{
      position: relative;
      display: flex;
      padding-bottom: 10px;
    }
    .step-item-one{
      margin-left: 10px;
    }
    .step-item{

      margin-top: 10px;
       display: flex;
      align-items: center;
      flex-direction: column;
      color: #969799;
      font-size:14px
    }
    .item-title{
      text-align: center;
      color:#2A2A2A;
      font-size:12px;
    }
    .item-title-active{
      background-color: #fcc900 !important;
    }
    .item-circle{
      width:32px;
      height:32px;
      border-radius: 50%;
      background:#9B9B9B ;
      color:#FFF;
      z-index:1;
      text-align: center;
      line-height: 32px;
      font-size:15px;
      font-weight: bold;
      margin-bottom: 10px;
      /*-webkit-transform: translateY(-50%);*/
      /*transform: translateY(-50%);*/
    }
    .item-line-left{
      top: 25px;
      left: 0;
      width: 100%;
      height:2px;
      position: absolute;
      background-color: #9B9B9B;
      -webkit-transition: background-color .3s;
      transition: background-color .3s;
    }
    .item-line{
      top: 25px;
      left: 40px;
      width: 100%;
      height:2px;
      position: absolute;
      background-color: #9B9B9B;
      -webkit-transition: background-color .3s;
      transition: background-color .3s;
    }
    .item-line::after{
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      top: -50%;
      right: -50%;
      bottom: -50%;
      left: -50%;
      border: 0 solid #EEEEED;
      -webkit-transform: scale(.5);
      transform: scale(.5);
    }
  }
}
</style>
