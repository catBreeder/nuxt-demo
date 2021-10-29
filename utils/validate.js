// 判断是否是图片格式
export const imgValidate =(value)=>{
  let index = value.lastIndexOf('.');//得到.在第几位
  value = value.substring(index);//截取.之前的，得到后缀
  return value===".bmp" || value===".png" || value===".gif" || value===".jpg" || value===".jpeg"
}
//判断是否是1688网站的产品 、https://www.1688.com/
export const url1688Validate =(value)=>{
  return (value.indexOf("detail.1688.com/offer/") !==-1 ||
    value.indexOf("detail.1688.com/pic/")!==-1 ||
    value.indexOf("m.1688.com/offer/")!==-1) && ( value.indexOf(".html") !==-1)
}
//判断是否是其他网站链接
export const otherUrlValidate =(value)=>{
  return value.indexOf("www.yellowsubtrading.co.za")!==-1 ||
    value.indexOf("snatcher.co.za") !==-1 ||
    value.indexOf("www.kilimall.co.ke")!==-1 ||
    value.indexOf("www.kikuu.com") !==-1;
}
//
export const receiverValidate =(value)=>{
  // return /^[a-zA-Z\u4e00-\u9fa5 ]{1,}$/.test(value)
  return /^[A-Za-z\s]+$/.test(value)
}
//只能输入数字，并且不能以0开头
export const inputOnlyNumberValidate=(value)=>{
  return /^[0]+[0-9]*$/.test(value);
}
//判断是不是数字
export const  isPureNumberValidate=(srt)=>{
  return new RegExp("^[0-9]*$").test(srt);
}
