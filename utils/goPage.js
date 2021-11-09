import config from '@/config';
import {  getUserTicket , getLoginInfo } from './memory';
export const goPageFun =(page)=>{
  let ticket = getUserTicket();
  let survey = getLoginInfo().survey || 0;
  if(page === 'index'){
    if(Number(survey) ===0){
      let url = config.jianweiDomain +  "/register/survey?id=" +getLoginInfo().id+ "&nosms=1" + "&ticket=" + ticket + "&spm=" + localStorage.getItem("spmClick");
      window.open(url)
    }else{
      window.open(`${config.jianweiDomain}/shoppingmall/index` + "?ticket=" + ticket + "&spm=" + localStorage.getItem("spmClick"));
    }
  }else if(page==='Coupon'){
    // let url = config.jianweiDomain + "/coupon/index" + "?ticket=" + ticket + "&spm=" + localStorages.getItem("spmClick");
    // window.open(url);
    this.$router.push(`/coupon/index?ticket=${ticket}&spm=${localStorage.getItem('spmClick')}`)

  }else if(page==='guangGao'){
    window.open("https://shopshipshake.co.za/business-service/membership/");
  }

}
export const advPageFun =(type)=>{
  let url = ''
  console.log(type);
  switch (type) {
    case 'weight':
      url=`${config.jianweiDomain}/thematicactivities/categoryproduct/index/32`;
      break;
    case 'source':
     url=`${config.jianweiDomain}/thematicactivities/categoryproduct/index/1`;
      break;
    case 'sale':
      url=`${config.jianweiDomain}/thematicactivities/hot/index`;
      break;
    case 'updated':
      url=`${config.jianweiDomain}/thematicactivities/new/index`;
      break;
    case 'season':
      url=`${config.jianweiDomain}/thematicactivities/categoryproduct/index/8`;
      break;
    case 'via':
      url=`${config.jianweiDomain}/thematicactivities/categoryproduct/index/16`;
      break;
  }
  window.open(url)
}
