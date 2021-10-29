import { get } from '@/utils/request';
import port from './port'
//消息详情 ： 消息类型（0-Message，1-Notice）
export const messageDetailApi =(id,type)=>{return get(port.message_detail,{id,type})}
//消息已读
export const readMessageApi =(id,type)=>{return get(port.message_read,{id,type})};
//消息列表 {page,tab,lastmintime}
export const messageRecordApi =(option)=> {return get(port.message_record,option)}
