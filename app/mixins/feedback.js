import { clipToBoundsProperty } from '../../node_modules/tns-core-modules/ui/layouts/layout-base';

const feedbackplugin = require('nativescript-feedback')

export default {
    data () {
      return {
        feedback: new feedbackplugin.Feedback(),
        auto_feedback: false
      }
    },
    computed: {
      lastMsgFeedback: {
        get () {return this.$store.getters.lastMsg},
        set (v) {return this.$store.commit('appendMsg',v)}
      }
    },
    watch: {
      // we watch the drawer prop for changes and open/close the sideDrawer accordingly
      lastMsgFeedback (v) {
        if (this.auto_feedback) { this.showLastLogFeedback() }
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
          onTap: function() { this.feedback.hide(); }
        })
      },
    },
    created () {
      console.log('mixins feedback created')
    }
  }