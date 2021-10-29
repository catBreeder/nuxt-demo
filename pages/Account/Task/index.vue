<template>
    <div>
      <van-sticky>
        <van-nav-bar @click-left="goBackHandle">
          <template #left>
            <van-icon name="arrow-left"  size="24" color="#8B8989"/>
          </template>
          <template #title><div class="navbar-title">Todo</div></template>
        </van-nav-bar>
      </van-sticky>
      <scroll-view class="scrollCommonHeightView">
        <div class="todo-card-content">
          <div class="font_size_16 g_mb_l color_active" v-if="customertype==10"> You have the following Todo to complete</div>
          <div class="font_size_14">
            <div class="g_mb_l">◇Todo 1：Phone number verified
              <van-tag v-if="apa.step3==0"  class="g_ml_s" color="#fcc900" size="large" text-color="#fff" @click="finishHandle('telephone')">  Go to finish</van-tag>
              <van-tag class="g_ml_s" v-else-if="apa.step3 == 1" color="#ccc" size="large" text-color="#333">Finished</van-tag>
            </div>
            <div>◇Todo 2：Complete the questionnaire

              <van-tag v-if="apa.step2==1" class="g_ml_s" color="#ccc" size="large" text-color="#333">Finished</van-tag>
              <van-tag v-if="apa.step2==0" class="g_ml_s g_mt_s" color="#ffe1e1" size="large" text-color="#ad0000" @click="finishHandle('question')"> Go to finish</van-tag>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
  import config from '@/config'
  import {getCurrentPageSpmID, setRefer, setRefSpm} from '@/utils/memory'
  import {loginRegisterPageBury } from '@/utils/buryPoint/buryPoint';
    import {accountCustomerTaskTodoApi,accountCustomerTaskVerifyApi} from '@/api/account'
    import ScrollView from "@/components/common/ScrollView";
  import {getUserID, setCurrentPage} from "../../../utils/memory";
    export default {
      head(){
        return {
          title:'Customer To do - shopshipshake'
        }
      },
        name: "index",
        components:{ScrollView},
      data(){
          return{
            customertype:'',
            apa:{}
          }
      },
        methods:{
          finishHandle(type){
            accountCustomerTaskVerifyApi(getUserID()).then(res=>{
              if(res.status==0){
                  let result = res.data;
                console.log(result);
                switch (type) {
                  case 'telephone':
                    if(result.registersource == 0 || result.registersource == 1){
                      //去老页面
                      // /register/smsvalidate?operate=manual&id=2051288435051347&countrycode=263&cellphone=263000001&count=4&verifytype=0&verifyfromtype=1&origUrl=http%3A%2F%2F192.168.0.46%3A28081%2Fcustomertask%2Ftodo&data_site_spm=a0001&data_spm=749a894e778a5
                      this.$router.push(`/register/smsvalidate?operate=manual&id=${getUserID()}&countrycode=${result.countrycode}&cellphone=${result.cellphone}&count=${result.count}&verifytype=0&verifyfromtype=1&origUrl=${this.$config.jianweiDomain}/customertask/todo`)
                    }else if(result.registersource == 2 || result.registersource == 3){
                      this.$router.push(`/new/register/codeValidate?operate=manual&id=${getUserID()}&countrycode=${result.countrycode}&cellphone=${result.cellphone}&count=${result.count}&verifytype=0&verifyfromtype=1&origUrl=${this.$config.jianweiDomain}/customertask/todo`)
                    }
                    // <%=path%>/customertask/todo/verifypage?id=${userid}&verifytype=0&fromtype=1&origUrl=<%=basePath%>customertask/todo

                    break;
                  case 'question':
                    if(result.count<4){
                      if(result.registersource == 0 || result.registersource == 1){
                        //老页面
                        window.open(`${this.$config.jianweiDomain}/register/survey?id=${getUserID()}&nosms=1&data_site_spm=a0001&data_spm=${getCurrentPageSpmID()}&origUrl=${this.$config.jianweiDomain}/customertask/todo`)
                      }else if(result.registersource == 2 || result.registersource == 3){
                        //新页面
                        this.$router.push(`/new/register/question/input?operate=manual&id=${getUserID()}countrycode=${result.countrycode}&cellphone=${result.cellphone}&count=${result.count}&verifytype=2&verifyfromtype=1&origUrl=${this.$config.jianweiDomain}/customertask/todo`)
                      }
                    }
                    // <%=path%>/customertask/todo/verifypage?id=${userid}&verifytype=2&fromtype=1&origUrl=<%=basePath%>customertask/todo
                    break;
                }
              }
            })

          },
          goBackHandle(){this.$router.back()},
          getTaskList(){
            accountCustomerTaskTodoApi().then(res=>{
              if(res.status==0){
                const {customertype,apa} = res.data;
                this.customertype = customertype;
                this.apa = apa;
              }
            })
          }
        },
      beforeRouteLeave(to,from,next){
        loginRegisterPageBury({
          p:'todo',
          operate:'close',
          spm:`a0001.todo.close.${getCurrentPageSpmID()}`
        })
        next();
      },
      beforeRouteEnter(to,from,next){
        if(from.path!='/'){
          setRefer(config.jianweiDomain +from.path)
        }
        if(to.query.spm){
          setRefSpm(to.query.spm);
        }
        setCurrentPage(to.name)
        loginRegisterPageBury({
          p:'todo',
          operate:'page',
          spm:`a0001.todo.page.-1`
        })
        next();
      },
      mounted() {
          this.getTaskList()
      }
    }
</script>

<style scoped lang="less">
  /deep/.van-tag--large{
    font-size:14PX;
  }
.todo-card-content{
  padding:10px 6px;
  margin:6px;
  background-color: #fff;
}
</style>
