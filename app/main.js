import Vue from 'nativescript-vue'
import { localize } from "nativescript-localize"
import RadListView from 'nativescript-ui-listview/vue'
import routes from '~/router'
import store from '~/store'
import sideDrawer from '~/components/sideDrawer'
import drawerContent from '~/components/drawerContent'
var AdvancedWebView = require("nativescript-advanced-webview")
AdvancedWebView.init()

Vue.prototype.$routes = routes
Vue.use(RadListView)
Vue.filter("L", localize)
import { TNSFontIcon, fonticon } from 'nativescript-fonticon'
TNSFontIcon.paths = {
  //fa: './assets/fontawesome.css',
  ion: './assets/ionicons.css',
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
Vue.registerElement('SwipeLayout', () => require('nativescript-swipe-layout').SwipeLayout)
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView)
Vue.registerElement('Ripple', () => require('nativescript-ripple').Ripple)
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown)
Vue.registerElement('CheckBox', () => require('nativescript-checkbox').CheckBox, {
  model: {
    prop: 'checked',
    event: 'checkedChange'
  }
})
//Vue.config.silent = (TNS_ENV === 'production')

// test application lifecycle
const application = require("tns-core-modules/application");
application.on(application.launchEvent, (args) => {
  console.log(`launched`)
})
application.on(application.suspendEvent, (args) => {
  console.log(`suspended`)
})
application.on(application.resumeEvent, (args) => {
  console.log(`resumed`)
})
application.on(application.displayedEvent, (args) => {
})
application.on(application.exitEvent, (args) => {
  console.log(`exited`)
})
application.on(application.lowMemoryEvent, (args) => {
  console.log(`low memory`)
})
application.on(application.uncaughtErrorEvent, (args) => {
  console.log(`uncaughtError`)
})
// test application lifecycle
import './styles.scss'

//import Themes from 'nativescript-themes'
//Themes.applyTheme(store.getters.currentThemeFile)
new Vue({
  store, // global available
  render (h){
    return h(sideDrawer, [
      h(drawerContent, {slot: "drawerContent"}),
      h(routes.MineAddress, {slot: "mainContent"})
    ])
  },
  created(){
    // initialize jingtum servers
    const SWTCSERVERS = [{ server: "wss://c04.jingtum.com:5020", display: "井通节点04"}, { server: "wss://c05.jingtum.com:5020", display: "井通节点05"}]
    if (store.getters.swtcServers.length === 0) {
      console.log("add initial servers")
      SWTCSERVERS.reverse().forEach( server => store.commit('addSwtcServer', server))
      store.commit('saveSwtcServers')
    } else {
      console.log("servers were set")
    }
  }
}).$start()
