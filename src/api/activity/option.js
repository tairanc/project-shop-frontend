import axios from '@/api/interception'

// 获取n元任选列表
const getOptionBuyList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/optionbuy/getOptionBuyList',
    params: params
  })
}

// 删除n元任选
const deleteOptionBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/optionbuy/deleteOptionBuy',
    data: params
  })
}

// 活动中添加 商品
const appendItems = (params) => {
  let _url = "/trmall/optionbuy/appendOptionBuyItems"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

// 关闭 1
const closeCoupon = (params) => {
  let _url =  "/trmall/optionbuy/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

//获取n元任选详情
const getOptionBuyDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/optionbuy/getOptionBuyDetail',
    params: params
  })
}

//关闭n元任选商品
const closeOptionBuyItem = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/optionbuy/closeOptionBuyItem',
    data: params
  })
}

//创建n元商品
const createOptionBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/optionbuy/createOptionBuy',
    data: params
  })
}

//编辑n元任选
const updateOptionBuy = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/optionbuy/updateOptionBuy',
    data: params
  })
}

export default {
  getOptionBuyList,
  deleteOptionBuy,
  appendItems,
  closeCoupon,
  getOptionBuyDetail,
  closeOptionBuyItem,
  createOptionBuy,
  updateOptionBuy
}