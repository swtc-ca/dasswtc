<template>
    <Page ref="page" :class="pageClasses" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <ActionBar :title="title" android:flat="true"/>
        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff"
                 >
            <TabViewItem :title="tabTitles[0]">
                <StackLayout>
                    <StackLayout :visibility="!!secret ? 'collapse' : 'visible'">
                        <ListPicker :items="wallets.map(w => w.address)" v-model="wallet" />
                        <Button text="选择井通钱包" @tap="onWalletSelected" class="btn btn-primary btn-active"/>
                    </StackLayout>
                    <StackLayout :visibility="!!secret ? 'visible' : 'collapse'">
                      <GridLayout ref="walletRef" columns="80,*,2*,90" rows="36">
                        <Label col="0" text="井通钱包" />
                        <Label col="1" :text="sequence ? '序号' + sequence : ''" />
                        <Label col="2" :text="balance ? '余额' + balance : ''" />
                        <Label col="3" :text="!!price ? '价格' + price : ''" />
                      </GridLayout>
                      <Label :text="'  地址: ' + address"  />
                    </StackLayout>
                    <StackLayout :visibility="!!remote ? 'collapse' : 'visible'">
                        <ListPicker :items="servers.map(s => s.display)" v-model="server" />
                        <Button text="选择井通节点" @tap="onServerSelected" class="btn btn-primary btn-active"/>
                    </StackLayout>
                    <StackLayout :visibility="!!remote ? 'visible' : 'collapse'">
                      <GridLayout ref="remoteRef" columns="100,100,*,80" rows="40">
                        <Label col="0" text="井通节点" />
                        <Label col="1" :text="remoteStatus ? '连接': ''" />
                        <button col="3" :isEnabled="!remoteconnecting" @tap="onRemote" :text="!remoteStatus ? '连接' : '断开'" style="width:80;height:40" class="btn btn-primary"/>
                      </GridLayout>
                      <Label :text="'  地址: ' + remote"  />
                      <Label :text="'  名称: ' + remoteDisplay"  />
                      <GridLayout ref="queryRef" columns="80,*,80" rows="40" :visibility="remoteStatus && !remoteconnecting ? 'visible' : 'collapse'">
                        <button col="0" row="0" @tap="onQueryLedger" text="查账本" style="width:80;" class="btn btn-primary"/>
                        <TextField col="1" row="0" v-model="qrLedgerTransaction" autocorrect="false"/>
                        <button col="2" row="0" @tap="onQueryTransaction" text="查交易" style="width:80;" class="btn btn-primary"/>
                      </GridLayout>
                    </StackLayout>
                    <StackLayout :visibility="!!remote ? 'visible' : 'collapse'">
                      <GridLayout ref="queryRef" columns="80,*,*,80" rows="40" :visibility="remoteStatus && !remoteconnecting ? 'visible' : 'collapse'">
                      <button col="0" :isEnabled="remoteStatus && !remoteconnecting" @tap="onWallet" text="查余额" style="width:80" class="btn btn-primary"/>
                      <Button col="1" text="查市场" :isEnabled="remoteStatus && !remoteconnecting" @tap="onOrderBook()" class="btn btn-primary"  style="width:80;" />
                      <button col="2" :isEnabled="remoteStatus && !remoteconnecting" @tap="onRemoteInfo" text="服务器" style="width:80;" class="btn btn-primary"/>
                      <Button col="3" row="1" text="查通证" @tap="onWalletTums()" class="btn btn-primary"  style="width:80;" />
                      </GridLayout>
                    </StackLayout>
                    <GridLayout ref="paymentRef" columns="80,*,*,80" rows="40,40,40" :visibility="remoteStatus && !remoteconnecting && activated ? 'visible' : 'collapse'">
                      <Button col="0" text="作支付" @tap="onPayment()" class="btn btn-primary"  style="width:80;" />
                      <TextField col="1" row="0" v-model="payMemo" autocorrect="false"/>
                      <TextField col="2" row="0" v-model="payValue" autocorrect="false"/>
                      <Button col="3" row="0" text="查记录" @tap="onWalletHistory()" class="btn btn-primary"  style="width:80;" />
                      <Button col="0" row="1" text="查关系" @tap="onWalletRelations()" class="btn btn-primary"  style="width:80;" />
                      <TextField col="1" row="1" v-model="qrRelation" autocorrect="false"/>
                      <Button col="3" row="1" text="查挂单" @tap="onWalletOffers()" class="btn btn-primary"  style="width:80;" />
                      <Button col="0" row="2" text="挂单买" @tap="onOfferBuy()" class="btn btn-primary"  style="width:80;" />
                      <TextField col="1" row="2" v-model="offerSWT" autocorrect="false"/>
                      <TextField col="2" row="2" v-model="offerCNY" autocorrect="false"/>
                      <Button col="3" row="2" text="挂单卖" @tap="onOfferSell()" class="btn btn-primary"  style="width:80;" />
                    </GridLayout>
                    <GridLayout ref="listenRef" columns="*,*" rows="40" :visibility="remoteStatus && !remoteconnecting ? 'visible' : 'collapse'">
                      <Button col="0" :text="!ledgerReceiving ? '监听账本' : '停止监听账本'" :visibility="remoteStatus && !remoteconnecting ? 'visible' : 'collapse'" @tap="onLedger()" class="btn btn-primary btn-active"  style="width: 50%" />
                      <Button col="1" :text="!transactionReceiving ? '监听交易' : '停止监听交易'" :visibility="remoteStatus && !remoteconnecting ? 'visible' : 'collapse'" @tap="onTransaction()" class="btn btn-primary btn-active"  style="width: 50%" />
                    </GridLayout>
                    <Button text="可触碰按钮 以下为输出" visibility="collapse" @tap="onTap" class="btn btn-primary btn-active"  style="width: 100%; height: 36" />
                    <ScrollView>
                      <TextView :text="msgs[0]" editable="false"></TextView>
                    </ScrollView>
                </StackLayout>
            </TabViewItem>
            <TabViewItem :title="tabTitles[1]">
                <StackLayout>
                    <ListView class="listdapp" for="dapp in dapps" @itemTap="onDappTap" style="height:100%">
                        <v-template>
                           <Label :text="dapp.name" class="dapp" />
                        </v-template>
                    </ListView>
                </StackLayout>
            </TabViewItem>
            <TabViewItem :title="tabTitles[2]">
                <StackLayout class="dapp">
                  <GridLayout columns="80,*,160" rows="40">
                    <Label text="关 于" col="0" row="0"/>
                    <Label text="//daszichan.com" col="2" row="0"/>
                  </GridLayout>
                  <GridLayout columns="80,*,80" rows="40">
                    <Label text="版 本" col="0" row="0"/>
                    <Label text="0.1.2" col="2" row="0"/>
                  </GridLayout>
                  <GridLayout columns="80,*,80" rows="40">
                    <Label text="冷钱包" col="0" row="0"/>
                    <Switch :checked="cold" @checkedChange="onColdChange" col="2" row="0"/>
                  </GridLayout>
                  <GridLayout columns="80,*,80" rows="40">
                    <Label text="秘钥" col="0" row="0"/>
                    <Switch :checked="showSecretSwitch" @checkedChange="onShowSecret" v-model="showSecretSwitch" col="2" row="0"/>
                  </GridLayout>
                  <Label :text="secret" :visibility="showSecret ? 'visible' : 'hidden'" style="font-size:16" />
                  <StackLayout>
                      <ListPicker :items="servers.map(s => s.display)" v-model="server" />
                      <Button text="选择井通节点" :isEnabled="!remoteStatus" @tap="onServerSelected" class="btn btn-primary btn-active"/>
                      <Button text="更新节点列表" :isEnabled="false" @tap="onServerListRefresh" class="btn btn-primary"/>
                  </StackLayout>
                </StackLayout>
            </TabViewItem>
            <TabViewItem :title="tabTitles[3]">
              <ScrollView>
                <TextView :text="msgs.join('\n')" editable="false"></TextView>
              </ScrollView>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
const dialogs = require('tns-core-modules/ui/dialogs')
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as platformModule from "tns-core-modules/platform";
import JingtumService from '@/services/JingtumService';
const jingtumService = new JingtumService();
jingtumService.confPersist()
export default {
  data() {
    return {
      wallets: [],
      wallet: -1,
      states: [],
      address: jingtumService.address,
      secret: jingtumService.secret,
      remote: jingtumService.server,
      remoteDisplay: '',
      remoteStatus: false,
      remoteconnecting: false,
      servers: jingtumService.servers(),
      server: jingtumService.servers().indexOf(jingtumService.servers().filter(d => d.server === jingtumService.server)[0]),
      ledgerReceiving: false,
      transactionReceiving: false,
      qrLedgerTransaction: '账本高度账本哈希交易哈希',
      payValue: 1,
      payMemo: 'memo赞助',
      qrRelation: 'trust',
      offerSWT: 1,
      offerCNY: 0.012,
      showSecretSwitch: false,
    };
  },
  computed: {
    localComputed() {},
    ...mapState(["title", "tabTitles", "activated", "showSecret", "price", "counter", "cold", "msgs", "dapps", "swtc", "moac", "balance", "sequence"]),
    ...mapGetters([]),
    pageClasses: function() {
      return {
        // add top class so we can apply styles to specific platforms
        "platform-ios": platformModule.isIOS,
        "platform-android": platformModule.isAndroid
      };
    }
  },
  methods: {
    ...mapMutations([
      "setactivated",
      "setshowSecret",
      "setprice",
      "setcounter",
      "setbalance",
      "setsequence",
      "increment",
      "decrement",
      "swapcold",
      "swapswtc",
      "swapmoac",
      "appendmsg"
    ]),
    ...mapActions([]),
    onServerListRefresh(){
      console.log("refresh server list")
      this.appendmsg(`更新服务器列表...`)
    },
    onShowSecret() {
      console.log("toggle display secret")
      this.appendmsg(`切换秘钥显示...`)
      if (this.showSecretSwitch) {
        prompt({
          title: "查看秘钥",
          message: "输入密码",
          okButtonText: "确定",
          cancelButtonText: "取消",
          defaultText: "",
          inputType: dialogs.inputType.password
        }).then(result => {
          if (result.result){ 
            if ( result.text === jingtumService.masterPassword ){
              this.setshowSecret(true)
              setTimeout(() => this.setshowSecret(false), 100000)
            } else {
              alert('密码错误')
              this.showSecretSwitch = false
              this.setshowSecret(false)
            }
          } else {
            this.setshowSecret(false)
            this.showSecretSwitch = false
          }
        })
      } else {
          this.setshowSecret(false)
          this.showSecretSwitch = false

      }
    },
    onOfferSell(){
      console.log("manage offers")
      this.appendmsg(`操作挂单...`)
      let takerpays = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takergets = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      jingtumService.requestOffer('Sell', takergets, takerpays)
    },
    onOfferBuy(){
      console.log("manage offers")
      this.appendmsg(`操作挂单...`)
      let takergets = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takerpays = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      jingtumService.requestOffer('Buy', takergets, takerpays)
    },
    onOrderBook() {
      console.log("query orderbooks")
      this.appendmsg(`查询市场...`)
      var callbackGetPrice =  (err, result) => {
        if(err) {
          console.log(err); store.commit('appendmsg',err)
        } else {
          if (typeof(result) === 'object') {
            let firstRecord = result.offers[0]
            let offers = []
            this.setprice(Math.floor(10000 * Number(firstRecord.TakerGets.value) * 1000000 / Number(firstRecord.TakerPays)) / 10000) 
            this.offerCNY = this.price
            result.offers.forEach(r => offers.push(`${Math.floor(Number(r.TakerPays) / 1000000)}SWT <-> ${Math.floor(r.TakerGets.value)}CNY`)) 
            this.appendmsg(JSON.stringify(offers,'',2))
            console.log(offers)
            //this.appendmsg(JSON.stringify(result,'',2))
          } else {
            console.log(result);
            this.appendmsg(result)
          }
        }
      }
      var options_swt_cny = {
          gets: { currency: 'SWT', issuer: '' },
          pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
      };
      jingtumService.requestOrderBook(options_swt_cny,callbackGetPrice)
    },
    onWalletOffers() {
      console.log("query offers")
      this.appendmsg(`查询挂单...`)
      jingtumService.requestAccountOffers()
    },
    onWalletRelations() {
      console.log("query relation")
      this.appendmsg(`查询关系...`)
      jingtumService.requestAccountRelations(this.qrRelation)
    },
    onWalletTums() {
      console.log("available tums")
      this.appendmsg(`查询可用通证...`)
      jingtumService.requestAccountTums()
    },
    onWalletHistory() {
      console.log("history")
      this.appendmsg(`查询支付记录...`)
      jingtumService.requestAccountTx()
    },
    onPayment(){
      console.log("donation")
      this.appendmsg(`测试支付赞助 ${this.payMemo}`)
      jingtumService.pay('jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',this.payValue,'SWT','',this.payMemo)
    },
    onQueryLedger(){
      console.log("querying ledger ...")
      this.appendmsg(`查询账本...`)
      jingtumService.queryLedger(this.qrLedgerTransaction)
    },
    onQueryTransaction(){
      console.log("querying transaction ...")
      this.appendmsg(`查询交易...`)
      jingtumService.queryTransaction(this.qrLedgerTransaction)
    },
    onLedger() {
      console.log("listen ledger_closed switch...")
      this.appendmsg(`更改账本接收...`)
      jingtumService.ledgerReceive(!this.ledgerReceiving)
      this.ledgerReceiving = !this.ledgerReceiving
    },
    onTransaction() {
      console.log("listen transactions switch...")
      this.appendmsg(`更改交易接收...`)
      jingtumService.transactionReceive(!this.transactionReceiving)
      this.transactionReceiving = !this.transactionReceiving
    },
    onWallet() {
      console.log("update balance")
      this.appendmsg("updating balance");
      var callbackAccount =  (err, result) => {if(err) { console.log(err); this.appendmsg(err); if (err === 'Account not found.') { this.setactivated(false); alert("账号未激活, 转入35个井通和0.1CNY可以体验账号相关测试")}} else { this.setactivated(true); console.log(result); if (typeof(result) === 'object') {this.appendmsg(JSON.stringify(result,'',2)); this.setsequence(result.account_data.Sequence); this.setbalance(Math.floor(result.account_data.Balance / 10000) / 100)} else {this.appendmsg(result)}}}
      jingtumService.updateWallet(callbackAccount);
    },
    onRemote(){
      this.remoteconnecting = true
      console.log("server connection change")
      var callbackConnect =  (err, result) => 
        {this.remoteconnecting = false; 
          if(err) { console.log(err); this.appendmsg(err)} 
          else { this.remoteStatus = !this.remoteStatus; console.log(result); 
            if (typeof(result) === 'object') {this.appendmsg(JSON.stringify(result,'',2))} 
            else {this.appendmsg(result)}
          }
        }
      if (this.remoteStatus) {
        jingtumService.disconnect()
        this.remoteStatus = !this.remoteStatus
        this.remoteconnecting = false
        this.setprice(0)
        this.setbalance(0)
      } else {
        jingtumService.connect(callbackConnect)
        setTimeout(() => this.onWallet(),4000)
        setTimeout(() => this.onOrderBook(),4000)
      }
      this.ledgerReceiving = false
      this.transactionReceiving = false
      var callbackPost = (timeout=3000) => setTimeout(() => { console.log('post call back'); this.remoteStatus = jingtumService.isConnected(); this.remoteconnecting = false}, timeout)
      //callbackPost()
    },
    onRemoteInfo() {
      jingtumService.serverInfo();
    },
    onServerSelected() {
      console.log("server seclected");
      if ( jingtumService.server != this.servers[this.server].server ) {
        jingtumService.server = this.servers[this.server].server 
        this.remote = this.servers[this.server].server;
        this.remoteDisplay = this.servers.filter( s => s.server === this.remote)[0].display
        jingtumService.refresh()
        this.appendmsg(JSON.stringify(this.servers[this.server], '', 2));
        alert("服务器已更改")
      }
    },
    onWalletSelected() {
      this.secret = this.wallets[this.wallet].secret;
      jingtumService.secret = this.secret
      console.log("wallet seclected");
      this.address = jingtumService.address
      if (this.address !== jingtumService.newWallet(this.secret).address) {
        alert("something wrong selecting address")
      }
      this.appendmsg(`address:${this.address}\t secret:${this.secret}`);
    },
    onMoacChange(args) {
      this.swapmoac();
      console.log(`this.moac=${this.moac}`);
      this.appendmsg(this.moac);
    },
    onSwtcChange(args) {
      this.swapswtc();
      console.log(`this.swtc=${this.swtc}`);
      this.appendmsg(this.swtc);
    },
    onColdChange(args) {
      this.swapcold();
      console.log(`this.cold=${this.cold}`);
      this.appendmsg(this.cold);
    },
    onTap() {
      this.increment();
      this.appendmsg(`tapped ${this.counter}`);
    },
    onDappTap(args) {
      this.appendmsg(`Dapp of index ${args.index} tapped`);
      action("Do you want to use this dapp?", "取消", ["打开", "隐藏"]).then(
        result => {
          switch (result) {
            case "打开":
              this.appendmsg(`onDappTap -> 打开`);
              break;
            case "隐藏":
              this.appendmsg(`onDappTap -> 隐藏`);
              break;
            case "取消" || undefined: // Dismisses the dialog.
              this.appendmsg(`onDappTap -> 取消`);
              break;
          }
        }
      );
    }
  },
  created() { 
    console.log("jingtum app created")
    if (this.secret) {
      this.address = jingtumService.newWallet(this.secret).address
    }
    if (this.remote) {
      try {
        this.remoteDisplay = jingtumService.servers().filter( s => s.server === this.remote)[0].display
      } catch (err) {
      }
    }
  },
  mounted() {
    console.log(jingtumService.jlibServer)
    let i = 0
     while (i < 20) {
       this.wallets.unshift(jingtumService.newWallet())
       i += 1
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.message {
  vertical-align: center;
  text-align: left;
  font-size: 16;
  color: #333333;
  line-height: 20%;
}
.dapp {
  text-align: left;
  font-size: 20;
}
Button {
  font-size: 12;
  height: 36;
  text-align: center;
}
</style>
