<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
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
              class="item item-link"
              to="/perfil/"
              v-on:click.native="$refs.popover.close()"
            >
              <i class="item-primary">settings</i>
              <div class="item-content">
                Configurar
              </div>
            </router-link>
            <div
              class="item item-link"
              @click="logOut(), $refs.popover.close()"
            >
              <i class="item-primary">power_settings_new</i>
              <div class="item-content">
                Logout
              </div>
            </div>
          </div>
        </q-popover>

      </button>
    </div>

    <q-drawer ref="leftDrawer">
      <div class="list no-border platform-delimiter">
        <div class="list-label">Acciones</div>
        <q-drawer-link icon="view_quilt" to="/catalogar/" exact>
          Catalogar
        </q-drawer-link>
        <hr>
        <div class="list-label">Listados</div>
        <q-drawer-link icon="view_quilt" to="/animales/" exact>
          Animales
        </q-drawer-link>
        <q-drawer-link icon="view_quilt" to="/casos/" exact>
          Casos
        </q-drawer-link>
        <hr>
        <div class="list-label">Usuario</div>
        <q-drawer-link icon="settings" to="/perfil/">
          Configurar
        </q-drawer-link>
        <div class="item item-link drawer-closer" @click="logOut()">
          <i class="item-primary">power_settings_new</i>
          <div class="item-content">
            Logout
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
