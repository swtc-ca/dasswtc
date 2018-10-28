var Vibrate = require("nativescript-vibrate").Vibrate

export default {
  data () {
    return {
      vibrator: new Vibrate(),
    }
  },
  methods: {
    vibrate (v) {
      vibrator.vibrate(v)
    }
  },
  created () {
    console.log('mixins vibrator created')
  }
}
