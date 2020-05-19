import axios from '@/api/interception'

const getItemList = (params) => {
  return axios({method: 'post', url: '/trmall/item/list', data: params})
}

const deleteItemList = (params) => {
  return axios({method: 'delete', url: '/trmall/item/delete', data: params})
}

const setShelf = (params) => {
  return axios({method: 'get', url: '/trmall/item/set_shelf', params: params})
}

const setTemplate = (params) => {
  return axios({method: 'get', url: '/trmall/item/set_freight_template', params: params})  
}
const setShopCategory = (params) => {
  return axios({method: 'get', url: '/trmall/item/set_shop_category', params: params})    
}

const exportGoods = (params) => {
  return axios({method: 'get', url: '/trmall/item/export', params: params})
}

// 品牌列表
const setBrandList = (params) => {
  return axios({method: 'get', url: '/trmall/brand/getShopRelateBrandList', params: params})
}

//发布商品
const getInit = (params) => {
  return axios({method: 'get', url: '/trmall/item/init_publish', params: params})
}

const createGood = (params) => {
  return axios({method: 'post', url: '/trmall/item/create', data: params})
}

const uploadImg = (params) => {
  return axios({
    method: 'post', 
    url: '/trmall/image/uploadImage', 
    data: params})
}

// 更新商品

const updateGood = (params) => {
  return axios({method: 'post', url: '/trmall/item/update', data: params})
}

//商品分类
const getCategory = (params) => {
  return axios({method: 'get', url: '/trmall/shop/category/get', params: params})
}

const saveCategory = (params) => {
  return axios({method: 'post', url: '/trmall/shop/category/save', data: params})
}

// 图片空间接口
const getImgDir = (params) => {
  return axios ({method : 'get' , url: '/trmall/image/getFileList' , params : params})
}

const getImgList = (params) => {
  return axios({method : 'get' , url: '/trmall/image/getImageFileList' , params : params})
}

const getImgListJustImg = (params) => {
  return axios({method : 'get' , url: '/trmall/image/getShopImages' , params : params})
}

const createImgFile = (params) => {
  return axios({method: 'post', url: '/trmall/image/createImageFile', data: params})
}

const deleteImgFile = (params) => {
  return axios({method: 'delete', url: '/trmall/image/delete', data: params})
}

const renameImgFile = (params) => {
  return axios({method: 'post', url: '/trmall/image/rename', data: params})
}

const moveImgFile = (params) => {
  return axios({method: 'post', url: '/trmall/image/move', data: params})
}

const getEditSaleList = (params) => {
  return axios({method : 'get' , url: '/trmall/item/init_item_sale' , params : params})
}


export default {
  getItemList,
  deleteItemList,
  setShelf,
  setTemplate,
  setShopCategory,
  setBrandList,
  getInit,
  createGood,
  updateGood,
  uploadImg,
  getCategory,
  saveCategory,
  getImgDir,
  getImgList,
  getImgListJustImg,
  createImgFile,
  deleteImgFile,
  renameImgFile,
  moveImgFile,
  getEditSaleList,
  exportGoods
}