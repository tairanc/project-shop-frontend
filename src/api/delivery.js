import axios from '@/api/interception'

//运费模板列表
const getDeliveryList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/deliveryTemplate/list/get',
    params: params
  })
}

//查看运费模板详情
const getDeliveryInfo = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/deliveryTemplate/info/get',
    params: params
  })
}

//新建运费模板
const createTemplate = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/deliveryTemplate/create',
    data:params
  })
}

//修改运费模板
const updateTemplate = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/deliveryTemplate/modify',
    data: params
  })
}

//删除运费模板
const removeTemplate = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/shop/deliveryTemplate/remove',
    data: params
  })
}

//获取运费模板的地区列表
const getAreaList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/deliveryTemplate/areaList',
    params: params
  })
}

//查询 供应商列表
const getSupperlier = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/chain/search_supplier',
    params: params
  })
}

//sku 供应链商品 sku 列表
const supplySkuList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/chain/supply_sku_list',
    params
  })
}

//sku  发送商品到供应商
const setItemToSupplier = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/chain/send_item_to_supplier',
    data:params
  })
}

//sku 绑定供应商sku 到 sku 
const bindSkuToSku = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/chain/bind_supply_sku_to_sku',
    data:params
  })
}

//sku 解绑供应商及所有绑定关系 
const unBindSupplier = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/chain/unbind_supplier',
    data:params
  })
}

//sku 解绑sku 
const unBindSku = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/chain/unbind_sku',
    data:params
  })
}

//查询快递公司列表
const getLogistics = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/contractLogistics/list/get',
    params
  })
}

//启用快递公司
const signLogistics = (params) => {
  return axios({
    method: 'post',
    headers: {
      'User-Agent': '1 TrMall/1.0.0 1'
    },
    url: '/trmall/shop/contractLogistics/sign',
    data: params
  })
}

//禁用快递公司
const cancelSignLogistics = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/shop/contractLogistics/cancelSign',
    data: params
  })
}

//仓库列表
const getWarehouseList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/store/list/get',
    params
  })
}

//删除仓库
const removeWarehouse = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/shop/store/remove',
    data: params
  })
}

//改变仓库状态
const changeWarehouseStatus = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/store/modify',
    data: params
  })
}

//获取新建仓库时的地区列表
const getWarehouseArea = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/store/areas/get',
    params
  })
}

//新建仓库
const createWarehouse = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/store/create',
    data:params
  })
}

export default {
  getDeliveryList,
  getDeliveryInfo,
  createTemplate,
  updateTemplate,
  removeTemplate,
  getAreaList,
  getSupperlier,
  supplySkuList,
  setItemToSupplier,
  bindSkuToSku,
  unBindSupplier,
  unBindSku,
  getLogistics,
  signLogistics,
  cancelSignLogistics,
  getWarehouseList,
  removeWarehouse,
  getWarehouseArea,
  createWarehouse,
  changeWarehouseStatus
}
