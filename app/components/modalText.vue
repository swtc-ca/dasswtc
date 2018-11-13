<template lang="html">
  <Frame>
  <Page class="page" @loaded="modalLoaded">
    <ActionBar class="action-bar" :title="title">
      <ActionItem @tap="$modal.close"  ios.position="right" ios.systemIcon="14" android.systemIcon="ic_menu_close_clear_cancel" />
    </ActionBar>
    <StackLayout verticalAlignment="middle">
      <Image :src="src" :width="width" :height="height" @tap="onTap" />
    </StackLayout>
  </Page>
  </Frame>
</template>

<script>
import statusBar from '~/mixins/statusBar'
var imageSource = require('image-source')
var fs = require('file-system')
export default {
  name: 'qr-code',
  mixins: [ statusBar ],
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
      this.onSave()
    },
    modalLoaded (args) {
      console.log('modal loaded')
      this.statusBarAndroid()
    },
    onSave() {
    	let folder
    	if (global.android) {
    		folder = android.os.Environment.getExternalStoragePublicDirectory (android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/"
    		let path = fs.path.join(folder, "zxingdemo001.jpg")
    		let saved = this.img.imageSource.saveToFile(path, "jpeg")
    	} else {
    		UIImageWriteToSavedPhotosAlbum(this.src.ios, null, null, null);
    	}
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