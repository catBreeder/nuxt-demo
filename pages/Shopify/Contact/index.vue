<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Contact Us</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollHeightNoBar" style="background-color: #fff;">
        <div class="contact-content">
          <div class="person-info-card">
            <div class="card-title">
              Person Info
            </div>
            <div class="card-inner">
              <div class="item-info">
                <div class="item-info-label">Email:</div>
                <div class="item-info-title">{{personInfo.email}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">Name:</div>
                <div class="item-info-title">{{personInfo.name}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">Residential Address:</div>
                <div class="item-info-title">{{customer.address}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">Occupation:</div>
                <div class="item-info-title">{{customerinfo.occupation}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">Business Scope:</div>
                <div class="item-info-title">{{customerinfo.businessscope}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">WhatsApp:</div>
                <div class="item-info-title">{{personInfo.whatsapp}}</div>
              </div>
              <div class="item-info">
                <div class="item-info-label">Ownaccount:</div>
                <div class="item-info-title">{{customerinfo.ownaccountStr}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="contact-content">
          <div class="person-info-card">
            <div class="card-title">
              Contact Us
            </div>
            <div class="card-inner">
              <p>If you don’t understand anything, you can consult your assistant or send a message to our email.</p>
              <h4 class="g_mb_big">EMAIL ADDRESS</h4>
              <div class="email_name text-align">
                <div class="g_mb_m">Service@shopshipshake.com</div>
                <div>business@shopshipshake.com</div>
              </div>

              <div class="support_link text_align_r">THANK YOU FOR YOUR SUPPORT</div>
              <div class="support_link text_align_r">ShopShipShake Dropshipping</div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {getPersonInfoApi} from '@/api/shopify'
    export default {
        name: "index",
        components:{ScrollView},
        data(){
          return{
            personInfo:{},
            customer:{},
            customerinfo:{}
          }
        },
        methods:{
          goBackHandle(){
            this.$router.back()
          },
          getPersonInfoHandle(){
            getPersonInfoApi().then(res=>{
              this.personInfo = res.user || {};
              this.customer = res.customer || {}
              this.customerinfo = res.customerinfo || {}
              console.log(this.personInfo);
            })
          }
        },
      mounted() {
          this.getPersonInfoHandle()
      }
    }
</script>

<style scoped lang="less">
.contact-content{
  padding:15px 10px;
  .person-info-card{
    border:1px solid #EEEEED;
    border-radius: 4px;
    padding:0 10px;
  }
  .card-title{
    height:36px;
    line-height:36px;
    border-bottom:1px solid #EEEEED;
    font-size:20px;

  }
  .card-inner{
    padding:10px 0;
    font-size:15px;
    .item-info{
      margin-bottom: 12px;
      font-size: 15px;
      .item-info-title{}
      .item-info-label{
        margin-bottom: 6px;
        font-size:14px;
        color:dimgray;
      }
    }
    p{
      margin-bottom: 12px;
    }
    .email_name{
      margin-bottom: 30px;
    }
    .support_link{
      font-size:12px;
      margin-bottom: 4px;
      margin-right: 8px;
    }
  }
}
</style>
