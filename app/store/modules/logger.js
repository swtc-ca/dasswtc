import moment from 'moment'

const state = {
  _msgs: [{moment: new moment(), category: 'system', msg: 'welcome to the demo app'},],
  _toasts: require('nativescript-toasts'),
  _clipboard: require("nativescript-clipboard"),
  _autoToast: false,
  _autoPrompt: false,
  _autoFeedback: true
}
  
const mutations = {
  appendMsg: (state, msg) => {
      state._msgs.unshift({timestamp: new moment(), category: '', msg: msg})
      state._msgs.splice(10,2)
  },
  appendMsgFeedback: (state, msg) => {
      state._msgs.unshift({timestamp: new moment(), category: 'feedback', msg: msg})
      state._msgs.splice(10,2)
  },
  appendMsgPrompt: (state, msg) => {
      state._msgs.unshift({timestamp: new moment(), category: 'prompt', msg: msg})
      state._msgs.splice(10,2)
  },
  setAutoFeedback: (state, v) => state._autoFeedback = v,
  setAutoToast: (state, v) => state._autoToast = v,
  setAutoPrompt: (state, v) => state._autoPrompt = v,
}

const getters = {
  msgs: (state) => state._msgs ,
  lastMsg: (state) => state._msgs[0],
  toasts: (state) => state._toasts,
  clipboard: (state) => state._clipboard,
  autoFeedback: (state) => state._autoFeedback,
  autoPrompt: (state) => state._autoPrompt,
  autoToast: (state) => state._autoToast
}

const actions = {
  showLastLogPrompt({getters, commit}) {
    let message = getters.lastMsg.msg
    if (typeof(message) === typeof({})) {
      message = JSON.stringify(message, '', 2)
    }
    getters.toasts.show({
      text: message,
      duration: getters.toasts.DURATION.SHORT,
    })
  },
  showLastLogToasts({getters, commit}) {
    let message = getters.lastMsg.msg
    if (typeof(message) === typeof({})) {
      message = JSON.stringify(message, '', 2)
    }
    getters.toasts.show({
      text: message,
      duration: getters.toasts.DURATION.SHORT,
    })
  },
  toClipboard: ({dispatch, getters, commit}, content) => {
    getters.clipboard.setText(content).then(() => { commit('appendMsg', `${content}已拷贝到粘贴板`)})
  },
}
// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}