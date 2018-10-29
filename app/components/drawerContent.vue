<template lang="html">
  <ScrollView>
    <StackLayout width="100%">
      <Label class="drawer-header" text="井通工具箱" @tap="closeDrawer()"/>

      <Label text="井通应用" class="sideLabel sideLightGrayLabel"></Label>
      <Label
        v-for="(page, i) in dapps"
        @tap="goToPage(page.component, page.navigateoption)"
        class="sideLabel"
        :text="page.name"
        :key="i"
      />
      <Label text="我的设置" class="sideLabel sideLightGrayLabel"></Label>
      <Label
        v-for="(page, i) in mines"
        @tap="goToPage(page.component, page.navigateoption)"
        class="sideLabel"
        :text="page.name"
        :key="i + 100"
      />
      <Label text="可行应用" class="sideLabel sideLightGrayLabel"></Label>
      <Label
        v-for="(page, i) in possibles"
        @tap="goToPage(page.component, page.navigateoption)"
        class="sideLabel"
        :text="page.name"
        :key="i + 200"
      />
      <Label text="关于" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="CA生态节点" class="drawer-item"></Label>
      <Label text="SWTC基金会" class="drawer-item"></Label>
      <Label text="井通公链" class="drawer-item"></Label>
      <Label text="版本" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="v0.2.0" class="drawer-item"></Label>

    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [sideDrawer],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      dapps: [
        { name: '靓号选', component: this.$routes.SelectAddress, navigateoption: { clearHistory: true }, },
        { name: '开发库', component: this.$routes.JingtumLib, navigateoption: { clearHistory: true }, },
        { name: '账本浏览器', component: this.$routes.Explorer, navigateoption: { clearHistory: true }, },
      ],
      possibles: [
        { name: '溯源', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '防伪', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '留证', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '菠菜', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '交易', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '生态节点', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '快速转账', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
        { name: '智能合约', component: this.$routes.Possible, navigateoption: { clearHistory: true }, },
      ],
      mines: [
        { name: '地址', component: this.$routes.MineAddress, navigateoption: {clearHistory: true}, },
        { name: '节点', component: this.$routes.MineServer, navigateoption: { clearHistory: true }, },
      ]
    }
  },
  methods: {
    goToPage (pageComponent, navigateoption) {
      // use the manual navigation method
      this.$navigateTo(pageComponent, navigateoption)
      // and we probably want to close the drawer when changing pages
      this.closeDrawer()
    }
  }
}
</script>

<style lang="css">
</style>