
export default {
  data () {
    return {
        isBusying: false
    }
  },
  computed: {
      isBusy: {
          get () { return this.isBusying },
          set (v) { this.isBusying = v }
      }
  },
  methods: {
  },
  created () {
    console.log('mixins activity indicator created')
  }
}
