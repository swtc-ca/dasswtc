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
        <Label height="50"/>
        <Ripple rippleColor="red">
        <Label style="horizontal-align:center;font-size:200;" class="fa fab" :text="'fa-github' | fonticon"></Label>
        </Ripple>
        <Ripple rippleColor="blue">
        <qr-code></qr-code>
        </Ripple>
      </Stacklayout>
    </GridLayout>
  </Page>
</template>

<script>
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