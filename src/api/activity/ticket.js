import axios from '@/api/interception'
// 获取优惠券列表
const getShopcouponList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcoupon/getShopCouponList',
    params: params
  })
}
// 获取优惠券详情
const getShopcoupon = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shopcoupon/getCoupon',
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
// 新增优惠券商品ID
const importItemsById = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/itemselect/importItems',
    data: params
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
// 删除优惠券
const deleteCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/deleteCoupon',
    headers: {
      'User-Agent': '	. TrMall/0.0.0 .'
    },
    data: params
  })
}
// 作废优惠券
const cancelCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/cancelCoupon',
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
// 补发优惠券
const reissueCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/reissue',
    data: params
  })
}
// 新增优惠券
const createCoupon = (params) => {
  return axios({
    method: 'POST',
    url: '/trmall/shopcoupon/createCoupon',
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
  getShopcoupon,
  createCoupon,
  getCouponAppliedItems,
  closeCouponItem,
  deleteCoupon,
  cancelCoupon,
  updateCounpon,
  reissueCoupon,
  addGoodsById,
  importItemsById,
  getWarehouse,
  getCategory,
  getRelBrandListByCategoryId,
  getSelectItemList
}
