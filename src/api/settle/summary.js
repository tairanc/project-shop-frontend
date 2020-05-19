import axios from '@/api/interception'

//列表
const searchPeriodicStatement = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchPeriodicStatement',
    params:data
  })
};
//结算确认
const checkPeriodicStatement = (data) => {
  return axios({
    method: 'post',
    url: '/trmall/settlement/checkPeriodicStatement',
    data:{ids:data}
  })
};

//导出
const exportPeriodicStatement = (data) => {
  return axios({
    method: 'post',
    url: '/trmall/settlement/exportPeriodicStatement',
    data:data
  })
};
export default {
  searchPeriodicStatement,
  checkPeriodicStatement,
  exportPeriodicStatement
}
