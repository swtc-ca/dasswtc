import * as imagepicker from "nativescript-imagepicker"

export default {
    data () {
      return {
      }
    },
    methods: {
        pickimage() {
            let context = imagepicker.create({ mode: "single" })
            return context.authorize()
                .then(function() {
                    return context.present()
                })
        }
    },
    created () {
      console.log('mixins image picker created')
    },
    mounted () {
      console.log('mixins image picker mounted')
    }
  }