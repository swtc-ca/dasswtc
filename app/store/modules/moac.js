//import shop from '../../api/shop'

// initial state
const state = {
  all: [],
	servers: [
	  { server: "http://47.89.246.244:8545", display: "美国阿里云" },
	  { server: "http://115.159.43.166:8545", display: "上海腾讯云" },
	  { server: "http://150.109.55.237:8545", display: "香港腾讯云" }
	]
}

// getters
const getters = {}

// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
