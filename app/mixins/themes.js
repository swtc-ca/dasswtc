import Themes from 'nativescript-themes'
//Themes.applyTheme('./assets/cssThemes/core.light.css')

export default {
    data () {
      return {
      }
    },
    computed: {
      themeId: {
        get () {return this.$store.getters.currentTheme},
        set (v) {this.$store.commit('setCurrentTheme',v)}
      },
      currentTheme: {
        get () {return this.$store.getters.currentThemeFileS}
      }
    },
    watch: {
      // we watch the drawer prop for changes and open/close the sideDrawer accordingly
      currentTheme (v) {
        this.applyTheme()
      }
    },
    methods: {
      applyTheme() {
        let themeFile = this.$store.getters.currentThemeFile.split('/').reverse()[0]
        console.log(`apply theme ${this.$store.getters.currentThemeFile}`)
        this.$store.commit('appendMsg', `apply theme ${this.$store.getters.currentThemeFile}`)
        //const cssText = require(this.$store.getters.currentThemeFileS)
        //Themes.applyThemeCss(cssText, themeFile)
        Themes.applyTheme(this.$store.getters.currentThemeFile)
      },
    },
    created () {
      console.log('mixins feedback created')
    },
    mounted () {
      this.applyTheme()
    }
  }