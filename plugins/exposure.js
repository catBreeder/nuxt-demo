import MessageExposure from '@/directive/MessageExposure/index';
import ImgExposure from '@/directive/ImgExposure/index'
import Vue from 'vue'
const messageExp = new MessageExposure();//信息埋点表示已读
const imgExp =new  ImgExposure()



//信息埋点
Vue.directive('mag-exp',{
  bind(el,binding,vnode){
    messageExp.add({el,val:binding.value})
  }
})
//图片曝光埋点:vue封装一个指令，每个使用了该指令的商品都会自动添加到观察者中
Vue.directive('exp-dot',{
  bind(el,binding,vnode){
    imgExp.add({el:el,val:binding.value})
  }
})
