<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      :title="server.display">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*" ref="mainLayout">
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import vibrator from '~/mixins/vibrator'
import jingtumLib from '~/mixins/jingtumLib'
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  mixins: [ sideDrawer, jingtumLib, vibrator ],
  data() {
    return {
    }
  },
  computed: {
	...mapGetters({ wallets: 'swtcWallets', wallet: 'swtcWallet'}),
  },
  methods: {
    ...mapMutations({ appendMsg: 'appendMsg', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'showLastLogToasts']),
    onFabItemTap(args) {
			console.log(args)
      this.$navigateTo(this.$routes.SelectAddress)
    }, 
    onScan(args) {
		this.$store.dispatch('scan').then(
           (result) => {
				console.log(result);
				console.log("Scan format: " + result.format);
				console.log("Scan text:   " + result.text);
				this.appendMsg(result)
           },
           (error) => {
                console.log("No scan: " + error);
			    this.appendMsg(error)
           }
  	    )
    },
    pageLoaded() {
      console.log("page loaded")
    },
  },
  created() {
  },
  mounted() {
  },
  destroyed () {
  }
}
</script>

<style scoped>
</style>
