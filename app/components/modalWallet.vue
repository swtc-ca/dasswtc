<template>
    <StackLayout>
      <GridLayout verticalAlignment="top" columns="auto,*">
        <Label col="0" fontSize="32" class="ion" :text="'ion-ios-arrow-dropleft' | fonticon" @tap="$modal.close()" />
        <Label col="1" class="h3 m-10 p-10 text-center" text="地址"></Label>
      </GridLayout>
      <Image :src="imgAddressSrc" :width="width" :height="height" />
      <Label class="h3 m-10 p-10 text-center" text="私钥"></Label>
      <Image :src="imgSecretSrc" :width="width" :height="height" />
    </StackLayout>
</template>

<script>
var imageSource = require('image-source')
export default {
  name: 'qr-code',
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