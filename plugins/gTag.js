/*谷歌埋点*/
export const gTagFun =(event_action,event_category,event_label)=>{
    gtag('event', event_action, {
      event_category,
      event_label
    });
  }
