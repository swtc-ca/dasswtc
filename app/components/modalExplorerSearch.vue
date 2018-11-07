<template lang="html">
  <Frame>
  <Page class="page" @loaded="modalLoaded">
    <ActionBar class="action-bar" :title="title">
      <ActionItem @tap="$modal.close"  ios.position="right" ios.systemIcon="14" android.systemIcon="ic_menu_close_clear_cancel" />
    </ActionBar>
    <StackLayout verticalAlignment="middle">
       <TextView class="t-10" v-model="resultstring" editable="false" />
    </StackLayout>
  </Page>
  </Frame>
</template>

<script>
import statusBar from '~/mixins/statusBar'
export default {
  name: 'search-result',
  mixins: [ statusBar ],
  props: {
    title: {
      type: String,
      default: '查询',
    },
    searchitem: {
      type: String,
      default: '',
    },
    result: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
    }
  },
  computed: {
    resultstring () {
      if (typeof(this.result) === typeof('')) {
        return this.result
      } else {
        return JSON.stringify(this.result, '', 2)
      }
    }
  },
  methods: {
    onTap (event) {
      console.log("taped inside modal")
      this.$emit('modalTap', event)
    },
    modalLoaded (args) {
      console.log('modal loaded')
      this.statusBarAndroid()
    }
  },
  created() {
    console.log("modal search created")
  },
  mounted() {
    console.log("modal mounted")
  }
}
</script>

<style lang="scss">
</style>