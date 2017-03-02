<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div class="row gutter wrap justify-around content-center">
        <div v-for="c in cases" class="card lg-width-1of3 bg-width-1of2">
          <div class="card-title">
            {{c.title}}
          </div>
          <div class="card-content">
            <div>
              <q-gallery-slider :src="c.images"></q-gallery-slider>
              {{c.description}}
            </div>
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
      cases: []
    }
  },
  created: function () {
    axios.get('/cases')
      .then((response) => {
        this.cases = response.data
      })
      .catch((e) => {
        console.log('[1] ' + e)
      })
  }
}
</script>

<style>
.card-content .q-gallery-slider img {
  height: 200px;
  width: auto;
}
</style>
