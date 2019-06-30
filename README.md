# DAS SWTC

## [PlayStore 应用商店](https://play.google.com/store/apps/details?id=com.daszichan.swtc)

-  Even easier develope mobile app than web app
-  移动应用比web应用开发更加直接和简单
-  Jingtum Lib Play by DAS
-  井通区块链node.js库
-  NativeScript + nativescript-nodeify
-  无需Java和Swift/Objective c++
-  Build native mobile apps for both iOS and Android
-  开发出原生应用
-  Selectable with javascript/angular/vue
-  可用纯javascript或者angular或者vue
-  web base playgroud and GUI app  基于网页的和图形界面的应用加速开发

## prerequisite 要求

-  known了解node.js/javascript
-  can setup development environment following documents 能按照文档搭建开发环境 nativescript.org
-  we always use the latest stable version 文档只针对最新的稳定版本

## prepare 准备

-  nativescript-core
   -  tns create myapp --js
   -  cd myapp
      - npm install
      - tns plugin add nativescript-nodeify
      - tns plugin add nativescript-websockets
      - npm install jingtum-lib
      - patch two (brorand, jingtum-lib) files from this git repo at ./patched
      - patch webpack.config.js from ./patched/webpack.config.js-tns-create-js
      - tns run --bundle
         - in ./app/main-view-model.js, you can now use jingtum-lib
           - require("nativescript-nodeify")
           - var JingtumLib = require("jingtum-lib")
           - var Wallet = JingtumLib.Wallet
           - var Remote = JingtumLib.Remote
           - optionally you can promisify jingtum-lib with the shipped bluebird library
-  nativescript-vue
   -  refer 参考 nativescript-vue.org
   -  tns create myapp --vue
   -  cd myapp
      - npm install
      - tns plugin add nativescript-nodeify
         - remove ./hooks/after-prepare/nativescript-nodeify.js
      - tns plugin add nativescript-websockets
      - npm install jingtum-lib
      - patch two (brorand, jingtum-lib) files from this git repo at ./patched
      - patch webpack.config.js from ./patched/webpack.config.js-tns-create-vue
      - tns run --bundle
        - in ./app/components/App.vue, you can now use jingtum-lib
           - require("nativescript-nodeify")
           - var JingtumLib = require("jingtum-lib")
           - var Wallet = JingtumLib.Wallet
           - var Remote = JingtumLib.Remote
           - optionally you can promisify jingtum-lib with the shipped bluebird library

## plugins tested 插件
-  cardview
-  swipe layout
-  theme
-  ui chart/listview/drawer
-  webview
-  qrcode barcode
-  fonticon
-  drop down
-  feedback
-  toasts
-  fancy alert
-  rippling
-  vibrate
-  vuex

## iterate 迭代
-  fast iteration since it is javascript and xml based with so many libraries

## publish 发布
-  google play is simple
   - play console
-  appstore is strict
   - itunes connect

