import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/src/plugins/logger'

import perfil from './modules/perfil'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    perfil
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

