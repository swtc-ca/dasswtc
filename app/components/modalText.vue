<template lang="html">
  <Frame>
  <Page class="page">
    <ActionBar class="action-bar" :title="title">
      <ActionItem @tap="$modal.close"  ios.position="right" ios.systemIcon="1" android.systemIcon="ic_menu_close_clear_cancel" /> 
    </ActionBar>
    <StackLayout verticalAlignment="middle">
      <Image :src="src" :width="width" :height="height" />
    </StackLayout>
  </Page>
  </Frame>
</template>

<script>
var imageSource = require('image-source')
export default {
  name: 'qr-code',
  props: {
    title: {
      type: String,
      default: 'title',
    },
    text: {
      type: String,
      default: '',
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
        img: null,
        src: null,
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
    this.img = zx.createBarcode({encode: this.text || "", height: this.height || 300, width: this.width || 300});
  },
  mounted() {
    console.log("qrcode component mounted")
    this.src = imageSource.fromNativeSource(this.img)
  }
}
</script>

<style lang="scss">
</style>