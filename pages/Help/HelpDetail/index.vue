<template>
  <div class="help-detail-wrapper">
    <van-sticky>
      <van-nav-bar border @click-left="goBackHandle">
        <template slot="left"><van-icon name="arrow-left" size="24" color="#8B8989"/></template>
        <template slot="title">
          <strong>{{title}}</strong>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="help-detail-content">

        <Guidance :type="type" :title="title" v-if="type==='advancedguidance' || type==='beginnerguidance'"/>
        <search :title="title" :type="type" v-else-if="searchModal"/>
        <condition :title="title" v-else-if="type==='termsconditions'"/>
        <importer-code :title="title" v-else-if="type==='importercode'" />
        <our-price :title="title"  v-else-if="type==='ourprice'"/>
        <Shipping   v-else-if="type==='shipping'"/>
        <calculation-cost  v-else-if="type==='calculationcost'"/>
        <about-modal v-else-if="aboutModal" :type="type" />
        <help-modal v-else-if="helpModal" :type="type"/>


    </div>
  </div>
</template>

<script>
import Guidance from "../childComponent/Guidance";
import Search from '../childComponent/Search'
import Condition from "../childComponent/Condition";
import ImporterCode from "../childComponent/ImporterCode";
import OurPrice from "../childComponent/OurPrice";
import Shipping from "../childComponent/Shipping";
import CalculationCost from "../childComponent/CalculationCost";
import AboutModal from "../childComponent/AboutModal";
import HelpModal from "../childComponent/HelpModal";

export default {
  name: "index",
  components:{Guidance ,Search ,Condition ,ImporterCode ,OurPrice ,Shipping ,CalculationCost ,AboutModal ,HelpModal},
  computed:{
    type(){return this.$route.params.type},
    title(){
      switch (this.$route.params.type){
        case 'advancedguidance':return 'SSS Advanced guidance';
        case 'beginnerguidance':return 'SSS beginner guidance';
        case 'search':return 'Search';
        case 'placeyourorder':return 'Place your order'
        case 'recharge':return 'Recharge';
        case 'payfororder':return 'Pay for your order'
        case 'internationallogistics':return 'International logistics'
        case 'trackyourorder' :return'Track your order '
        case 'forwardingagency': return 'Forwarding agency'
        case 'termsconditions':return 'Terms & Conditions'
        case 'importercode':return 'Importer\'s Code';
        case 'ourprice':return'Our Price';
        case 'shipping' :return 'Shipping';
        case 'calculationcost':return 'Calculation Cost';
        case 'shopshipshake' :return 'Shopshipshake?';
        case 'collaboratewithus':return 'Collaborate width us';
        case 'privatepolicy' : return 'Private Policy';
        case 'contactus' : return 'Contract US';
        case 'refundpolicy' :return 'Refund Policy';
        case 'paymentprotection' : return 'Payment Protection';
        case 'faq' : return 'FAQ'
      }
    },
    aboutModal(){
      const type =this.$route.params.type;
      return type ==='shopshipshake' ||
            type==='collaboratewithus' ||
             type==='privatepolicy' ||
              type==='contactus'
    },
    helpModal(){
      const type =this.$route.params.type;
      return type==='refundpolicy' || type==='paymentprotection' || type==='faq'
    },
    searchModal(){
     const type =this.$route.params.type;
     return type==='search' ||
            type==='placeyourorder'||
            type==='recharge' ||
            type==='payfororder' ||
            type==='internationallogistics' ||
            type==='trackyourorder' ||
            type==='forwardingagency'
    }
  },
  methods:{
    goBackHandle(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="less">
.help-detail-wrapper{}
.help-detail-content{
  padding:20px 15px 60px;
}
  .scrollHeight{
    height:calc(100vh - 50px - 50px)
  }
</style>
