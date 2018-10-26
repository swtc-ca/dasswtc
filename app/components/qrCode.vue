<template>
    <Image :src="imgSrc" :width="width" :height="height" />
</template>

<script>
var ZXing = require('nativescript-zxing')
var imageSource = require('image-source')
var newImg
export default {
  name: 'qr-code',
  props: {
    text: {
      type: String,
      default: 'daszichan 2018',
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
        imgSrc: ''
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
    let zx = new ZXing()
    newImg = zx.createBarcode({encode: this.text || "daszichan 2018", height: this.height || 300, width: this.width || 300});
  },
  mounted() {
    console.log("qrcode component mounted")
    this.imgSrc = imageSource.fromNativeSource(newImg)
  }
}
</script>

<style lang="scss">
</style>