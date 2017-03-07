<template>
  <div class="layout-view">
    <v-map :zoom=10 :center="initialLocation">
      <v-icondefault :image-path="'/statics/leafletImages/'"></v-icondefault>
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker-cluster>
        <v-marker v-for="c in cases" v-if="c.location !== null" :lat-lng="geojsonPoint2leaflet(c.location)">
          <v-popup :content="tooltipContent(c)"></v-popup>
        </v-marker>
      </v-marker-cluster>
    </v-map>
  </div>
</template>

<script>
import axios from 'axios'
import MarkerCluster from './MarkerCluster'
import { Dialog, Loading } from 'quasar'

export default {
  components: {
    'v-marker-cluster': MarkerCluster
  },
  data () {
    return {
      cases: [],
      initialLocation: window.L.latLng(-34.9205, -57.953646)
    }
  },
  methods: {
    geojsonPoint2leaflet: function (p) {
      return window.L.latLng(p.coordinates[0], p.coordinates[1])
    },
    tooltipContent: function (c) {
      var content = '<span>' + c.description + '</span>'
      if (c.images.length > 0) {
        content = '<img style="max-height:100px;max-width:100px;float:left;margin: 2px 10px 10px 0" src="' + c.images[0] + '">' + content
      }
      return content
    }
  },
  created: function () {
    Loading.show({ delay: 0, message: 'Cargando Casos' })
    axios.get('/cases?page=all')
      .then((response) => {
        this.cases = response.data
        Loading.hide()
      })
      .catch((e) => {
        Loading.hide()
        Dialog.create({
          title: 'Error',
          message: 'No pude recuperar los casos <hr>' + e
        })
      })
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
.map-container {
  height: 100%
}
</style>
