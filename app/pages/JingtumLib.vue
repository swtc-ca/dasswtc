<template>
  <Page ref="page" actionBarHidden="false" class="page" backgroundSpanUnderStatusBar="true">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="井通开发库">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <Gridlayout ~mainContent rows="*,auto" cols="*">
      <StackLayout row="0" :visibility="activeSegment === 'lib' ? 'visible' : 'collapse'">
        <GridLayout columns="*,auto,10,auto" verticalAlignment="top">
          <Label textVerticalAlignment="center" class="openrul" text="jingtum-lib" col="0" />
          <Label class="openurl fa fas" col="3" :text="'fa-external-link-alt' | fonticon" @tap="openurl('http://developer.jingtum.com/chapter1_connect.html')"></Label>
        </GridLayout>
        <Button height="60" class="docimportant" text="在线文档" @tap="awv('http://developer.jingtum.com/chapter1_connect.html')"/>
        <Label class="docimportant" text="本地签名" />
        <ScrollView>
          <TextView style="font-size:16;" editable="false">
          Remote({server: server, local_sign: true})
          </TextView>
        </ScrollView>
      </StackLayout>
      <StackLayout row="0" :visibility="activeSegment === 'base' ? 'visible' : 'collapse'">
        <GridLayout columns="*,auto,10,auto" verticalAlignment="top">
          <Label textVerticalAlignment="center" class="openrul" text="基础库钱包签名" col="0" />
          <Label class="openurl fa fas" col="3" :text="'fa-external-link-alt' | fonticon" @tap="openurl('http://developer.jingtum.com/chapter2_account_new.html')"></Label>
        </GridLayout>
        <Button height="60" class="docimportant" text="在线文档" @tap="awv('http://developer.jingtum.com/chapter2_account_new.html')"/>
        <Label class="docimportant" text="离线签名" />
        <ScrollView>
          <TextView style="font-size:16;" editable="false">
          Wallet.sign
          Wallet.verify
          Wallet.signTx
          Wallet.verifyTx
          </TextView>
        </ScrollView>
      </StackLayout>
      <StackLayout row="0" :visibility="activeSegment === 'api' ? 'visible' : 'collapse'">
        <GridLayout columns="*,auto,10,auto" verticalAlignment="top">
          <Label textVerticalAlignment="center" class="openrul" text="API 访问适合移动应用" col="0" />
          <Label class="openurl fa fas" col="3" :text="'fa-external-link-alt' | fonticon" @tap="openurl('http://developer.jingtum.com/api2_doc.html#')"></Label>
        </GridLayout>
        <Button height="60" class="docimportant" text="在线文档" @tap="awv('http://developer.jingtum.com/api2_doc.html#')"/>
        <Label class="docimportant" text="提交本地签名的交易" />
        <ScrollView>
          <TextView style="font-size:16;" editable="false">
          POST /v2/blob
          { "blob": "123456787...." }
          </TextView>
        </ScrollView>
      </StackLayout>
      <StackLayout row="0" :visibility="activeSegment === 'output' ? 'visible' : 'collapse'">
        <ScrollView>
          <TextView :text="logMsgs" fontSize="12" editable="false">
          </TextView>
        </ScrollView>
      </StackLayout>
      <StackLayout row="0" :visibility="activeSegment === 'play' ? 'visible' : 'collapse'">
      <StackLayout :visibility="!wallet || wallet.address === 'undefined' ? 'visible' : 'collapse'">
          <ListPicker :items="wallets.map(w => w.address)" v-model="walletIndex" />
          <Button text="选择井通地址" @tap="onWalletSelected" class="btn btn-primary btn-active"/>
      </StackLayout>
      <StackLayout :visibility="!server || server.server === 'undefined' ? 'visible' : 'collapse'">
          <ListPicker :items="servers.map(s => s.display)" v-model="serverIndex" />
          <Button text="选择井通服务器" @tap="onServerSelected" class="btn btn-primary btn-active"/>
      </StackLayout>
      <StackLayout :visibility="wallet.address === 'undefined' ? 'collapse' : 'visible'">
        <GridLayout ref="walletRef" columns="80,*,2*,90" rows="40">
          <Label col="0">井通</Label>
          <Label col="1" :text="sequence ? '序' + sequence : ''" />
          <Label col="2" :text="balance ? '余' + balance : ''" />
          <Label col="3" :text="!!price ? '价' + price : ''" />
        </GridLayout>
        <Label :text="'     ' + wallet.address" @onTap="toClipboard(`${wallet.address}`)" />
      </StackLayout>
      <StackLayout :visibility="!swtcRemote ? 'collapse' : 'visible'">
        <GridLayout ref="remoteRef" columns="100,*,*,80" rows="44">
          <Label col="0" :text="server.display" />
          <Button col="3" :isEnabled="!remoteConnecting" @tap="onRemoteConnection" :text="!remoteStatus ? '连接' : '断开'" style="width:80;height:40" class="btn btn-primary"/>
        </GridLayout>
        <GridLayout ref="queryRef" columns="120,*,120" rows="48" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">
          <Button col="0" row="0" @tap="onQueryLedger" text="查账本" style="width:120;" class="btn btn-primary"/>
          <TextField col="1" row="0" hint="帐本高度/哈希 交易哈希" v-model="qrLedgerTransaction" autocorrect="false"/>
          <Button col="2" row="0" @tap="onQueryTransaction" text="查交易" style="width:120;" class="btn btn-primary"/>
        </GridLayout>
        <GridLayout ref="queryRefa" columns="120,*,*,120" rows="48" :visibility="remoteStatus && !remoteConnecting && wallet? 'visible' : 'collapse'">                     
          <Button col="0" :isEnabled="remoteStatus && !remoteConnecting" @tap="onWalletBalance" text="查余额" style="width:120" class="btn btn-primary"/>                
          <Button col="3" :isEnabled="remoteStatus && !remoteConnecting && activated" row="1" text="查通证" @tap="onWalletTums" class="btn btn-primary"  style="width:120;" />
        </GridLayout>
        <GridLayout ref="queryRefb" columns="120,*,*,120" rows="48" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">                     
          <Button col="0" text="查市场" :isEnabled="remoteStatus && !remoteConnecting" @tap="onOrderBook" class="btn btn-primary"  style="width:120;" />      
          <Button col="3" :isEnabled="remoteStatus && !remoteConnecting" @tap="onRemoteInfo" text="服务器" style="width:120;" class="btn btn-primary"/>           
        </GridLayout>
        <GridLayout ref="paymentRef" columns="120,*,*,120" rows="48,48,48" :visibility="remoteStatus && !remoteConnecting && activated ? 'visible' : 'collapse'">  
          <Button col="0" row="0" :isEnabled="!isIOS && isAndroid" text="作支付" @tap="onPayment" class="btn btn-primary"  style="width:120;" />
          <TextField col="1" row="0" v-model="payMemo" autocorrect="false"/>
          <TextField col="2" row="0" v-model="payValue" autocorrect="false"/>
          <Button col="3" row="0" text="查记录" @tap="onWalletHistory" class="btn btn-primary"  style="width:120;" />
          <Button col="0" row="1" text="查关系" @tap="onWalletRelations" class="btn btn-primary"  style="width:120;" />
          <TextField col="1" row="1" v-model="qrRelation" autocorrect="false"/>
          <Button col="3" row="1" text="查挂单" @tap="onWalletOffers" class="btn btn-primary"  style="width:120;" />
          <Button col="0" row="2" text="挂单买" :isEnabled="!isIOS && isAndroid" @tap="onOfferBuy" class="btn btn-primary"  style="width:120;" />
          <TextField col="1" row="2" v-model="offerSWT" autocorrect="false"/>
          <TextField col="2" row="2" v-model="offerCNY" autocorrect="false"/>
          <Button col="3" row="2" text="挂单卖" :isEnabled="!isIOS && isAndroid" @tap="onOfferSell" class="btn btn-primary"  style="width:120;" />
        </GridLayout>
        <GridLayout ref="listenRef" columns="120,*,*,120" rows="48" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">
          <Button col="0" width="120" :text="!onLedger ? '监听账本' : '停止监听账本'" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'" @tap="onListenLedger()" class="btn btn-primary btn-active" />
          <Button col="3" width="120" :text="!onTransaction ? '监听交易' : '停止监听交易'" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'" @tap="onListenTransaction()" class="btn btn-primary btn-active" />
        </GridLayout>
      </StackLayout>
      </StackLayout>
      <GridLayout col="1" backgroundColor="aqua" verticalAlignment="bottom" columns="*,*,*,*,*">
        <Button class="segmentitem" col="0" @tap="activeSegment='play'" text="PLAY"></Button>
        <Button class="segmentitem" col="1" @tap="activeSegment='api'" text="API"></Button>
        <Button class="segmentitem" col="2" @tap="activeSegment='base'" text="BASE"></Button>
        <Button class="segmentitem" col="3" @tap="activeSegment='lib'" text="LIB"></Button>
        <Button class="segmentitem" col="4" @tap="activeSegment='output'" text="OUTPUT"></Button>
      </Gridlayout>
    </GridLayout>
  </Page>
</template>

<script>
const dialogs = require('tns-core-modules/ui/dialogs')
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as platformModule from "tns-core-modules/platform";
//import JingtumLibService from './../services/JingtumLibService';
//const jingtumLibService = new JingtumLibService('jingtumlib');
import sideDrawer from '~/mixins/sideDrawer'
import feedback from '~/mixins/feedback'
import jingtumLib from '~/mixins/jingtumLib'
import { openUrl } from "tns-core-modules/utils/utils"
import { openAdvancedUrl, AdvancedWebViewOptions } from 'nativescript-advanced-webview'
export default {
  mixins: [ sideDrawer, feedback, jingtumLib ],
  data() {
    return {
      appVersion: '0.2.1',
      walletIndex: 0,
      serverIndex: 0,
      remoteConnecting: false,
      qrLedgerTransaction: '',
      onTransaction: false,
      onLedger: false,
      payValue: 1,
      payMemo: 'memo赞助',
      qrRelation: 'trust',
      offerSWT: 1,
      offerCNY: 0.01,
      segmentItems: ['api', 'base', 'lib', 'play', 'output'],
      segmentIndex: 3,
      activeSegment: 'play',
      apis: [],
      base: ['Wallet.generate', 'Wallet.fromSecret', 'Wallet.isValidAddress', 'Wallet.isValidSecret', 'Wallet.sign', 'Wallet.verify', 'Wallet.address', 'Wallet.secret', 'Wallet.toJson', 'Wallet.getPublicKey', 'Wallet.signTx', 'Wallet.verifyTx'],
      lib: []
    };
  },
  computed: {
    ...mapState(['isIOS', 'isAndroid']),
    ...mapGetters({activated: 'swtcActivated', sequence: 'swtcSequence', balance: 'swtcBalance', price: 'swtcPrice', msgs: 'msgs', wallets: 'swtcWallets', wallet: 'swtcWallet', servers: 'swtcServers', server: 'swtcServer'}),
    remoteStatus: function () {
      return this.swtcRemote && this.swtcRemote.isConnected() 
    },
    pageClasses: function() {
      return {
        // add top class so we can apply styles to specific platforms
        "platform-ios": platformModule.isIOS,
        "platform-android": platformModule.isAndroid
      };
    },
    logMsgs() {
      return this.msgs.map( e => `${JSON.stringify(e.msg, '', 2)}\n`)
    }
  },
  methods: {
    ...mapMutations([
      "appendMsg", "addSwtcWallet", "saveSwtcWallets", "setSwtcWallet", "saveSwtcWallet", "setSwtcServer", "saveSwtcServer", "setSwtcActivated","setSwtcPrice", "setSwtcSequence", "setSwtcBalance"
    ]),
    ...mapActions(['showLastLogToasts', 'toClipboard']),
    callback_message (msg) {
      console.log(msg)
      this.$store.commit('appendMsg',msg)
      this.showLastLog()
    },
   // toClipboard(content){
   //   clipboard.setText(content).then(() => { this.appendMsg(`${content}已拷贝到粘贴板`); this.showLastLogToasts()});
   // },
   	awv(url) {
      try {
        //let AdvancedWebViewOptions = {
        let opt = {
          url: url,
          showTitle: true,
          toolbarColor: '#336699',
          toolbarControlsColor: '#333',
          isClosed: closed => {
            console.log(closed);
          }
        }
        openAdvancedUrl(opt);
      } catch (error) {
        console.log(error);
      }
	  },
    openurl(url) {
      openUrl(url)
    },
    onSegmentChange(args) {
      console.log(args.object.__vue_element_ref__)
      console.log(this.segmentIndex)
      console.log(this.activeSegment)
//      this.appendMsg(args.object.__vue_element_ref__)
      this.showLastLog()
    },
    showLastLog() {
      this.showLastLogToasts()
    },

    onPayment(){
      console.log("donation")
      this.appendMsg(`测试支付赞助 ${this.payMemo}`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcPay(this.wallet, 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',this.payValue,'SWT','',this.payMemo,cbErrResult)
    },
    onOfferSell(){
      console.log("manage offers")
      this.appendMsg(`操作挂单...`)
      this.showLastLog()
      let takerpays = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takergets = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      this.swtcRequestOffer(this.wallet, 'Sell', takergets, takerpays)
    },
    onOfferBuy(){
      console.log("manage offers")
      this.appendMsg(`操作挂单...`)
      this.showLastLog()
      let takergets = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takerpays = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      this.swtcRequestOffer(this.wallet, 'Buy', takergets, takerpays)
    },
    onOrderBook() {
      console.log("query orderbooks")
      this.appendMsg(`查询市场...`)
      this.showLastLog()
      var callbackGetPrice =  (err, result) => {
        if(err) {
          console.log(err)
          this.appendMsg(err)
        } else {
          if (typeof(result) === 'object') {
            let firstRecord = result.offers[0]
            let offers = []
            this.setSwtcPrice(Math.floor(10000 * Number(firstRecord.TakerGets.value) * 1000000 / Number(firstRecord.TakerPays)) / 10000)
            this.offerCNY = this.price
            result.offers.forEach(r => offers.push(`${Math.floor(Number(r.TakerPays) / 1000000)}SWT <-> ${Math.floor(r.TakerGets.value)}CNY`))
            this.appendMsg(offers.slice(0,10))
            console.log(offers)
          } else {
            console.log(result);
            this.appendMsg(result)
          }
        }
        this.showLastLog()
      }
      var options_swt_cny = {
          gets: { currency: 'SWT', issuer: '' },
          pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
      };
      this.swtcRequestOrderBook(options_swt_cny,callbackGetPrice)
    },
    onListenLedger() {
      console.log("listen ledger_closed switch...")
      //let cbMsg = msg => { console.log(msg); this.appendMsg(msg); this.showLastLog() }
      //jingtumLibService.onLedger(this.remote, this.callback_message)
      if (this.onLedger) {
        this.swtcRemote.removeListener('ledger_closed', this.callback_message)
      } else {
        this.swtcRemote.on('ledger_closed', this.callback_message)
      }
      this.appendMsg(`更改账本接收...`)
      this.showLastLog()
      this.onLedger = !this.onLedger
    },
    onListenTransaction() {
      console.log("listen transactions switch...")
      if (this.onTransaction) {
        this.swtcRemote.removeListener('transactions', this.callback_message)
      } else {
        this.swtcRemote.on('transactions', this.callback_message)
      }
      this.appendMsg(`更改交易接收...`)
      this.showLastLog()
      this.onTransaction = !this.onTransaction
    },
    onWalletOffers() {
      console.log("query offers")
      this.appendMsg(`查询挂单...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcRequestAccountOffers(this.wallet.address, cbErrResult)
    },
    onWalletRelations() {
      console.log("query relation")
      this.appendMsg(`查询关系...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcRequestAccountRelations(this.wallet.address, this.qrRelation, cbErrResult)
    },
    onWalletTums() {
      console.log("available tums")
      this.appendMsg(`查询可用通证...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcRequestAccountTums(this.wallet.address, cbErrResult)
    },
    onWalletHistory() {
      console.log("history")
      this.appendMsg(`查询支付记录...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcRequestAccountTx(this.wallet.address, cbErrResult)
    },
    onWalletBalance() {
      console.log("update balance")
      this.appendMsg("查余额...");
      this.showLastLog()
      let callbackAccount =  (err, result) => {
        if(err) {
          console.log(err)
          this.appendMsg(err)
          if (err === 'Account not found.') {
            alert({title: "注意", message: "账号未激活, 转入35个井通和0.1CNY可以体验账号相关测试", okButtonText: "好"})
          }
        } else {
          this.setSwtcActivated(true)
          console.log(result)
          if (typeof(result) === 'object') {
            this.setSwtcSequence(result.account_data.Sequence)
            this.setSwtcBalance(Math.floor(result.account_data.Balance / 10000) / 100)
          }
          this.appendMsg(result)
        }
        this.showLastLog()
      }
      this.swtcRequestAccountInfo(this.wallet.address, callbackAccount);
    },
    onQueryLedger(){
      console.log("querying ledger ...")
      this.appendMsg(`查询账本...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcQueryLedger(this.qrLedgerTransaction, true, cbErrResult)
    },
    onQueryTransaction(){
      console.log("querying transaction ...")
      this.appendMsg(`查询交易...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcQueryTransaction(this.qrLedgerTransaction, cbErrResult)
    },
    onRemoteInfo() {
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      this.swtcRequestServerInfo(cbErrResult);
    },
    onRemoteConnection() {
      console.log("switching remote connection")
      this.remoteConnecting = true
      console.log("server connection change")
      var callbackConnect =  (err, result) =>{
          this.remoteConnecting = false;
          if(err) {
            console.log(err)
            this.appendMsg(err)
          } else {
            console.log(result)
            this.appendMsg(result)
          }
          this.showLastLog()
        }
      if (this.remoteStatus) {
        this.swtcDisconnect()
        this.onLedger = false
        this.onTransaction = false
        this.remoteConnecting = false
        this.setSwtcPrice(0)
        this.setSwtcBalance(0)
        this.appendMsg('remote disconnected')
      } else {
        this.swtcConnect(callbackConnect)
      }
      //callbackPost()
    },
    onServerSelected() {
      console.log("server selected");
      if (this.serverIndex && this.serverIndex < this.servers.length) {
        this.setSwtcServer(this.servers[this.serverIndex])
        this.saveSwtcServer()
        console.log(this.server)
        this.swtcRemote = this.swtcNewRemote(this.server.server)
        console.log(this.server.server)
        this.appendMsg(this.server)
      } else {
        console.log('no server selected')
        this.appendMsg('请选择一个服务器')
      }
      this.showLastLog()
    },
    onWalletSelected() {
      console.log("wallet selected");
      if (this.walletIndex && this.walletIndex < this.wallets.length) {
        this.setSwtcWallet(this.wallets[this.walletIndex])
        this.saveSwtcWallet()
        console.log(this.wallet.address)
        this.appendMsg(this.wallet)
      } else {
        console.log('no wallet selected')
        this.appendMsg('请选择一个钱包')
      }
      this.showLastLog()
    },
  },
  created() { 
    console.log("jingtum app created")
    if (this.wallet && this.wallet.hasOwnProperty('address')) {
      this.walletIndex = this.wallets.indexOf(this.wallets.filter(w => w.address === this.wallet.address)[0])
    } else if (this.wallets.length > 0) {
      let wallet = this.wallets[0]
      this.setSwtcWallet(wallet)
      this.saveSwtcWallet()
    } else {
      let wallet = this.swtcNewWallet()
      this.addSwtcWallet(wallet)
      this.saveSwtcWallets()
      this.setSwtcWallet(wallet)
      this.saveSwtcWallet()
    }
    if (this.server && this.server.hasOwnProperty('server')) {
      this.serverIndex = this.servers.indexOf(this.servers.filter(s => s.server === this.server.server)[0])
    } else {
      let swtcServer =  this.servers[Math.floor(Math.random() * this.servers.length)]
      this.setSwtcServer(swtcServer)
      this.saveSwtcServer()
    }
  },
  mounted() {
    console.log("jingtum app mounted")
    if (this.server && this.server.hasOwnProperty('server')) {
      console.log("set jingtumlib.remote")
      this.swtcRemote = this.swtcNewRemote(this.server)
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.message {
  vertical-align: center;
  text-align: left;
  font-size: 16;
  color: #333333;
  line-height: 10%;
}
Button {
  padding-bottom: 1;
  margin: 0;
  height: 44;
  text-align: center;
  vertical-align: middle;
}
.openurl {
  font-size: 20;
  horizontal-align: right;
}
.docimportant {
  font-size: 20;
  horizontal-align: center;
}
.segmentitem {
  padding-left: 2;
  padding-right: 2;
  margin: 0;
}
</style>
