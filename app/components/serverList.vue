<template>
  <RadListView ref="listView"
               for="item in items"
               :pullToRefresh="pulltorefresh"
               itemReorder="true"
               :swipeActions="swipeactions"
               @itemTap="onItemTap"
               @pullToRefreshInitiated="onPullToRefreshInitiated"
               @itemReordered="onItemReordered"
               class="list-group"
               @itemSwipeProgressStarted="onSwipeStarted">
    <v-template>
      <GridLayout columns="60,*" rows="*" class="list-group-item" backgroundColor="White">
        <Label col="0" :text="$store.getters.swtcServer.server === item.server ? '(默认)' : ''" class="h3" />
        <Label :text="item.display" class="h3" col="1"/>
      </GridLayout>
    </v-template>

    <v-template name="itemswipe">
      <GridLayout columns="auto, *, auto" backgroundColor="White">
        <StackLayout id="select-view" col="0" class="swipe-item left"
                     orientation="horizontal" @tap="onLeftSwipeClick">
          <Label :text="leftswipetext" verticalAlignment="center" horizontalAlignment="center"/>
        </StackLayout>
        <StackLayout id="delete-view" col="2" class="swipe-item right"
                     orientation="horizontal" @tap="onRightSwipeClick">
          <Label :text="rightswipetext" verticalAlignment="center" horizontalAlignment="center" />
        </StackLayout>
      </GridLayout>
    </v-template>
  </RadListView>
</template>

<script>
export default {
  name: 'item-list',
  props: {
    items: {
      type: Array,
      default: [],
    },
    pulltorefresh: {
      type: Boolean,
      default: true,
    },
    swipeactions: {
      type: Boolean,
      default: true,
    },
    leftswipetext: {
      type: String,
      default: "LEFT",
    },
    rightswipetext: {
      type: String,
      default: "RIGHT",
    }
  },
  data () {
    return {}
  },
  methods: {
    onItemTap (event) {
      this.$emit('itemTap', event)
    },
    onPullToRefreshInitiated ({ object }) {
      this.$emit('pulling', object)
    },
    onItemReordered({ index, data, object }) {
      console.log(`Item reordered from index ${index} to ${data.targetIndex}`)
    },
    onSwipeStarted ({ data, object }) {
      console.log(`Swipe started`)
      const swipeLimits = data.swipeLimits
      const swipeView = object
      const leftItem = swipeView.getViewById('select-view')
      const rightItem = swipeView.getViewById('delete-view')
      swipeLimits.left = leftItem.getMeasuredWidth()
      swipeLimits.right = rightItem.getMeasuredWidth()
      swipeLimits.threshold = leftItem.getMeasuredWidth() / 2
    },
    onLeftSwipeClick ({ object }) {
      console.log('left action tapped')
      this.$emit('itemSelected', object.bindingContext)
      this.$refs.listView.notifySwipeToExecuteFinished()
    },
    onRightSwipeClick ({ object }) {
      console.log('right action tapped')
      // remove item
      this.$emit('itemDeleted', object.bindingContext)
      this.$refs.listView.notifySwipeToExecuteFinished()
    },
    refresh () {
      this.$refs.listView.refresh()
    }
  },
}
</script>

<style lang="scss">
</style>

