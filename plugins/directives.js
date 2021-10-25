import Vue from 'vue'
/*
* 新版登录注册埋点
* */
Vue.directive('loginRegisterTrack', {
    bind: (el, binding, vnode) => {
      if (binding.value && binding.value.triggerType) {
        //这里参数是根据自己业务可以自己定
        //如果是浏览类型，直接保存
        if (binding.value.triggerType == 'browse') {
          //调用后台接口保存数据
          // api.eventTrack.saveEventTrack(params);
        } else if (binding.value.triggerType == 'click') {
          //如果是click类型，监听click事件
          el.addEventListener('click',(event)=>{
  
  
            // let p = binding.value.page?binding.value.page:getCurrentPage();
            // let spmvalue = getCurrentPageSpmID();
            // let spm =`a0001.${p}.${binding.value.operate}.0.${spmvalue}`
            // let option ={
            //   userid:getUserID()?getUserID():'',
            //   p,
            //   opeation:'click',
            //   device:'mobile',
            //   spm,
            //   spmvalue,
            //   refer:getRefer(),
            //   refspm:getRefSpm(),
            //   resultdata:binding.value.resultdata
            // }
            // spmLogApi(option).then(res=>{
  
            // })
          },false)
        }
  
      }
    }
  })
  /*防止重复点击*/
  Vue.directive('preventReClick',{
    bind(el,bingding){
      el.addEventListener('click',()=>{
        if(!el.disabled ){
          el.disable = true;
          setTimeout(()=>{
            el.disabled = false;
          },bingding.value || 1000)
        }
      })
    }
  })

  /*
* 图片上传埋点
* */
Vue.directive('imgUpload',{
  bind: (el, binding, vnode) => {
    if (binding.value && binding.value.triggerType) {
      //这里参数是根据自己业务可以自己定
      //如果是浏览类型，直接保存
      if (binding.value.triggerType == 'browse') {
        //调用后台接口保存数据
        // api.eventTrack.saveEventTrack(params);
      } else if (binding.value.triggerType == 'click') {

        //如果是click类型，监听click事件
        el.addEventListener('click', (event) => {
          // let option ={
          //   resultdata:binding.value.resultdata,
          //   referer:getRefer() ,
          //   refspm:getRefSpm(),
          //   opeation:binding.value.triggerType,
          //   device:'mobile',
          //   userid:getLoginInfo()?getLoginInfo().id : "",
          //   spmvalue:getCurrentPageSpmID(),
          //   p:binding.value.p,
          //   spm:`a0001.${binding.value.position?binding.value.position:'p0001'}.imgsearch.${getUserTicket()?'l1':'l0'}.${getCurrentPageSpmID()}`
          // }
          // spmLogApi(option).then(res=>{

          // })
          // // 调用后台接口保存数据
          // api.eventTrack.saveEventTrack(params);
        }, false)
      }

    }
  }
})