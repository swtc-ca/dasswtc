import { openAdvancedUrl, AdvancedWebViewOptions } from 'nativescript-advanced-webview'

export default {
  data () {
    return {
    }
  },
  methods: {
   	awv(url) {
      try {
        //let AdvancedWebViewOptions = {
        let opt = {
          url: url,
          showTitle: true,
          toolbarColor: '#336699',
          toolbarControlsColor: '#333',
          isClosed: closed => {
            console.log(closed);
          }
        }
        openAdvancedUrl(opt);
      } catch (error) {
        console.log(error);
      }
	  },
  },
  created () {
    console.log('mixins advancedWebView created')
  }
}
