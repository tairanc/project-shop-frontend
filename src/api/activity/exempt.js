import axios from '@/api/interception'
// 获取列表 1
const getShopcouponList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/freecoupon/getFreeCouponList',
    params: params
  })
} 
// 获取用户免单券列表 1
const getUserCouponList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/freecoupon/getUserCouponList',
      params: params
    })
  }
// 查看已经生成兑换
  const getExchangeCodes = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/freecoupon/getExchangeCodes',
      params: params
    })
  }
// 获取免单券详情 1
const getShopcoupon = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/freecoupon/getCoupon',
    params: params
  })
}
// 编辑 免单券详情 1
const getCoupon = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/freecoupon/getCoupon',
      params: params
    })
  }
// 获取优惠券商品列表
const getCouponAppliedItems = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcoupon/getCouponAppliedItems',
    params: params
  })
}
// 编辑优惠券商品ID
const addGoodsById = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/appendApplicableItems',
    data: params
  })
}
// 新增ID 1
const importItemsById = (params) => {
  return axios({
    method: 'GET',
    url: '/trmall/freecoupon/checkItem',
    params: params
  })
}
// 关闭优惠券商品
const closeCouponItem = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/closeCouponItem',
    headers: {
      'User-Agent': '	. TrMall/0.0.0 .'
    },
    data: params
  })
}
// 删除免单券
const deleteCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/freecoupon/deleteCoupon',
    headers: {
      'User-Agent': '	. TrMall/0.0.0 .'
    },
    data: params
  })
}
// 作废免单券 1
const cancelCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/freecoupon/cancelCoupon',
    data: params
  })
}
// 修改优惠券
const updateCounpon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/updateCoupon',
    headers: {
      'User-Agent': '	. TrMall/0.0.0 .'
    },
    data: params
  })
}
// 补发免单券 1
const reissueCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/freecoupon/reissue',
    data: params
  })
}
// 导出兑换码 1
const exportCode = (params) => {
    return axios({
      method: 'POST',
      url: '/trmall/freecoupon/exportCode',
      data: params
    })
  }
// 新增免单券 编辑免单券 1
const createCoupon = (params ,type) => {
  let _url = type ? '/trmall/freecoupon/updateFreeCoupon' : '/trmall/freecoupon/createFreeCoupon'
  return axios({
    method: 'POST',
    url: _url,
    headers: {
      'User-Agent': '	. TrMall/0.0.0 .'
    },
    data: params
  })
}
// 查询商家仓库列表
const getWarehouse = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/store/list/get',
    params: params
  })
}
// 获得店铺绑定的类目
const getCategory = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/category/shop_bind_category/get',
    params: params
  })
}
// 获取分类关联品牌列表
const getRelBrandListByCategoryId = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/brand/getShopRelateBrandList',
    params: params
  })
}

//获取选择商品弹窗 商品列表
const getSelectItemList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/itemselect/getItemList',
    params: params
  })
}



export default {
  getShopcouponList,
  getUserCouponList,
  getExchangeCodes,
  getShopcoupon,
  getCoupon,
  createCoupon,
  getCouponAppliedItems,
  closeCouponItem,
  deleteCoupon,
  cancelCoupon,
  updateCounpon,
  reissueCoupon,
  exportCode,
  addGoodsById,
  importItemsById,
  getWarehouse,
  getCategory,
  getRelBrandListByCategoryId,
  getSelectItemList
}
