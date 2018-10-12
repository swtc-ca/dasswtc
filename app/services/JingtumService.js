import { getString, setString, getBoolean, setBoolean } from 'tns-core-modules/application-settings'
import BackendService from './BackendService'
import store from '../store'
import moment from 'moment'

var callbackErrorResult =  (err, result) => {if(err) { console.log(err); store.commit('appendmsg',err)} else {console.log(result); if (typeof(result) === 'object') {store.commit('appendmsg', JSON.stringify(result,'',2))} else {store.commit('appendmsg', result)}}}
var callbackMessage = msg => { console.log(msg); if (typeof(msg) === 'object') { store.commit('appendmsg', JSON.stringify(msg,'',2)) } else { store.commit('appendmsg', msg) }}
require("nativescript-nodeify")
const JL = require('jingtum-lib')
var SERVERS = [
  {server: 'wss://c04.jingtum.com:5020', display: "井通节点04" },
  {server: 'wss://c05.jingtum.com:5020', display: "井通节点05" },
  {server: 'ws://swtc.daszichan.com:5020', display: "CA生态节点" }
]

const Wallet = JL.Wallet
const Remote = JL.Remote
var options_swt_cny = {
    gets: { currency: 'SWT', issuer: '' },
    pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
};
var options_swt_cny = {
    gets: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
    pays: { currency: 'SWT', issuer: '' }
};

export default class JingtumService extends BackendService {

  constructor() {
    console.log('jingtum service initializing')
    super()
    this._address = this.swtcSecret ? Wallet.fromSecret(this.swtcSecret).address : ''
    this._remote = this.jlibServer ? new Remote({server: this.jlibServer, local_sign: true }) : null
    this._connecting = false
    this._connected = false
    console.log('jingtum service initialized')
    store.commit('appendmsg', 'Jingtum Service initialized')
  }
  servers() {
      return SERVERS;
  }
  get server() {
    return this.jlibServer
  }
  set server(server) {
    this.jlibServer = server
    this.remote = server
  }
  get secret() {
    return this.swtcSecret
  }
  set secret(secret) {
    this.swtcSecret = secret
    this.address = this.newWallet(secret).address
  }
  get remote() {
      return this._remote
  }
  set remote(server) {
      if ( this._connected ) {
          let old_remote = this._remote
          old_remote.disconnect()
      }
      this._remote = new Remote({server: server, local_sign: true })
      if ( this._connected ) {
          this._connected = false
          this.connect()
          setTimeout(() => this._connected = true, 2000)
      }
  }
  get connecting() {
    return this._connecting
  }
  set connecting(truefalse) {
    this._connecting = truefalse
  }
  get connected() {
    return this._connected
  }
  set connected(truefalse) {
    this._connected = truefalse
  }
  isConnected() {
    return this.connected
  }
  get address() {
      return this._address
  }
  set address(address) {
      this._address = address
  }
  connect(cb=callbackErrorResult){
    console.log('START REMOTE CONNECTION:')
    if (!!this.remote) {
      this.remote.connect(cb)
    }
  }
  disconnect(){
    console.log('END REMOTE CONNECTION:')
    if (!!this.remote) {
      this.remote.disconnect()
    }
  }
  confPersist() {
  }
  newWallet(secret=false) {
      if (secret) {
          return Wallet.fromSecret(secret)
      } else {
          return Wallet.generate()
      }
  }
  requestOffer(offerType, taker1, taker2, cb=callbackErrorResult) {
      let tx = this.remote.buildOfferCreateTx({type: offerType, account: this.address, taker_gets: taker1, taker_pays: taker2})
      tx.setSecret(this.secret)
      tx.submit(cb)
  }
  requestOrderBook(options=options_swt_cny, cb=callbackErrorResult){
    this.remote.requestOrderBook(options).submit(cb)
  }
  requestAccountOffers(cb=callbackErrorResult){
    this.remote.requestAccountOffers({account: this.address}).submit(cb)
  }
  requestAccountRelations(relation='trust', cb=callbackErrorResult){
    this.remote.requestAccountRelations({account: this.address, type: relation}).submit(cb)
  }
  requestAccountTums(cb=callbackErrorResult){
    this.remote.requestAccountTums({account: this.address}).submit(cb)
  }
  requestAccountTx(cb=callbackErrorResult){
    this.remote.requestAccountTx({account: this.address}).submit(cb)
  }
  buildPaymentTx(to, value=1, currency='SWT', issuer='', memo='') {
    var tx = this.remote.buildPaymentTx({
        account: this.address,
        to: to,
        amount: {
            value: value,
            currency: currency,
            issuer: issuer
        }
    })
    tx.setSecret(this.secret);
    if (memo) {
      tx.addMemo(memo)
    } else {
      tx.addMemo(`${(new moment()).format('YYYYMMDDHHmmss')}`);
    }
    return tx
  }

  pay(to='jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG', value=1, currency='SWT', issuer='', memo='', cb=callbackErrorResult){
      this.buildPaymentTx(to, value, currency, issuer, memo).submit(cb)
  }
  queryLedger(hashnum, with_transactions=false,cb=callbackErrorResult){
      this.remote.requestLedger({ledger_index:hashnum,transactions:with_transactions}).submit(cb)
  }
  queryTransaction(hashnum, cb=callbackErrorResult){
      this.remote.requestTx({hash:hashnum}).submit(cb)
  }
  ledgerReceive(truefalse, cb=callbackMessage) {
      if (truefalse) {
        this.remote.on('ledger_closed', cb);
      } else {
        this.remote.removeListener('ledger_closed', cb)
      }
  }
  transactionReceive(truefalse, cb=callbackMessage) {
      if (truefalse) {
        this.remote.on('transactions', cb);
      } else {
        this.remote.removeListener('transactions', cb)
      }
  }
  updateWallet(cb=callbackErrorResult) {
      console.log(Wallet.fromSecret(this.secret).address)
      this.remote.requestAccountInfo({account: Wallet.fromSecret(this.secret).address}).submit(cb)
  }
  serverInfo(cb=callbackErrorResult){
    this.remote.requestServerInfo().submit(cb)
  }
  refresh() {
  }

}
