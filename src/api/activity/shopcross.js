import axios from '@/api/interception'

// 获取跨店优惠券列表
const getShopCrossCouponList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcrosscoupon/getShopCrossCouponList',
    params: params
  })
}

//获取跨店券详情
const getShopCrossCoupon = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcrosscoupon/getShopCrossCoupon',
    params: params
  })
}

//获取跨店券报名商品列表
const getCouponAppliedItems = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcrosscoupon/getCouponAppliedItems',
    params: params
  })
}

//跨店券报名
const apply = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shopcrosscoupon/apply',
    data: params
  })
}


export default {
  getShopCrossCouponList,
  getShopCrossCoupon,
  getCouponAppliedItems,
  apply
}