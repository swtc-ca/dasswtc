import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import swtc from './modules/swtc';
import moac from './modules/moac';
import moment from 'moment';

//import mutations from './mutations.js'
//import * as actions from './actions.js'
//import * as getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

//var axios = require("axios");
//require("nativescript-nodeify");
//const JL = require("jingtum-lib");
//var swtcWallet = JL.Wallet;
//var swtcRemote = JL.Remote;

const store = new Vuex.Store({
  state: {
    // daszichan
    title: "DAPP钱包原型演示",
    tabTitles: ["钱包", "应用", "设置", "信息"],
    sequence: 0,
    balance: 0,
    activated: false,
    showSecret: false,
    price: 0,
    counter: 0,
    cold: true,
    swtc: true,
    swtcSecrets: [],
    moac: false,
    moacSecrets: [],
    msgs: ['welcome to check the demo app',],
    dapps: [ {name: "公链状态"}, {name: '交易所'}, { name: "大乐透"  }, { name: "靓号选"  }, { name: "誓言墙"  }, {name: "小游戏"}, {name: '快转帐'}, {name: '浏览器'}, {name: '投票机'}],
    donations: {
      swtc: "jLvo6LSKNEYJ4KDwDuM8LU5fuSsQkE4HVW",
      moac: "0x515710900f459aabf340E8921AD25a86B72E128a"
    },
  },
   // synchronous, store.commit(mutationname)
  mutations: {
   // ...mutations,
    setbalance: (state, balance) => state.balance = balance ,
    setsequence: (state, sequence) => state.sequence = sequence ,
    setactivated:  (state, truefalse) => { state.activated = truefalse; } ,
    setshowSecret:  (state, truefalse) => { state.showSecret = truefalse; } ,
    setprice: (state, price) => state.price = price ,
    swapcold:  state => { state.cold = !state.cold; } ,
    swapswtc:  state => { state.swtc = !state.swtc; } ,
    swapmoac:  state => { state.moac = !state.moac; } ,
    setcounter: (state, counter) => state.counter = counter ,
    increment: state => state.counter++ ,
    decrement: state => state.counter-- ,
    appendmsg: (state, msg) => {state.msgs.unshift(`${new moment().format('HH:mm:ss')}  ${msg}`.trim()); state.msgs.splice(10,2) }
  },
  // computed, store.getters.gettername or store.getters.gettername()
  getters: {
    //...getters
  },
  actions: {
    //...actions,
    increment (context) {
        context.commit('increment')
    },
    incrementAsync ({ commit }) {
        setTimeout(() => {
          commit('increment')
        }, 1000)
    },
    //async actionA ({ commit }) {
    //  commit('gotData', await getData())
    //},
    //async actionB ({ dispatch, commit }) {
    //  await dispatch('actionA') // wait for `actionA` to finish
    //  commit('gotOtherData', await getOtherData())
    //}
  },
  //mutations,
  //actions,
  //getters,
  strict: debug,
});

Vue.prototype.$store = store;

export default store;
