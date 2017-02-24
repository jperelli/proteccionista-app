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
            <div
              class="item item-link item-delimiter"
              @click="logOut(), $refs.popover.close()"
            >
              <div class="item-content">
                Logout
              </div>
            </div>
          </div>
        </q-popover>

      </button>
    </div>

    <router-view class="layout-view"></router-view>

  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog, Loading } from 'quasar'

export default {
  computed: {
    ...mapGetters([
      'user',
      'fb_groups'
    ])
  },
  created: function () {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '726350657534668',
        version: 'v2.8'
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
      Loading.show({ delay: 0, message: 'Esperando Log in' })
      this.$store.dispatch('fblogin')
        .then(Loading.hide)
        .catch((error) => {
          Dialog.create({
            title: 'Error',
            message: 'Could not login <hr>' + error
          })
          Loading.hide()
        })
    },
    logOut () {
      Loading.show({ delay: 0, message: 'Cerrando sesion' })
      this.$store.dispatch('logout')
        .then(Loading.hide)
        .catch((error) => {
          Dialog.create({
            title: 'Error',
            message: 'Could not logout <hr>' + error
          })
          Loading.hide()
        })
    }
  }
}
</script>
