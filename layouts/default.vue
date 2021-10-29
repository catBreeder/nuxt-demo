<template>
    <div>
       <nuxt/>
       <Footer v-if='!$route.meta.hideTabbar'/>
      <!--消息通知弹出框-->
      <van-popup v-model="isVisible" @click-overlay="closePopHandle"  round :close-on-click-overlay	="true" transition="fade">
        <notice-popup
          @hidePopupEmit="hidePopup"
          :popupItem="popupItem"
          :popupType="popupType"/>
      </van-popup>
      <van-popup v-model="evaluateVisible"  round >
        <div class="evaluate-content-wrapper"  @click.stop>
          <div class="evaluate-content-title d_flex d_flex_between">
            <div>
              <div class="font_size_title g_mb_m">Quick-quiz to get <span class="color_orange">{{evaluateInfo.scoin}}</span> S Coin</div>
              <div class="font_size_normal">Arrive in <span class="color_orange"> two</span> working days</div>
            </div>
            <div>
              <van-icon name="cross" size="20" @click="closeRateHandle"/>
            </div>
          </div>
          <scroll-view class="evaluateScroll">

            <div class="evaluate-content-box ">
              <!--          商品详情-->
              <div class="evaluate-goods-box" v-if="evaluateInfo.expressnumber">
                <div class="goods-box-title g_mb_l">
                  <div class="font_size_15 g_mb_m">{{evaluateInfo.expressnumber}}</div>
                  <div class="font_size_12 text_align_r">
                    <span class="color_intro">{{evaluateInfo.finishtime}}</span>
                    <span class="color_orange">Signed</span>
                  </div>
                </div>
                <div class="goods-box-list g_mb_l" v-if=" evaluateInfo.totalnum && evaluateInfo.totalnum>0">
                  <van-grid :border="false" :column-num="4">
                    <van-grid-item v-if="evaluateInfo.img1">
                      <van-image :src="evaluateInfo.img1" />
                    </van-grid-item>
                    <van-grid-item v-if="evaluateInfo.img2">
                      <van-image :src="evaluateInfo.img2" />
                    </van-grid-item>
                    <van-grid-item v-if="evaluateInfo.img3">
                      <van-image :src="evaluateInfo.img3" />
                    </van-grid-item>
                    <van-grid-item>
                      <div class="d_flex">Total <span class="color_orange font_w font_size_title g_ml_m">{{evaluateInfo.totalnum}}</span></div>
                    </van-grid-item>
                  </van-grid>
                </div>
                <div class="goods_rate g_mb_m">
                  <van-row>
                    <van-col span="12"><div class="good-intro-title g_mr_l">International Logistic</div></van-col>
                    <van-col span="12"><van-rate
                      v-model="evaluateInfo.score2"
                      :size="20"
                      @change="updateOrderHandle('logistic')"
                      color="#fcc900"
                      void-icon="star"
                      void-color="#eee"/></van-col>
                  </van-row>
                </div>
                <div class="goods_rate g_mb_l">
                  <van-row>
                    <van-col span="12"><div class="good-intro-title g_mr_l">Client Service</div></van-col>
                    <van-col span="12"><van-rate
                      @change="updateOrderHandle('service')"
                      v-model="evaluateInfo.score1" :size="20"
                      color="#ffd21e"
                      void-icon="star"
                      void-color="#eee"/></van-col>
                  </van-row>
                </div>
                <div class="goods_rate g_mb_l" v-if="evaluateInfo.evaluateambassador==1">
                  <van-row>
                    <van-col span="14"><div class="good-intro-title g_mr_l">Ambassador Services</div></van-col>
                    <van-col span="10"><van-rate
                      @change="updateOrderHandle('ambassador')"
                      v-model="evaluateInfo.valuationcontentambassador" :size="20"
                      color="#ffd21e"
                      void-icon="star"
                      void-color="#eee"/></van-col>
                  </van-row>
                </div>
                <div class="goods_remark g_mb_l" v-if="evaluateInfo.evaluateambassador==1">
                  <van-field
                    v-model="evaluateInfo.valuationcontent"
                    rows="1"
                    @blur="updateOrderHandle('ambassador')"
                    type="textarea"
                    maxlength="50"
                    placeholder="suggestions and comments"
                    show-word-limit
                  />
                </div>
                <div class="g_mb_l">
                  <div>Will you shop again via ShopshipShake?</div>
                  <div class="d_flex d_flex_between g_mt_s">
                    <van-radio-group v-model="evaluateInfo.intentionflg"

                                     direction="horizontal">
                      <van-radio :name="1"  @click="updateOrderHandle('again')" icon-size="16">Yes</van-radio>
                      <van-radio :name="2"   @click="updateOrderHandle('again')" icon-size="16">No</van-radio>
                    </van-radio-group>
                  </div>
                </div>
                <div class="goods_remark">
                  <van-field
                    v-model="evaluateInfo.valuationcontent"
                    rows="1"
                    @blur="updateOrderHandle('comments')"
                    type="textarea"
                    maxlength="50"
                    placeholder="suggestions and comments"
                    show-word-limit
                  />
                </div>
                <van-sticky :container="evaluateRef" :offset-top="60">
                  <div class="goods_btn-area">
                    <van-button class="close-btn" @click="closeRateHandle">Close</van-button>
                    <van-button class="submit-btn" @click="submitHandle">Submit</van-button>
                  </div>
                </van-sticky>

              </div>
              <!--          商品详情-->
              <div class="goods-list-box" v-if="evaluateInfo.totalnum>0">
                <input type="file" ref="inputRef" class="upload-input" accept="image/*"  @change="uploadFileHandle">
                <div class="goods-list-title">
                  <span>To better service,</span>
                  <br>
                  please write your advice about the products</div>
                <div class="goods-list">
                  <div class="goods-list-item g_pt_m b_border_dash" v-for="(item,index) in orderevaluationVoList" :key="index">

                    <van-row type="flex" align="center">
                      <van-col span="6">
                        <div class="goods-img">
                          <img :src="item.image" alt="">
                        </div>
                      </van-col>
                      <van-col span="17" offset="1">
                        <van-radio-group v-model="item.satisfied"   direction="horizontal">
                          <van-radio :name="1" @click="goodChangeHandle(item,'statify')" icon-size="15">satisfied</van-radio>
                          <van-radio :name="0" @click="goodChangeHandle(item,'statify')" icon-size="15">unsatisfied</van-radio>
                        </van-radio-group>
                        <div class="g_mt_s">
                          <van-field
                            v-model="item.description"
                            rows="1"
                            type="textarea"
                            @blur="goodChangeHandle(item,'remark')"
                            placeholder="want to say something?"
                          />
                        </div>
                        <van-grid class="g_mt_m">
                          <van-grid-item >
                            <div class="upload-item" @click="uploadImgHandle(item,0)">
                              <img :src="item.imageList[0]" alt="" v-if="item.imageList && item.imageList[0]">
                              <van-icon name="plus" v-else/>
                            </div>
                          </van-grid-item>
                          <van-grid-item >
                            <div class="upload-item" @click="uploadImgHandle(item,1)">
                              <img :src="item.imageList[1]" alt="" v-if="item.imageList && item.imageList[1]">
                              <van-icon name="plus" v-else/>
                            </div>
                          </van-grid-item>
                          <van-grid-item >
                            <div class="upload-item" @click="uploadImgHandle(item,2)">
                              <img :src="item.imageList[2]" alt="" v-if="item.imageList && item.imageList[2]">
                              <van-icon name="plus" v-else/>
                            </div>
                          </van-grid-item>
                          <van-grid-item >
                            <div class="upload-item" @click="uploadImgHandle(item,3)">
                              <img :src="item.imageList[3]" alt="" v-if="item.imageList && item.imageList[3]">
                              <van-icon name="plus" v-else/>
                            </div>
                          </van-grid-item>
                        </van-grid>
                      </van-col>
                    </van-row>
                  </div>

                </div>
              </div>
            </div>
          </scroll-view>

        </div>
      </van-popup>
      <Drag v-if="$route.meta.showQuestion"/>
    </div>
</template>
<script>
  import {
    showPopupApi,
    homeReadPopupApi,
    homePopupHandleApi,
    homePopupDraftApi
  } from '@/api/home';
  import NoticePopup from '@/components/content/Home/NoticePopup'
  import { getUserID} from '@/utils/memory'
  import ScrollView from "@/components/common/ScrollView";
import Footer from '../Layout/Footer.vue'
export default {
    components:{
        Footer,
      NoticePopup,
      ScrollView
    },
  data(){
    return{
      isVisible:false,
      popupItem:{},
      popupType:0,
      evaluateRef:'',
      //包裹评价
      evaluateInfo:{},//包裹评价详情
      evaluateVisible:false,//是否显示包裹评价
      orderevaluationVoList:[],//订单列表
      selectOrder:{},//选中上传的商品
      imageIndex:0
    }
  },
  computed:{
    isShowTime(){
      return this.popupType === this.$config.popupType.NOTICE ||
        this.popupType === this.$config.popupType.MESSAGE ||
        this.popupType===this.$config.popupType.FEEDBACK ||
        this.popupType ===this.$config.popupType.RESEARCH ||
        this.popupType === this.$config.popupType.FEEDBACK

    },
    isWindowtitle(){
      let value='';
      if(this.popupType === this.$config.popupType.FEEDBACK ||
        this.popupType === this.$config.popupType.TASK ||
        this.popupType === this.$config.popupType.COUPON ||  this.popupType === this.$config.popupType){
        value = this.popupItem.windowtitle
      }else if(this.popupType === this.$config.popupType.VIP){
        value = `Respectable ${this.popupItem.vipname} Membership`
      }else if(this.popupType === this.$config.popupType.RESEARCH){
        value =`Quick-quiz to win ${this.popupItem.scoin} S Coin`
      }else{
        value = this.popupItem.titlecontent
      }
      return value;
    }
  },
  // watch:{
  //   //监听路由变化
  //   '$route.path':{
  //     deep:true,
  //     immediate:true,
  //     handler(newVal){
  //       if(newVal){
  //         this.getPopupInfo();
  //       }
  //     }
  //   }
  // },
  methods:{
    //除了包裹评价关闭消息弹出框
    hidePopup(){
      this.isVisible = false;
      this.popupItem={}
      this.getPopupInfo()
    },
    //包裹评价点击close
    closeRateHandle(){
      homeReadPopupApi({id:this.evaluateInfo.expressid,type:this.popupType,ordertype:this.evaluateInfo.ordertype}).then(res=>{
        this.evaluateVisible = false;
        this.getPopupInfo()
      })
    },
    //包裹评价上传图片
    uploadImgHandle(item,index){
      this.selectOrder = item;
      this.imageIndex = index;
      this.$refs.inputRef.dispatchEvent(new MouseEvent('click'))
    },
    //包裹评价上传图片
    //包裹评价上传图片
    uploadFileHandle(){
      const inputFile = this.$refs.inputRef.files[0];
      let _upload = new XCUPload({
        file:inputFile,
        savePath:'3simgs',
        onComplete:(info)=>{
          this.orderevaluationVoList = this.orderevaluationVoList.map(order=>{
            if(order.shoporderid === this.selectOrder.shoporderid){
              if(this.imageIndex < order.imageList.length){
                order.imageList = order.imageList.map((image,index)=>{
                  if(index == this.imageIndex){
                    image = this.$config.onlineImgURL + info.path
                  }
                  return image;
                })
              }else{
                order.imageList =[...order.imageList,this.$config.onlineImgURL + info.path]
              }

            }
            return order;
          })
          let baseOption ={
            // draft:0,//是否保存草稿
            ordertype:this.evaluateInfo.ordertype,
            expressid:this.evaluateInfo.expressid,
            orderevaluationVoList:[{
              shoporderid:this.selectOrder.shoporderid,
              imageList:this.selectOrder.imageList
            }]
          }
          this.finalHandle(baseOption)

        }
      })
      _upload.upload()
    },
    goodChangeHandle(item,type){
      if(item.satisfied==0){
        this.$toast({message:'Please upload pictures'})
      }
      let baseOption ={
        // draft:0,//是否保存草稿
        ordertype:this.evaluateInfo.ordertype,
        expressid:this.evaluateInfo.expressid,
      }
      let option ={};
      switch (type) {
        case 'statify':
          option ={
            ...baseOption,
            ...{"orderevaluationVoList":[
                {"shoporderid":item.shoporderid,
                  "satisfied":item.satisfied}
              ]}
          }
          break;
        case 'remark':
          option ={...baseOption,
            ...{"orderevaluationVoList":[
                {"shoporderid":item.shoporderid,
                  description:item.description}
              ]
            }
          }
          break;

      }
      this.finalHandle(option)
    },
    //更新操作
    updateOrderHandle(type){
      let baseOption ={
        // draft:0,//是否保存草稿
        ordertype:this.evaluateInfo.ordertype,
        expressid:this.evaluateInfo.expressid,
      }
      let option ={};
      switch (type) {
        case 'logistic':
          //修改logistic
          option ={...baseOption, ...{score2:this.evaluateInfo.score2}}
          break;
        case 'service':
          //修改服务
          option ={...baseOption, ...{score1:this.evaluateInfo.score1}}
          break;
        case 'again':
          //再次购买
          option ={...baseOption,...{intentionflg:this.evaluateInfo.intentionflg}};
          break;
        case 'comments':
          //评价
          option ={...baseOption,...{valuationcontent:this.evaluateInfo.valuationcontent}};
          break;
        case 'ambassador':
          //团长评价
          option ={...baseOption,...{valuationcontentambassador:this.evaluateInfo.valuationcontentambassador}};
          break;

      }
      this.finalHandle(option)
    },
    //点击submit
    submitHandle(){
      let unSatifyList = this.orderevaluationVoList.filter(item=>item.satisfied==0);//不满意的
      let satifyList = this.orderevaluationVoList.filter(item=>item.satisfied!=0);//满意的
      let hasPic = false;
      if(unSatifyList.length){
        unSatifyList.forEach(item=>{
          if(item.satisfied==0 && item.imageList.length==0){
            hasPic = true;
          }
        })
      }
      if(this.evaluateInfo.score1==0 || this.evaluateInfo.score2==0){
        return this.$toast({message:'please mark our international Logistic  (Client Service )  '})
      }
      if(hasPic){
        this.$toast({message:'To show you a quick feedback, please upload the picture of product you are unsatisfied with.    '});
        this.orderevaluationVoList = [...unSatifyList,...satifyList];
      }else{
        let basicOption ={
          // draft,//是否保存草稿
          ordertype:this.evaluateInfo.ordertype,
          expressid:this.evaluateInfo.expressid,
        }
        homePopupHandleApi({
          type:this.popupType,
          annex:basicOption
        }).then(res=>{
          if(res.status==0){
            this.$toast({message:'Evaluation is successful !'})
            this.evaluateVisible = false;
            this.getPopupInfo()
          }else{
            this.evaluateVisible = false;
          }

        })
      }
    },
    finalHandle(option){
      homePopupDraftApi({
        type:this.popupType,
        annex:option
      }).then(res=>{

      })
    },
    closePopHandle(){
      //埋点
      homeReadPopupApi({id:this.popupItem.id,type:this.popupType}).then(res=>{
        this.isVisible = false;
        this.getPopupInfo()

      })
    },
    getPopupInfo(){
      if(!this.$route.path) return;
      //未登录仅仅在首页弹出
      if(!getUserID() && !(this.$route.path=='/shoppingmall/index' ||  this.$route.path=='/')) return;
      //登录检车session标记
      let interrupt_popupwindow_login = window.sessionStorage.getItem('interrupt_popupwindow_login')==1;
      if(getUserID() && interrupt_popupwindow_login){
        return;
      }
      let path = this.$route.path=='/shoppingmall/index'?'/home':this.$route.path;
      showPopupApi(`/shop${path}`).then(res=>{
        if(Number(res.status)!=500){
          if(res.message==this.$config.popupType.GUIDE){
            this.$EventBus.$emit('introBtnEmit',res.message)
          }else{
            this.popupType = Number(res.message);
            if(this.popupType == this.$config.popupType.RESEARCH){
              this.evaluateInfo = res.data.evaluation || {};
              if(this.evaluateInfo.orderevaluationVoList && this.evaluateInfo.orderevaluationVoList.length){
                this.orderevaluationVoList = this.evaluateInfo.orderevaluationVoList.map(item=>{
                  item.fileList=[];
                  if(item.imageList){
                    item.imageList.forEach(url=>{
                      item.fileList.push({'url':url});
                    })
                  }
                  return item;
                })

              }
              this.evaluateVisible = true;
            }else{
              let value = res.data.id?res.data.id:res.data.type;
              if(sessionStorage.getItem(`noticeID_${value}`) == value) return;
              sessionStorage.setItem(`noticeID_${value}`,value);
              this.popupItem ={
                content:res.data.content,
                id:res.data.id || '',
                time:this.popupType ===this.$config.popupType.RESEARCH?'Arrive in two working days':res.data.time,
                titlecontent:res.data.titlecontent|| '',
                type:res.data.type,
                unreadnum:res.data.unreadnum,
                windowtitle:res.data.windowtitle,
                customertype:res.data.customertype || '',
                question:res.data.question || '',
                feedback:res.data.feedback || '',
                vipname:res.data.vipname || '',
                date:res.data.date || '',
                money:res.data.money || '',
                remainday:res.data.remainday || '',
                couponlist:res.data.couponlist  || [],
                scoin:res.data.scoin || '',
                expressnumber  :res.data.expressnumber   || '',
                finishtime   :res.data.finishtime    || '',
                totalnumber   :res.data.totalnumber    || '',

              };
              this.isVisible = true;
            }
          }
        }else{
          if(res.data){
            sessionStorage.removeItem('interrupt_popupwindow_login');
          }else{
            if(getUserID()){
              sessionStorage.setItem('interrupt_popupwindow_login',1)
            }
          }
        }
      })
    },
  },
  created() {
    this.$EventBus.$on('popupEmit',()=>{
      this.getPopupInfo()
    })
  },
  mounted() {
    this.evaluateRef = this.$refs.evaluateRef;
    this.getPopupInfo()
  },
}
</script>
<style scoped lang='less'>
/deep/.introjs-button{
  padding:8px 10px !important;
}
/deep/.van-button{
    height:36px;
    line-height:36px;
}

/deep/ .van-button{
  height:36px !important;
  line-height:36px;
}
/deep/ .swiper-pagination-bullet-active{
  background-color: #FCC900;
}

/deep/ .van-row{
  margin-top: 0 !important;
}
/deep/ .van-button--primary{
  background-color:#fcc900;
  font-size:14px;
  border:1px solid #fcc900;
}
/deep/ .van-empty__image{
  width:100px;
  height:100px;

}
/deep/.van-tab--active{
  color:#FCC900;
}
/deep/.van-empty{
  padding:100px 0;
}
/deep/ .van-search{
  padding:0;
}
/deep/.van-tabs__line{
  background-color: #fcc900 !important;
}
//loading修改
/deep/.van-loading{
  text-align: center;
  margin:50vw 0;
}
/deep/.van-overlay{
  z-index:9999;
}
/deep/.van-nav-bar{
  box-shadow:5px 0 5px #EEEEED;
}
/deep/.van-checkbox__icon--checked .van-icon{
  background:#fcc900;
  border-color:#fcc900;
}
/deep/.van-nav-bar__left{
  cursor: pointer;
}
/*包裹评价 开始*/
/deep/.van-grid-item__content{
  padding:0;
}
.upload-item{
  height:60px;
  line-height:60px;
  img{
    width:100%;
    height:100%;
  }
}
.font_size_title{
  font-size:15px;
}
.font_size_normal{font-size:14px;color:#3d4145}
.evaluateScroll{
  height:72vh;
}
.evaluate-content-wrapper{
  background-color: #fff;
  width:92vw;

  /*  头部*/
  .evaluate-content-title{
    padding:10px 25px;
    border-bottom:1px solid #EEEEED;

  }
  /*  头部 end*/
  /*  内容 state*/
  .evaluate-content-box{

    /deep/.van-radio__icon--checked .van-icon{
      background: #fcc900;
      border-color: #fcc900;
    }
    /deep/.van-sticky--fixed{
      border-top:1px solid #EEEEED;
      box-shadow: 0 6px 6px #eee;
      transform: none !important;
    }
    padding:15px 15px 20px 15px;
    .evaluate-goods-box{
      .goods_rate{
        font-size:15px;
      }
      /deep/ .van-cell{
        padding:2px 10px;
        margin:4px 0;
        background-color: #EEEEED;

      }
      .goods_btn-area{
        padding:10px ;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        .close-btn{border-radius: 6px}
        .submit-btn{
          background-color: #fcc900;border-radius: 6px}
      }
      /deep/.van-field--min-height .van-field__control{
        min-height:30px;
        border-radius: 10px;
      }
    }
    .goods-list-box{
      .upload-input{
        display: none;
      }
      .goods-list-title{
        padding:10px 0;
        line-height:1.5;
        font-size:14px;
        color:#F00;
      }
      .goods-list{
        .goods-img{
          width:90px;
          height:90px;
          img{
            width:90%;
            height:auto;
            border-radius: 4px;
          }
        }
        /deep/ .van-cell{
          padding:4px 0;
          background-color: #EEEEED;
        }
        /deep/.van-uploader__file{
          width:45px;
          height:45px;
        }
        /deep/.van-uploader__upload{
          width:45px;
          height:45px;
        }
        /deep/.van-uploader__preview-image{
          width:45px;
          height:45px;
        }
      }
    }
  }
  /*  内容 end*/
}
/*包裹评价 结束*/
.header-wrapper{
  height:100%;
  position:relative;
  .close-tag{
    position: absolute;
    right:5px;
    top:10px;
    color:gray;
    font-size:18px;
    cursor: pointer;
  }
}
.content-title{
  font-size:15px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin-right:20px;
}
.text_l{
  justify-content: flex-start !important;
}
.content-time{
  font-size:13px;
  color:gray;
  text-align: left;
  padding-bottom:10px;
  padding-left: 8px;
}
.popup-content{

  .content-detail{
    text-indent: 10px;
    word-break: break-word !important;
    p{
      word-break: break-word;
    }
  }
}
.btn-content{
  text-align: center;
  font-weight: bold;
  color:#ff4062;
  padding:10px 4px 10px;
  background-color: #ffeab2;
  border-top:1px solid #EEEEED;

}
.task-content{
  background-color: #EEEEED;
  .task-list-content{
    background-color: #fff;
    padding:8px 10px;
    .task-title{
      font-size:12px;
      padding-bottom:8px;
      border-bottom:1px solid #EEEEED;
    }
    .task-list{
      P{
        padding:4px;
        font-size:14px;
      }
    }
    .task-btn{
      padding:10px 0;
    }
  }
}
.task-btn{

  /deep/ .van-button{
    height:30px !important;
    line-height:30px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #FCC900;
    font-weight: bold;
  }
}
.feedback-content{
  div{
    font-weight: bold;
    padding:4px 0;
  }
}
.coupon-content{
  .coupon-list{
    height:260px;
    .item-info{
      border-radius: 8px;
      border:1px solid #EEEEED;
      padding: 8px;
      margin-bottom:10px;
      display: flex;
      justify-content: space-between;
      .info-left-title{
        font-weight: bold;
        margin-bottom:8px;
      }
      .info-left-time{
        font-size:10px;
        color:gray;
      }
      .info-right{
        display: flex;
        justify-content: center;
        align-items: center;
        color:#FCC900;
        font-weight: bold;
      }
    }

  }
}
.vip-content{
  font-size:10px;
  line-height:2;
  .task-btn{
    padding:10px 0;
  }
}
.research-btn{
  justify-content: center;
  width:100%;
  display: flex;
  padding-bottom:8px;
  /deep/ .van-button{
    font-size:12px;
    margin-right:10px;
    border-radius: 4px;
  }
  .submit-btn{
    background: #FCC900;
  }
}
.research-content{
  .order-title{
    font-size:13px;
    color:#2A2A2A;
    padding-bottom: 6px;
  }
  .order-img{
    padding:8px 0;
  }
  .question-title{
    font-size:13px;
    font-weight: 500;
  }
  .textarea-content{
    background-color: #eeeeee;
    padding:4px;
    border-radius: 4px;
  }

}
/deep/.van-popup--center.van-popup--round{
  border-radius: 10px;
}
</style>
