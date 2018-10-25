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
        <Label style="horizontal-align:center;font-size:100;" class="fa fab" :text="'fa-github' | fonticon"></Label>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [ sideDrawer ],
  data() {
    return {
    }
  }
}
</script>