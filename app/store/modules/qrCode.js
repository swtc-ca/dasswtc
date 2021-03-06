var ZXing = require('nativescript-zxing')
var imageSource = require('image-source')

export default {
    state: {
    },
    getters: {
      zxing () {
        return new ZXing()
      }
    },
    actions: {
      encode ({getters, commit}, text='daszichan 2018', height=300, width=300, format=ZXing.QR_CODE) {
        console.log("encode")
        return getters.zxing.createBarcode({encode: text, height: height, width: width, format: format})
      },
    },
    created () {
      console.log('qrcode created')
    }
  }
