// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import Vue2Leaflet from 'vue2-leaflet'
import VueFilter from 'vue-filter'
import VueCarousel from 'vue-carousel'

import router from './router'
import config from './config'
import axios from 'axios'
import store from './store'

Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueFilter)
Vue.use(VueCarousel)

Vue.component('v-map', Vue2Leaflet.Map)
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer)
Vue.component('v-marker', Vue2Leaflet.Marker)
Vue.component('v-poly', Vue2Leaflet.Polyline)
Vue.component('v-group', Vue2Leaflet.LayerGroup)
Vue.component('v-tooltip', Vue2Leaflet.Tooltip)
Vue.component('v-popup', Vue2Leaflet.Popup)
Vue.component('v-icondefault', Vue2Leaflet.IconDefault)
Vue.component('v-circle', Vue2Leaflet.LCircle)

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App')),
    created: () => {
      axios.defaults.baseURL = config.api
      axios.defaults.headers.common['Content-Type'] = 'application/json'
    }
  })
})
