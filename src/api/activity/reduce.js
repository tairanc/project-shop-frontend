import axios from '@/api/interception'
// 获取列表 1
const getShopList = (params , type) => {
    // use
 let _url = type ? "/trmall/fulldiscount/getFullDiscountList" : "/trmall/fullminus/getFullMinusList"
  return axios({
    method: 'get',
    url: _url,
    params: params
  })
}
// 获取查看详情 1
const getShopcoupon = (params, type) => {
  let _url = type ? "/trmall/fulldiscount/getFullDiscountDetail" : "/trmall/fullminus/getFullMinusDetail"
  return axios({
    method: 'get',
    url: _url,
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
// 关闭
const closeCouponItem = (params,type) => {
  let _url = type ? "/trmall/fulldiscount/closeFullDiscountItem" : "/trmall/fullminus/closeFullMinusItem"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}
// 删除 1
const deleteCoupon = (params , type) => {
  let _url = type ? "/trmall/fulldiscount/deleteFullDiscount" : "/trmall/fullminus/deleteFullMinus"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

// 活动中添加 商品
const appendItems = (params , type) => {
  let _url = type ? "/trmall/fulldiscount/appendFullDiscountItems" : "/trmall/fullminus/appendFullMinusItems"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}
// 关闭 1
const closeCoupon = (params , type) => {
  let _url = type ? "/trmall/fulldiscount/closePromotion" : "/trmall/fullminus/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
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
// 新增活动
const createPlay = (params , type, isedit) => {
  let _url = type ? '/trmall/fulldiscount/createFullDiscount' : '/trmall/fullminus/createFullMinus'
  if (isedit === "editBreakReduce") {
    _url = '/trmall/fulldiscount/updateFullDiscount'
  }
  if (isedit === "editFullReduce") {
    _url = '/trmall/fullminus/updateFullMinus'
  }
  return axios({
    method: 'POST',
    url: _url,
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
  getShopList,
  getShopcoupon,
  createPlay,
  getCouponAppliedItems,
  closeCouponItem,
  deleteCoupon,
  appendItems,
  closeCoupon,
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
