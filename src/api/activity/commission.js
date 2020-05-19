import axios from '@/api/interception'

// 加入分佣
const joinCommission = () => {
  return axios({
    method: 'post',
    url: '/trmall/commission/joinCommission',

  })
}
// 获取分佣分类列表
const getShopCategoryList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/commission/getShopCategoryList',
      params:params
    })
}
// 退出分佣
const exitCommission = () => {
    return axios({
      method: 'post',
      url: '/trmall/commission/exitCommission',
    })
}
// 删除分佣主推商品
const exitSpecialItem = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/commission/exitSpecialItem',
      data:params
    })
}
// 分佣商品列表
const getItemList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/commission/itemList',
      params:params
    })
}
// 分佣商品绑定优惠券
const bindCommissionCoupon = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/commission/bindCommissionCoupon',
      data:params
    })
}
// 分佣订单明细列表
const getListShareBonus = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/commission/getListShareBonus',
      params:params
    })
}
// 分佣订单汇总
const getOrderGatherList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/commission/getOrderGatherList',
      params:params
    })
}
// 编辑分佣分类
const editShopCategory = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/commission/editShopCategory',
      data:params
    })
}
//获取有效的店铺优惠券列表
const getValidCouponList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/commission/getValidCouponList',
      params:params
    })
}
//编辑主推商品
const updateCommissionItem = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/commission/updateCommissionItem',
      data:params
    })
}
//新增主推商品
const createCommissionItem = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/commission/createCommissionItem',
      data:params
    })
}
//是否已经加入分佣
const isJoin = () => {
  return axios({
    method: 'get',
    url: '/trmall/commission/isJoin',
  })
}
//是否初始化分佣分类比例
const isCategoryInitialized = () => {
  return axios({
    method: 'get',
    url: '/trmall/commission/isCategoryInitialized',
  })
}
//获取需要设置的分类列表
const getNeedSetCategories = () => {
  return axios({
    method: 'get',
    url: '/trmall/commission/getNeedSetCategories',
  })
}
//获取需要设置的分类列表
const setShopCategory = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/commission/setShopCategory',
    data:params
  })
}
export default {joinCommission,
                exitCommission,
                getShopCategoryList,
                exitSpecialItem,
                getItemList,
                bindCommissionCoupon,
                getListShareBonus,
                getOrderGatherList,
                editShopCategory,
                getValidCouponList,
                updateCommissionItem,
                createCommissionItem,
                isJoin,
                isCategoryInitialized,
                getNeedSetCategories,
                setShopCategory
                }