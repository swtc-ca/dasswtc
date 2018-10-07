//import shop from '../../api/shop'

// initial state
// shape: [{ id, quantity }]
const state = {
  items: [],
  checkoutStatus: null,
	servers: [
	  { server: "wss://c04.jingtum.com:5020", display: "井通节点04" },
	  { server: "wss://c05.jingtum.com:5020", display: "井通节点05" },
	  { server: "ws://35.183.111.229:5020", display: "CA生态节点" }
	],
}

// getters
const getters = {
}

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
