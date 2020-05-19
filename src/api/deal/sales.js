import axios from '@/api/interception'
//查看商家售后单列表
const getSalesList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/customerService/afterSale/list/get',
    params
  })
}
//获取商家售后单详情
const getSalesIntoList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/customerService/afterSale/info/get',
    params
  })
}
//商家审核售后申请
const getVerify = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/customerService/afterSale/verify',
    data:params
  })
}
//商家审核售后单：审核用户回寄（针对退货退款类型的售后）
const getCheckRestore = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/customerService/afterSale/checkRestore',
    data:params
  })
}
//获取供应链可退仓库列表
const supplyWarehouseList = () => {
  return axios({
    method: 'GET',
    url: '/trmall/customerService/afterSale/supplyWarehouseList',
  })
}
//获取供应链可退仓库列表
const notifyWarehouse = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/customerService/afterSale/notifyWarehouse',
    data:params
  })
}
//获取供应链可退仓库列表
const checkNotify = (params) => {
  return axios({
    method: 'GET',
    url: '/trmall/customerService/afterSale/checkNotify',
    params:params
  })
}
//获取供应链仓库反馈信息
const warehouseFeedBack = (params) => {
  return axios({
    method: 'GET',
    url: '/trmall/customerService/afterSale/warehouseFeedBack',
    params:params
  })
}
export default {
    getSalesList,getSalesIntoList,getVerify,getCheckRestore,supplyWarehouseList,notifyWarehouse,checkNotify,warehouseFeedBack
}