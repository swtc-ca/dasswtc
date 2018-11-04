<template>
    <StackLayout style="width:100%;height:100%">
      <GridLayout verticalAlignment="top" columns="*,auto">
        <Label col="0" class="t-24 m-10 p-10 text-center" :text="title"></Label>
        <Label col="1" fontSize="32" class="ion" :text="'ion-ios-close-circle-outline' | fonticon" @tap="$modal.close()" />
      </GridLayout>
       <TextView class="t-10" v-model="resultstring" editable="false" />
    </StackLayout>
</template>

<script>
export default {
  name: 'search-result',
  props: {
    title: {
      type: String,
      default: '查询',
    },
    searchitem: {
      type: String,
      default: '',
    },
    result: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
    }
  },
  computed: {
    resultstring () {
      if (typeof(this.result) === typeof('')) {
        return this.result
      } else {
        return JSON.stringify(this.result, '', 2)
      }
    }
  },
  methods: {
    onTap (event) {
      console.log("taped inside modal")
      this.$emit('modalTap', event)
    },
  },
  created() {
    console.log("modal search created")
  },
  mounted() {
    console.log("modal mounted")
  }
}
</script>

<style lang="scss">
</style>