
import axios from '@/api/interception'

const getAdminList = () => {
  return axios({
    method: 'get',
    url: '/trmall/shop/getShopSellerList',
  })
}
const getRoleList = () => {
    return axios({
      method: 'get',
      url: '/trmall/shop/getRoleList',
    })
  }

const delAdmin = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/shop/deleteShopSellerAccount',
      data:params
    })
  }
const restPassWord=(params) =>{
    return axios({
        method: 'post',
        url: '/trmall/shop/resetShopSellerAccountPassword',
        data:params
    })
}
const getAdminInfo=(params) =>{
    return axios({
        method: 'get',
        url: '/trmall/shop/getShopSellerAccountInfo',
        params
    })
}
const upDataInfo=(params) =>{
    return axios({
        method: 'post',
        url: '/trmall/shop/updateShopSellerAccount',
        data:params
    }) 
} 
const createAdmin=(params) =>{
    return axios({
        method: 'post',
        url: '/trmall/shop/createShopSellerAccount',
        data:params
    }) 
}
const getOperationLogList=(params) =>{
    return axios({
        method: 'get',
        url: '/trmall/shop/getOperationLogList',
        params
       
    }) 
}
export default {
    getAdminList,delAdmin,restPassWord,getAdminInfo,upDataInfo,createAdmin,getRoleList,getOperationLogList
}