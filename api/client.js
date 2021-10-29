import {get,post,shareRequest } from '@/utils/request';
import port from "./port";
//GET /api/client/address/list         收件地址 - 列表client_address_list
export const clientAddressListApi =(option)=> {return get(port.client_address_list,option)}
//POST /api/client/address/setDef   设置默认地址 client_address_set_Default
export const clientAddressSetDefaultApi =(option)=> {return post(port.client_address_set_Default,option)}
// GET /api/client/address/editpage   收件地址 - 编辑页面信息  client_address_edit_page
export const clientAddressEditInfoApi =(id)=> {return get(port.client_address_edit_page,{id})}
// POST /api/client/address/edit   收件地址 - 编辑  client_address_edit
export const clientAddressEditApi =(option)=> {return shareRequest(port.client_address_edit,option)}
// export const clientAddressEditApi =(option)=> {return post(port.client_address_edit,option)}
//POST /api/client/address/del     收件地址 - 删除  client_address_del
export const clientAddressDelApi =(rid)=> {return post(port.client_address_del, {rid})}
