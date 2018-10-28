import moment from 'moment'
const feedbackplugin = require('nativescript-feedback')

const state = {
  _msgs: [{moment: new moment(), msg: 'welcome to the demo app'},],
  _toasts: require('nativescript-toasts'),
  _feedback: new feedbackplugin.Feedback(),
  _clipboard: require("nativescript-clipboard")
}
  
const mutations = {
  appendMsg: (state, msg) => {
      state._msgs.unshift({timestamp: new moment(), msg: msg})
      state._msgs.splice(10,2)
  },
}

const getters = {
  msgs: (state) => state._msgs ,
  lastMsg: (state) => state._msgs[0],
  toasts: (state) => state._toasts,
  feeback: (state) => state._feedback,
  clipboard: (state) => state._clipboard
}

const actions = {
  showLastLogToasts({getters, commit}) {
    let message = getters.lastMsg.msg
    if (typeof(message) === typeof({})) {
      message = JSON.stringify(message, '', 2)
    }
    getters.toasts.show({
      text: message,
      duration: getters.toasts.DURATION.LONG,
    })
  },
  showLastLogFeedback({getters,commit}) {
    let message = getters.lastMsg.msg
    if (typeof(message) === typeof({})) {
      message = JSON.stringify(message, '', 2)
    }
    getters.feedback.show({
      title: "输出",
      message: message,
      duration: 2000,
      onTap: function() { getters.feedback.hide(); }
    })
  },
  toClipboard: ({dispatch, getters, commit}, content) => {
    getters.clipboard.setText(content).then(() => { commit('appendMsg', `${content}已拷贝到粘贴板`); dispatch('showLastLogToasts')})
  },
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}