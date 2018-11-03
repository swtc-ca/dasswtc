<template>
  <Page class="page">
    <ActionBar
      class="action-bar"
      title="浏览器实况">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <StackLayout ~mainContent>
      <GridLayout columns="80, 60, *, auto" rows="*" class="item" height="60" backgroundColor="White">
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="账本高度" class="h4" col="0" row="0" />
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="交易数" class="h4" col="1" row="0"/>
        <Label :visibility="!searching ? 'visible' : 'collapse'" text="账本哈希" class="h4" col="2" row="0"/>
        <Label :visibility="!searching ? 'visible' : 'collapse'" :text="'ion-ios-search' | fonticon" class="h4 ion" col="3" row="0" @tap="searching=!searching" />
        <SearchBar :visibility="searching ? 'visible' : 'collapse'" row="0" col="0" colSpan="4" hint="搜索" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="searchitem"  @submit="onSearch" @clear="onClear" />
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
import modalExplorerSearch from '~/components/modalExplorerSearch'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  mixins: [ sideDrawer, jingtumLib ],
  components: {
    'item-list': LedgerList,
  },
  data() {
    return {
      searchitem: '',
      searching: false,
    }
  },
  computed: {
    ...mapGetters({ledgers: 'swtcLedgers', msgs: 'msgs', server: 'swtcServer', servers: 'swtcServers'}),
  },
  methods: {
    ...mapMutations(['appendMsg', 'addSwtcLedger', 'setSwtcServer', 'saveSwtcServer']),
    onSearch() {
      console.log(this.searchitem)
      this.searching = !this.searching
      let searchresult
      let callback = (e,r) => {
        if (e) {
          searchresult = e
        } else {
          searchresult = r
        }
        this.$showModal(modalExplorerSearch, {props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
      }
      if (!this.searchitem) {
        console.log("empty search")
        return ''
      } else if (this.searchitem.length < 10) {
        let height = Number(this.searchitem)
        if (!isNaN(height)) {
          //search height
          console.log("search is a number")
          this.swtcQueryLedger(height, true, callback)
        } else {
          //try token
          console.log("token search")
          searchresult = "查询通证还没有实现"
          this.$showModal(modalExplorerSearch, {props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
        }
      } else if (this.searchitem.startsWith('j')) {
        // search an address
        console.log("address search")
        this.swtcRequestAccountInfo(this.searchitem, callback)
      } else {
        // try hash
        console.log("hash search")
        let callback2 = (e,r) => {
          if (e) {
            this.swtcQueryLedger(this.searchitem, true, callback)
          } else {
            searchresult = r
            this.$showModal(modalExplorerSearch, {props: {title: '搜索结果', searchitem: this.searchitem, result: searchresult}})
          }
        }
        this.swtcQueryTransaction(this.searchitem, callback2)
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
      console.log(`Tapped on ${item.address}`)
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
    }
  },
  created() {
    console.log("created")
    console.log("create local remote")
    if (this.server && this.server.hasOwnProperty('server')) {
      console.log(this.server.server)
    } else {
      let swtcServer =  this.servers[Math.floor(Math.random() * this.servers.length)]
      this.setSwtcServer(swtcServer)
      this.saveSwtcServer()
    }
    this.swtcRemote = this.swtcNewRemote(this.server)
  },
  mounted() {
    console.log("mounted")
    console.log("connect local remote")
    console.log(this.server)
    this.swtcConnect((error, result) => {
      if (error) {
        console.log("connect error")
        console.log(error)
        this.appendMsg(error)
      } else {
        console.log("connected")
        console.log(result)
        this.appendMsg(result)
        // connected to the remote now, install ledger monitoring
        console.log("connected local remote")
        callback_on_ledger = msg => { console.log(msg); this.addSwtcLedger(msg); this.appendMsg(msg) }
        this.swtcRemote.on('ledger_closed', callback_on_ledger)
      }
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
</style>
