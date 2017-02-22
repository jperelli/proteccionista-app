<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <router-link to="/">
          Proteccionista
        </router-link>
      </q-toolbar-title>
      <button v-if="!user" @click="FBLogin()">
        Login
        <i>account_circle</i>
      </button>
      <button v-if="user">
        {{ user.name }}
        <i>account_circle</i>

        <q-popover ref="popover">
          <div class="list highlight">
            <router-link
              tag="div"
              class="item item-link item-delimiter"
              to="/perfil/"
              v-on:click.native="$refs.popover.close()"
            >
              <div class="item-content">
                Configurar
              </div>
            </router-link>
            <!--div
              class="item item-link item-delimiter"
              @click="doSomething(), $refs.popover.close()"
            >
              <div class="item-content">
                Logout
              </div>
            </div-->
          </div>
        </q-popover>

      </button>
    </div>

    <router-view class="layout-view"></router-view>

  </q-layout>
</template>

<script>
import { Dialog, Loading } from 'quasar'
import axios from 'axios'
import store from '../store'

function loginStage2 (that, fbAccessToken) {
  axios.get(
    '/profile/jwt',
    {
      headers: {
        'Authorization': 'FB ' + fbAccessToken
      }
    }
  )
  .then(function (response) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.jwt
    axios.get('/profile/').then(function (response) {
      that.user = response.data
      Loading.hide()
    })
    .catch(function (error) {
      Dialog.create({
        title: 'Error',
        message: 'Could not retrieve profile. (3)<hr>' + error
      })
      Loading.hide()
    })
  })
  .catch(function (error) {
    Dialog.create({
      title: 'Error',
      message: 'Could not connect via facebook. (2)<hr>' + error
    })
    Loading.hide()
  })
}

store.state.index = {
  user: false
}

export default {
  data () {
    return store.state.index
  },
  created: function () {
    console.log(this)
    var that = this
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '726350657534668',
        xfbml: true,
        version: 'v2.8'
      })

      window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          Loading.show({ delay: 0, message: 'Esperando Log in' })
          loginStage2(that, response.authResponse.accessToken)
        }
      })
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  },
  methods: {
    FBLogin () {
      var that = this
      Loading.show({ delay: 0, message: 'Esperando Log in' })
      window.FB.login(function (response) {
        if (response.status === 'connected') {
          loginStage2(that, response.authResponse.accessToken)
        }
        else {
          Dialog.create({
            title: 'Error',
            message: 'Could not connect via facebook. (1)<hr>' + response.status
          })
          Loading.hide()
        }
      }, {scope: 'public_profile,pages_show_list,email'})
    }
  }
}
</script>
