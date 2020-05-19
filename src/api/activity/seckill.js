import axios from '@/api/interception'
// 获取秒杀列表
const getSeckillList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/seckill/list',
    params: params
  })
}

// 获取秒杀商品列表
const getSeckillGoodList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/seckill/activity_goods',
    params: params
  })
}

//删除秒杀
const deleteSeckill = (params) => {
  return axios({
    method: 'delete', 
    url: '/trmall/seckill/delete', 
    data: params
  })
}

// 关闭 1
const closeCoupon = (params) => {
  let _url =  "/trmall/seckill/closePromotion"
  return axios({
    method: 'POST',
    url: _url,
    data: params
  })
}

//秒杀详情
const getSeckillDetail = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/seckill/info',
    params: params
  })
}

//关闭秒杀商品
const closeSeckillDetail = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/seckill/close',
    data: params
  })
}

//创建秒杀商品
const createSeckill = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/seckill/create',
    data: params
  })
}

//编辑秒杀商品
const updateSeckill = (params,type) => {
  let _url = type ? "/trmall/seckill/appendSecKillItems" : '/trmall/seckill/update'
  return axios({
    method: 'post',
    url: _url,
    data: params
  })
}

export default {
  getSeckillList,
  getSeckillGoodList,
  deleteSeckill,
  closeCoupon,
  getSeckillDetail,
  closeSeckillDetail,
  createSeckill,
  updateSeckill
}