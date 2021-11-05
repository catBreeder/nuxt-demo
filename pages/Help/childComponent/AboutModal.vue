<template>
  <div class="about-wrapper">
    <scroll-view class="scrollViewHeight">
      <template v-if="type==='shopshipshake'">
        <div class="about-title">What is Shopshipshake?</div>
        <div class="about-intro">
          <p>
            Shopshipshake ("Triple S") is a direct-from-factory platform based on 1688.com, and  is the only strategic partnership with Alibaba 1688.com in Africa. We will support Taobao and Tmall in the near future.
          </p>
          <p>

            Our technology innovation on the supply chain enables us to offer people in South Africa the best prices by connecting you
            with factories in China.

          </p>
        </div>
        <div class="about-title">What is the Advantages of Shopshipshake?</div>
        <div class="about-intro">
          <p>
            Our technology bypasses distributors and lowers prices you find on Wish/EBay/Amazon/and Aliexpress by 20%-40%</p>
        </div>
        <div class="about-title">Niche Products</div>
        <div class="about-intro">
          <p>
            You could find trendy products from popular in the world on Shopshipshake with the help of our advanced technology.</p>
        </div>
        <div class="about-title">Low Shipping Fees Express</div>
        <div class="about-intro">
          <p>
            Through Shopshipshake you can buy products from factories in China.</p>
          <p>
            Multiple items, one package, one shipping fee.</p>
        </div>
        <div class="about-title">Assured Quality</div>
        <div class="about-intro">
          <p>
            Our customer service team will communicate with factories on your behalf about whatever questions</p>
          <p>
            you may have with your order. We built a comprehensive quality control system to filter out </p>
          <p>
            factories that do not meet our standards.</p>
        </div>
      </template>
      <template v-else-if="type==='collaboratewithus'">
        <div class="about-title-big">Do you want to be a Shopshipshake Ambassador?</div>
        <div class="about-intro">
          Then don’t hesitate to send us an email ( service@shopshipshake.com). You may get free items from Shopshipshake or a long-term collaboration according to your skills.
          Collaboration Policy</div>
        <div class="about-title">1. Requirements</div>
        <div class="about-intro">
          <p>
            Youtube or Instagram influencers.</p>
          <p>
            Facebook: Over 3,000 subscribers in your group </p>
          <p>
            Youtube: Over 1,000 subscribers. Instagram: 1,000 followers.</p>
        </div>
        <div class="about-title">2. Steps</div>
        <div class="about-intro">
          <p>
            Contact service@shopshipshake.com and send your:</p>
          <p>
            Name:</p>
          <p>
            Location:</p>
          <p>
            Website/Youtube/Instagram Link & number of Subscribers:</p>
          <p>
            Brands you have worked with:</p>
          <p>
            More about you:</p>
        </div>
        <div class="about-title">3. Other conditions</div>
        <div class="about-intro">
          <p>
            If you don't meet all the requirements and want to promote for us, please feel free to share your best photos or vidoes using hashtag #shopshipshake for a chance to be featured on our social media pages
          </p>
        </div>
      </template>
      <template v-else-if="type==='privatepolicy'">
        <div class="about-intro">
<!--          <p>-->
<!--            Your privacy is important to us at Shopshipshake As such, we are committed to being transparent and open. This Privacy Policy explains how we collect and utilize information about our customers.-->
<!--          </p>-->
          <p class="g_mb_l">Shopshipshake "the App” provides Product Sourcing and Fulfillment Services "the Service" to merchants who use Shopify to power their stores.</p>
          <p>This Privacy Policy describes how your personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.</p>
          <div class="about-title g_mt_l g_mb_l">Personal Information the App Collects</div>
          <p class="g_mb_l">When you install the App, we are automatically able to access certain types of information from your Shopify account: such as site name (domain name),
            email address, cookies data of web browser, and other relevant data. For more information about cookies,
            and how to disable cookies. This information is used by us to identify you and provide you with services,
            mailings, notification, support, and to meet other contractual obligations. </p>
          <p class="g_mb_l">When your customers log in or register a new account on your website using their social network account, we collect the following types of personal information from your customers: social network account information (ID, email, encrypted password, link to avatar image, link to profile page), their registration date, last login time.
            This information will be used for the next time your customers log in to your site and help you gather data about your customers.</p>
          <p class="g_mb_l">
            When you install and use our App, we do not collect, process, or retain any personal data of the customers or visitors or your Shopify store.
          </p>
          <div class="about-title g_mt_l g_mb_l">How Do We Use Your Personal Information?</div>
          <p>We use the personal information we collect from you in order to provide the Service and to operate the App. Additionally, we use this personal information to:
            Communicate with you; Optimize or improve the App; and Provide you with information relating to our products or services. </p>
          <div class="about-title g_mt_l g_mb_l">Sharing Your Personal Information</div>
          <p class="g_mb_l">We commit to protect your Personal Information without sharing to any third party or using for remarketing or targeted advertising campaign. 
            Finally, we may share your Personal Information to comply with applicable laws and regulations,
            to respond to a subpoena, search warrant or other lawful requests for information we receive, or to otherwise protect our rights.</p>
          <div class="about-title g_mt_l g_mb_l">Changes </div>
          <p class="g_mb_l">We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other
            operational, legal, or regulatory reasons.</p>
          <div class="about-title g_mt_l g_mb_l">Contact Us  </div>
          <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at service@shopshipshake.com.</p>
        </div>
      </template>
      <template v-else-if="type==='contactus'">
        <div class="about-intro">
          <p>Email:Service@shopshipshake.com </p>
          <p>facebook: <a target="_blank" href="https://www.facebook.com/shopshipshake/">https://www.facebook.com/shopshipshake/</a></p>
          <p>WhatsAPP:+8618918902959</p>
        </div>
    </template>
    </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
export default {
  name: "AboutModal",
  props:['type'],
  components:{ScrollView}
}
</script>

<style scoped lang="less">
.about-wrapper{
  padding-top: 10px;
  color:#3d4145;
  .about-title{
      font-size:16px;
      font-weight: bold;
      margin-bottom: 10px;
  }
  .about-intro{
    font-size:13px;
    line-height:1.8;
    margin-bottom: 15px;
    a{
      color:#3d4145;
    }
  }
  .about-title-big{
    font-size:25px;
    font-weight: 500;
    line-height:1.5;
    margin-bottom: 15px;
  }
}
.scrollViewHeight{
  height:calc(100vh - 50PX - 50PX)
}
</style>
