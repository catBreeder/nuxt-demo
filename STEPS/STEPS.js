//1.npx crate-nuxt-app 项目名（项目名不能有大写）
/*
    aysncData获取数据
  asyncData方法会在组件每次加载之前被调用。可以在服务端或者路由更新之前被调用
  这个方法被调用的时候，第一个参数context被设定为当前页面的上下文对象，可以利用asyncData方法来获取数据、
  nuxt.js会将asyncData返回的数据与data方法返回的数据一起合并后返回给当前组件
  调用后台数据接口采用axios异步发送请求。
  npm install @nuxtjs/axios

  使用：
  async asyncData({$axios}){
      const ip = await $axios.$get(url);
      return {ip}
  }
  asyncData({$axios}){
        $axios.$get(url).then(res=>{

        })
  }
  方法中使用methods/created/mounted
  methods:{
      async fetchSomething(){
          const ip = await this.$axios.$get(url);
          this.ip = ip;
      }
  }
  store中使用
  actions:{

  }
 */
//1.插件方式解耦在nuxtjs中调用api
/*
  创建api插件 api/test.js
  export default({$axios},injext)=>{
      inject('test',data=>$axios.$get('/test'))
  }
  引入插件
  plugins:['@/api/test.js']
  组件中使用
  async asyncData({$axios,app}){
      const response = app.$test();
      return {data:response.data}
  }
  方法小红使用
  async mounted(){
      const response = await this.$test();

  }
*/
//2.vue-router配置
/*
  1.自动配置
  2.手动配置


*/
//3.中间件
/*
  中间件允许定义一个自定义函数运行在一个页面或者一组页面渲染之前。可以用于权限判断，有权限才可以访问对应页面。
  每个中间件应放置在middleware目录下。
  文件名的名称将成为中间件名称(middleware/author.js将成为author中间件)。
  在nuxt.config.js,layout或者pages中使用中间件
  1.创建中间件
  middleware/auth 其中文件名auth就是中间件名称
  一个中间件接受context作为第一个参数
  export default({store,redirect})=>{

  }
  组件中声明使用：middleware:'author'
*/

//4.使用Vuex状态管理
/*
  1.nuxt会尝试找到项目根目录下的store目录，如果该目录存在，将做以下操作：
    1.引入vuex模块
    2.将vuex模块加到配置中去
    3.设置vue根实例的store配置项
    总结起来：只要在store目录下创建文件就可以了。nuxt实例化好Vuex.Store对象，自动将stor目录下的模块管理起来
2.nuxtjs支持两种使用store的方式：
  1.模块方式：store目录下每个.js文件都会被准换为状态树置顶命名的子模块
  2.classic(不建议使用，nuxt3会抛弃):store/index.js返回自己创建的Vuex.Store实例的方法

无论使用那种方法，state的值应该始终是function,为了避免返回引用类型，会导致多个实例相互影响。
store文件夹下创建index.js

  state应该是function
  const state =()=>({
    userInfo:null
  })
  const mutations ={
    //状态置空
    RESET_USER_INFO(state){
      state.userInfo = null
    }
  }

  const actions ={
    LoginPage({commit}){
      commit('RESET_USER_INFO')
    }
  }
  export default{
    state,
    mutations,
    actions
  }
  使用：$store.dispatch('RESET_USER_INFO')
*/
