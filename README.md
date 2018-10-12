# DAS SWTC

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

## prepare 准备

-  nativescript-core
   -  tns create myapp
   -  cd myapp
      - npm install
      - tns plugin add nativescript-nodeify
      - tns plugin add nativescript-websockets
      - npm install jingtum-lib
      - patch two jingtum-lib files from this git repo at ./patched
      - tns run ios or tns run android
         - in ./app/main-view-model.js, you can now use jingtum-lib
           - require("nativescript-nodeify")
           - var JingtumLib = require("jingtum-lib")
           - var Wallet = JingtumLib.Wallet
           - var Remote = JingtumLib.Remote
-  nativescript-vue
   - refer 参考 nativescript-vue.org
   - vue init nativescript-vue/vue-cli-template myapp
   - cd myapp
      - npm install
      - tns plugin add nativescript-nodeify
         - remove ./hooks/after-prepare/nativescript-nodeify.js
      - tns plugin add nativescript-websockets
      - npm install jingtum-lib
      - patch two jingtum-lib files from this git repo at ./patched
      - update webpack.config.js with the version in this repository
      - tns run ios --bundle or tns run android --bundle
        - in ./app/components/App.vue, you can now use jingtum-lib
           - require("nativescript-nodeify")
           - var JingtumLib = require("jingtum-lib")
           - var Wallet = JingtumLib.Wallet
           - var Remote = JingtumLib.Remote

## iterate 迭代
-  fast iteration since it is javascript and xml based with so may libraries

## publish 发布
-  google play is simple
   - play console
-  appstore is strict
   - itunes connect

