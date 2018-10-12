import Vue from 'nativescript-vue';

import store from './store';
import BackendService from './services/BackendService'
const backendService = new BackendService()
import Login from './components/Login/Login'
import Jingtum from './components/Jingtum/Jingtum'
//import Web from './components/Web'
//import VueDevtools from 'nativescript-vue-devtools'

import './styles.scss';

if (TNS_ENV !== 'production') {
  //Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === 'production'

// test application lifecycle
const application = require("tns-core-modules/application");
application.on(application.launchEvent, (args) => {
})
application.on(application.suspendEvent, (args) => {
  backendService.unlocked = false
})
application.on(application.resumeEvent, (args) => {
})
application.on(application.displayedEvent, (args) => {
})
application.on(application.exitEvent, (args) => {
})
application.on(application.lowMemoryEvent, (args) => {
})
application.on(application.uncaughtErrorEvent, (args) => {
  console.log(`uncaughtError`)
})
// test application lifecycle

new Vue({
  render: h => {
    //console.log("BackendService:", backendService.server)
    return h('frame', [h(Login)])
    //return h('frame', [h(backendService.unlocked ? Jingtum : Login)])
    //return h('frame', [h(Web)])
  },
  store
}).$start();
