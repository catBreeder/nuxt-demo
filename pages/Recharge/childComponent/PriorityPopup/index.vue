<template>
  <div class="priority-content">
    <van-swipe :loop="false" :height="viewMinHeight"
               v-if="memberShip && (memberShip[$config.memberType.PLATINUM] || memberShip[$config.memberType.GOLDEN])">
      <van-swipe-item :style="{height:viewMinHeight+'px'}" >
        <div class="priority-item" ref="sliverRef">
          <div class="item-img">
            <div class="gold-img"> <img src="~assets/images/common/sliver.png" alt=""></div>
            <div class="gold-title">Sliver Priorities</div>
          </div>
          <div class="item-list" :style="{height:(viewMinHeight-100)+'px'}" style="overflow-y: scroll">
            <div class="item-list-item animate__animated animate__fadeInLeft" v-for="(item,index) in memberShip[$config.memberType.SILVER].priorityList" :key="index">
              <van-icon name="star" :color="item.prefix==1?'#fcc900':'#BEBEBE'" size="20"/>
              <span class="item-list-title">{{item.priority}}</span>
              <i class="iconfont icon icon-new1 color_warning" v-if="item.suffix==1"></i>
            </div>
          </div>
        </div>
      </van-swipe-item>

      <van-swipe-item :style="{height:viewMinHeight+'px'}" >
        <div class="priority-item" ref="goldRef">
          <div class="item-img">
            <div class="gold-img"> <img src="~assets/images/common/gold.png" alt=""></div>
            <div class="gold-title">Gold Priorities</div>
          </div>
          <div class="item-list"  :style="{height:(viewMinHeight-130)+'px'}" style="overflow-y: scroll">
            <div class="item-list-item animate__animated animate__fadeInLeft" v-for="(item,index) in memberShip[$config.memberType.GOLDEN].priorityList" :key="index">
              <van-icon name="star" :color="item.prefix==1?'#fcc900':'#BEBEBE'" size="20"/>
              <span class="item-list-title">{{item.priority}}</span>
              <i class="iconfont icon icon-new1 color_warning" v-if="item.suffix==1"></i>
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item :style="{height:viewMinHeight+'px'}" >
        <div class="priority-item" ref="platinumRef">
          <div class="item-img">
            <div class="gold-img"> <img src="~assets/images/common/platinum.png" alt=""></div>
            <div class="gold-title">Platinum Priorities</div>
          </div>
          <div class="item-list" :style="{height:(viewMinHeight-130)+'px'}" style="overflow-y: scroll">
            <div class="item-list-item animate__animated animate__fadeInLeft" v-for="(item,index) in memberShip[$config.memberType.PLATINUM].priorityList" :key="index">
              <van-icon name="star" :color="item.prefix===1?'#fcc900':'#BEBEBE'" size="20"/>
              <span class="item-list-title">{{item.priority}}</span>
              <i class="iconfont icon icon-new1 color_warning" v-if="item.suffix===1"></i>
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
    export default {
        name: "index",
      props:{
        memberShip:{
          type:Object,
          default:()=>{}
        }
      },
      data(){
          return {
            viewMinHeight:0
          }
      },
      mounted() {
          this.$nextTick(()=>{
            let goldRef = this.$refs.goldRef.clientHeight;
            let platinumRef = this.$refs.platinumRef.clientHeight;
            let sliverRef = this.$refs.sliverRef.clientHeight;
            this.viewMinHeight = Math.min(goldRef,platinumRef,sliverRef)
          })
      }
    }
</script>

<style scoped lang="less">
  /deep/.van-swipe__indicators{
    bottom:50px;
  }
  /deep/.van-swipe-item{
    height:372px;
  }
  .priority-content{
    background-color: #EEEEED;
    padding:10px 20px;
    .priority-item{
      background-color: #fff;
      border:1px solid #EEEEED;
      margin-right:15px;
      border-radius: 10px;
      display: flex;
      padding: 20px;
      flex-direction: column;
      align-content: center;
      .item-img{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .gold-img{
          width:50px;
          height:50px;
          img{
            width:100%;
            height:auto;
          }
        }
        .gold-title{
          flex:1;
          padding-bottom:4px;
          font-size:20px;
          font-weight: bold;
          margin-left: 20px;
          border-bottom:6px solid #fcc900;
        }
      }
      .item-list{
        padding:0 0 20px;
        .item-list-item{
          padding:4px ;
          display: flex;
          margin-bottom: 6px;
          align-items: center;
          background:pink;
          color:gray;
          border-radius: 4px;
          .item-list-title{
            margin-left:7px;
          }
          .icon-new1{
            font-size:20px;
          }
        }
      }
    }
  }

  /deep/.van-action-sheet__header{
    border-bottom:1px solid #EEEEED;
  }
</style>
