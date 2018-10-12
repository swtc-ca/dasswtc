<template>
    <Page>
        <ActionBar title="webview"/>
        <GridLayout cols="*" rows="*">
        <WebView row="0" col="0" ref="webviewurl" src="http://swtc.daszichan.com/index.html" width="500" height="600"/>
        </GridLayout>
    </Page>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'Hello WebView'
      }
    },
    methods: {
      onWebViewLoaded(){
          console.log("webview loaded")
      }
    },
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
</style>
