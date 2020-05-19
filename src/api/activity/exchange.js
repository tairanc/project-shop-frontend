import axios from '@/api/interception'
// 获取加价换购列表
const getExchangeBuyList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/exchangeBuy/getExchangeBuyList',
    params: params
  })
}

//关闭加价换购商品
const closeItem = (params) => {
  return axios({
    method: 'post', 
    url: '/trmall/exchangeBuy/closeItem', 
    data: params
  })
}

//加价换购详情
const getExchangeBuyDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/exchangeBuy/getExchangeBuyDetail',
    params: params
  })
}

//删除加价换购活动
const deleteExchangeBuy = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/exchangeBuy/deleteExchangeBuy',
    params: params
  })
}

// 关闭 1
const closeCoupon = (params) => {
  let _url =  "/trmall/exchangeBuy/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

//创建加价换购活动
const createExchangeBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/exchangeBuy/createExchangeBuy',
    data: params
  })
}

//添加 主商品
const appendItems = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/exchangeBuy/appendExchangeBuyItems',
    data: params
  })
}

// 添加 赠品
const appendItemsGift = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/exchangeBuy/appendExchangeBuySubItems',
    data: params
  })
}


//编辑加价换购活动
const updateExchangeBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/exchangeBuy/updateExchangeBuy',
    data: params
  })
}

// 导出加价换购数据
const getExportData = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/exchangeBuy/getExportData',
    params: params
  })
}

export default {
  getExchangeBuyList,
  deleteExchangeBuy,
  closeCoupon,
  createExchangeBuy,
  getExchangeBuyDetail,
  closeItem,
  appendItems,
  appendItemsGift,
  updateExchangeBuy,
  getExportData
}