<template>
    <div>
      <van-sticky >
        <common-index-header
          page="个人中心"
          @clickLeftEmit="goOtherUrlHandle('index')"
          @clickRightEmit="goOtherUrlHandle('message')"
        >
          <i
            class="icon iconfont icon-kaitongxuzhi"
            v-click-track="{ triggerType: 'click', fun: 'intro' }"
            slot="left"
          ></i>
        </common-index-header>
      </van-sticky>
      <div class="notice-content">
        <van-notice-bar
          wrapable
          :scrollable="false"
          :text="resultMSG"
        />
      </div>
    </div>
</template>

<script>
    import {accountGroupShipBindResultApi} from '@/api/account'
    import CommonIndexHeader from "@/components/common/CommonIndexHeader";
    export default {
        name: "index",
        components:{CommonIndexHeader},
        data(){
          return{
            resultMSG:''
          }
        },
        methods:{
          goOtherUrlHandle(type) {
            let url = "";
            switch (type) {
              case "index":
                this.$router.replace("/");
                this.$EventBus.$emit("toIndex");
                break;
              case "message":
                this.$router.push("/message/index");
                break;
            }
          },
          bindGroupShipResultApi(){
            accountGroupShipBindResultApi(this.$route.query.inc).then(res=>{
              if(res.status==0){
                this.resultMSG = res.data.resultMSG;
              }
            })
          }
        },
      mounted() {
          this.bindGroupShipResultApi()
      }
    }
</script>

<style scoped lang="less">
  .icon-kaitongxuzhi {
    font-size: 25px;
    color: gray;
  }
  .notice-content{
    padding:15px 4px;
    margin-top:30vh;
    /deep/.van-notice-bar__content{
      font-size:20px;
      line-height:1.5;
    }
    /deep/.van-notice-bar{
      border-radius: 6px;
    }
  }
</style>
