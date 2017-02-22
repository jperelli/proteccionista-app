<template>
  <div class="layout-padding">
    <p class="caption">
        Usuario {{getUser().name}}
    </p> 
    <p class="caption">
        Seleccione páginas a administrar con proteccionista
    </p> 
    <div class="list">
      <label class="item" v-for="page in getUser().pages">
        <div class="item-primary">
          <q-checkbox v-model="pages[page.id]"></q-checkbox>
        </div>
        <div class="item-content">
          {{page.name}}
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import store from '../store'

store.state.perfil = {
  message: 'holaaaa',
  pages: []
}

export default {
  data () {
    return store.state.perfil
  },
  methods: {
    getUser: function () {
      return store.state.index.user ? store.state.index.user : {}
    },
    changeName: function () {
      store.state.index.user.name = 'pedo'
    }
  }
}
</script>
