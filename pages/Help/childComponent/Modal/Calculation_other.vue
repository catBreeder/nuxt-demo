<template>
  <div class="cost-wrapper">
    <scroll-view class="scrollViewHeight">
      <div class="b_border g_pb_m">
        <div class="cost-title">Trial calculation of international freight:</div>
        <div class="form-container">
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">Postal Code<span class="color_warning"> *</span></div>
            <div class="form-input">
              <div class="input-area">
                <input type="text" placeholder="Postal Code"
                       v-model="searchKey.postal"
                       @focus="showListPopHandle('postal')"
                       class="input-area-input">
                <transition name="van-fade">
                  <div class="select-area" @click="visible.postal" v-if="visible.postal">
                    <input type="text" placeholder="Postal Code"
                           v-model="searchInput.postal"
                           @input="searchInputPostalHandle"
                           class="input-area-input">
                    <scroll-view class="scrollHeight" @reachBottom="loadMorePostalHandle">
                      <van-cell v-for="(item,index) in postalList"
                                @click="choosePostalItem(item)"
                                :key="index" :title="item.text" />
                    </scroll-view>
                  </div>
                </transition>

              </div>
            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">Suburb<span class="color_warning"> *</span></div>
            <div class="form-input">
              <div class="input-area">
                <input type="text" placeholder="Postal Code"
                       v-model="searchKey.suburb"
                       @focus="showListPopHandle('suburb')"
                       class="input-area-input">
                <transition name="van-fade">
                  <div class="select-area" @click="visible.suburb" v-if="visible.suburb">
                    <input type="text" placeholder="Suburb"
                           v-model="searchInput.suburb"
                           @input="searchInputSuburbHandle"
                           class="input-area-input">
                    <scroll-view class="scrollHeight" @reachBottom="loadMoreSuburbHandle">
                      <van-cell v-for="(item,index) in subrubList"
                                @click="chooseSuburbItem(item)"
                                :key="index" :title="item.text" />
                    </scroll-view>
                  </div>
                </transition>

              </div>
            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w"><div class="tag_icon g_mr-s ">1</div> Actual Weight(KG) <span class="color_warning"> *</span></div>
            <van-popover v-model="visible.actualWeight" placement="top-start">
              <span class="color_warning" style="font-size:14px;padding:0 5px;"> * this field is required</span>
              <template #reference>
                <div class="form-input">
                  <input type="number" v-model="searchKey.actualWeight">

                </div>
              </template>
            </van-popover>

          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">Length(CM) <span class="color_warning"> *</span></div>
            <div class="form-input">
              <van-popover v-model="visible.lengthVisible" placement="top-start">
                <span class="color_warning" style="font-size:14px;padding:0 5px;"> * this field is required</span>
                <template #reference>
                  <input type="number" v-model="searchKey.lengthInner">
                </template>
              </van-popover>

            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">width(CM) <span class="color_warning"> *</span></div>
            <div class="form-input">
              <van-popover v-model="visible.widthVisible" placement="top-start">
                <span class="color_warning" style="font-size:14px;padding:0 5px;"> * this field is required</span>
                <template #reference>
                  <input type="number"  v-model="searchKey.widthInner">
                </template>
              </van-popover>
            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">height(CM) <span class="color_warning"> *</span></div>
            <div class="form-input">
              <van-popover v-model="visible.heightVisible" placement="top-start">
                <span class="color_warning" style="font-size:14px;padding:0 5px;"> * this field is required</span>
                <template #reference>
                  <input type="number"  v-model="searchKey.heightInner">
                </template>
              </van-popover>
            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">Transport Service<span class="color_warning"> *</span></div>
            <div class="form-input">
              <select name="" id="Transport" class="select-item_3">
                <option value="1">Economical Air Freight(1/8000)(Door to door)</option>

              </select>
            </div>
          </div>
          <div class="form-item-intro" @click="showCountVisible= true">
            Estimate receive in 7-18 days,Volume weight according to 8000
            <van-icon name="question" size="16" style="vertical-align: middle"/>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w"><div class="tag_icon g_mr-s ">2</div> Volumetric Weight<span class="color_warning"> *</span></div>
            <div class="form-input">
              <van-popover v-model="visible.volumeVisible" placement="top-start">
                <span class="color_warning" style="font-size:14px;padding:0 5px;"> * this field is required</span>
                <template #reference>
                  <input type="number" v-model="volumeInner">
                </template>
              </van-popover>
            </div>
          </div>
          <div class="form-item">
            <div  class="g_ml_m form-label d_flex font_w">
              Chargable Weight（the greater of
              <div class="tag_icon g_mr-s g_ml_m">1</div>

              and

              <div class="tag_icon g_mr-s g_ml_m ">2</div>
              )
            </div>
            <div class="form-input">
              <input type="number" v-model="chargableWeight">
            </div>
          </div>
          <div class="form-item">
            <van-button type="default" class="submit-btn" @click="calculateHandle">calculation</van-button>
          </div>
        </div>
      </div>
      <div class="result-box">
        <strong>Result : {{resultData}} ZAR</strong>
      </div>
      <van-dialog v-model="showCountVisible"  show-cancel-button>
        <div class="count-popup-wrapper">
          <div class="count-popup-title">
            <div><img src="~assets/images/help/cost.png" alt="" class="cost-img"></div>
            <div>How is it using the parameter 8000 to calculate Volumetric Weight ?</div>
          </div>
          <div class="count-popup-content b_border">
            <van-row>
              <van-col span="18" offset="3">
                <div class="cube"><img src="~assets/images/help/cube.png" alt=""></div>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="18" offset="3">
                <h3>V = a(cm) * b(cm) * h(cm)</h3>
                <h3>Weight Volume = V / 8000 kg</h3>
                <h3 class="eg">E.g.:</h3>
                <h3>a=80cm,b=50cm,h=10cm</h3>
                <h3>Weight Volume = 80*50*10 / 8000 = 5kg</h3>
                <h3>Actual Weight:4kg</h3>
                <h3>Chargeable Weight: 5kg</h3>
              </van-col>
            </van-row>
          </div>

          <div class="count-popup-footer">
            <van-button type="default" class="close-btn" @click="showCountVisible = false">Close</van-button>
          </div>
        </div>

      </van-dialog>

    </scroll-view>

  </div>
</template>

<script>
  import { searchPostcodeApi ,calculationcostApi } from '@/api/help';
  import ScrollView from "@/components/common/ScrollView";
  export default {
    name: "CalculationCost",
    components:{ScrollView},
    data(){
      return{
        showCountVisible:false,
        searchKey:{
          postal:'',
          suburb:'',
          actualWeight:'',
          lengthInner:'',
          widthInner:'',
          heightInner:'',

        },
        searchInput:{
          postal:'',
          suburb:'',
        },
        postalCode:'',
        suburbCode:'',
        postalList:[],
        subrubList:[],
        visible:{
          postal:false,
          suburb:false,
          actualWeight:false,
          lengthVisible:false,
          heightVisible:false,
          widthVisible:false,
          volumeVisible:false,
        },
        resultData:'',
        page:1,
        postalPage:1,
        suburbPage:1,

      }
    },
    computed:{
      chargableWeight(){
        const value = this.searchKey.widthInner * this.searchKey.lengthInner * this.searchKey.heightInner;
        return this.searchKey.actualWeight > value ?this.searchKey.actualWeight :value;
      },
      volumeInner(){
        const value = this.searchKey.widthInner * this.searchKey.lengthInner * this.searchKey.heightInner;
        return value / 8000;
      }
    },
    methods:{
      //显示postallist

      loadMorePostalHandle(){
        this.postalPage++;
        searchPostcodeApi({
          search:this.searchInput.postal,
          type:'postcode',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = [...this.postalList,...res.list];
        })
      },
      loadMoreSuburbHandle(){
        this.suburbPage++;
        searchPostcodeApi({
          search:this.searchInput.suburb,
          type:'suburb',
          page:this.suburbPage,
        }).then(res=>{
          this.subrubList =[...this.subrubList,... res.list];
        })

      },
      choosePostalItem(item){
        let value = item.text.split(',');
        this.searchKey.postal = item.id;
        this.searchKey.suburb = value[1];
        this.visible.postal = false;

      },
      chooseSuburbItem(item){
        let value = item.text.split(',');
        this.searchKey.postal = value[1];
        this.searchKey.suburb = value[2];
        this.visible.suburb = false;
      },
      searchInputPostalHandle(event){
        this.getPostalList()
      },
      searchInputSuburbHandle(){

        this.getSurburbList()
      },
      showListPopHandle(type){
        switch (type) {
          case 'postal':
            this.visible.postal = true;
            this.getPostalList()
            break;
          case 'suburb':
            this.visible.suburb = true;
            this.getSurburbList()
            break;
        }
      },
      save(){
        const { postal ,suburb} = this.searchKey;
        let option={
          receivepostcode:postal,
          receivesuburb:suburb,
          transportmode:this.$config.transportWay.NORMAL,
          totalweight:this.chargableWeight
        }
        calculationcostApi(option).then(res=>{
          this.resultData = res;
        })
      },
      calculateHandle(){
        if(!this.searchKey.postal){
          this.visible.postal = true;
        }else if(!this.searchKey.suburb){
          this.visible.suburb = true;
        }else if(!this.searchKey.actualWeight){
          this.visible.actualWeight= true;
        }else if(!this.searchKey.widthInner){
          this.visible.widthVisible = true;
        }else if(!this.searchKey.heightInner){
          this.visible.heightVisible = true;
        }else if(!this.searchKey.lengthInner){
          this.visible.lengthVisible = true;
        }else if(!this.volumeInner){
          this.visible.volumeVisible = true;
        }else{
          this.save()
        }

      },
      postCodeInputHandle(event){
        if(event){
          this.searchKey.postal = event.id;
          let value =event.text.split(',');
          this.searchKey.suburb = value[1]
        }

      },
      suburbCodeInputHandle(event){
        if(event){
          this.suburbCode = event.id;
          let value = event.text.split(',');
          this.searchKey.postal = value[1];
          this.searchKey.suburb = value[0]
        }
      },
      getPostalList(){
        searchPostcodeApi({
          search:this.searchInput.postal,
          type:'postcode',
          page:this.postalPage,
        }).then(res=>{
          this.postalList = res.list;
        })
      },
      getSurburbList(){
        searchPostcodeApi({
          search:this.searchInput.suburb,
          type:'suburb',
          page:this.suburbPage,
        }).then(res=>{
          this.subrubList = res.list;
        })
      }
    },
    mounted() {
      // this.getPostalList();
      // this.getSurburbList()
    }

  }
</script>

<style scoped lang="less">
  .scrollHeight{
    height:160px;
    background-color: #fff;
  }
  //弹出层
  .count-popup-wrapper{
    color:#3d4145;
    padding:20px 10px 0;
    .count-popup-title{
      display: flex;
      .cost-img{
        width:40px;
        height:auto;
        margin-right: 10px;
      }
      font-weight: bold;
      font-size:20px;
      padding:10px 0;
      border-bottom:1px solid #EEEEED;
    }
    .count-popup-content{
      padding:30px 0 10px;
      .cube{
        width:150px;
        height:auto;
        margin-bottom: 30px;
      }
    }
    .eg{
      padding:10px 0;

    }
    h3{
      line-height:2;
    }
    .count-popup-footer{
      padding:10px 20px;
      text-align: right;
      .close-btn{
        font-size:15px;
        border-radius: 4px;
      }
    }

  }
  .submit-btn{
    margin-top: 20px;
    background:#FCC900;
    color:#222;
    border-radius: 4px;
  }
  .cost-wrapper{
    .cost-title{
      font-size:14px;
      font-weight: bold;
    }
    .form-container{
      padding-top: 20px;
      .select-item{
        padding:8px 70px 8px 10px;
        background:#fff;
        color: #555;
        font-size: 14px;
        border-radius: 6px;
        border:1px solid #ccc;
      }
      .select-item_2{
        padding:8px 50px 8px 10px;
        background:#fff;
        color: #555;
        font-size: 14px;
        border-radius: 6px;
        border:1px solid #ccc;
      }
    }
  }
  .result-box{
    font-size:15px;
    padding-top:20px;
    padding-bottom: 30px;
  }
  strong{
    display: block;
  }
  .form-item{
    margin-top: 12px;
  }
  .form-label{
    font-size:13px;
    .tag_icon{
      border:1px solid orange;
      border-radius: 50%;
      width:20px;
      height:20px;
      text-align: center;
      line-height:20px;
    }
  }
  .form-input{
    margin-top: 8px;
    input{
      padding:9px 20px 9px 10px;
      border-radius: 6px;
      border:1px solid #e5e6e7;

    }
    .input-area{
      position:relative;
      .input-area-input{
        width:80%;
      }
      .select-area{
        position:absolute;
        z-index:5;
        padding:10px 10px;
        width:300px;
        top:45px;
        border-radius: 10px;
        border:1px solid #EEEEED;
        background-color: #fff;
        box-shadow: 20px 0 20px #EEEEED;
      }
      .select-area:after{
        content:'';
        position:
          absolute;bottom:100%;
        left:10px;
        width:0;
        height:0;
        border-width:8px
      ;border-style:solid;
        border-color:transparent;
        border-bottom-width:10px;
        border-bottom-color:#efefff;
      }
    }
  }
  .select-item_4{
    width:70%;
    padding:8px 10px 8px;
    background:#fff;
    color: #555;
    font-size: 14px;
    border-radius: 6px;
    border:1px solid #ccc;
  }
  .select-item_3{
    width:90%;
    padding:8px 0 8px;
    background:#fff;
    color: #555;
    font-size: 14px;
    border-radius: 6px;
    border:1px solid #ccc;
  }
  .form-item-intro{
    padding:20px 0 10px;
    font-size:14px;
    line-height: 1.5;
    font-weight:bold;
  }
  /deep/.van-dialog{
    width:95%;
  }
  /deep/.van-dialog__footer{
    display: none;
  }
  /deep/.vs__dropdown-toggle{
    padding:4px 10px;
    width:70%;
  }
  /deep/.vs__dropdown-menu {
    width:70%;
    font-size:14px;
  }
  /deep/.vs__clear{
    display: none;
  }
  /deep/.van-popover__wrapper{
    display: block;
  }
  .scrollViewHeight{
    height:calc(100vh - 50PX - 50PX)
  }
</style>
