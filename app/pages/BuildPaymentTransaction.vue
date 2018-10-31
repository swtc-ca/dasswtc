<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      title="创建支付交易">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="60,80,80,auto,100,*" ref="mainLayout">
      <DropDown ref="dropdown" row="0" hint="选择支付钱包" selectedIndex="0" :items="wallets.map(w => w.address)"  @selectedIndexChanged="onSelect" />
      <GridLayout row="1" columns="auto,*">
        <Label col="0" text="支付方" />
        <TextField col="1" :text="wallet.address" editable="false" style="font-size:12" />
      </GridLayout>
      <GridLayout row="2" columns="auto,*,auto,10">
        <Label col="0" text="接收方" />
        <TextField col="1" v-model="destination" style="font-size:12" />
        <Label class="ion ionicon" col="2" :text="'ion-md-qr-scanner' | fonticon" @tap="onScanDestination"/>
      </GridLayout>
      <GridLayout row="3" columns="100,*,auto">
        <Label col="0" text="支付SWTC" />
        <TextField col="1" v-model="quantity" />
        <Button class="btn btn-primary btn-active" col="2" text="生成交易" @tap="onGenerate" />
      </GridLayout>
      <TextView hint="交易数据" row="4" autocorrect="false" maxLength="3000" v-model="result" editable="false" @tap="showResult"/>
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
export default {
  mixins: [ sideDrawer, jingtumLib, vibrator, feedback ],
  data() {
    return {
      walletIndex: 0,
      destination: '',
      quantity: 1,
      result: '',
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
    showResult() {
      this.toClipboard(this.result)
      this.appendMsg('拷贝到粘贴板')
	  this.$showModal(ModalText, {props: {text: this.result, width: 300, height: 300}})
    },
    onSelect(args) {
      this.walletIndex = args.newIndex
      this.$refs.dropdown.nativeView.close()
    },
    onGenerate() {
      console.log("生成交易")
      this.appendMsg("生成交易")
      let tx = this.swtcRemote.buildPaymentTx({
          account: this.wallet.address,
          to: this.destination,
          amount: {
              value: this.quantity,
              currency: 'SWT',
              issuer: ''
          }
      })
      console.log(tx.tx_json)
      this.result = JSON.stringify(tx.tx_json)
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
TextView {
  font-size: 14;
}
</style>
