<template>
  <section>
    <template v-if="operateType=='category' || operateType=='categoryItem'">
      <category-model :title="$route.query.name"
                      :thirdIDProp="$route.query.thirdid"
                      :operate-type="$route.query.operate"
                      :categoryIDProp="$route.query.categoryID"/>
    </template>
    <template v-else-if="operateType=='homeModel'">
      <home-all-model :title="$route.query.name" :operate-type="$route.query.operate"/>
    </template>
    <template v-else-if="operateType=='keyword' || operateType=='hotword' || operateType=='link'">
      <keyword-model />
    </template>
  </section>
</template>
<script>
import CategoryModel  from "./childComponents/template/CategoryModel";
import HomeAllModel from "./childComponents/template/HomeAllModel";
import KeywordModel from "./childComponents/template/KeywordModel";
import JsCookie from 'js-cookie'
import {keywordOption} from '@/utils'
import {commonCategorySEOApi,spmLogApi} from '@/api/common';
import {setCurrentPage} from '@/utils/memory'
export default {
  components:{
    CategoryModel ,
    KeywordModel,
    HomeAllModel,
  },
  head(){
    return{
      title: `${this.seoSetting.title}${this.seoSetting.title?'-':''}shopshipshake`,
      meta:[
        {hid:'description',name:'description',content:`${this.seoSetting.description}`},
        {hid:'keywords',name:'keywords',content: `${this.seoSetting.keywords}`}
      ]
    }
  },
  computed:{
    operateType(){
      return this.$route.query.url ?'keyword': this.$route.query.operate
    },
  },
  data(){
    return {
      seoSetting:{}
    }
  },
  beforeRouteEnter(to,from,next){
    setCurrentPage(to.name)
    if(from.path =='/shoppingmall/search/index' || from.path =='/shoppingmall/categorylist' || from.path=='/shoppingmall/index' ){
      let option ={}
      switch (to.query.operate) {
        case 'keyword':
          option = keywordOption({
            p:'查询结果页面',
            operate:'page',
            spm: `a0001.p0001.searchkey.0.-1`
          })
          break;
        case 'hotword':
          option = keywordOption({
            p:'查询结果页面',
            operate:'page',
            spm: `a0001.p0001.hot_search.${to.query.keyword}.-1`
          })
          break;
        case 'link':
          option = keywordOption({
            p:'查询结果页面',
            operate:'page',
            resultdata:to.query.keyword,
            spm: `a0001.p0001.searchkey.link.-1`
          })
          break;
         default:
           option =keywordOption({
             p:'产品列表页面',
             operate:'page',
             spm:`a0001.ResultSearch.page.-1`
           })
              break;
      }
      spmLogApi(option).then(res=>{
        JsCookie.set('currentPageSpmValue',res.spmid)
      })
    }
    next()

  },
  async asyncData({route}){
    /*seo优化*/
   const res = await commonCategorySEOApi(route.query.thirdid?route.query.thirdid:route.query.categoryID)
    return{
      seoSetting:res
    }
  },
}
</script>
<style scoped lang="less">

</style>
