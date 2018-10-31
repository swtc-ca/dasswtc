<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      title="离线签名">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="auto,auto,100,100,*" ref="mainLayout">
      <ListPicker row="0" :items="wallets.map(w => w.address)" v-model="walletIndex" />
        <GridLayout row="1" columns="auto,*,auto">
          <Button col="0" text="使用钱包签名" @tap="onSign" />
          <Label class="fa fas" col="2" :text="'fa-qrcode' | fonticon" @tap="onScan" />
        </GridLayout>
      <TextView hint="需要签名的数据
      可以扫码
      通常时签署交易" row="2" autocorrect="false" maxLength="3000" v-model="toSign" />
      <TextView hint="签名后数据" row="3" autocorrect="false" maxLength="3000" v-model="result" editable="false" @tap="showResult"/>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import vibrator from '~/mixins/vibrator'
import jingtumLib from '~/mixins/jingtumLib'
import { mapGetters, mapMutations, mapActions } from "vuex";
import ModalText from './../components/modalText'
export default {
  mixins: [ sideDrawer, jingtumLib, vibrator ],
  data() {
    return {
      walletIndex: 0,
      toSign: '',
      result: '',
    }
  },
  computed: {
	...mapGetters({ wallets: 'swtcWallets', wallet: 'swtcWallet'}),
  },
  methods: {
    ...mapMutations({ appendMsg: 'appendMsg', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'showLastLogToasts', 'toClipboard']),
    onFabItemTap(args) {
			console.log(args)
      this.$navigateTo(this.$routes.SelectAddress)
    }, 
    showResult() {
      this.toClipboard(this.result)
      this.appendMsg('拷贝到粘贴板')
			this.$showModal(ModalText, {props: {text: this.result, width: 300, height: 300}})
    },
    onSign(args) {
      let signWallet = this.swtcClassWallet(this.wallets[this.walletIndex].secret)
      this.result = signWallet.sign(this.toSign)
    },
    onScan(args) {
		this.$store.dispatch('scan').then(
           (result) => {
				console.log(result);
				console.log("Scan format: " + result.format);
        console.log("Scan text:   " + result.text);
        this.toSign = result.text
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
    if (this.wallet && this.wallet.hasOwnProperty('address')) {
      this.walletIndex = this.wallets.indexOf(this.wallets.filter(w => w.address === this.wallet.address)[0])
    }
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
