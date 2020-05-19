import axios from '@/api/interception'
// 获取买赠列表
const getGiftBuyList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/giftBuy/getGiftBuyList',
    params: params
  })
}

//删除买赠商品
const closeItem = (params) => {
  return axios({
    method: 'post', 
    url: '/trmall/giftBuy/closeItem', 
    data: params
  })
}

//买赠详情
const getGiftBuyDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/giftBuy/getGiftBuyDetail',
    params: params
  })
}

//删除买赠活动
const deleteGiftBuy = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/giftBuy/deleteGiftBuy',
    params: params
  })
}

// 关闭 1
const closeCoupon = (params) => {
  let _url =  "/trmall/giftBuy/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

//创建买赠活动
const createGiftBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/giftBuy/createGiftBuy',
    data: params
  })
}

//添加 主商品
const appendItems = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/giftBuy/appendGiftBuyItems',
    data: params
  })
}

// 添加 赠品
const appendItemsGift = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/giftBuy/appendGiftBuySubItems',
    data: params
  })
}

//编辑买赠活动
const updateGiftBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/giftBuy/updateGiftBuy',
    data: params
  })
}

const getExportData = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/giftBuy/getExportData',
    params: params
  })
}

export default {
  getGiftBuyList,
  deleteGiftBuy,
  closeCoupon,
  createGiftBuy,
  getGiftBuyDetail,
  closeItem,
  appendItems,
  appendItemsGift,
  updateGiftBuy,
  getExportData
}