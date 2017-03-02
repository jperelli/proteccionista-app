// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import vueFilter from 'vue-filter'
import router from './router'
import config from './config'
import axios from 'axios'
import store from './store'

Vue.use(Quasar) // Install Quasar Framework
Vue.use(vueFilter)

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
