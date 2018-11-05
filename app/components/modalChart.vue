<template>
    <StackLayout style="width:100%;height:100%">
      <GridLayout verticalAlignment="top" columns="*,auto">
        <Label col="0" class="t-24 m-10 p-10 text-center" :text="title"></Label>
        <Label col="1" fontSize="32" class="ion" :text="'ion-ios-close-circle-outline' | fonticon" @tap="$modal.close()" />
      </GridLayout>
      <GridLayout rows="*" height="*">
          <RadCartesianChart ref="chartref" row="0">
              <LineSeries v-tkCartesianSeries :items="chartData"
                  categoryProperty="timestamp" valueProperty="txn_count" />
              <DateTimeContinuousAxis v-tkCartesianHorizontalAxis majorStep="Minute" dateFormat="hh:mm" labelFitMode="Rotate" labelRotationAngle="1.5"/>
              <LinearAxis v-tkCartesianVerticalAxis />
          </RadCartesianChart>
      </GridLayout>
    </StackLayout>
</template>

<script>
export default {
  name: 'Chart',
  props: {
    chartData: {
      type: Array,
      default: [],
    },
    title: {}
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