<template>
  <div class="manager_model_content">
    <div class="manager_model_top">
      <van-tabs  v-model="tabIndex" @change="tabChangeHandle">
        <van-tab v-for="(item,index) in tabList" :title="item.name" :key="index"/>
      </van-tabs>
      <div class="manager-bill-title" v-if="tabIndex==1">
        <div class=" d_flex d_flex_between">
          <div class="bill-time" @click="isVisible = true">{{currentDate | timeFormat('ym')}} <i class="icon iconfont icon-sanjiaoxing"></i></div>
          <div class="bill-income">income   <span class="color_orange">{{income | moneyFormat}}</span></div>
        </div>
        <div class="d_flex bill_input_area">
          <van-search v-model="searchKey"  shape="round" placeholder="Whatsapp" class="g_mr_l"/>
          <van-button type="primary" size="small" round class="search_btn" @click="searchHandle">Search</van-button>
        </div>
      </div>
    </div>
    <template v-if="tabIndex==0">
      <scroll-view class="managerScroll" @reachBottom="loadMoreHandle">
        <van-loading color="#fcc900" size="40" type="spinner" v-if="isLoading"/>
        <template v-else>
          <div class="manager_list" v-if="list.length">
            <van-row class="list-title">
              <van-col span="8">TEL</van-col>
              <van-col span="7">
                <div class="search-item">
                  <div  @click="orderByFrequency">Frequency</div>
                  <div class="search-item-tag" >
                    <div class="tag-top" :class="{'active_by_top':orderby===1}"></div>
                    <div class="tag-bottom" :class="{'active_by_bottom':orderby===2}"></div>
                  </div>
                </div>
              </van-col>
              <van-col span="7">
                <div class="search-item">
                  <div @click="orderByFreHandle">Amount</div>
                  <div class="search-item-tag" >
                    <div class="tag-top" :class="{'active_by_top':orderby===3}" ></div>
                    <div class="tag-bottom" :class="{'active_by_bottom':orderby===4}" ></div>
                  </div>
                </div>
              </van-col>
            </van-row>
            <van-row class="list-title list-item g_pt_m" v-for="(item,index) in list" :key="index">
              <van-col span="10"  >
                <div :class="{
                      'item-whatapp-old':item.isnewmember!=1,
                      'item-whatapp-new':item.isnewmember==1
                      }" @click="changeStatusHandle(item)">{{item.cellphone}}</div>
              </van-col>
              <van-col span="7">{{item.ordercount}}</van-col>
              <van-col span="7">{{item.ordermoney | moneyFormat}}</van-col>
            </van-row>
            <van-row class="list-total list-item noBorder">
              <van-col span="10" >number of clients:</van-col>
              <van-col span="7">
                <div class="color_orange" >{{list.length || 0}}</div>
              </van-col>
              <van-col span="7">
                <div class="color_orange">{{totalMoney | moneyFormat}}</div>
              </van-col>
            </van-row>
          </div>
          <van-empty description="No Bill are available" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </template>
      </scroll-view>
    </template>
    <template v-if="tabIndex==1">
      <scroll-view class="managerScroll" @reachBottom="loadMoreHandle">
        <van-loading color="#fcc900" size="40" type="spinner" v-if="isLoading"/>
        <template v-else>
          <div class="bill-list" v-if="billList.length">
            <div class="bill-list-item" v-for="(item,index) in billList" :key="index">
              <van-row>
                <van-col span="14">
                  <div class="item-whatapp"
                  >{{item.whatsapp}}</div>
                  <div class="item-number">{{item.expressnumber}}</div>
                  <div class="item-time">{{item.jhwctime}}</div>
                </van-col>
                <van-col span="10">
                  <div class="item-money ">{{item.servicefee | moneyFormat}}</div>
<!--                  <del v-if="item.cancelservicefee>0" class="color_intro">{{item.cancelservicefee | moneyFormat}}</del>-->
                </van-col>
              </van-row>
            </div>
            <div class="list_bottom" v-show="billList.length>10">
              <van-loading size="24px" color="#fcc900" v-if="status==$config.loadingType.LOADING"><span class="font_size_loading">in loading...</span></van-loading>
              <div class="icon iconfont icon-end color_intro text-align g_mb_m g_mt_m" v-if="status==$config.loadingType.FINISHED"></div>
            </div>
          </div>
          <van-empty description="No Bill are available" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </template>

      </scroll-view>
    </template>

    <template v-if="tabIndex==2">
      <scroll-view class="managerScroll" @reachBottom="loadMoreHandle">
        <van-loading color="#fcc900" size="40" type="spinner" v-if="isLoading"/>
        <template v-else>
          <div class="manager_list" v-if="list.length">
            <van-row class="list-title">
              <van-col span="8">TEL</van-col>
              <van-col span="7">
                <div class="search-item">
                  <div  @click="orderByFrequency">Quantity</div>
                  <div class="search-item-tag" >
                    <div class="tag-top" :class="{'active_by_top':orderby===1}"></div>
                    <div class="tag-bottom" :class="{'active_by_bottom':orderby===2}"></div>
                  </div>
                </div>
              </van-col>
              <van-col span="7">
                <div class="search-item">
                  <div @click="orderByFreHandle">Amount</div>
                  <div class="search-item-tag" >
                    <div class="tag-top" :class="{'active_by_top':orderby===3}" ></div>
                    <div class="tag-bottom" :class="{'active_by_bottom':orderby===4}" ></div>
                  </div>
                </div>
              </van-col>
            </van-row>
            <van-row class="list-title list-item g_pt_m" v-for="(item,index) in list" :key="index">
              <van-col span="10" >{{item.tel}}</van-col>
              <van-col span="7">{{item.quantity}}</van-col>
              <van-col span="7">
                <span v-if="tabIndex==0">{{item.ordermoney | moneyFormat}}</span>
                <span v-else>{{item.totalAmount | moneyFormat}}</span>
              </van-col>
            </van-row>
            <van-row class="list-total list-item noBorder">
              <van-col span="7" offset="17">
                <div class="color_orange">{{allAmount | moneyFormat}}</div>
              </van-col>
            </van-row>
          </div>
          <van-empty description="No Bill are available" v-else>
            <img src="~assets/images/common/empty.png" alt="" slot="image">
          </van-empty>
        </template>
      </scroll-view>
    </template>
    <van-popup v-model="isVisible" round  position="bottom"  :style="{ height: '50%' }" >
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        confirm-button-text="Confirm"
        cancel-button-text="Cancel"
        title="Select Month"
        :min-date="minDate"
        @confirm="chooseTimeHandle"
        @cancel="isVisible = false"
      />
    </van-popup>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  import {accountGroupShipMemberListApi ,groupShipBillListApi ,accountGroupShipComingList,changeMemberStatusApi} from '@/api/account'
  import { timeFormatValidate  } from '@/utils'
  export default {
    name: "index",
    props:{
      totalMoney:Number
    },
    components:{ScrollView},
    data(){
      return{
        tabIndex:0,
        tabList:[{name:'Members'},{name:'Bill'},{name:'Coming'}],
        pageCount:0,
        isLoading:false,
        page:1,
        orderby:1,// 1:数量降序，2：数量升序，3:金额降序，4:金额升序
        list:[],
        isVisible:false,
        currentDate: new Date(),
        billList:[],
        income:0,
        searchKey:null,
        minDate: new Date(new Date().getFullYear(), 0, 1),
        status:1
      }
    },
    computed:{
      columns(){
        let val =[],count = this.$config.areaCode;
        for(let k in count){
          val=[...val,count[k]]
        }
        return val;
      },
      allFrequent(){
        if(this.list){
          return this.list.reduce((pre,cur)=>{
            return pre + Number(cur.ordercount)
          },0)
        }else{
          return 0
        }
      },
      allAmount(){
        if(this.tabIndex==0){
          if(this.list){
            return this.list.reduce((pre,cur)=>{
              return pre+Number(cur.ordermoney)
            },0)
          }else{
            return 0
          }
        }else if(this.tabIndex==2){
          if(this.list){
            return this.list.reduce((pre,cur)=>{
              return pre+Number(cur.totalAmount)
            },0)
          }else{
            return 0
          }
        }

      }
    },
    methods:{
      changeStatusHandle(item){
        if(item.isnewmember!=1) return;
        changeMemberStatusApi(item.userid).then(res=>{
          if(res.status==0){
            this.$toast({message:'Authentication succeeded!'})
          }
          this.getGroupShipMemberList()
        })
      },
      searchHandle(){
        this.page =1;
        this.status=this.$config.loadingType.LOADING;
        this.getBillList()
      },
      chooseTimeHandle(event){
        this.status=this.$config.loadingType.LOADING;
        this.isVisible = false;
        this.page =1;
        this.getBillList()
      },
      //显示时间选择
      tabChangeHandle(){
        switch (this.tabIndex) {
          case 0:
            this.page =1;
            this.status=this.$config.loadingType.LOADING;
            this.getGroupShipMemberList()
            break;
          case 1:
            this.page=1;
            this.status=this.$config.loadingType.LOADING;
            this.getBillList();
            break;
          case 2:
            this.page =1;
            this.status=this.$config.loadingType.LOADING;
            this.getComingList()
            break;
        }
      },
      getBillList(){
        this.isLoading = true;
        groupShipBillListApi({startdate:timeFormatValidate(this.currentDate,'YM'),page:1,whatsapp:this.searchKey}).then(res=>{
          this.billList = res.list;
          this.income = res.income;
          this.pageCount = res.pageCount;
          this.isLoading = false;

        })
      },
      getComingList(){
        this.isLoading = true;
        accountGroupShipComingList({
          page:this.page,
          orderby:this.orderby,
        }).then(res=>{
          this.list = res.list;
          this.pageCount = res.pageCount;
          this.isLoading = false;
        })
      },
      orderByFrequency(){
        this.page =1;
        this.status=this.$config.loadingType.LOADING;
        this.orderby = this.orderby==1?2:1;
        if(this.tabIndex==0){
          this.getGroupShipMemberList()
        }else if(this.tabIndex==2){
          this.getComingList()
        }
      },
      orderByFreHandle(){
        this.page =1
        this.status=this.$config.loadingType.LOADING;
        this.orderby = this.orderby==3?4:3;
        if(this.tabIndex==0){
          this.getGroupShipMemberList()
        }else if(this.tabIndex==2){
          this.getComingList()
        }

      },
      loadMoreHandle(){
        if(this.status==this.$config.loadingType.FINISHED) return;
        if(this.page <= this.pageCount){
          this.page ++;
          switch (this.tabIndex) {
            case 0:
              accountGroupShipMemberListApi({
                page:this.page,
                orderby:this.orderby,
              }).then(res=>{
                this.list =[...this.list,... res.list];
              })
              break;
            case 1:
              groupShipBillListApi({startdate:timeFormatValidate(this.currentDate,'YM'),page:this.page,whatsapp:this.searchKey}).then(res=>{
                if(!res.list || !res.list.length){this.status = this.$config.loadingType.FINISHED}
                this.billList = [...this.billList,...res.list];
              })
              break;
            case 2:
              accountGroupShipComingList({
                page:this.page,
                orderby:this.orderby,
              }).then(res=>{
                this.list = [...this.list,...res.list];

              })
              break;
          }

        }
      },
      //获取团员列表
      getGroupShipMemberList(){
        this.isLoading = true;
        accountGroupShipMemberListApi({
          page:this.page,
          orderby:this.orderby,
        }).then(res=>{
          let hash ={};
          this.pageCount= res.pageCount;
          this.list = res.list.reduce((item,next)=>{
            hash[next.cellphone]?"":hash[next.cellphone] = true && item.push(next)
            return item;
          },[])
          this.isLoading = false;
        })
      },
    },
    mounted() {
      this.getGroupShipMemberList();


    }
  }
</script>

<style scoped lang="less">
  .list_bottom{
    padding:15px 0 ;
    /deep/.van-loading{
      margin: 0 !important;
    }
  }
  /deep/.van-picker__cancel, .van-picker__confirm{
    font-size:15px;
  }
  /deep/.van-empty{
    margin-top: 80px;
  }
  .manager-bill-title{
    background-color: #EEEEED;
    padding:10px 15px;
    /deep/.van-search{
      background:#EEEEED;
      width:80%;
      /deep/.van-cell{
        padding:2px 10px;
      }
    }
    /deep/.van-icon-search{
      display: none;
    }
    .bill_input_area{
      margin:6px -4px 2px;
      /deep/.van-button{
        height:30PX !important;
        line-height:30PX;
      }
    }
    .bill-title{
      font-size:15px;
    }
    .bill-time{
      font-size:18px;
      margin-bottom: 6px;
    }
    .bill-income{
      font-size:16px;
    }
  }
  .manager_list{
    padding:60px 15px 10px;
    .list-title{
      padding-bottom:8px;
      font-size:15px;
      border-bottom:1px dashed gray;
    }
    .list-total{
      padding:10px 0;
      font-size:16px;
    }
    .list-item{
      padding:12px 0;
      font-size:15px;
    }
    /deep/.van-col--8{
      text-align: center;
      font-size:15px;
      color:gray;
    }
    .search-item{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .search-item-tag{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-left: 3px;
      .tag-top{
        width:0;
        height:0;
        border-right:4px solid transparent;
        border-left:4px solid transparent;
        border-bottom:6px solid gray;
        margin-bottom:1px;
      }
      .active_by_top{
        border-bottom:6px solid #fcc900 !important;
      }
      .active_by_bottom{
        border-top:6px solid #fcc900 !important;
      }
      .tag-bottom{
        width:0;
        height:0;
        border-right:4px solid transparent;
        border-left:4px solid transparent;
        border-top:6px solid gray;
      }
    }
    /deep/.van-icon{
      vertical-align: bottom;
      margin-left:2px;
    }
  }

  .manager_model_content{
    position: relative;
    .manager_model_top{
      position: fixed;
      left:0;
      right:0;
      z-index:1;
    }
    .manager_model_bottom{

    }
  }
  .managerScroll{
    height:calc(100vh - 160px);
  }
  .item-whatapp-old{
    color:#2A2A2A;
  }
  .item-whatapp-new{
    color:deepskyblue;
  }
  .bill-list{
    margin-top: 150px;
    padding:0 15px;
    .bill-list-item{
      padding:6px 8px;
      font-size:15PX;
      line-height:1.6;
      border-bottom:1px solid #EEEEED;
      margin-bottom: 8px;
      .item-whatapp{
        font-size:13px;
      }

      .item-number{
        color:#2A2A2A;
        margin:2px 0;
      }
      .item-time{
        color:#9e9e9e;
        font-size:13px;
      }
      .item-money{
        color:#2A2A2A;
        font-size:18px;
        text-align: right;
      }
    }
  }
  /deep/.van-tab{
    font-size:16px;
  }
</style>
