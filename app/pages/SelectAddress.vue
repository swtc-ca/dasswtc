<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="选择井通靓号">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*">
		  <FloatingBubble ref="bubble" text="生成更多地址供选择">
      <item-list
        ref="list"
        :items="itemList"
        leftswipetext="收纳"
        rightswipetext="淘汰"
        @loadMoreItems="!$refs.bubble.visible && $refs.bubble.show()"
        @watchrefresh="onWatchRefresh"
        @itemTap="onItemTap"
        @itemSelected="onItemSelected"
        @itemDeleted="onItemDeleted"
        @pulling="onPulling">
      </item-list>
      </FloatingBubble>
    </GridLayout>
  </Page>
</template>

<script>
import JingtumBaseLibService from './../services/JingtumBaseLibService'
var jingtumBaseLibService = new JingtumBaseLibService('address')
import ItemList from './../components/addressList'
import FloatingBubble from "./../components/floatingBubble";

import sideDrawer from '~/mixins/sideDrawer'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import ModalWallet from './../components/modalWallet'
export default {
  mixins: [ sideDrawer ],
  components: {
    'item-list': ItemList,
		FloatingBubble
  },
  data() {
    return {
      itemList: [],
    }
  },
  computed: {
  },
  methods: {
    ...mapMutations({addWallet: 'addSwtcWallet', saveWallets: 'saveSwtcWallets'}),
    ...mapActions(['showLastLogToasts','showLastLogFeedback', 'toClipboard']),
    onWatchRefresh() {
      console.log("received watchrefersh")
    },
    onItemTap({ item }) {
      console.log(`Tapped on ${item.address}`)
      this.toClipboard(item.secret)
			this.$showModal(ModalWallet, {props: {wallet: item, width: 200, height: 200}})
    },
    onPulling (listview) {
			this.$refs.bubble.show()
			setTimeout(() => this.$refs.bubble.hide(),2000)
      setTimeout(() => {
        for (let i=0; i < 10; i++){
          this.itemList.unshift(jingtumBaseLibService.newWallet())
        }
        listview.notifyPullToRefreshFinished()
        listview.refresh()
      })
    },
    onItemSelected (item) {
      this.addWallet(item)
      this.saveWallets()
      this.itemList.splice(this.itemList.indexOf(item), 1)
      this.$refs.list.refresh()
    },
    onItemDeleted (item) {
      this.itemList.splice(this.itemList.indexOf(item), 1)
      this.$refs.list.refresh()
    },
  },
  created() {
    for (let i = 0; i < 20; i++) {
      this.itemList.push(jingtumBaseLibService.newWallet())
    }
    if ( this.$store.debug ) {
      console.log("itemlist")
      console.log(this.itemList)
    }
  },
  mounted() {
    if ( this.$store.debug ) {
      console.log("destroyed")
    }
  },
  destroyed () {
    if ( this.$store.debug ) {
      console.log("destroyed")
    }
  }
};
</script>

<style scoped>
</style>
