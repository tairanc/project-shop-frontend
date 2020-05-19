import axios from '@/api/interception'

const delivery = {
  state: {
    templateUpList: [],
    templateDownList: []
  },

  mutations: {
    updateData(state, payload) {
      state[payload.name] = payload.value
    }
  },

  actions: {
    getDeliveryStatusList({ commit }, payload) {
      let name =''
      if(payload.status===1){
        name = 'templateUpList'
      }else{
        name = 'templateDownList'
      }

      axios({
        method: 'get',
        url: '/trmall/shop/deliveryTemplate/list/status/get',
        params: payload
      }).then((res) => {
        commit('updateData', {
          name: name,
          value: res.data.data
        })
      })
    }
  }
}

export default delivery
