<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      title="离线签名TX">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="60,auto,100,auto,auto,100,50,*" ref="mainLayout">
      <DropDown class="m-10 p-5" ref="dropdown" row="0" hint="选择签名钱包" selectedIndex="0" :items="wallets.map(w => w.address)"  @selectedIndexChanged="onSelect" />
      <Label row="1" class="hr-light" />
      <TextView class="t-14 m-10" hint="需要签名的数据
      可以扫码
      通常用于签署交易" row="2" autocorrect="false" maxLength="3000" autocapitalizationType="none" v-model="toSign" />
      <GridLayout row="3" columns="*,*">
        <Button class="btn btn-primary ion" col="0" :text="'ion-ios-image' | fonticon" @tap="onImageScan"/>
        <Button class="btn btn-primary ion" col="1" :text="'ion-md-qr-scanner' | fonticon" @tap="onScan"/>
      </GridLayout>
      <Button :isEnabled="!!toSign" class="btn btn-primary btn-active" row="4" text="使用钱包签名" @tap="onSign" />
      <TextView class="t-14 m-10 p-5" hint="签名后数据" row="5" autocorrect="false" maxLength="3000" v-model="result" editable="false" @tap="showResult"/>
      <Button row="6" :isEnabled="!!result" text="签名验证" @tap="onVerify" class="btn btn-primary btn-active" />
      <Label row="7" :visibility="verified ? 'visible' : 'collapse'" class="t-14 m-10 p-5" :text="'签名已经验证: ' + wallet.address" />
      <Label row="7" :visibility="!verified ? 'visible' : 'collapse'" class="t-14 m-10 p-5" :text="'签名未验证: ' + wallet.address" />
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import vibrator from '~/mixins/vibrator'
import jingtumLib from '~/mixins/jingtumLib'
import feedback from '~/mixins/feedback'
import imagePicker from '~/mixins/imagePicker'
import fancyAlert from '~/mixins/fancyAlert'
import { mapGetters, mapMutations, mapActions } from "vuex";
import ModalText from './../components/modalText'
var imageSource = require('image-source')

export default {
  mixins: [ sideDrawer, jingtumLib, vibrator, feedback, imagePicker, fancyAlert ],
  data() {
    return {
      walletIndex: 0,
      verified: false,
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
  watch: {
    wallet (v) {
      console.log("wallet changed")
      this.verified = false
    }
  },
  methods: {
    ...mapMutations({ appendMsg: 'appendMsgPrompt', appendMsgFeedback: 'appendMsgFeedback', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'toClipboard']),
    onFabItemTap(args) {
			console.log(args)
      this.$navigateTo(this.$routes.SelectAddress)
    }, 
    showResult() {
      if (this.result) {
        this.toClipboard(this.result)
        this.appendMsg('拷贝到粘贴板')
			  this.$showModal(ModalText, {props: {title: '签名后数据', text: this.result, width: 300, height: 300}})
      }
    },
    onSelect(args) {
      this.walletIndex = args.newIndex
      this.$refs.dropdown.nativeView.close()
    },
    onVerify() {
      let verifyWallet = this.swtcClassWallet(this.wallet.secret)
      this.verified = verifyWallet.verifyTx(this.toSign, this.result)
    },
    onSign(args) {
      let signWallet = this.swtcClassWallet(this.wallet.secret)
      this.result = signWallet.signTx(this.toSign)
    },
    onImageScan(args) {
      this.pickimage().then( (selection) => {selection.forEach( (imagefile) => {
        if (global.ios) {
          console.log("in ios")
          this.processiOSBarCode(imagefile)
        } else {
          console.log("in android")
          this.processAndroidBarCode(imagefile)
        }
      })}).catch(e => {
        console.log(e)
        this.tnsFaAlert.showInfo(
          "注意",
          "未从图片中识别出内容，请尝试其他方式",
          "知道了"
        )})
    },
    processAndroidBarCode(uri) {
    	var source;
    	console.log("Loading: ", uri.android);
    	var is = imageSource.fromFile(uri.android);
      source = is.android;
      console.log(source)
    	this.finishProcessingBarCode(source)
    	is.android.recycle();
    	is.android = null;
    	is = null;
    },
    processiOSBarCode(selected) {
      console.log(selected.ios.mediaType)
      this.tnsFaAlert.showInfo(
        "注意",
        "未从ios图片中识别出内容，请尝试其他方式",
        "知道了"
      )
    },
    finishProcessingBarCode(source) {
      let zxing = this.$store.getters.zxing
      let results
      results = zxing.decodeBarcode(source, {tryHarder: true, formats: [zxing.QR_CODE,zxing.CODE_128]});
      if (results !== null) {
        this.toSign = results.barcode
      }else {
        console.log("did not get content")
        this.tnsFaAlert.showInfo(
          "注意",
          "未从图片中识别出内容，请尝试其他方式",
          "知道了"
        )
      }
    },
    onScan(args) {
		this.$store.dispatch('scan').then(
           (result) => {
				console.log(result);
				console.log("Scan format: " + result.format);
        console.log("Scan text:   " + result.text);
        this.toSign = result.text
				this.appendMsgFeedback(result)
           },
           (error) => {
                console.log("No scan: " + error);
			    this.appendMsgFeedback(error)
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
