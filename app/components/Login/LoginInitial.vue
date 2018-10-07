<template>
  <StackLayout ref="initialContainer" class="initial-container" :visibility="visible?'visible':'collapse'">
    <Label text="DASZICHAN" class="initial-label"></Label>
    <StackLayout @tap="login()" class="initial-button">
      <Label text="体验JINGTUM-LIB应用" class="initial-button-label"></Label>
    </StackLayout>
    <ListPicker :items="feathers" />
  </StackLayout>
</template>

<script>
export default {
  name: 'login-initial',
  props: {
    visible: Boolean
  },
  data() {
    return {
      feathers: ["去中心化", "免服务器", "全面原生库", "低门槛应用开发" ]
    }
  },
  methods: {
    login: function() {
      // fadeout and notify parent element when finished
      this.$refs.initialContainer.nativeView.animate({
        opacity: 0,
        duration: 200
      }).then( () => {
        console.log('emitting unlock')
        this.$emit('unlock');
      })
    }
  },
  mounted() {
    console.log("login initial mounted")
  }
}
</script>

<style lang="scss">
// vue scoped styles are not working with this rollup config, and
// that's why we scope with this '.login' class
.login {
  .initial-container {
    margin-top: 250;
  }

  .initial-label {
    color: white;
    horizontal-align: center;
    margin-bottom: 80;
  }

  .initial-button {
    background-color: white;
    color: #CB1D00;
    height: 45;
    width: 275;
    vertical-align: center;
  }

  .initial-button-label {
    horizontal-align: center;
    font-weight: bold;
  }
}

.platform-ios .login {
  .initial-label {
    font-size: 40;
    letter-spacing: 0.2;
  }
}

.platform-android .login {
  .initial-container {
    margin-top: 290;
  }

  .initial-label {
    font-size: 36;
    letter-spacing: 0.35;
  }
}

</style>
