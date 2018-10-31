import * as applicationSettings from "tns-core-modules/application-settings"

export default {
    state: {
        _currentTheme: applicationSettings.getNumber('THEMECODE') || 5,
        _scssThemes: ['aqua.scss', 'brown.scss', 'dark.scss', 'forest.scss', 'grey.scss', 'lemon.scss', 'light.scss', 'ruby.scss'],
        _cssThemes: ['aqua.css', 'blue.css', 'brown.css', 'core.dark.css', 'core.light.css', 'forest.css', 'grey.css', 'lemon.css', 'lime.css', 'orange.css', 'purple.css', 'ruby.css', 'sky.css']
    },
    getters: {
        currentThemeFile: (state) => `~/assets/cssThemes/${state._cssThemes[state._currentTheme]}`,
        currentThemeFileS: (state) => `~/assets/scssThemes/${state._scssThemes[state._currentTheme]}`,
        currentTheme: (state) => state._currentTheme,
        scssThemes: (state) => state._scssThemes,
        cssThemes: (state) => state._cssThemes
    },
    mutations: {
        setCurrentTheme: (state,v) => {
            state._currentTheme = v
            applicationSettings.setNumber('THEMECODE',v)
        }
    },
    created () {
      console.log('themes created')
    }
  }
