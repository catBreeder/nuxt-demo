<template>
  <div class="customer-task-wrapper">
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title><div class="navbar_title">Influence</div></template>
      </van-nav-bar>
    </van-sticky>
    <div v-if="isInvalid">
      <van-notice-bar
        :scrollable="false"
        text="Invalid Client !"
      />
    </div>
    <section v-else>
      <scroll-view class="scrollHeightNoBar">
        <div class="customer-task-content">
          <!--          头部 start-->

          <div class="customer-task-header">
            <div class="rewards_card b_border">
              <div class="reward-item d_flex" v-if="customerInfo.type==1">
                <div @click="viewSkipHandle('reward')" class="item-money">Rewards of this month {{customerInfo && customerInfo.ap && apInfo.money/100 | moneyFormat}}</div>
                <van-icon name="arrow" class="g_ml_l" size="20" color="#fcc900"/>
              </div>
              <div v-else>
                <div class="reward-item reward-item-first">
                  <div class="item-title d_flex_between d_flex">
                    <div class="item-money-item d_flex">
                      <div class="item-money">R5.00</div> per person
                    </div>
                    <div  @click="viewSkipHandle('reward')"  class="item-link color_active d_flex">
                      My Rewards <van-icon name="arrow" size="20"/>
                    </div>
                  </div>
                  <div class="item-intro">successfully register through your link</div>
                </div>
                <div class="reward-item">
                  <div class="item-title d_flex_between d_flex">
                    <div class="item-money-item d_flex ">
                      <div class="item-money">R10.00</div> per person
                    </div>
                    <div class="item-link color_active d_flex">
                      <van-tag type="warning" size="large">Part time</van-tag>
                    </div>
                  </div>
                  <div class="item-intro">cumulative recharge more than 300</div>
                </div>
              </div>
            </div>
          </div>
          <!--          头部 end-->
          <div class="reward-link-content bg_white">
            <!--            进度条 start-->
            <div class="reward-link-progress g_mb_l" v-if="customerInfo.type==1">
              <div class="reward-progress-title d_flex d_flex_between g_mb_m">
                <div>L{{apInfo.level}}</div>
                <div>L{{customerInfo.level}}</div>
              </div>
              <van-progress stroke-width="10"
                            pivot-color="#fcc900"
                            :percentage="`${apInfo.cusqty }`"
                            color="linear-gradient(to right, #F5F5F5, #DCDCDC)"/>
            </div>
            <!--            进度条 end-->
            <div class="link-title d_flex_between d_flex">
              <div>Promotion Link</div>
              <van-tag color="#f8ac59" v-if="customerInfo.type==1">Full Time</van-tag>
            </div>
            <div class="link-content font_size_16 color_orange">{{copyLink}}</div>
            <div class="link-operate d_flex">
              <div class="link-copy" v-clipboard:copy="copyLink" v-clipboard:success="copyHandle">Copy Link</div>
              <div class="link-face" @click="facebookOperateHandle">f</div>
            </div>
            <div class="link-intro">

              After other users successfully register through your link
              <template v-if="customerInfo.type!=1">and complete <strong>Todo 1</strong>, <strong>Todo 2</strong> tasks</template>
              , you can get rewards.
            </div>
            <div class="link-operate ">
              <van-button size="medium" class="link-view-color" @click="viewSkipHandle('info')"  v-if="customerInfo.type!==1">
                View Tasks
              </van-button>
              <div class="d_flex" v-else>
                <van-button size="medium" class=" link-view-color g_mr_m" @click="viewSkipHandle('info')">
                  Rewards standard
                </van-button>
                <van-button size="medium" class=" link-tools-color" @click="viewSkipHandle('tool')">
                  Marketing tools
                </van-button>
              </div>
            </div>
          </div>
          <div class="customer-list-content bg_white">
            <div class="list-title font_size_18 b_border">Customer List</div>
            <div class="list-content" >
              <van-tabs v-model="tabIndex" animated @change="tabChangeHandle">
                <van-tab :name="item.value" v-for="(item,index) in tabList" :title="item.name" :key="index"/>
              </van-tabs>

              <scroll-view class="customerListScroll" @reachBottom="loadMoreHandle">

                <div class="customer-list">
                  <van-row class="list-title">
                    <van-col :span="10" class="font_size_16 text-align">Cellphone</van-col>
                    <van-col :span="7" class="font_size_16 text-align">
                      <span>{{customerInfo.type==1?'Time':'Todo1'}}</span>
                    </van-col>
                    <van-col :span="7" class="font_size_16 text-align" v-show="customerInfo.type!=1">Todo2</van-col>
                  </van-row>
                  <van-empty description="No data at present....." v-if="customerList.length==0">
                    <img src="~assets/images/common/empty.png" alt="" slot="image">
                  </van-empty>
                  <template v-else>
                    <van-row type="flex" align="bottom" v-for="(item,index) in customerList" :key="index" class="list-item">
                      <van-col :span="10" class=" text-align">{{item.cellphone}}</van-col>
                      <van-col :span="7" class=" text-align">
                        <template v-if="customerInfo.type==1">
                          {{item.regtime}}
                        </template>
                        <template v-else>
                          <van-icon :name="item.todo1==1?'checked':'clear'" size="24" :color="item.todo1==1?'#fcc900':'#f00'"/>
                        </template>
                      </van-col>
                      <van-col :span="7" class="font_size_16 text-align" v-show="customerInfo.type!=1">
                        <van-icon :name="item.todo2==1?'checked':'clear'" size="24" :color="item.todo2==1?'#fcc900':'#f00'"/>
                      </van-col>
                    </van-row>
                    <div class="list_bottom" v-show="customerList.length>6">
                      <van-loading size="20px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
                      <div class="icon iconfont icon-end color_intro text-align" v-if="status==$config.loadingType.FINISHED"/>
                    </div>
                  </template>
                </div>

              </scroll-view>
            </div>
          </div>
        </div>

      </scroll-view>
    </section>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {accountCustomerTaskPromotionApi,accountCustomerTaskCustomerListApi} from '@/api/account'
  export default {
    head(){
      return {
        title:'Junior - shopshipshake'
      }
    },
    name: "index",
    components:{ScrollView},
    computed:{
      copyLink(){
        return `https://shop.shopshipshake.com/register?inc=${this.apInfo.ambassadorid}`
      }
    },
    data(){
      return{
        tabIndex:-1,
        tabList:[
          {name:'All',value:-1},
          {name:'Unfinished',value:0},
          {name:'Finished',value:1},
        ],
        list:[],
        customerInfo:{},
        apInfo:{},
        page:1,
        customerList:[],
        pageCount:0,
        status:1,
        isInvalid:false

      }

    },
    methods:{
      viewSkipHandle(type){
        if(type=='info'){
          this.$router.push(`/customertask/promotioninfo?type=${this.customerInfo.type}`)
        }else if(type=='tool'){
          this.$router.push('/customertask/promotiontool')
        }else if(type=='reward'){
          this.$router.push('/customertask/promotiondetail')
        }
      },
      tabChangeHandle(){
        this.page =1;
        this.getCustomerList()
      },
      goBackHandle(){this.$router.replace('/account/index')},
      getPromotionInfoHandle(){
        accountCustomerTaskPromotionApi().then(res=>{
          if(res.status==0){
            this.customerInfo= res.data;
            this.apInfo= res.data.ap || {}
          }else{
            this.isInvalid= true;
          }
        })
      },
      getCustomerList(){
        accountCustomerTaskCustomerListApi({
          page:this.page,
          status:this.tabIndex
        }).then(res=>{
          this.customerList = res.resultMap.list || [];
          this.pageCount= res.resultMap.pageCount;
        })
      },
      //复制成功
      copyHandle(event){
        this.$toast({message:'Copy Success !'})
      },
      facebookOperateHandle(){
        let shareUrl = "http://www.facebook.com/sharer/sharer.php?u=" +this.copyLink;
        window.open(shareUrl)
      },
      loadMoreHandle(){
        if(this.page > this.pageCount) {this.status = this.$config.loadingType.FINISHED;return;}
        this.page++;
        accountCustomerTaskCustomerListApi({
          page:this.page,
          status:this.tabIndex
        }).then(res=>{
          if(!res.resultMap.list || res.resultMap.list.length==0){this.status = this.$config.loadingType.FINISHED;}
          this.customerList =[...this.customerList,...res.resultMap.list]
        })
      }
    },
    created() {
      this.getPromotionInfoHandle();
      this.getCustomerList()
    }
  }
</script>

<style scoped lang="less">
  .g_mr_m{
    margin-right: 6px;
  }
  /deep/.van-empty{
    padding:30px 0;
  }
  .list_bottom{
    padding-top: 15px;
    /deep/.van-loading{
      margin:10px 0 0;
    }
  }
  .customer-task-wrapper{
    /deep/.van-tag{
      font-size:16px;
    }
  }
  .customerListScroll{
    max-height:54vh;
  }
  .customer-task-content,.customer-list-content{
    padding:15px 8px;
  }
  .customer-task-content{
    margin-bottom: 15px;
  }
  .reward-progress-title{
    padding:4px 8px;
  }
  .rewards_card{
    color:#000;
    background-color: #fff;
    padding:10px;
    border-radius: 6px 6px 0 0 ;
    .reward-item-first{
      margin-bottom: 12px;
    }
    .reward-item{
      .item-title{
        font-size:15px;
      }
      .item-money{
        font-size:19px;
        margin-right: 4px;
      }
      .item-intro{
        font-size:14px;
        color:gray;
        margin-top: 3px;
      }
    }
  }
  .reward-link-content{
    padding:15px 10px;
    font-size:14px;
    margin-bottom: 15px;
    border-radius: 0 0 6px 6px;
    .link-title{
      /deep/.van-tag{
        font-size:14px;
        padding:4px 6px;
        border-radius: 4px;
      }
    }
    .link-content{
      padding:15px 0;
      line-height: 1.5;
    }
    .link-intro{
      font-size:14px;
      line-height:1.3;
      padding:3px 0 10px;

    }
    .link-operate{
      margin-bottom: 15px;
      /deep/.van-button{
        font-size:13px;
        padding: 0px 10px;
      }
      .link-copy{
        padding:6px 10px;
        border:1px solid #fcc900;
        border-radius: 4px;color:#fcc900;
        font-size:13px;
        margin-right: 8px;
      }
      .link-view{
        padding:8px 0;
        font-size:14px;
        margin-right: 8px;
        width:40%;
        text-align: center;
      }
      .link-view-color{
        border:1px solid #1c84c6;
        border-radius: 4px;

        a{
          color:#1c84c6;
        }
      }
      .link-tools-color{
        border:1px solid #fcc900;
        border-radius: 4px;
        a{color:#fcc900;}
      }
      .link-face{
        background-color: #2d4373;
        font-weight: bold;
        color:#fff;
        font-size: 24px;
        padding:0 16px;
        border-radius: 4px;

      }
    }
  }
  .customer-list-content{
    margin-bottom: 30px;
    .list-title{
      padding-bottom: 10px;
    }
    .list-content{
      /deep/.van-tab{
        font-size:16px;
      }
    }
    .customer-list{
      .list-item{
        font-size:14px;
        line-height: 2;
        border-bottom:1px dashed #fcc900;
      }
    }
  }
</style>
