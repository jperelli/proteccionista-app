import axios from 'axios'

// initial state
// shape: [{ id, quantity }]
const state = {
  user: null,
  fb_groups: []
}

// getters
const getters = {
  user: state => state.user,
  fb_groups: state => state.fb_groups
}

// actions
const actions = {
  fblogin ({ dispatch, commit, state }) {
    commit('fblogin_request')
    return new Promise((resolve, reject) => {
      window.FB.login((response) => {
        if (response.status === 'connected') {
          axios.get(
            '/profile/jwt',
            {
              headers: {
                'Authorization': 'FB ' + response.authResponse.accessToken
              }
            }
          )
          .then(function (response) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.jwt
            commit('user_receive', response.data.user)
            dispatch('user_group_update_from_fb').then(resolve).catch(reject)
          })
          .catch((e) => {
            reject('[2] ' + e)
          })
        }
        else {
          reject('[1] ' + response.status)
        }
      }, {scope: 'public_profile,user_managed_groups,email'})
    })
  },
  logout ({ dispatch, commit, state }) {
    window.FB.logout((response) => {
      commit('logout')
    })
  },
  user_group_update_from_fb ({ dispatch, commit, state }) {
    return new Promise((resolve, reject) => {
      window.FB.api(
        '/',
        {
          ids: state.user.fb_groups.join(','),
          fields: 'id,name,picture{url}'
        },
        (response) => {
          if (!response || response.error) {
            reject('[3] ' + response.status)
          }
          else {
            commit('user_fb_groups_receive', response)
            resolve()
          }
        }
      )
    })
  },
  user_groupid_add ({ dispatch, commit, state }, groupid) {
    return new Promise((resolve, reject) => {
      axios.post('/profile/groups', { id: groupid })
        .then((response) => {
          commit('user_groupid_add', response.data)
          dispatch('user_group_update_from_fb').then(resolve).catch(reject)
        })
        .catch((e) => {
          reject('[1] ' + e)
        })
    })
  },
  user_groupid_rm ({ dispatch, commit, state }, groupid) {
    return new Promise((resolve, reject) => {
      axios.delete('/profile/groups/' + groupid)
        .then((response) => {
          commit('user_groupid_rm', groupid)
          resolve()
        })
        .catch((e) => {
          reject('[1] ' + e)
        })
    })
  }
}

// mutations
const mutations = {
  fblogin_request (state) {
    state.user = null
  },
  user_receive (state, user) {
    state.user = user
  },
  user_fb_groups_receive (state, response) {
    state.fb_groups = []
    for (var key in response) {
      state.fb_groups.push(response[key])
    }
  },
  user_groupid_add (state, groupid) {
    state.user.fb_groups.push(groupid)
  },
  user_groupid_rm (state, groupid) {
    const i1 = state.user.fb_groups.indexOf(groupid)
    if (i1 > -1) {
      state.user.fb_groups.splice(i1, 1)
    }

    const i2 = state.fb_groups.findIndex(obj => obj.id === groupid)
    if (i2 > -1) {
      state.fb_groups.splice(i2, 1)
    }
  },
  logout (state, response) {
    state.user = null
    state.fb_groups = []

    // delete jwt from memory
    delete axios.defaults.headers.common['Authorization']

    // delete fblo_* cookie that bothers later when trying to re-login
    // see http://stackoverflow.com/a/34853477/912450
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].split('=')[0].indexOf('fblo_') !== -1) {
        document.cookie = cookies[i].split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
