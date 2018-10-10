<template>
  <StackLayout ref="unlockContainer" class="unlock-container" :visibility="visible?'visible':'collapse'">
    <Label class="main-label" text="DASZICHAN" :color="isUnlocking? 'black' : 'white'"></Label>

    <!-- form controls -->
    <GridLayout ref="formControls" class="form-controls" rows="auto, auto" translateY="50">
      <TextField
        hint="Email Address"
        keyboardType="number"
        returnKeyType="next"
        :text="isUnlocking ? '输入密码解锁' : '设置锁定密码'"
        :isEnabled="false"
        autocorrect="false"
        autocapitalizationType="none"
        row="0"></TextField>
      <TextField ref="password"
        hint="Password"
        secure="true"
        returnKeyType="done"
        @returnPress="submit()"
        v-model="user.password"
        :isEnabled="true"
        row="1"></TextField>

      <ActivityIndicator busy="false" rowSpan="2"></ActivityIndicator>
    </GridLayout>

    <!-- login / sign up button -->
    <Button
      :text="isUnlocking ? '解锁' : '设置锁定'"
      isEnabled="true"
      class="submit-button"
      @tap="submit()"></Button>

    <!-- forgot password button -->
    <Label
      class="forgot-password-label"
      text=""
      :opacity="isUnlocking ? 1 : 0"></Label>

    <!-- forgot password button  -->
    <StackLayout ref="signUpStack" class="sign-up-stack" @tap="toggleDisplay()" translateY="50">
      <!--<Label :text="isUnlocking ? '设置锁定密码' : '解锁'"></Label>-->
    </StackLayout>
  </StackLayout>
</template>

<script>
import { Animation } from 'ui/animation'
import { prompt } from "ui/dialogs"
import { Color } from 'tns-core-modules/color'
import { connectionType, getConnectionType } from 'tns-core-modules/connectivity'

import Jingtum from '@/components/Jingtum/Jingtum'
import User from '@/models/User'
import UnlockService from '@/services/UnlockService'
//import alert from '@/utils/alert'

const unlockService = new UnlockService()

export default {
  name: 'login-unlock',

  props: {
    visible: Boolean
  },

  data() {
    return {
      isUnlocking: !unlockService.unlocked && unlockService.masterPassword,
      //isSettingLocking: false,
      user: new User()
    }
  },

  watch: {
    visible: function(val) {
      // when element turns visible, start animations
      if (val) {
        const animations = []

        animations.push({ target: this.$refs.unlockContainer.nativeView, opacity: 1, duration: 300 })

        // Slide up the form controls and sign up container.
        animations.push({ target: this.$refs.signUpStack.nativeView, translate: { x: 0, y: 0 }, opacity: 1, delay: 300, duration: 100 })
        animations.push({ target: this.$refs.formControls.nativeView, translate: { x: 0, y: 0 }, opacity: 1, delay: 350, duration: 100 })

        // Kick off the animation queue
        new Animation(animations, false).play()
      }
    }
  },

  methods: {
    toggleDisplay() {
      this.isUnlocking = !this.isUnlocking;
      let unlockContainer = this.$refs.unlockContainer.nativeView
      unlockContainer.animate({
          backgroundColor: this.isUnlocking ? new Color("white") : new Color("#301217"),
          duration: 200
      });
    },

    submit() {
      if (!this.user.password) {
        alert("密码不对")
        return;
      }
      //console.log('submit', this.user.password)
      if (this.isUnlocking) {
       if (this.user.password === unlockService.masterPassword) {
         unlockService.unlocked = true
         this.$navigateTo(Jingtum)
       } else {
         alert("密码不对")
       }
      } else {
        console.log("set master password")
        unlockService.masterPassword = this.user.password
        unlockService.unlocked = true
        this.$navigateTo(Jingtum)
      }
    },
  },

  mounted() {
    console.log('unlock mounted...')
  },

  created() {
  }
}
</script>

<style lang="scss">
.login {
  .unlock-container {
    height: 425;
    margin-left: 30;
    margin-right: 30;
    background-color: white;
  }

  .main-label {
    horizontal-align: center;
    color: black;
  }

  /* Hide a bunch of things to setup the initial animations */
  .form-controls,
  .sign-up-stack {
    opacity: 0;
  }

  Image {
    margin-top: 5;
    margin-bottom: 20;
  }

  Button,
  TextField {
    margin-left: 16;
    margin-right: 16;
    margin-bottom: 10;
  }

  TextField {
    color: black;
    placeholder-color: #ACA6A7;
    margin-bottom: 10;

    &.light {
      color: #C4AFB4;
      placeholder-color: #C4AFB4;
    }
  }

  .submit-button {
    background-color: #CB1D00;
    color: white;
    margin-top: 15;
  }

  .forgot-password-label {
    font-size: 13;
    margin-left: 20;
    margin-bottom: 45;
    color: black;
  }

  .sign-up-stack {
    background-color: #311217;

    label {
      width: 100%;
      color: white;
      horizontal-align: center;
      text-align: center;
      font-size: 15;
      height: 48;
    }
  }
}

.platform-ios .login {
  .main-container {
    width: 300;
  }

  .main-label {
    color: #311217;
    font-size: 32;
    margin-top: 45;
    margin-bottom: 52;
    letter-spacing: 0.2;
  }

  TextField {
    border-width: 1;
    border-color: #6E595C;
    margin-bottom: 20;

    &.light {
      border-color: #C4AFB4;
    }
  }

  .submit-button {
    height: 40;
  }
}

.platform-android .login {
  .main-container {
    width: 275;
    height: 394;
  }

  .main-label {
    font-size: 28;
    margin-top: 42;
    margin-bottom: 32;
    letter-spacing: 0.3;
  }

  .sign-up-stack label {
    margin-top: 15;
    text-transform: uppercase;
  }

  .forgot-password-label {
    font-size: 13;
    text-transform: uppercase;
  }
}

</style>
