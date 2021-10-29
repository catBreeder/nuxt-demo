<template>
  <div class="postal-content">
    <div class="form-item">
      <div  class="g_ml_m form-label d_flex font_w">Postal Code<span class="color_warning"> *</span></div>
      <div class="form-input">
        <div class="input-area">
          <input type="text" placeholder="Postal Code"
                 v-model="searchKey.postal"
                 @focus="showListPopHandle('postal')"
                 class="input-area-input">
          <transition name="van-fade" >
            <div class="select-area" v-if="visible.postal" >
              <div class="d_flex d_flex_between">
                <input type="text" placeholder="Postal Code"
                       v-model="searchInput.postal"
                       @input="getPostalList"
                       class="input-area-input-pop">
                <van-icon name="cross" size="16" @click="visible.postal = false"></van-icon>
              </div>
              <template v-if="postalList.length">
                <scroll-view class="scrollHeight" @reachBottom="loadMorePostalHandle" >
                  <van-cell v-for="(item,index) in postalList"
                            @click="choosePostalItem(item)"
                            :key="index" :title="item.text" />
                </scroll-view>
              </template>
              <template v-else>
                <van-empty description="No results found" >
                  <img src="~assets/images/common/empty.png" alt=""  width="80px" slot="image">
                </van-empty>
              </template>

            </div>
          </transition>

        </div>
      </div>
    </div>
    <div class="form-item g_mt_l">
    <div  class="g_ml_m form-label d_flex font_w">Suburb<span class="color_warning"> *</span></div>
    <div class="form-input">
      <div class="input-area">
        <input type="text" placeholder="Suburb"
               v-model="searchKey.suburb"
               @focus="showListPopHandle('suburb')"
               class="input-area-input">
        <transition name="van-fade" >
          <div class="select-area" v-if="visible.suburb" >
            <div class="d_flex_between d_flex">
              <input type="text" placeholder="Suburb"
                     v-model="searchInput.suburb"
                     @input="getSurburbList"
                     class="input-area-input-pop">
              <van-icon name="cross" size="16" @click="visible.suburb = false"></van-icon>
            </div>
            <template v-if="subrubList.length">
              <scroll-view class="scrollHeight" @reachBottom="loadMoreSuburbHandle">

                <van-cell v-for="(item,index) in subrubList"
                          @click="chooseSuburbItem(item)"
                          :key="index" :title="item.text" />
              </scroll-view>
            </template>
            <template v-else>
              <van-empty description="No results found" >
                <img src="~assets/images/common/empty.png" alt="" width="80px" slot="image">
              </van-empty>
            </template>
          </div>
        </transition>

      </div>
    </div>
  </div>
    <van-button block class="estimate-btn g_mt_l" @click="estimateHandle">Estimate</van-button>
  </div>
</template>

<script>
import ScrollView from "../ScrollView";
import { searchPostcodeApi  } from '@/api/help';
export default {
  name: "index",
  components:{ScrollView},
  data(){
    return{
      showPopover:false,
      showSubPopover:false,
      searchKey:{
        postal:'',
        suburb:''
      },
      // page:1,
      postalList:[],
      subrubList:[],
      searchInput:{
        postal:'',
        suburb:''
      },
      visible:{
        postal:'',
        suburb:''
      },
      page:{
        postal:1,
        suburb:1
      }
    }
  },
  methods:{
    chooseSuburbItem(item){
      let value = item.text.split(',');
      this.searchKey.postal = value[1];
      this.searchKey.suburb = value[2];
      this.visible.suburb = false;
    },
    choosePostalItem(item){
      let value = item.text.split(',');
      this.searchKey.postal = item.id;
      this.searchKey.suburb = value[1];
      this.visible.postal = false;

    },
    loadMorePostalHandle(){
      this.postalPage++;
      searchPostcodeApi({
        search:this.searchInput.postal,
        type:'postcode',
        page:this.page.postal,
      }).then(res=>{
        this.postalList = [...this.postalList,...res.list];
      })
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
    estimateHandle(){
      if(!this.searchKey.postal){
        return this.$toast({message:'Postal Code is Required!'})
      }
      if(!this.searchKey.suburb){
        return this.$toast({message:'Suburb Code is Required!'})
      }
      this.$emit('searchKeyEmit',this.searchKey)
    },
    loadMoreHandle(){
      this.page++;
      searchPostcodeApi({
        search:this.searchInput.postal,
        type:'postcode',
        page:this.page
      }).then(res=>{
        this.postalList = [...this.postalList,...res.list];
      })
    },
    loadMoreSuburbHandle(){
      this.page++;
      searchPostcodeApi({
        search:this.searchInput.suburb,
        type:'suburb',
        page:this.page,
      }).then(res=>{
        this.subrubList = [...this.subrubList,...res.list];
      })
    },
    //选择
    chooseItem(item){
      let value = item.text.split(',');
      this.showPopover = false;
      this.searchKey={
        postal: value[0],
        suburb:value[1]
      }
    //  保存数据
      window.localStorage.setItem('postal',value[0])
      window.localStorage.setItem('suburb',value[1])

    },
    chooseSubrubListItem(item){
      let value = item.text.split(',');
      this.showSubPopover = false;
      this.searchKey={
        postal: value[1],
        suburb:value[2]
      }
      //  保存数据
      window.localStorage.setItem('postal',value[0])
      window.localStorage.setItem('suburb',value[1])
    },
    inputHandle(){
      this.page =1;
      this.getPostalList()
    },
    inputSuburbHandle(){
      this.page =1;
      this.getSurburbList()
    },
    getPostalList(){
      searchPostcodeApi({
        search:this.searchInput.postal,
        type:'postcode',
        page:this.page.postal
      }).then(res=>{
        this.postalList = res.list;
      })
    },
    getSurburbList(){
      searchPostcodeApi({
        search:this.searchInput.suburb,
        type:'suburb',
        page:this.page.suburb,
      }).then(res=>{
        this.subrubList = res.list;
      })
    },
  },
  mounted() {
    // this.getPostalList();
    // this.getSurburbList();
    if(window.localStorage.getItem('postal') && window.localStorage.getItem('suburb')){
      this.searchKey={
        postal: window.localStorage.getItem('postal'),
        suburb:window.localStorage.getItem('suburb')
      }
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-empty{
    padding:10px 0;
  }
  .scrollHeight{
    height:200px;
    background-color: #fff;
  }
.estimate-btn{
  margin-top:15px;
  background-color: #FCC900;
  border-radius: 6px;
  font-size:16px;
}
.form-input{
  margin-top: 8px;
  input{
    padding:5px 20px 5px 10px;
    border-radius: 6px;
    border:1px solid #e5e6e7;

  }
  .input-area{
    position:relative;
    .input-area-input{
      width:90%;
    }
    .input-area-input-pop{
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
      border-bottom-color:#eeeeed;
    }
  }
}
.postal-content{
  color:#2A2A2A;
  padding:6px 10px;
  /deep/.van-popover__wrapper{
    width:100%;
  }

  /*.input-area{*/
  /*  width:96%;*/
  /*  border-radius: 6px;*/
  /*  padding:4px 6px;*/
  /*  border:1px solid #EEEEED;*/
  /*}*/

}
/*
.select-content{
  padding:4px 10px;
  width:300px;
  .select-input{
    height:24px;
    width:95%;
    margin-bottom:8px;
    font-size:14px;
    padding:4px 10px;
    border-radius: 6px;
    border:1px solid #EEEEED;
  }
  .scrollHeight{
    height:160px;
    background-color: #fff;
  }
}
*/
</style>
