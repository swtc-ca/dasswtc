<template>
  <Page class="page">
    <ActionBar
      class="action-bar"
      title="可行应用">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*">
      <SwipeLayout class="sl" v-for="item in texts" :key="item" @swipeLeft="rewind" @swipeRight="forward">
      <StackLayout horizontalAlignment="center">
        <CardView elevation="20" margin="10" radius="10" backgroundColor="white" shadowOpacity=".2" shadowRadius="5">
          <qr-code :text="item"></qr-code>
        </CardView>
      </StackLayout>
      </SwipeLayout>
    </GridLayout>
  </Page>
</template>

<script>
require( "nativescript-platform-css" )
import sideDrawer from '~/mixins/sideDrawer'
import qrCode from './../components/qrCode'
export default {
  mixins: [ sideDrawer ],
  components: {
    qrCode,
  },
  data() {
    return {
      texts: ['fa-github', 'fa-slack', 'fa-docker', 'fa-linkedin', 'fa-twitter', 'fa-yelp', 'fa-uber'],
      text: ''
    }
  },
  methods: {
    rewind() {
      this.text = this.texts[(this.texts.indexOf(this.text) - 1 + this.texts.length) % this.texts.length]
    },
    forward() {
      this.text = this.texts[(this.texts.indexOf(this.text) + 1) % this.texts.length]
    }
  },
  created (){
    this.text = this.texts[Math.floor(Math.random() * this.texts.length)]
  }
}
</script>
<style scoped>
.android .sl { horizontal-align: center; }
.ios .sl { margin-top: 40; }
.ios .possible { font-size: 250; }
.android .possible { font-size: 200; }
</style>