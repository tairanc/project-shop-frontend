import axios from '@/api/interception'

const getOrderList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/order/list',
    params
  })
}
const getOrderInfo =(params) =>{
  return axios({
    method:'get',
    url:'/trmall/order/item_info',
    params
  })
}
const initDelivery =(params)=>{
  return axios({
    method:'get',
    url:'/trmall/order/init_delivery',
    params
  })
}
const delivery =(params)=>{
  return axios({
    method:'post',
    url:'/trmall/order/delivery',
    data:params
  })
}

const batch_delivery =(params)=>{
  return axios({
    method:'post',
    url:'/trmall/order/batch_delivery',
    data:params
  })
}
const packBatchConsoleInfo =(params)=>{
  return axios({
    method:'get',
    url:'/trmall/order/pack_batch_console_info',
    params:params
  })
}

const Dcexport =(params)=>{
  return axios({
    method:'get',
    url:'/trmall/order/export',
    params:params
  })
}
const deliveryInfo =(params)=>{
  return axios({
    method:'get',
    url:'/trmall/order/delivery_info',
    params
  })
}
const init_batch_delivery =()=>{
  return axios({
    method:'get',
    url:'/trmall/order/init_batch_delivery',
  })
}
const delivery_trace =(params)=>{
  return axios({
    method:'get',
    url:'/trmall/order/delivery_trace',
    params:params
  })
}
export default {
    getOrderList,
    getOrderInfo,
    initDelivery,
    delivery,
    deliveryInfo,
    Dcexport,
    batch_delivery,
    packBatchConsoleInfo,
    init_batch_delivery,
    delivery_trace
}