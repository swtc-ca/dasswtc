const application = require("tns-core-modules/application")
const platform = require('tns-core-modules/platform')

export default {
    data () {
      return {
          statusBarHeight: 0,
      }
    },
    computed: {
    },
    watch: {

    },
    methods: {
        statusBarAndroid (args) {
          if (application.android && platform.device.sdkVersion >= "21") {
            const window = application.android.startActivity.getWindow()
            const View = android.view.View;
            const decorView = window.getDecorView()
            window.setStatusBarColor(0x000000)
            decorView.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
              //| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              //| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
              | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            )
            let statusHeight 
            let resourceId = application.android.currentContext.getResources().getIdentifier('status_bar_height', 'dimen', 'android');
            if (resourceId) {
              statusHeight = application.android.currentContext.getResources().getDimensionPixelSize(resourceId);
            }
            if (statusHeight) {
              this.statusBarHeight = statusHeight
              console.log(`statusbar height ${this.statusBarHeight}`)
            }
          }
        }
    },
    created () {
      console.log('mixins statusBar created')
    },
    mounted () {
      console.log('mixins statusBar mounted')
    }
  }