import axios from '@/api/interception'

function judgeChannel(channel) {
  switch (channel) {
    case "TrInstallment":
      return "installment";
    default:
      return "trmall"
  }
}

const getLoginState = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/loginAccount',
    data:params
  })
}
const getRAegistered = (params,channel) => {
  channel = judgeChannel(channel);
    return axios({
      method: 'post',
      url: '/'+channel+'/shop/registerShopKeeperAccount',
      data:params
    })
  }
  const getShopRegisterLicense = () => {
    return axios({
      method: 'get',
      url: '/trmall/common/getShopRegisterLicense',

    })
  }
  const getShopMenuList = () => {
    return axios({
      method: 'get',
      url: '/trmall/shop/getShopMenuList',

    })
  }
  //首页
  const getShopTrends = () => {
    return axios({
      method: 'get',
      url: '/trmall/common/getShopTrends',
    })
  }
  //入驻协议
  const getEnterApplicationProtocol = () => {
    return axios({
      method: 'get',
      url: '/trmall/common/getEnterApplicationProtocol',
    })
  }
export default {
    getLoginState,getRAegistered,getShopRegisterLicense,getShopMenuList,getShopTrends,getEnterApplicationProtocol
  }
