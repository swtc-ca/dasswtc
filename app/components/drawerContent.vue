<template lang="html">
  <ScrollView>
    <StackLayout width="100%">
      <GridLayout columns="20,auto,20,*">
        <Image col="1" class="sidedrawer-header-image" src="~/assets/images/das256.png" @tap="closeDrawer()" />
        <Label col="3" class="sidedrawer-header-brand" text="井通工具箱" @tap="closeDrawer()" />
      </GridLayout>
      <Label text="井通应用" class="sideLabel sideLightGrayLabel"></Label>
      <GridLayout rows="*" columns="*,auto"
          class="sidedrawer-list-item" :class="active"
        v-for="(page, i) in dapps" :key="i"
        @tap="goToPage(page.component, page.navigateoption)">
        <Label col="0"
          :text="page.name" />
          <Label col="1" class="fa fas" :text="'fa-angle-right' | fonticon" />
      </GridLayout>
      <Label text="我的设置" class="sideLabel sideLightGrayLabel"></Label>
      <GridLayout rows="*" columns="*,auto"
          class="sidedrawer-list-item"
          v-for="(page, i) in mines" :key="i + 100"
          @tap="goToPage(page.component, page.navigateoption)">
        <Label col="0" :text="page.name" />
        <Label col="1" class="fa fas" :text="'fa-angle-right' | fonticon" />
      </GridLayout>
      <Label text="关于" class="sideLabel sideLightGrayLabel"></Label>
      <GridLayout rows="*" columns="*,auto"
          v-for="(org, i) in abouts" :key="i"
          @tap="awv(org.url)">
        <Label col="0" :text="org.name" class="drawer-item"></Label>
        <Label col="1" class="t-12 ion" :text="'ion-md-open' | fonticon" />
      </GridLayout>
      <Label text="版本:  0.2.2" class="sideLabel sideLightGrayLabel"></Label>
    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import advancedWebView from '~/mixins/advancedWebView'
export default {
  mixins: [sideDrawer, advancedWebView],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      abouts: [
        { name: "CA生态节点", url: "http://daszichan.com"},
        { name: "SWTC基金会", url: "https://swtc.top"},
        { name: "井通公链", url: "https://jingtum.com"}
      ],
      dapps: [
        { name: '开发库', component: this.$routes.JingtumLib, navigateoption: { clearHistory: true }, },
        { name: '靓号选', component: this.$routes.SelectAddress, navigateoption: { clearHistory: true }, },
        { name: '建交易', component: this.$routes.BuildPaymentTransaction, navigateoption: { clearHistory: true }, },
        { name: '离线签', component: this.$routes.OfflineSignTx, navigateoption: { clearHistory: true }, },
        { name: '账本浏览器', component: this.$routes.Explorer, navigateoption: { clearHistory: true }, },
        { name: '可行应用', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
      ],
      possibles: [
        { name: '溯源', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '防伪', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '留证', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '菠菜', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '交易', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '生态节点', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '快速转账', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
        { name: '智能合约', component: this.$routes.Possible, navigateoption: { clearHistory: false }, },
      ],
      hiddens: [
        { name: '地址', component: this.$routes.MineAddress, navigateoption: {clearHistory: true}, },
        { name: '节点', component: this.$routes.MineServer, navigateoption: { clearHistory: true }, },
      ],
      mines: [
        { name: '设置', component: this.$routes.Configuration, navigateoption: { clearHistory: true }, },
      ]
    }
  },
  methods: {
    goToPage (pageComponent, navigateoption) {
      // use the manual navigation method
      this.$navigateTo(pageComponent, navigateoption)
      // and we probably want to close the drawer when changing pages
      this.closeDrawer()
    },
  }
}
</script>

<style lang="css">
</style>