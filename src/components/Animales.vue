<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div>
        <div v-for="a in animals" class="card">
          <div class="card-title">
            {{a.name}}
          </div>
          <div class="card-content">
            <div>tipo: {{a.type}}</div>
            <div>color: {{a.color}}</div>
            <div>dueño: {{a.owner}}</div>
            <div>raza: {{a.race}}</div>
            <div>tamaño: {{a.size}}</div>
            <div>sexo: {{a.sex}}</div>
            <div>edad: {{a.age}}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Loading } from 'quasar'

export default {
  data () {
    return {
      animals: [],
      page: 1
    }
  },
  created: function () {
    Loading.show({ delay: 0, message: 'Cargando Animales' })
    axios.get('/animals?page=' + this.page)
      .then((response) => {
        this.animals = response.data
        Loading.hide()
      })
      .catch((e) => {
        Dialog.create({
          title: 'Error',
          message: 'Could not login <hr>' + e
        })
        Loading.hide()
      })
  }
}
</script>
