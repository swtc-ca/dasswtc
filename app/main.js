import Vue from 'nativescript-vue';

import BackendService from './services/BackendService'
const backendService = new BackendService()
import Login from './components/Login/Login'
import Jingtum from './components/Jingtum/Jingtum'
//import VueDevtools from 'nativescript-vue-devtools'

import store from './store';

import './styles.scss';

if (TNS_ENV !== 'production') {
  //Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === 'production'

new Vue({

  render: h => {
    console.log("BackendService:", backendService.server)
    return h('frame', [h(backendService.unlocked ? Jingtum : Login)])
  },

  store

}).$start();
