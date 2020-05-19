import axios from '@/api/interception'

const getComments = () => {
  return axios({
    method: 'post',
    url: '/trmall/rate/survey',
  })
}
const getCommentList =(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/rate/list',
    data:params
  })
}

const getComplaintList =(params) =>{
  return axios({
    method: 'get',
    url: '/trmall/rate/appeal/list',
    params:params
  })
}
//设置精华评价
const set_essence =(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/rate/set_essence',
    data:params
  })
}
//回复评价
const reply =(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/rate/reply',
    data:params
  })
}
//申诉详情
const info =(params) =>{
  return axios({
    method: 'get',
    url: '/trmall/rate/appeal/info',
    params:params
  })
}

//创建申诉
const create =(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/rate/appeal/create',
    data:params
  })
}
//创建申诉
const modify =(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/rate/appeal/modify',
    data:params
  })
}
export default {
  getComments,getCommentList,getComplaintList,set_essence,reply,info,create,modify
}