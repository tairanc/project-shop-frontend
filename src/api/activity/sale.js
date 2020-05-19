import axios from '@/api/interception'

// 获取特卖活动列表
const getFlashSaleList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/flashSale/getFlashSaleList',
    params: params
  })
}

//获取特卖详情
const getFlashSaleDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/flashSale/getFlashSaleDetail',
    params: params
  })
}

//获取特卖报名商品列表
const getFlashSaleApplyList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/flashSale/getFlashSaleApplyItemList',
    params: params
  })
}

//特卖报名
const applyFlashSale = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/flashSale/applyFlashSale',
    params: params
  })
}


export default {
  getFlashSaleList,
  getFlashSaleDetail,
  getFlashSaleApplyList,
  applyFlashSale
}