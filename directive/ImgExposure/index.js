import 'intersection-observer';
import { imgExposureApi } from '@/api/common'
import JsCookie from 'js-cookie'
//节流时间，默认是100ms
IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 10;

export default class ImgExposure{
  dotDataArr=[];
  maxNum=0;
  _observer;//_observer可以理解未观察者的集合
  _timer;//定时器

//  初始化
  constructor(maxNum=30) {
    this.dotDataArr=[];
    this.maxNum = maxNum;
    this._timer =0;

    //全局只会实例化一次Exposure类，init方法只会执行一次
    this.init();
  }
  init(){
    const self = this;
    //init只会执行一次，边界处理方法放这里
    //把浏览器localStorage里面的剩余数据清空
    this.dotFromLocalStorage();
    //注册客户端webvies的关闭生命狗子函数
    this.beforeLeaveWebview();
    this._observer = new IntersectionObserver((function(entries,observer){
      entries.forEach(entry=>{
        //每个商品进入视窗都会触发
        if(entry.isIntersecting){
          //清楚当前定时器
          clearTimeout(self._timer);
          //获取元素信息
          const ctm = entry.target.attributes['data-info'].value;
          //收集的数据加到上报数组中
          self.dotDataArr.push(ctm);
          //收集到该商品后，取消对该商品dom的观察
          self._observer.unobserve(entry.target);
          //超过一定量打点，打点会删除这一批
          if(self.dotDataArr.length > self.maxNum){
            self.dot();
          }else{
            self.storeIntoLocalstorage(self.dotDataArr);
            if(self.dotDataArr.length>0){
              //只要有新的ctm添加进来，接下来如果没有增加，自动2s后打
              self._timer = window.setTimeout(function(){
                self.dot()
              },500)
            }
          }
        }
      },{
        root:null,
        rootMargin:'0px',
        threshold: 0.5 // 不一定非得全部露出来  这个阈值可以小一点点
      })
    }))
  }
  //每个商品都会通过全局唯一的exposure的实例执行该add方法，蒋自己添加进观察者中
  add(entry){
    this._observer && this._observer.observe(entry.el)
  }
  dot(){
    //同时删除这批打点的ctms
    const dotDataArr = this.dotDataArr.splice(0,this.maxNum);
    // imgExposureApi(dotDataArr.join(','));
    imgExposureApi(dotDataArr.join('$&'));
    //打完后，顺便更新一下，localstorage
    // this.storeIntoLocalstorage(dotDataArr);
  }
  storeIntoLocalstorage(dotDataArr){
    // 。。。 存进localStorage中，具体什么格式的字符串自行定义就好
    // window.localStorages.setItem('dotDataArr',dotDataArr)
    JsCookie.set('dotDataArr',dotDataArr)
  }
  dotFromLocalStorage(){
    // const ctmsStr  = window.localStorages.getItem('dotDataArr')
    // if(ctmsStr ){
    //   //如果有数据，就上报打点
    //   imgExposureApi(ctmsStr);
    // }
  }
  beforeLeaveWebview(){
    // let win= window;
    //自行跟客户端约定钩子函数的实现就好
    // Vue.emit('webviewWillDisappear',()=>{
    //   if(this.dotDataArr.length>0){
    //     get(this.dotDataArr)
    //   }
    // })
  }

}
