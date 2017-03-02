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

export default {
  data () {
    return {
      animals: []
    }
  },
  created: function () {
    axios.get('/animals')
      .then((response) => {
        this.animals = response.data
      })
      .catch((e) => {
        console.log('[1] ' + e)
      })
  }
}
</script>
