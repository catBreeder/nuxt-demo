var sensors_service_url = 'https://log.shopshipshake.com/sa?project=default&token=e89c6359d2857da9';//测试连接
if(document.domain == 'shop.shopshipshake.com'){
  sensors_service_url = 'https://log.shopshipshake.com/sa?project=production&token=e89c6359d2857da9';//正式连接
}
let sensors = require('sa-sdk-javascript');
sensors.init({
  server_url: sensors_service_url,
  is_track_single_page:false, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time:true,
  send_type:'beacon',
  // show_log:false,
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap:'default',
    //是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map:'not_collect',
    batch_send:true
  }
});

//公共属性
sensors.registerPage({
  current_url: location.href,
  referrer: document.referrer,
  platform_type: 'WAP', // 平台类型：App，H5，Web
  currency:'R',//货币

});
export default sensors;
