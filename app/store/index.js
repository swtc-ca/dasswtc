import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import { isIOS, isAndroid } from 'tns-core-modules/platform'
import sideDrawer from './modules/sideDrawer'
import swtc from './modules/swtc'
import logger from './modules/logger'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  modules: {
    sideDrawer,
    logger,
    swtc
  },
  state: {
      isIOS,
      isAndroid,
  },
  strict: debug
})

Vue.prototype.$store = store

export default store