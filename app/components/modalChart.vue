<template lang="html">
  <Frame>
  <Page class="page" @loaded="modalLoaded">
    <ActionBar class="action-bar" :title="title">
      <ActionItem @tap="$modal.close"  ios.position="right" ios.systemIcon="14" android.systemIcon="ic_menu_close_clear_cancel" />
    </ActionBar>
    <StackLayout verticalAligment="middle">
      <GridLayout rows="*" height="*">
          <RadCartesianChart ref="chartref" row="0">
              <LineSeries v-tkCartesianSeries :items="chartData"
                  categoryProperty="timestamp" valueProperty="txn_count" />
              <DateTimeContinuousAxis v-tkCartesianHorizontalAxis majorStep="Minute" dateFormat="hh:mm" labelFitMode="Rotate" labelRotationAngle="1.5"/>
              <LinearAxis v-tkCartesianVerticalAxis />
          </RadCartesianChart>
      </GridLayout>
    </StackLayout>
  </Page>
  </Frame>
</template>

<script>
import statusBar from '~/mixins/statusBar'
export default {
  name: 'Chart',
  mixins: [ statusBar ],
  props: {
    chartData: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: 'Chart'
    }
  },
  data () {
    return {
    }
  },
  computed: {
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
    console.log("modal chart created")
  },
  mounted() {
    console.log("modal mounted")
  }
}
</script>

<style lang="scss">
</style>