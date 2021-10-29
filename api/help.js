import {get} from '@/utils/request';
import port from "./port";
//获取postal和suburb
export const searchPostcodeApi =(option)=>{ return get(port.help_cost_searchPostcode,option)}
//计算数据
export const calculationcostApi =(option)=>{return get(port.help_cost_calculationcost,option)}
