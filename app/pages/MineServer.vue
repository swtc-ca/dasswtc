<template>
  <Page class="page" @loaded="pageLoaded">
    <ActionBar
      class="action-bar"
      :title="server.display">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*" ref="mainLayout">
		  <FloatingBubble row="0" ref="bubble" text="不能删除默认节点">
      <item-list row="0"
        ref="list"
        :items="servers"
        :pulltorefresh="true"
        leftswipetext="默认"
        rightswipetext="删除"
        @watchrefresh="onWatchRefresh"
        @itemTap="onItemTap"
        @itemSelected="onItemSelected"
        @itemDeleted="onItemDeleted"
        @pulling="onPulling">
      </item-list>
		  </FloatingBubble>
		  <AbsoluteLayout ref="fabItemPosition" marginTop="87%" marginLeft="80%">
		  	<GridLayout ref="fabItemContainer" left="8" top="8">
		  		<FabItem row="1" :class="classItem1" color="green" title="选" />
		  		<FabItem row="1" :class="classItem2" color="blue" title="加" />
		  	</GridLayout>
		  	<FabButton @onButtonTap="onFabButtonTap" :isActive="isActive" />
		  </AbsoluteLayout>
    </GridLayout>
  </Page>
</template>

<script>
import ItemList from './../components/serverList'
import FabButton from './../components/fabButton'
import FabItem from './../components/fabItem'
import FloatingBubble from "./../components/floatingBubble"
const app = require('tns-core-modules/application')
const platform = require('tns-core-modules/platform')

import sideDrawer from '~/mixins/sideDrawer'
import vibrator from '~/mixins/vibrator'
import fancyAlert from '~/mixins/fancyAlert'
import { mapGetters, mapMutations, mapActions } from "vuex"
export default {
  mixins: [ sideDrawer, vibrator, fancyAlert ],
  components: {
    'item-list': ItemList,
    FabItem,
		FabButton,
		FloatingBubble
  },
  data() {
    return {
			isActive: false,
    }
  },
  computed: {
		...mapGetters({lastMsg: 'lastMsg', servers: 'swtcServers', server: 'swtcServer'}),
    classItem1() {
        return this.isActive ? "raiseItem1" : "downItem1"
    },
    classItem2() {
        return this.isActive ? "raiseItem2" : "downItem2"
    }
  },
  methods: {
    ...mapMutations({ appendMsg: 'appendMsg', removeServer: 'removeSwtcServer', saveServers: 'saveSwtcServers', addServer: 'addSwtcServer', setServer: 'setSwtcServer', saveServer: 'saveSwtcServer'}),
    ...mapActions(['scan', 'showLastLogToasts']),
    onFabItemTap(args) {
			console.log(args)
      this.$navigateTo(this.$routes.SelectAddress)
    }, 
    onFabButtonTap(args) {
			this.isActive = !this.isActive
			if (this.isActive) {
				//setTimeout(() => this.$navigateTo(this.$routes.SelectAddress), 50)
				this.appendMsg('添加服务器')
			}
    },
    pageLoaded() {
      console.log("page loaded")
			let fabItemContainer = this.$refs.fabItemContainer.nativeView
			let fabItemPosition = this.$refs.fabItemPosition.nativeView
			let mainLayout = this.$refs.mainLayout.nativeView

			// Needed to avoid masking child components on Android
			if (app.android && platform.device.sdkVersion >= '21') {
				fabItemContainer.android.setClipChildren(false)
				fabItemPosition.android.setClipChildren(false)
				mainLayout.android.setClipChildren(false)
			}	
    },
    onWatchRefresh() {
      console.log("received watchrefersh")
    },
    onItemTap({ item }) {
			console.log(`Tapped on ${item.display}`)
			if (this.server.server == item.server) {
				this.vibrator.vibrate()
			}
			console.log("fancy alert")
    },
    onPulling (listview) {
      listview.notifyPullToRefreshFinished()
    },
    onItemSelected (item) {
			this.vibrator.vibrate()
			this.setServer(item)
			this.$refs.list.refresh()
			this.saveServer()
    },
    onItemDeleted (item) {
			this.vibrator.vibrate()
			console.log(item.display)
			if (item.server === this.server.server) {
			  this.$refs.bubble.show()
			  setTimeout(() => this.$refs.bubble.hide(),2000)
			} else {
        this.removeServer(item)
        this.saveServers()
        this.$refs.list.refresh()
			}
    }
  },
  created() {
  },
  mounted() {
  },
  destroyed () {
  }
};
</script>

<style scoped>
	.backdrop {
		background-color: rgba(29, 30, 35, .90);
		opacity: 0;
	}

	.backdrop-visible {
		animation-name: activateBackdrop;
		animation-duration: .25;
		animation-fill-mode: forwards;
	}

	.backdrop-invisible {
		animation-name: activateBackdrop;
		animation-duration: .25;
		animation-fill-mode: forwards;
		animation-direction: reverse;
	}

	.raiseItem1 {
		opacity: 1;
		animation-name: raiseItem1;
		animation-duration: .25;
		animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
		animation-fill-mode: forwards;
	}

	.raiseItem2 {
		opacity: 1;
		animation-name: raiseItem2;
		animation-duration: .25;
		animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
		animation-fill-mode: forwards;
	}

	.downItem1 {
		animation-name: raiseItem1;
		animation-duration: .20;
		animation-timing-function: cubic-bezier(0.895, 0.030, 0.685, 0.220);
		animation-fill-mode: forwards;
		animation-direction: reverse;
	}

	.downItem2 {
		animation-name: raiseItem2;
		animation-duration: .20;
		animation-timing-function: cubic-bezier(0.895, 0.030, 0.685, 0.220);
		animation-fill-mode: forwards;
		animation-direction: reverse;
	}

	@keyframes activateBackdrop {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes raiseItem1 {
		from {
			opacity: 1;
			transform: translate(0, 0);
		}
		to {
			opacity: 1;
			transform: translate(0, -64);
		}
	}

	@keyframes raiseItem2 {
		from {
			opacity: 1;
			transform: translate(0, 0);
		}
		to {
			opacity: 1;
			transform: translate(0, -128);
		}
	}
</style>
