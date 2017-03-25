<template>
  <q-layout>
    <q-drawer ref="leftDrawer">
      <div class="list no-border platform-delimiter">
        <q-drawer-link class="logo-container" to="/">
          <img src="statics/portada-small.png">
        </q-drawer-link>
        <hr>
        <q-drawer-link v-if="user && user.capabilities.indexOf('admin') !== -1" icon="view_quilt" to="/catalogar/" exact>
          Catalogar
        </q-drawer-link>
        <hr v-if="user && user.capabilities.indexOf('admin') !== -1">
        <q-drawer-link icon="pets" to="/animales/" exact>
          Animales
        </q-drawer-link>
        <q-drawer-link icon="warning" to="/casos/" exact>
          Casos
        </q-drawer-link>
        <q-drawer-link icon="map" to="/mapa/">
          Mapa
        </q-drawer-link>
        <hr>
        <q-drawer-link v-if="user" icon="settings" to="/perfil/">
          Configurar
        </q-drawer-link>
        <div v-if="user" class="item item-link drawer-closer" @click="logOut()">
          <i class="item-primary">power_settings_new</i>
          <div class="item-content">
            Logout
          </div>
        </div>
        <div v-if="!user" class="item item-link drawer-closer" @click="FBLogin()">
          <i class="item-primary">account_circle</i>
          <div class="item-content">
            Login
          </div>
        </div>
      </div>
      </div>
    </q-drawer>

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

<style>
.drawer.left-side {
  z-index: 11;
}
.layout-view {
  z-index: 0;
}
.item.logo-container {
  height: initial;
}
.item.logo-container > * {
  text-align: center;
}
</style>
