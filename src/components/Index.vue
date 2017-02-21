<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        Proteccionista {{user.name}}
      </q-toolbar-title>
      <button @click="FBLogin()">
        <i>account_circle</i>
      </button>
    </div>

    <router-view class="layout-view"></router-view>

  </q-layout>
</template>

<script>
import { Dialog } from 'quasar'
import axios from 'axios'
import config from '../config'

export default {
  data () {
    return {
      search: '',
      user: {
        name: 'loading'
      }
    }
  },
  methods: {
    FBLogin () {
      var that = this
      window.FB.login(function (response) {
        console.log(response)
        if (response.status === 'connected') {
          axios.get(
            config.api + 'profile/jwt',
            {
              headers: {
                'Authorization': 'FB ' + response.authResponse.accessToken
              }
            }
          )
          .then(function (response) {
            axios.get(config.api + 'profile/', { headers: { Authorization: 'Bearer ' + response.data.jwt } }).then(function (response) {
              that.user = response.data
            })
            .catch(function (error) {
              Dialog.create({
                title: 'Error',
                message: 'Could not retrieve profile. (3)<hr>' + error
              })
            })
          })
          .catch(function (error) {
            Dialog.create({
              title: 'Error',
              message: 'Could not connect via facebook. (2)<hr>' + error
            })
          })
        }
        else {
          Dialog.create({
            title: 'Error',
            message: 'Could not connect via facebook. (1)<hr>' + response.status
          })
        }
      }, {scope: 'public_profile,pages_show_list,email'})
    }
  }
}
</script>
