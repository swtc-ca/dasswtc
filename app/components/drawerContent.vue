<template>
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
        <Label col="0"
          :text="page.name" />
          <Label col="1" class="fa fas" :text="'fa-angle-right' | fonticon" />
      </GridLayout>
      <Label text="可行应用" class="sideLabel sideLightGrayLabel"></Label>
      <GridLayout rows="*" columns="*,auto"
        v-for="(page, i) in possibles" :key="i + 200"
        @tap="goToPage(page.component, page.navigateoption)">
        <Label col="0"
          class="sideLabel"
          :text="page.name" />
          <Label col="1" class="fa fas sideLabel" :text="'fa-angle-right' | fonticon" />
      </GridLayout>
      <Label text="关于" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="CA生态节点" class="drawer-item"></Label>
      <Label text="SWTC基金会" class="drawer-item"></Label>
      <Label text="井通公链" class="drawer-item"></Label>
      <Label text="版本" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="v0.2.1" class="drawer-item"></Label>

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
        { name: '离线签', component: this.$routes.OfflineSign, navigateoption: { clearHistory: true }, },
        { name: '建交易', component: this.$routes.BuildPaymentTransaction, navigateoption: { clearHistory: true }, },
        { name: '账本浏览器', component: this.$routes.Explorer, navigateoption: { clearHistory: true }, },
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
    }
  }
}
</script>

<style lang="css">
</style>