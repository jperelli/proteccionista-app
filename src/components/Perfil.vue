<template>
  <div class="layout-view">
    <div class="layout-padding">
      <p class="caption">
          Grupos a administrar
      </p>
      <div class="list">
        <div class="item" v-for="(group, index) in fb_groups">
          <img class="item-primary thumbnail" :src="group.picture.data.url">
          <div class="item-content has-secondary">{{group.name}}</div>
          <div class="item-secondary">
            <i slot="target">
              more_vert
              <q-popover ref="popover">
                <div class="list">
                  <div class="item item-link" v-on:click="removeGroup(group);$refs.popover[index].close()">
                    <div class="item-content has-secondary">Remove</div>
                    <div class="item-secondary"><i>delete_forever</i></div>
                  </div>
                  <div class="item item-link" v-on:click="gotoGroup(group);$refs.popover[index].close()">
                    <div class="item-content has-secondary">Open</div>
                    <div class="item-secondary"><i>open_in_new</i></div>
                  </div>
                </div>
              </q-popover>
            </i>
          </div>
        </div>
        <label class="item">
          <div class="item-primary">
            <button class="primary circular small" v-on:click="$refs.groupSearchModal.open()">
              <i>add</i>
            </button>
          </div>
          <div class="item-content">
            Agregar nuevo grupo
          </div>
        </label>
      </div>
      <q-modal
        ref="groupSearchModal"
        :content-css="{minWidth: '80vw', minHeight: '80vh'}"
      >
        <q-layout>
          <div slot="header" class="toolbar">
            <button @click="$refs.groupSearchModal.close()">
              <i>close</i>
            </button>
            <q-toolbar-title :padding="1">
              Agregar un grupo de facebook
            </q-toolbar-title>
          </div>
          <div slot="header" class="toolbar primary">
            <q-search class="primary" v-model="search">
            </q-search>
          </div>
          <div class="layout-view">
            <div class="list">
              <div class="item item-link" v-for="group in groups" v-on:click="addGroup(group)">
                <img class="item-primary thumbnail" :src="group.picture.data.url">
                <div class="item-content has-secondary">{{group.name}}</div>
                <div class="item-secondary" style="width:100px">
                  <button class="primary small circular"><i>add</i></button>
                  <button class="white small"><i>open_in_new</i></button>
                </div>
              </div>
            </div>
          </div>
        </q-layout>
      </q-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog, Loading } from 'quasar'

export default {
  data () {
    return {
      search: '',
      groups: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'fb_groups'
    ])
  },
  methods: {
    addGroup: function (group) {
      Loading.show({ delay: 0, message: 'Guardando grupo en tu perfil' })
      this.$store.dispatch('user_groupid_add', group.id)
        .then(Loading.hide)
        .catch((error) => {
          Dialog.create({
            title: 'Error',
            message: 'No se pudo guardar <hr>' + error
          })
          Loading.hide()
        })
    },
    gotoGroup: function (group) {
      window.open('http://www.facebook.com/groups/' + group.id + '/', '_blank')
    },
    removeGroup: function (group) {
      Loading.show({ delay: 0, message: 'Eliminando grupo de tu perfil' })
      this.$store.dispatch('user_groupid_rm', group.id)
        .then(Loading.hide)
        .catch((error) => {
          Dialog.create({
            title: 'Error',
            message: 'No se pudo eliminar <hr>' + error
          })
          Loading.hide()
        })
    }
  },
  watch: {
    'search': function (n, o) {
      this.loadingSearch = true
      this.groups = []
      window.FB.api(
        '/search',
        {
          q: n,
          type: 'group',
          fields: 'id,name,picture{url}'
        },
        (response) => {
          if (!response || response.error) {
            // alert('Error occured')
          }
          else {
            this.groups = response.data
          }
        }
      )
    }
  }
}
</script>
