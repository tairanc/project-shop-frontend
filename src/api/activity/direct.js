import axios from '@/api/interception'

// 获取直降列表
const getDirectReductionList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/directreduction/getDirectReductionList',
    params: params
  })
}

// 删除直降
const deleteDirectReduction = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/directreduction/deleteDirectReduction',
    data: params
  })
}

// 关闭 1
const closeCoupon = (params) => {
  let _url =  "/trmall/directreduction/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

//获取直降详情
const getDirectReductionDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/directreduction/getDirectReductionDetail',
    params: params
  })
}

//关闭直降商品
const closeDirectReductionItem = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/directreduction/closeDirectReductionItem',
    data: params
  })
}

//创建直降商品
const createDirectReduction = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/directreduction/createDirectReduction',
    data: params
  })
}

//编辑直降
const updateDirectReduction = (params,type) => {
  let _url = type ? "/trmall/directreduction/appendDirectReductionItems" : '/trmall/directreduction/updateDirectReduction'
  return axios({
    method: 'post',
    url: _url,
    data: params
  })
}

export default {
  getDirectReductionList,
  deleteDirectReduction,
  closeCoupon,
  getDirectReductionDetail,
  closeDirectReductionItem,
  createDirectReduction,
  updateDirectReduction
}