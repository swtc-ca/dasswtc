<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="可行应用">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*">
      <Stacklayout row="0">
        <Ripple rippleColor="red">
        <Label height="50"/>
        </Ripple>
        <Label class="fa fab possible" :text="'fa-github' | fonticon"></Label>
        <qr-code></qr-code>
      </Stacklayout>
    </GridLayout>
  </Page>
</template>

<script>
require( "nativescript-platform-css" )
import sideDrawer from '~/mixins/sideDrawer'
import QrCode from './../components/qrCode'
export default {
  mixins: [ sideDrawer ],
  components: {
    QrCode,
  },
  data() {
    return {
    }
  }
}
</script>
<style scoped>
.ios .possible {  horizontal-align:center; font-size: 300; }
.android .possible {  horizontal-align:center; font-size: 200; }
</style>