<template>
    <div>
      <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>More Topics</template>
<!--        <template #right>-->
<!--          <van-icon name="wap-home-o" size="22" color="#333" @click="goIndexHandle"/>-->
<!--        </template>-->
      </van-nav-bar>
    </van-sticky>
      <div class="topics_content" v-if="list.length">
        <van-cell :title="item.title" @click="checkDetailHandle(item)" is-link v-for="(item,index) in list" :key="index"/>
        <div class="topic_bottom" v-if="isFinish" @click="loadMoreHandle">view more</div>
      </div>
      <van-empty description="No Results find" v-else>
        <img src="~assets/images/common/empty.png" alt="" slot="image">
      </van-empty>
    </div>
</template>

<script>
    import {questionOperateModelApi} from '@/api/account'
    export default {
      head(){
        return {
          title:'Ambassador Q&A - shopshipshake'
        }
      },
        name: "index",
        data(){
          return{
            page:1,
            list:[],
            recordTotal:0,
            isFinish:true

          }
        },
        methods:{
          goIndexHandle(){
            this.$router.replace('/');
            this.$emit('toIndex')
          },
          checkDetailHandle(item){
            this.$router.push(`/question/answer/${item.id}`)
          },
          goBackHandle(){
            this.$router.back()
          },
          getTopicInfo(){
            questionOperateModelApi(this.$route.params.id,this.page).then(res=>{
              let result = res.pageinfo || {};
              this.list = result.list || [];
              this.recordTotal = res.pagenum;
              console.log(this.recordTotal);
            })
          },
          loadMoreHandle(){

            if(this.page > this.recordTotal){
              this.isFinish = false;
              return
            }
            this.page ++;
            questionOperateModelApi(this.$route.params.id,this.page).then(res=>{
              let result = res.pageinfo || {};
              this.list =[...this.list,...result.list ];

            })
          }
        },
        mounted() {
          this.getTopicInfo()
        }

    }
</script>

<style scoped lang="less">
.topics_content{
  padding:10px 4px;
  .topic_bottom{
    color:#fcc900;
    text-align: center;
    font-size:16px;
    margin-top:18px;
  }
}
</style>
