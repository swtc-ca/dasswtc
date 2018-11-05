<template>
  <Page ref="page" actionBarHidden="false" class="page" backgroundSpanUnderStatusBar="true">
    <ActionBar
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
              <Label col="0" text="反馈" />
              <Switch class="switch" col="1" v-model="autoFeedback" />
            </GridLayout>
            <GridLayout rows="60" columns="*,auto">
              <Label col="0" text="提示" />
              <Switch class="switch" col="1" v-model="autoToast" />
            </GridLayout>
            <GridLayout rows="*" height="300">
		      		<RadCartesianChart row="0">
		      			<BarSeries v-tkCartesianSeries :items="favoriteFruits" categoryProperty="type" valueProperty="count" />
		      			<CategoricalAxis v-tkCartesianHorizontalAxis />
		      			<LinearAxis v-tkCartesianVerticalAxis />
		      		</RadCartesianChart>
		      	</GridLayout>
        </StackLayout>
        <StackLayout :visibility="activeSegment === '风格' ? 'visible' : 'collapse'">
            <ListPicker :items="cssThemes" v-model="themeId" />
        </StackLayout>
      </Stacklayout>
      <GridLayout row="1" class="segmented-bar" verticalAlignment="bottom" columns="*,*,*,*">
        <Button class="segmented-item" col="0" @tap="activeSegment='钱包'" text="钱包"></Button>
        <Button class="segmented-item" col="1" @tap="activeSegment='服务器'" text="服务器"></Button>
        <Button class="segmented-item" col="2" @tap="activeSegment='反馈'" text="反馈"></Button>
        <Button class="segmented-item" col="3" @tap="activeSegment='风格'" text="风格"></Button>
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
import themes from '~/mixins/themes'
//import Themes from 'nativescript-themes'
//require('nativescript-ui-chart/vue')
export default {
  mixins: [ sideDrawer, feedback, jingtumLib, themes ],
  data() {
    return {
      walletIndex: 0,
      serverIndex: 0,
      activeSegment: '钱包',
      favoriteFruits: [
                { type: "🍎", count: 7 },
                { type: "🍌", count: 15 },
                { type: "🍍", count: 12 },
                { type: "🍒", count: 30 },
                { type: "🍇", count: 16 }
      ]
    }
  },
  computed: {
    ...mapState(['isIOS', 'isAndroid']),
    ...mapGetters({ cssThemes: 'cssThemes', scssThemes: 'scssThemes', msgs: 'msgs', wallets: 'swtcWallets', wallet: 'swtcWallet', servers: 'swtcServers', server: 'swtcServer'}),
  },
  methods: {
    ...mapMutations([
      "appendMsg", "setSwtcWallet", "saveSwtcWallet", "setSwtcServer", "saveSwtcServer"
    ]),
    ...mapActions(['showLastLogToasts', 'toClipboard']),
    applySelectedTheme () {
        this.appendMsg('应用主题')
        let themeFile = this.$store.getters.currentThemeFile.split('/').reverse()[0]
        //const cssText = require(this.$store.getters.currentThemeFileS)
        //Themes.applyThemeCss(cssText, themeFile)
        //Themes.applyTheme(this.$store.getters.currentThemeFile)
    },
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
    console.log("conf app mounted ")
  }
};
</script>

<style scoped>
</style>
