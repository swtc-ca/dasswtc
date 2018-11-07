<template lang="html">
  <Frame>
  <Page class="page" @loaded="modalLoaded">
    <ActionBar class="action-bar" title="信息">
      <ActionItem @tap="$modal.close"  ios.position="right" ios.systemIcon="14" android.systemIcon="ic_menu_close_clear_cancel" />
    </ActionBar>
    <StackLayout>
      <Label class="h3 m-10 p-10 text-center" text="地址"></Label>
      <Image :src="imgAddressSrc" :width="width" :height="height" />
      <Label class="h3 m-10 p-10 text-center" text="私钥"></Label>
      <Image :src="imgSecretSrc" :width="width" :height="height" />
    </StackLayout>
  </Page>
  </Frame>
</template>

<script>
import statusBar from '~/mixins/statusBar'
var imageSource = require('image-source')
export default {
  name: 'qr-code',
  mixins: [ statusBar ],
  props: {
    wallet: {
      type: Object,
      default: {address: '', secret: ''},
    },
    height: {
      type: Number,
      default: 300,
    },
    width: {
      type: Number,
      default: 300,
    },
  },
  data () {
    return {
        imgAddress: null,
        imgSecret: null,
        imgAddressSrc: '',
        imgSecretSrc: ''
    }
  },
  methods: {
    onTap (event) {
      console.log("taped inside qrcode")
      this.$emit('qrTap', event)
    },
    modalLoaded (args) {
      console.log('modal loaded')
      this.statusBarAndroid()
    }
  },
  created() {
    console.log("qrcode components created")
    let zx = this.$store.getters.zxing
    this.imgAddress = zx.createBarcode({encode: this.wallet.address || "daszichan 2018", height: this.height || 300, width: this.width || 300});
    this.imgSecret = zx.createBarcode({encode: this.wallet.secret || "daszichan 2018", height: this.height || 300, width: this.width || 300});
  },
  mounted() {
    console.log("qrcode component mounted")
    this.imgAddressSrc = imageSource.fromNativeSource(this.imgAddress)
    this.imgSecretSrc = imageSource.fromNativeSource(this.imgSecret)
  }
}
</script>

<style lang="scss">
</style>