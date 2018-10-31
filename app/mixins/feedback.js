const feedbackplugin = require('nativescript-feedback')

export default {
    data () {
      return {
        feedback: new feedbackplugin.Feedback(),
      }
    },
    computed: {
      lastMsgFeedback: {
        get () {return this.$store.getters.lastMsg},
        set (v) {this.$store.commit('appendMsg',v)}
      },
      autoFeedback: {
        get () { return this.$store.getters.autoFeedback },
        set (v) { this.$store.commit('setAutoFeedback', v) }
      },
      autoToast: {
        get () { return this.$store.getters.autoToast },
        set (v) { this.$store.commit('setAutoToast', v) }
      }
    },
    watch: {
      // we watch the drawer prop for changes and open/close the sideDrawer accordingly
      lastMsgFeedback (v) {
        if (this.autoFeedback) { this.showLastLogFeedback() }
        if (this.autoToast) { this.$store.dispatch('showLastLogToasts') }
      }
    },
    methods: {
      showLastLogFeedback() {
        let message = this.lastMsgFeedback.msg
        if (typeof(message) === typeof({})) {
          message = JSON.stringify(message, '', 2)
        }
        this.feedback.show({
          title: "输出",
          message: message,
          duration: 2000,
          onTap: () => this.feedback.hide()
        })
      },
    },
    created () {
      console.log('mixins feedback created')
    }
  }