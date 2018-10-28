require('nativescript-nodeify/nodeify')
const JLib = require('jingtum-lib')
const Remote = JLib.Remote
const Wallet = JLib.Wallet

const options_swt_cny = {
    gets: { currency: 'SWT', issuer: '' },
    pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
};
const options_cny_swt = {
    gets: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
    pays: { currency: 'SWT', issuer: '' }
};
var callbackErrorResult =  (err, result) => {
    if(err) { 
      console.log(err)
    } else {
       console.log(result)
    }
}
var callbackMessage = msg => console.log(msg)

export default {
    data () {
      return {
        swtcRemote: false,
      }
    },
    computed: {
    },
    methods: {
      swtcNewWallet(secret=false) {
          if (secret) {
              return Wallet.fromSecret(secret)
          } else {
              return Wallet.generate()
          }
      },
      swtcNewRemote(server='ws://swtc.daszichan.com:5020', local_sign=true) {
          if (typeof(server) === typeof({})) {
              return new Remote({server: server.server, local_sign: local_sign})
          } else {
              return new Remote({server: server, local_sign: local_sign})
          }
      },
      swtcConnect(cb=callbackErrorResult){
          console.log('START REMOTE CONNECTION:')
          if (!!this.swtcRemote) {
            this.swtcRemote.connect(cb)
          }
      },
      swtcIsConnected(){
          console.log('START REMOTE CONNECTION:')
          if (!!this.swtcRemote) {
            return this.swtcRemote.isConnected()
          } else {
              return false
          }
      },
      swtcDisconnect(){
          console.log('END REMOTE CONNECTION:')
          if (!!this.swtcRemote) {
            this.swtcRemote.disconnect()
          }
      },
      swtcRequestOffer(wallet, offerType, taker1, taker2, cb=callbackErrorResult) {
          let tx = this.swtcRemote.buildOfferCreateTx({type: offerType, account: wallet.address, taker_gets: taker1, taker_pays: taker2})
          tx.setSecret(wallet.secret)
          tx.submit(cb)
      },
      swtcRequestOrderBook(options=options_swt_cny, cb=callbackErrorResult){
          this.swtcRemote.requestOrderBook(options).submit(cb)
      },
      swtcRequestAccountOffers(address,cb=callbackErrorResult){
          this.swtcRemote.requestAccountOffers({account: address}).submit(cb)
      },
      swtcRequestAccountRelations(address, relation='trust', cb=callbackErrorResult){
          this.swtcRemote.requestAccountRelations({account: address, type: relation}).submit(cb)
      },
      swtcRequestAccountTums(address,cb=callbackErrorResult){
          this.swtcRemote.requestAccountTums({account: address}).submit(cb)
      },
      swtcRequestAccountTx(address,cb=callbackErrorResult){
          this.swtcRemote.requestAccountTx({account: address}).submit(cb)
      },
      swtcBuildPaymentTx(wallet, to, value=1, currency='SWT', issuer='', memo='') {
        var tx = this.swtcRemote.buildPaymentTx({
            account: wallet.address,
            to: to,
            amount: {
                value: value,
                currency: currency,
                issuer: issuer
            }
        })
        tx.setSecret(wallet.secret);
        if (memo) {
          tx.addMemo(memo)
        } else {
          tx.addMemo(`${(new moment()).format('YYYYMMDDHHmmss')}`);
        }
        return tx
      },
      
      swtcPay(wallet, to='jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG', value=1, currency='SWT', issuer='', memo='', cb=callbackErrorResult){
          this.swtcBuildPaymentTx(wallet, to, value, currency, issuer, memo).submit(cb)
      },
      swtcQueryLedger(hashnum, with_transactions=false,cb=callbackErrorResult){
          this.swtcRemote.requestLedger({ledger_index:hashnum,transactions:with_transactions}).submit(cb)
      },
      swtcQueryTransaction(hashnum, cb=callbackErrorResult){
          this.swtcRemote.requestTx({hash:hashnum}).submit(cb)
      },
      swtcRequestAccountInfo(address,cb=callbackErrorResult) {
          this.swtcRemote.requestAccountInfo({account: address}).submit(cb)
      },
      swtcRequestServerInfo(cb=callbackErrorResult){
        this.swtcRemote.requestServerInfo().submit(cb)
      }
    },
    created () {
      console.log('mixins jingtumlib created')
    }
}