import * as applicationSettings from "tns-core-modules/application-settings"
require('nativescript-nodeify/nodeify')
const JLib = require('jingtum-lib')
var Bluebird = require("bluebird")
Bluebird.promisifyAll(JLib)

const state = {
    _swtcWallets: JSON.parse(applicationSettings.getString('SWTCWALLETS') || '[]'),
    _swtcServers: JSON.parse(applicationSettings.getString('SWTCSERVERS') || '[]'),
    _swtcLedgers: [],
    _swtcWallet: JSON.parse(applicationSettings.getString('SWTCWALLET') || '{}'),
    _swtcServer: JSON.parse(applicationSettings.getString('SWTCSERVER') || '{}'),
    _swtcSequence: 0,
    _swtcBalance: 0,
    _swtcPrice: 0,
    _swtcActivated: false,
    _swtcRemotes: [],
 }
const getters = {
    swtcLedgers: (state) => state._swtcLedgers,
    swtcWallets: (state) => state._swtcWallets,
    swtcWallet: (state) => state._swtcWallet,
    swtcServers: (state) => state._swtcServers,
    swtcServer: (state) => state._swtcServer,
    swtcSequence: (state) => state._swtcSequence,
    swtcBalance: (state) => state._swtcBalance,
    swtcPrice: (state) => state._swtcPrice,
    swtcActivated: (state) => state._swtcActivated,
    swtcRemotes: (state) => state._swtcRemotes
}
const mutations = {
    addSwtcLedger: (state, v) => { if (state._swtcLedgers.indexOf(v) === -1) { state._swtcLedgers.unshift(v) } } ,
    //addSwtcLedger: (state, v) => state._swtcLedgers.unshift(Object.assign({}, v, {timestamp: (new Date()).getTime()})),
    addSwtcWallet: (state, v) => { if (state._swtcWallets.filter(e => e.address === v.address).length < 1)  { state._swtcWallets.unshift(v) } },
    removeSwtcWallet: (state, v) => state._swtcWallets.splice(state._swtcWallets.indexOf(v),1),
    setSwtcWallet: (state, v) => state._swtcWallet = Object.assign({}, {address: v.address, secret: v.secret}),
    addSwtcServer: (state, v) => { if (state._swtcServers.filter(e => e.server === v.server).length < 1)  { state._swtcServers.unshift(v) } },
    removeSwtcServer: (state, v) => state._swtcServers.splice(state._swtcServers.indexOf(v),1),
    setSwtcServer: (state, v) => state._swtcServer = Object.assign({}, {server: v.server, display: v.display}),
    setSwtcSequence: (state, v) => state._swtcSequence = v,
    setSwtcBalance: (state, v) => state._swtcBalance = v,
    setSwtcPrice: (state, v) => state._swtcPrice = v,
    setSwtcActivated: (state, v) => state._swtcActivated = v,
    setSwtcRemotes: (state, v) => state._swtcRemotes.splice(0, 1, new JLib.Remote({server: v.server, local_sign: true})),

    saveSwtcWallets: (state) => applicationSettings.setString('SWTCWALLETS', JSON.stringify(state._swtcWallets)),
    saveSwtcServers: (state) => applicationSettings.setString('SWTCSERVERS', JSON.stringify(state._swtcServers)),
    saveSwtcWallet: (state) => applicationSettings.setString('SWTCWALLET', JSON.stringify(state._swtcWallet)),
    saveSwtcServer: (state) => applicationSettings.setString('SWTCSERVER', JSON.stringify(state._swtcServer)),
}
const actions = {
}
export default {
  state,
  getters,
  mutations,
  actions
}