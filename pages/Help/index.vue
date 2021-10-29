<template>
  <div class="s3-help-wrapper">
    <van-sticky>
      <common-index-header @clickLeftEmit="goBackHandle" @clickRightEmit="goMessageHandle">
        <van-icon name="arrow-left" slot="left" size="24" color="#8B8989"/>
      </common-index-header>
    </van-sticky>
    <scroll-view class="scrollHeight">
    <van-cell title="SSS Advanced guidance" is-link to="/helpcenter/index/advancedguidance"/>
    <van-cell title="SSS beginner guidance" is-link to="/helpcenter/index/beginnerguidance"/>
    <van-collapse v-model="activeName" accordion class="collapse-content" >
      <van-collapse-item title="How to use" name="1">
        <van-cell title="Search" class="g_bg" is-link to="/helpcenter/index/search"/>
        <van-cell title="Place your order"  class="g_bg" is-link to="/helpcenter/index/placeyourorder"/>
        <van-cell title="Recharge"  class="g_bg" is-link to="/helpcenter/index/recharge"/>
        <van-cell title="Pay for your order" class="g_bg" is-link to="/helpcenter/index/payfororder"/>
        <van-cell title="International logistics" class="g_bg" is-link to="/helpcenter/index/internationallogistics"/>
        <van-cell title="Track your order" class="g_bg" is-link to="/helpcenter/index/trackyourorder"/>
        <van-cell title="Forwarding agency"  class="g_bg" is-link to="/helpcenter/index/forwardingagency"/>
      </van-collapse-item>
    </van-collapse>
    <van-cell title="Terms & Conditions" is-link to="/helpcenter/index/termsconditions"/>
    <van-cell title="Importer's Code" is-link to="/helpcenter/index/importercode"/>
    <van-cell title="Our Price" is-link to="/helpcenter/index/ourprice"/>
    <van-cell title="Shipping" is-link to="/helpcenter/index/shipping"/>
    <van-cell title="Calculation Cost" is-link to="/helpcenter/index/calculationcost"/>
    <van-collapse v-model="aboutTab" accordion class="collapse-content">
      <van-collapse-item title="About Us">
        <van-cell title="Shopshipshake" class="g_bg" is-link to="/helpcenter/index/shopshipshake"/>
        <van-cell title="Collaborate with us "  class="g_bg"is-link to="/helpcenter/index/collaboratewithus" />
        <van-cell title="Private Policy" class="g_bg" is-link to="/helpcenter/index/privatepolicy" />
        <van-cell title="Contact Us" class="g_bg" is-link to="/helpcenter/index/contactus" />
      </van-collapse-item>
    </van-collapse>
    <van-collapse v-model="helpTab" accordion class="collapse-content">
      <van-collapse-item title="Help">
        <van-cell title="Refund Policy" class="g_bg" is-link to="/helpcenter/index/refundpolicy" />
        <van-cell title="Payment Protection" class="g_bg" is-link to="/helpcenter/index/paymentprotection" />
        <van-cell title="FAQ" is-link  class="g_bg" to="/helpcenter/index/faq" />
      </van-collapse-item>
    </van-collapse>
    </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
import CommonIndexHeader from "@/components/common/CommonIndexHeader";
export default {
  head(){
    return {
      title:'Help - shopshipshake'
    }
  },
  name: "index",
  components:{CommonIndexHeader,ScrollView},
  data(){
    return{
      activeName:'',
      aboutTab:'',
      helpTab:'',
    }
  },
  methods:{
    goBackHandle(){
      this.$router.replace('/')
    },
    goMessageHandle(){
      this.$router.push('/message/index')
    }
  },
}
</script>

<style scoped lang="less">
.icon-kaitongxuzhi{
  font-size:25px;
  color:#FCC900;
}
.s3-help-wrapper{
  .help-recharge-box{
    padding:15px;
    .help-recharge-parage{
      line-height:1.4;
      font-size:13px;
      color:#3d4145;
    }
    .help-recharge-img{
      img{
        width:100%;
        height:auto;
      }
    }
  }
}
/deep/.van-cell__title{
  font-size:15px;
  font-weight: 500;
}
.norm-title{
  font-size:15px;
  font-weight: bold;
}
.collapse-content{
  /deep/.van-collapse-item__content{
    background:#eeeeee;
  }
}
.scrollViewHeight{
  height:calc(100vh - 50px - 50px)
}
</style>
