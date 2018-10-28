<template>
    <Image :src="qrSource" :width="width" :height="height" />
</template>

<script>
var imageSource = require('image-source')
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
      //zx: new ZXing(),
      qrImage: null,
      qrSource: '',
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
    //this.qrImage = this.zx.createBarcode({encode: this.text, height: this.height, width: this.width})
  },
  mounted() {
    console.log("qrcode component mounted")
    this.qrImage = this.$store.getters.zxing.createBarcode({encode: this.text, height: this.height, width: this.width})
    this.qrSource = imageSource.fromNativeSource(this.qrImage)
  }
}
</script>

<style lang="scss">
</style>