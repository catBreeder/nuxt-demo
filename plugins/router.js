
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
  removeOrderShipAddressID,
  removeCategoryID,
  removeCategoryScroll,
  removeUserTicket,
  removeLoginInfo, removeRegisterInfo,removeUserID,
  removeRefer, removeRefSpm,removeUserType,removeSensorData,
  getLoginInfo, getUserID, removeCartQualityFlag,
  removeCustomerIdentity
} from '@/utils/memory';
import sensors from "@/tools/sensors";
// 简单配置
import {logoutApi } from '@/api/user';
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
export default ({app})=>{
    app.router.beforeEach((to,from,next)=>{
        NProgress.start();
        document.title = `${to.meta.content?to.meta.content:''}${to.meta.content?'-':''}shopshipshake`;
      if(to.path=='/login' || to.path=='/register'){
        logoutApi().then(res=>{})
        removeLoginInfo();
        removeOrderShipAddressID();
        removeCategoryID();
        removeCategoryScroll();
        removeUserTicket();
        removeRegisterInfo();
        removeUserID();
        removeRefer()
        removeRefSpm()
        removeUserType();
        removeSensorData();
        removeCartQualityFlag();
        removeCustomerIdentity();
        localStorage.removeItem('top100Info')
        localStorage.removeItem('HomeProductModal')
        localStorage.removeItem('changeTab');

      }
        next()
    })
    app.router.afterEach((to,from)=>{
        NProgress.done();
      sensors.registerPage({
        is_member:()=>{
          return !getLoginInfo()?false:getLoginInfo().vip>0
        },
        is_login:()=>{
          return !!getUserID();
        },
        vip_level:()=>{
          return !getLoginInfo()?'':getLoginInfo().vip;
        },
        sales:()=>{
          return  !getLoginInfo()?'':getLoginInfo().businessname
        }
      })
      sensors.track("pageview",{title:to.meta.analyTitle?to.meta.analyTitle:'未知'});
      sensors.quick('autoTrack')
    })
}
