<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      title="离线签名">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="60,auto,100,auto,auto,100,*" ref="mainLayout">
      <DropDown ref="dropdown" row="0" hint="选择签名钱包" selectedIndex="0" :items="wallets.map(w => w.address)"  @selectedIndexChanged="onSelect" />
      <Label row="1" class="hr-light" />
      <TextView class="t-14" hint="需要签名的数据
      可以扫码
      通常用于签署交易" row="2" autocorrect="false" maxLength="3000" v-model="toSign" />
      <Label horizontalAlignment="center" class="ion ionicon" row="3" :text="'ion-md-qr-scanner' | fonticon" @tap="onScan"/>
      <Button class="btn btn-primary btn-active" row="4" text="使用钱包签名" @tap="onSign" />
      <TextView class="t-14" hint="签名后数据" row="5" autocorrect="false" maxLength="3000" v-model="result" editable="false" @tap="showResult"/>
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
      toSign: '',
      result: '',
    }
  },
  computed: {
	...mapGetters({ wallets: 'swtcWallets'}),
    wallet () {
        return this.wallets[this.walletIndex]
    }
  },
  methods: {
    ...mapMutations({ appendMsg: 'appendMsg', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'toClipboard']),
    onFabItemTap(args) {
			console.log(args)
      this.$navigateTo(this.$routes.SelectAddress)
    }, 
    showResult() {
      this.toClipboard(this.result)
      this.appendMsg('拷贝到粘贴板')
			this.$showModal(ModalText, {props: {text: this.result, width: 300, height: 300}})
    },
    onSelect(args) {
      this.walletIndex = args.newIndex
      this.$refs.dropdown.nativeView.close()
    },
    onSign(args) {
      let signWallet = this.swtcClassWallet(this.wallet.secret)
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
</style>
