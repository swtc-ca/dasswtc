<template>
  <Page ref="page" actionBarHidden="false" class="page" backgroundSpanUnderStatusBar="true">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="应用设置">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <Gridlayout ~mainContent rows="*,auto" cols="*">
      <Stacklayout row="0">
        <StackLayout :visibility="activeSegment === '钱包' ? 'visible' : 'collapse'">
            <ListPicker :items="wallets.map(w => w.address)" v-model="walletIndex" />
            <Button text="选择默认钱包" @tap="onWalletSelected" class="btn btn-primary btn-active"/>
            <Button text="所有钱包" @tap="$navigateTo($routes.MineAddress)" class="btn btn-primary btn-active"/>
        </StackLayout>
        <StackLayout :visibility="activeSegment === '服务器' ? 'visible' : 'collapse'">
            <ListPicker :items="servers.map(s => s.display)" v-model="serverIndex" />
            <Button text="选择默认服务器" @tap="onServerSelected" class="btn btn-primary btn-active"/>
            <Button text="所有服务器" @tap="$navigateTo($routes.MineServer)" class="btn btn-primary btn-active"/>
        </StackLayout>
        <StackLayout :visibility="activeSegment === '反馈' ? 'visible' : 'collapse'">
            <GridLayout rows="60" columns="*,auto">
              <Label col="0" text="实时反馈" />
              <Switch col="1" v-model="autoFeedback" />
            </GridLayout>
            <GridLayout rows="60" columns="*,auto">
              <Label col="0" text="实时提示" />
              <Switch col="1" v-model="autoToast" />
            </GridLayout>
        </StackLayout>
      </Stacklayout>
      <GridLayout row="1" class="segmentGroup" verticalAlignment="bottom" columns="*,*,*">
        <Button class="segmentitem" col="0" @tap="activeSegment='钱包'" text="钱包"></Button>
        <Button class="segmentitem" col="1" @tap="activeSegment='服务器'" text="服务器"></Button>
        <Button class="segmentitem" col="2" @tap="activeSegment='反馈'" text="反馈"></Button>
      </Gridlayout>
    </GridLayout>
  </Page>
</template>

<script>
const dialogs = require('tns-core-modules/ui/dialogs')
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import sideDrawer from '~/mixins/sideDrawer'
import feedback from '~/mixins/feedback'
import jingtumLib from '~/mixins/jingtumLib'
export default {
  mixins: [ sideDrawer, feedback, jingtumLib ],
  data() {
    return {
      walletIndex: 0,
      serverIndex: 0,
      activeSegment: '钱包',
    }
  },
  computed: {
    ...mapState(['isIOS', 'isAndroid']),
    ...mapGetters({ msgs: 'msgs', wallets: 'swtcWallets', wallet: 'swtcWallet', servers: 'swtcServers', server: 'swtcServer'}),
  },
  methods: {
    ...mapMutations([
      "appendMsg", "setSwtcWallet", "saveSwtcWallet", "setSwtcServer", "saveSwtcServer"
    ]),
    ...mapActions(['showLastLogToasts', 'toClipboard']),
    onServerSelected() {
      console.log("server selected");
      if (this.serverIndex > -1 && this.serverIndex < this.servers.length) {
        this.setSwtcServer(this.servers[this.serverIndex])
        this.saveSwtcServer()
        console.log(this.server)
        this.swtcRemote = this.swtcNewRemote(this.server.server)
        console.log(this.server.server)
        this.appendMsg(this.server)
      } else {
        console.log('no server selected')
        this.appendMsg('请选择一个服务器')
      }
    },
    onWalletSelected() {
      console.log("wallet selected");
      if (this.walletIndex > -1 && this.walletIndex < this.wallets.length) {
        this.setSwtcWallet(this.wallets[this.walletIndex])
        this.saveSwtcWallet()
        console.log(this.wallet.address)
        this.appendMsg(this.wallet)
      } else {
        console.log('no wallet selected')
        this.appendMsg('请选择一个钱包')
      }
    },
  },
  created() { 
    console.log("conf app created")
    if (this.wallet && this.wallet.hasOwnProperty('address')) {
      this.walletIndex = this.wallets.indexOf(this.wallets.filter(w => w.address === this.wallet.address)[0])
    }
    if (this.server && this.server.hasOwnProperty('server')) {
      this.serverIndex = this.servers.indexOf(this.servers.filter(s => s.server === this.server.server)[0])
    }
  },
  mounted() {
    console.log("conf app mounted")
  }
};
</script>

<style scoped lang="scss">
@import '~nativescript-theme-core/scss/light';
@import '~nativescript-theme-core/scss/index';

Button {
  padding-bottom: 1;
  margin: 0;
  height: 44;
  text-align: center;
  vertical-align: middle;
}
.segmentGroup {
  background-color: $accent;
}
.segmentitem {
  padding-left: 2;
  padding-right: 2;
  margin: 0;
}
</style>
