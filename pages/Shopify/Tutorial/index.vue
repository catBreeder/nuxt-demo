<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title><div class="title">DROPSHIPPING WITH SHOPSHIPSHAKE</div></template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollHeightNoBar" style="background-color: #fff;">
        <div class="shopify-tutorial-content">
          <div class="parage"><span class="title-welcome">Welcome</span> to ShopShipShake Dropshipping - a business model, you find the right stuff to sell, then find the right customers to buy it. Reduce your cost burden and make money easily</div>
          <div class="tutorial-title g_mb_l">WHY YOU CHOOSE SHOPSHIPSHAKE DROPSHIPPING WORK?</div>
          <div class="card-item">
            <van-row>
              <van-col :span="7">
                <div class="card-item-img">
                  <img src="~assets/images/shopify/Key-benefits-4.jpg" alt="">
                </div>
              </van-col>
              <van-col :span="17">
                <div class="card-item-intro">
                  <div class="card-item-title card-item-title-first">Professional logistics</div>
                  <div class="card-item-title-intro">We have an exclusive and efficient logistics team that supports self-pickup or door-to-door deliver</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="card-item">
            <van-row>
              <van-col :span="7">
                <div class="card-item-img">
                  <img src="~assets/images/shopify/Key-benefits-1.jpg" alt="">
                </div>
              </van-col>
              <van-col :span="17">
                <div class="card-item-intro">
                  <div class="card-item-title">Mass supply</div>
                  <div class="card-item-title-intro">From the Chinese factory, there are a large number of products for you to choose, a complete variety</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="card-item">
            <van-row>
              <van-col :span="7">
                <div class="card-item-img">
                  <img src="~assets/images/shopify/Key-benefits-2.jpg" alt="">
                </div>
              </van-col>
              <van-col :span="17">
                <div class="card-item-intro">
                  <div class="card-item-title">Easy Operatio</div>
                  <div class="card-item-title-intro">Just click "list" to add to your website, you can easily modify the price and detailed information</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="card-item">
            <van-row>
              <van-col :span="7">
                <div class="card-item-img">
                  <img src="~assets/images/shopify/Key-benefits-3.jpg" alt="">
                </div>
              </van-col>
              <van-col :span="17">
                <div class="card-item-intro">
                  <div class="card-item-title">Package tracking</div>
                  <div class="card-item-title-intro">Package tracking, each package has a corresponding number, which is convenient for you to deliver</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="shopify-banner">
            <img src="~assets/images/shopify/banner-1.png" alt="">
          </div>
          <div class="shopify-banner">
            <video  controls="controls" width="100%" height="150" src="~assets/files/shopifytutorial.mp4"></video>
          </div>
          <div class="normal-title  g_mb_l">Add App</div>
          <div class="add_item">
            <van-row>
              <van-col :span="18">
                <div class="img_box">
                  <img src="~assets/images/shopify/Snipaste_2021-09-18_14-27-18.png" alt="">
                </div>
              </van-col>
            </van-row>
            <div class="add_item_intro">
              <p>First you need to add app, this is the link</p>
              <a href="https://apps.shopify.com/shopshipshake" target="_blank">https://apps.shopify.com/shopshipshake</a>
              <p>After “Add app”, you can synchronize the products to your</p>
            </div>
          </div>
          <div class="normal-title">Select Products</div>
          <div class="title">1. Log in to your shopshipshake account, click "shopify", as pictur</div>
          <div class="img_box">
            <img src="~assets/images/shopify/header.png" alt="">
          </div>
          <div class="title ">2 . The products on this page are the best-selling products</div>
          <div class="font_size_14 g_mb_l">For example, if you want to sell the product on the picture, you only need to click on "List" to synchronize it to your shopify online store</div>
          <div class="img_box">
            <img src="~assets/images/shopify/shopify商品页面.jpg" alt="">
          </div>
          <div class="img_box">
            <img src="~assets/images/shopify/00.png" alt="">
          </div>
          <div class="title">3 . There is a "listed" icon in the upper left corner of the product that has been added successfully</div>
          <div class="img_box">
            <img src="~assets/images/shopify/shopify商品页面.jpg" alt="">
          </div>
          <div class="img_box">
            <img src="~assets/images/shopify/商品.png" alt="">
          </div>
          <div class="normal-title g_mb_l">Edit product</div>
          <div class="title">1 . You can see the product you just added in "Draf</div>
          <div class="img_box">
            <img src="~assets/images/shopify/01.png" alt="">
          </div>
          <div class="title">2 .  Click on the product to edit</div>
          <div class="img_box">
            <img src="~assets/images/shopify/03.png" alt="">
          </div>
          <div class="title">3 .  Select "active" to launch the product</div>
          <div class="img_box">
            <img src="~assets/images/shopify/04.png" alt="">
          </div>
          <div class="shopify-banner g_mt_l">
            <img src="~assets/images/shopify/商品上架.jpg" alt="">
          </div>
          <div class="normal-title text-align g_mb_l">SO HOW TO SYNCHRONIZE YOUR ORDERS</div>
          <div class="title">1 . Find the order in your Shopify Backstage, we have the following picture #1049 as an example</div>
          <div class="img_box">
            <img src="~assets/images/shopify/05.png" alt="">
          </div>
          <div class="title">2 . Only after your customers have paid the money, the products will appear in your shopify shopping cart</div>
          <div class="img_box">
            <img src="~assets/images/shopify/06.png" alt="">
          </div>
          <div class="title">3 . Wait about half an hour to refresh the shopping cart, you can see the goods that the customer just paid. Then the subsequent purchasing process is the same as your usual purchasing process on our website.</div>
          <div class="img_box">
            <img src="~assets/images/shopify/07.png" alt="">
          </div>
          <div class="normal-title text-align">SIMPLE AND CONVENIENT！</div>
          <div class="normal-title g_mb_l text-align">WHAT ARE YOU WAITING FOR？</div>
          <div class="shopify-banner g_mt_l">
            <img src="~assets/images/shopify/海报-1.jpg" alt="">
          </div>
          <div class="normal-title text-align">CONTACT US</div>
          <div>If you don’t understand anything, you can consult your assistant or send a message to our email.</div>
          <div class="normal-title text-align">EMAIL ADDRESS:</div>
          <div class="title-email " s>Service@shopshipshake.com</div>

         <div class="title-email"> business@shopshipshake.com</div>
          <div class="title-support">
            <p>THANK YOU FOR YOUR SUPPORT</p>
            <p>ShopShipShake Dropshipping</p>
          </div>
        </div>
      </scroll-view>
      <van-image-preview v-model="isShowImage" :images="images"  />
    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    export default {
        name: "index",
        components:{ScrollView},
        data(){
          return{
            isShowImage:false,
            images:[]
          }
        },
        methods:{
          goBackHandle(){
            this.$router.back()
          },
          imageShowHandle(img){
            console.log(img);
            this.images = [...this.images,img]
             this.isShowImage = true;
          }
        }
    }
</script>

<style scoped lang="less">
  .title{
    font-size:14px;
    font-weight: bold;
    margin:12px 0;
  }
  .shopify-tutorial-content{
    padding:20px 10px;
    .parage{
      font-size:14px;
      line-height:1.5;
      text-indent: 2em;
      margin:8px 0;
      .title-welcome{
        color:#fcc900;
        font-style: italic;
        font-size:22px;
      }
    }
    .tutorial-title{
      font-size:13px;
      font-weight: bold;
      line-height: 1.5;
    }
    .card-item{
      border:1px solid #EEEEED;
      border-radius: 6px;
      margin-bottom: 6px;
      padding:10px 4px;
      .card-item-img{
        img{
          width: 100%;
          height:auto;
        }
      }
      .card-item-intro{
        .card-item-title-first{
          background: url('~assets/images/shopify/Key-benefits-4-1.png') no-repeat;
          background-size:30px 30px;
        }
        .card-item-title{
          height:35px;
          font-size:16px;
          padding-left: 40px;
          line-height:35px;

        }
        .card-item-title-intro{
          margin-top: 4px;
          font-size:13px;
          color:gray;
          line-height:1.5;
        }
      }
    }
    .shopify-banner{
      margin-bottom: 10px;
     img{ max-width: 100%;
       height:auto;}
      video{
        max-width: 100%;
        height:auto;
      }
    }
    .normal-title{
      font-size:20px;
      padding:10px 0;
    }
    .add_item{
      padding:10px 4px;
      .add_item_intro{
        margin-top: 15px;
        p{
          font-size:14px;
          line-height:1.5;
        }
        a{
          color:#007bff;
          text-decoration: underline;
          display: block;
          padding:6px 0;
          font-size:15px;
        }
      }
    }
  }
.img_box{
  img{
    width: 100%;
    height:auto;
  }
}
  .title-email{
    text-align: center;
    font-size:14px;
    margin-bottom: 10px;
  }
  .title-support{
    text-align: right;
    padding-right: 10px;
    font-size:12px;
    margin-top: 15px;
    p{line-height:1.6;}
  }
</style>
