<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title>Size Guide</template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView bg_white">
        <div class="size_guidance_wrapper">
            <div class="size_guidance_tip g_mb_l">Tips</div>
            <p class="color_orange_red">a. If size Information is displayed in product detail , please be suject to product detail.</p>
            <p class="color_orange_red">b. The information mentioned above is for reference only.</p>
            <p class="color_orange_red">c. The information follows the standard international size chart and the information is not enforced by law.</p>
          <div class="size_guidance_tip g_mb_l">1. Measurement</div>
          <div class="size_guidance_litter_title g_mb_l">How do I measure my body?</div>
          <div class="img-box">
            <img src="~assets/images/productDetail/measurement_reference1.jpg" alt="">
          </div>
          <div class="img-box">
            <img src="~assets/images/productDetail/measurement_reference2.jpg" alt="">
          </div>
          <div class="size_guidance_litter_title g_mb_l">How do I measure my feet?</div>
          <div class="img-box">
            <img src="~assets/images/productDetail/measurement_reference3.jpg" alt="">
          </div>
          <div class="size_guidance_litter_title g_mb_l">How do I measure my Chest?</div>
          <div class="img-box">
            <img src="~assets/images/productDetail/measurement_reference4.jpg" alt="">
          </div>
          <div class="size_guidance_tip g_mb_l">Tips</div>
          <p>
            a. The tags on clothes usually tell you the measurements (height, waist, bust, body weight, etc.).
            <br>

            For example, “160/68A”, “160” is height and “68” is bust or waist. “A” is a reference to expanded size.
            “A” means normal size, “B” means larger than average, “C” means extra large, and “Y” means smaller than average.

          </p>
          <p>b. There are three different sizes for pants due to the length difference. “S” means shorter than average, “R” means average length, and “L” means longer than average.
            <br>

            For example, you may see “29W x 30L” on jeans, “29W” means that the waist is 29 inches, and “30L” means that the length of the inseam (from crotch to bottom) is 30 inches (1 inch equals 2.54 centimeters).

          </p>
          <p>
            c. The standards may vary for different stores on Taobao. We suggest that you use your body measurements (bust, waist, hip) as a reference when selecting the size. When measuring your body, please make sure that the tape measure is straight and wrap the tape measure loosely around your body. There might be a 1 to 3 centimeters difference for manual measurement.
          </p>
          <p>
            d. Please measure your feet in the afternoon since your feet will be larger than normal during that time. Your feet are not perfectly symmetrical so please use the size of your larger foot. The shoe size in China does not indicate the width of your feet so please select a larger size if your feet are wider than average. For example, if your size is 8, please go with 8.5.
          </p>
          <div class="size_guidance_tip g_mb_l">2. Size Conversion Chart</div>
          <p>Reference Size Chart for Women’s Tops</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/women_tops.png" alt="">
          </div>
          <p>Reference Size Chart for Women’s Pants</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/women_pants.png" alt="">
          </div>
          <p>Reference Size Chart for Men’s Tops</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/men_tops.jpg" alt="">
          </div>
          <p>Reference Size Chart for Men’s Pants</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/men_pants.jpg" alt="">
          </div>
          <p>Reference Size Chart for Shoes</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/shoes.png" alt="">
          </div>
          <p>Reference Size Chart for Bra</p>
          <div class="img-box">
            <img src="~/assets/images/productDetail/bra.png" alt="">
          </div>
          <div class="answer_bottom">
            <div class="answer_bottom_title">Is this helpful for you?</div>
            <div>
              <van-button plain type="info" :disabled="disabled" size="small" class="g_mr_l" @click="operateHandle('1')">
                <van-icon name="good-job-o" size="16"/> YES</van-button>
              <van-button plain type="danger"  :disabled="disabled" size="small" @click="operateHandle('2')">
                <van-icon name="good-job-o" size="16"/> NO</van-button>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
    import ScrollView from "@/components/common/ScrollView";
    import {questionOperateApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Size Guide - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView},
        methods:{
          goBackHandle(){this.$router.back()},
          operateHandle(count){
            this.disabled = true;
          }
        },
      data(){
          return{
            disabled:false
          }
      }
    }
</script>

<style scoped lang="less">
.size_guidance_wrapper{
  padding:15px;
  .size_guidance_tip{
    font-size:16px;
    font-weight: bold;
  }
  p{
    font-size:15px;
    line-height: 1.4;
    margin:12px 0;
  }
  .size_guidance_litter_title{
    font-weight: bold;
    margin:10px 0;
  }
  .img-box{
    img{
      display: block;
      max-width: 100%;
      height: auto;
    }
  }

}
.answer_bottom{
  padding:20px ;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.answer_bottom_title{
  font-size:18px;
  margin-bottom: 15px;
}
  .scrollCommonHeightView{
    background-color: #fff;
  }
</style>
