import axios from '@/api/interception'
//  礼包报名列表
const getGiftList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/package/list',
    params: params
  })
} 
//  礼包报名查看
const getGiftInfo = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/package/info',
    params: params
  })
} 
//礼包报名优惠券列表
const getGiftCouponList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/package/coupon/list',
      params: params
    })
  } 
//保存礼包报名
const saveGift = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/package/save',
      data: params
    })
  } 
export default {
    getGiftList,getGiftCouponList,saveGift,getGiftInfo
}