var Vibrate = require("nativescript-vibrate").Vibrate

export default {
    state: {
        _vibrator: new Vibrate(),
        _vibrate_counter: 0
    },
    getters: {
      vibrator: (state) => state._vibrator
    },
    mutations: {
      vibrate: (state) => { state._vibrate_counter++ ; state._vibrator.vibrate(1000) }
    },
    created () {
      console.log('vibrator created')
    }
  }
