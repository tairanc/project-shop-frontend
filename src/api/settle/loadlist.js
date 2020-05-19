import axios from '@/api/interception'

//列表
const searchDownloadList = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchDownloadList',
    params:data
  })
};

//下载
const getDownloadAuthUrl = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/getDownloadAuthUrl',
    params:data
  })
};

export default {
  searchDownloadList,
  getDownloadAuthUrl
}

