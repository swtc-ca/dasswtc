<template>
  <Page class="page" @loaded="loaded">
    <ActionBar
      class="action-bar"
      title="浏览器实况">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <StackLayout ~mainContent>
      <GridLayout columns="80, 60, *, auto, auto" rows="*" class="item" height="55" backgroundColor="White">
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="账本高度" class="h3" col="0" row="0" />
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="交易数" class="h3" col="1" row="0"/>
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="账本哈希" class="h3" col="2" row="0"/>
        <Label :visibility="!searching ? 'visible' : 'collapse'" style="padding-right:10;" :text="'ion-ios-pulse' | fonticon" class="h3 ion" col="3" row="0" @tap="showChart"/>
        <Label :visibility="(!searching && isBusying) ? 'visible' : 'collapse'" :text="'ion-ios-hourglass' | fonticon" class="h3 ion" col="4" row="0" />
        <Label :visibility="(!searching && !isBusying) ? 'visible' : 'collapse'" :text="'ion-ios-search' | fonticon" class="h3 ion" col="4" row="0" @tap="searching=!searching" />
        <TextField :visibility="searching ? 'visible' : 'collapse'" row="0" col="0" colSpan="5" class="h3 searchitem" style="padding-left:30;" keyboardType="search" autocorrect="false" autocapitalizationType="none" v-model="searchitem" @returnPress="onSearch"/>
        <Label :visibility="searching ? 'visible' : 'collapse'" row="0" col="0" class="h3 ion" :text="'ion-ios-search' | fonticon" style="padding-left:5;"/>
      </GridLayout>
      <item-list
        ref="list"
        :items="ledgers"
        :pulltorefresh="false"
        :swipeactions="false"
        @watchrefresh="onWatchRefresh"
        @itemTap="onItemTap"
        @itemSelected="onItemSelected"
        @itemDeleted="onItemDeleted"
        @pulling="onPulling">
      </item-list>
    </StackLayout>
  </Page>
</template>

<script>
import LedgerList from './../components/ledgerList'
var callback_on_ledger = () => {}
import sideDrawer from '~/mixins/sideDrawer'
import jingtumLib from '~/mixins/jingtumLib'
import feedback from '~/mixins/feedback'
import activityIndicator from '~/mixins/activityIndicator'
import statusBar from '~/mixins/statusBar'
import modalExplorerSearch from '~/components/modalExplorerSearch'
import modalChart from '~/components/modalChart'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  mixins: [ sideDrawer, jingtumLib, activityIndicator, feedback, statusBar ],
  components: {
    'item-list': LedgerList,
  },
  data() {
    return {
      searchitem: '',
      searching: false,
      //showChart: false,
      chartData: []
    }
  },
  computed: {
    ...mapGetters({ledgers: 'swtcLedgers', msgs: 'msgs', server: 'swtcServer', servers: 'swtcServers'}),
  },
  methods: {
    ...mapMutations(['appendMsg', 'appendMsgFeedback', 'appendMsgPrompt', 'addSwtcLedger', 'setSwtcServer', 'saveSwtcServer']),
    ...mapActions(['toClipboard']),
    showChart() {
      this.appendMsgPrompt('显示图表')
      this.$showModal(modalChart, {fullscreen: true, props: {title: '交易数目图表', chartData: this.chartData}})
    },
    onSearch() {
      console.log(this.searchitem)
      this.appendMsgPrompt('搜索...')
      this.isBusying = true
      this.searching = !this.searching
      let searchresult = ''
      let callback = (e,r) => {
        if (e) {
          searchresult = { error: e }
        } else {
          searchresult = r
        }
        this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        this.isBusying = false
      }
      if (!this.searchitem) {
        console.log("empty search")
        this.isBusying = false
        return ''
      } else if (this.searchitem.length < 10) {
        let height = Number(this.searchitem)
        if (!isNaN(height)) {
          //search height
          console.log("search is a number")
          //this.swtcQueryLedger(height, true, callback)
          this.isBusy = true
          this.swtcRemote.requestLedger({ledger_index:height,transactions:true}).submitAsync().then( result => {
              searchresult = result
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
            }).catch(error => {
              searchresult = { error: error }
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
            })
        } else {
          //try token
          console.log("token search")
          searchresult = "查询通证还没有实现"
          this.isBusying = false
          this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        }
      } else if (this.searchitem.startsWith('j')) {
        // search an address
        console.log("address search")
        this.swtcRemote.requestAccountInfo({account: this.searchitem}).submitAsync().then( result => {
              searchresult = result
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        }).catch(error => {
              searchresult = { error: error }
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        })
      } else {
        // try hash
        console.log("hash search")
        let callback2 = (e,r) => {
          if (e) {
            this.swtcQueryLedger(this.searchitem, true, callback)
          } else {
            this.isBusying = false
            searchresult = r
            this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
          }
        }
        this.swtcRemote.requestTx({hash: this.searchitem}).submitAsync().then( result => {
          searchresult = result
          this.isBusying = false
          this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        }).catch(error => {
          console.log("transaction not found, try ledger")
          this.swtcRemote.requestLedger({ledger_index:this.searchitem,transactions:true}).submitAsync().then( result => {
              searchresult = result
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
            }).catch(error => {
              searchresult = { error: error }
              this.isBusying = false
              this.$showModal(modalExplorerSearch, {fullscreen: true, props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
            })
        })
      }
      this.searchitem = ''
    },
    onClear() {
      this.searching = false
      this.searchitem = ''
    },
    onSearchItemChange(args) {
      //this.searchitem = 
    },
    onWatchRefresh() {
      console.log("received watchrefersh")
    },
    onItemTap({ item }) {
      console.log(`Tapped on ${item.ledger_hash}`)
      this.appendMsgPrompt('拷贝账本哈希')
      this.toClipboard(item.ledger_hash)
    },
    onPulling (listview) {
      listview.notifyPullToRefreshFinished()
    },
    onItemSelected (item) {
      this.$refs.list.refresh()
    },
    onItemDeleted (item) {
      this.removeWallet(item)
      this.saveWallets()
      this.$refs.list.refresh()
    },
    loaded(args) {
      console.log("explorer page loaded")
      this.statusBarAndroid(args)
    }
  },
  created() {
    console.log("created")
    console.log("create local remote")
    //this.$store.commit('setSwtcRemotes', this.server)
    this.isBusying = true
    this.swtcRemote = this.swtcNewRemote(this.server)
  },
  mounted() {
    console.log("mounted")
    console.log("connect local remote")
    console.log(this.server)
    this.ledgers.forEach(e => this.chartData.unshift(e))
    this.swtcRemote.connectAsync().then( result => {
        console.log("connected")
        this.isBusying = false
        console.log(result)
        this.appendMsg(result)
        // connected to the remote now, install ledger monitoring
        console.log("connected local remote")
        //callback_on_ledger = msg => { console.log(msg); this.addSwtcLedger(msg); this.appendMsg(msg) }
        this.swtcRemote.on('ledger_closed', msg => {
         console.log(msg)
         this.addSwtcLedger(msg)
         this.appendMsg(msg) 

         this.chartData.push(Object.assign({}, {timestamp: new Date()}, msg))
         console.log(`current chart length: ${this.chartData.length}`)
        })
      }).catch( error => {
        console.log("connect error")
        console.log(error)
        this.appendMsg(error)
        this.isBusying = true
      })
    console.log(this.msgs)
  },
  destroyed () {
    console.log("destroyed")
    if (this.swtcIsConnected()) {
      console.log("remove ledger monitoring")
      this.swtcRemote.removeListener('ledger_closed', callback_on_ledger)
      console.log("disconnect")
      this.swtcDisconnect()
      console.log("disconnected")
    }
  }
};
</script>

<style scoped>
.searchitem {
  border-radius: 10;
  border-width: 1;
  padding: 2;
  margin: 2;
}
</style>
