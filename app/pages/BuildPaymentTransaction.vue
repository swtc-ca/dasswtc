<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      title="创建支付交易">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="60,auto,auto,auto,auto,auto,auto,auto,100,*" ref="mainLayout">
      <DropDown class="m-10 p-5" ref="dropdown" row="0" hint="选择支付钱包" selectedIndex="0" :items="wallets.map(w => w.address)"  @selectedIndexChanged="onSelect" />
      <Label row="1" class="hr-light" />
      <GridLayout class="m-10 p-5" row="2" columns="auto,*">
        <Label col="0" text="支付方" />
        <TextField class="t-14" col="1" :text="wallet.address" editable="false" />
      </GridLayout>
      <GridLayout class="m-10 p-5" row="3" columns="auto,*,auto,10">
        <Label col="0" text="接收方" />
        <TextField class="t-14" col="1" v-model="destination" />
        <Label class="ion ionicon" col="2" :text="'ion-md-qr-scanner' | fonticon" @tap="onScanDestination"/>
      </GridLayout>
      <GridLayout class="m-10 p-5" row="4" columns="100,*">
        <Label col="0" text="账号序号" />
        <TextField class="t-14" col="1" v-model="sequence" />
      </GridLayout>
      <GridLayout class="m-10 p-5" row="5" columns="100,*,auto">
        <Label col="0" text="支付SWTC" />
        <TextField class="t-14" col="1" v-model="quantity" />
        <Button :isEnabled="!!destination" class="btn btn-primary btn-active" col="2" text="生成交易" @tap="onGenerate" />
      </GridLayout>
      <TextView class="t-14 m-10 p-5" hint="交易数据" row="6" autocorrect="false" maxLength="3000" :text="result" editable="false" @tap="showResult"/>
      <Button class="btn btn-primary" :isEnabled="!!tx" row="7" text="签名" @tap="onSign" />
      <TextView :visibility="signed ? 'visible' : 'collapse'" class="t-14" hint="签名数据" row="8" autocorrect="false" maxLength="3000" :text="result_signed" editable="false" @tap="showResult2"/>
      <TextView :visibility="signed ? 'visible' : 'collapse'" @tap="showResult3" class="t-14" hint="签名" row="9" autocorrect="false" maxLength="3000" :text="signature" editable="false"/>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import vibrator from '~/mixins/vibrator'
import jingtumLib from '~/mixins/jingtumLib'
import feedback from '~/mixins/feedback'
import { mapGetters, mapMutations, mapActions } from "vuex";
import ModalText from './../components/modalText'
require("nativescript-nodeify")
const jser = require('jingtum-lib/lib/Serializer.js').Serializer
const PREFIX = 0x53545800
export default {
  mixins: [ sideDrawer, jingtumLib, vibrator, feedback ],
  data() {
    return {
      walletIndex: 0,
      destination: '',
      quantity: 1,
      tx: false,
      signed: false,
      result: '',
      result_signed: '',
      signature: '',
      sequence: 0
    }
  },
  computed: {
    ...mapGetters({ wallets: 'swtcWallets',  server: 'swtcServer', servers: 'swtcServers'}),
    wallet () {
        return this.wallets[this.walletIndex]
    }
  },
  methods: {
    ...mapMutations({ addSwtcWallet: 'addSwtcWallet', setSwtcWallet: 'setSwtcWallet', saveSwtcWallets: 'saveSwtcWallets', saveSwtcWallet: 'saveSwtcWallet', appendMsg: 'appendMsg', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'showLastLogToasts', 'toClipboard']),
    showResult3() {
      this.toClipboard(this.result_signed)
      this.appendMsg('拷贝到粘贴板')
	    this.$showModal(ModalText, {props: {title: '签名印戳', text: this.signature, width: 300, height: 300}})
    },
    showResult2() {
      this.toClipboard(this.result_signed)
      this.appendMsg('拷贝到粘贴板')
	    this.$showModal(ModalText, {props: {title: '签名数据', text: this.result_signed, width: 300, height: 300}})
    },
    showResult() {
      this.toClipboard(this.result)
      this.appendMsg('拷贝到粘贴板')
	    this.$showModal(ModalText, {props: {title: '交易数据', text: this.result, width: 300, height: 300}})
    },
    onSelect(args) {
      this.walletIndex = args.newIndex
      this.$refs.dropdown.nativeView.close()
    },
    onSign() {
      this.tx.sign( (e,r) => {
        if (e) { console.log(e) }
          console.log(r)
          console.log('signed')
          this.signed = true
          this.result_signed = r
          this.signature = this.tx.tx_json.TxnSignature
          delete this.tx.tx_json.TxnSignature
          delete this.tx.tx_json.blob
          this.result = jser.from_json(this.tx.tx_json).hash(0x53545800)

          console.log(this.tx.tx_json)
          console.log(this.result)
          console.log(this.signature)
          console.log(this.wallet.secret)
      })
    },
    onGenerate() {
      console.log("生成交易")
      this.appendMsg("生成交易")
      this.tx = this.swtcRemote.buildPaymentTx({
          account: this.wallet.address,
          to: this.destination,
          amount: {
              value: this.quantity,
              currency: 'SWT',
              issuer: ''
          }
      })
      this.tx.setSequence(this.sequence)
      this.tx.setSecret(this.wallet.secret)
      console.log(this.tx.tx_json)
      this.result = JSON.stringify(this.tx.tx_json)
    },
    onScanDestination(args) {
		this.$store.dispatch('scan').then(
           (result) => {
				console.log(result);
				console.log("Scan format: " + result.format);
                console.log("Scan text:   " + result.text);
                this.destination = result.text
				this.appendMsg(result)
           },
           (error) => {
                console.log("No scan: " + error);
			    this.appendMsg(error)
           }
  	    )
    },
    pageLoaded() {
      console.log("page loaded")
    },
  },
  created() {
    console.log("created")
    if (this.wallet && this.wallet.hasOwnProperty('address')) {
      this.walletIndex = this.wallets.indexOf(this.wallets.filter(w => w.address === this.wallet.address)[0])
    } else {
      let wallet = this.swtcNewWallet()
      this.addSwtcWallet(wallet)
      this.saveSwtcWallets()
      this.setSwtcWallet(wallet)
      this.saveSwtcWallet()
    }
    console.log("create local remote")
    if (this.server && this.server.hasOwnProperty('server')) {
      console.log(this.server.server)
    } else {
      let swtcServer =  this.servers[Math.floor(Math.random() * this.servers.length)]
      this.setServer(swtcServer)
      this.saveServer()
    }
    this.swtcRemote = this.swtcNewRemote(this.server)
  },
  mounted() {
  },
  destroyed () {
  }
}
</script>

<style scoped>
</style>
