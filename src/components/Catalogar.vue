<template>
  <div class="layout-view">
    <div class="layout-padding">
      <p class="caption">
        Grupos a administrar
      </p>
      <q-select
        type="radio"
        v-model="selectedGroup"
        :options="selectOptions"
      ></q-select>
      <div>
        <div v-for="p in posts" class="card" style="max-width: 500px;">
          <div class="card-title">
            {{getType(p)}}
            <a class="pull-right" :href="p.permalink_url" target="_blank"><i>open_in_new</i></a>
          </div>
          <div class="card-content">
            <div class="card-img" :style="{ 'background-image': 'url(' + getPicture(p) + ')' }"></div>
            {{getDescription(p)}}
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedGroup: null,
      posts: []
    }
  },
  computed: {
    selectOptions: function () {
      return this.$store.state.perfil.fb_groups.map(g => ({ label: g.name, value: g.id }))
    }
  },
  methods: {
    getPicture: function (p) {
      var pic = ''
      if (p.attachments && p.attachments.data[0].subattachments && p.attachments.data[0].subattachments.data[0].media) {
        pic = p.attachments.data[0].subattachments.data[0].media.image.src
      }
      if (p.attachments && p.attachments.data[0].media && p.attachments.data[0].media.image && p.attachments.data[0].media.image.src) {
        pic = p.attachments.data[0].media.image.src
      }
      if (p.picture) {
        pic = p.picture
      }
      return pic
    },
    getDescription: function (p) {
      var des = []
      if (p.attachments && p.attachments.data[0].description) {
        des.push(p.attachments.data[0].description)
      }
      if (p.message) {
        des.push(p.message)
      }
      return des.join('<hr>')
    },
    getType: function (p) {
      var ret = p.type
      if (p.attachments && p.attachments.data[0].type) {
        ret += ' > '
        ret += p.attachments.data[0].type
      }
      return ret
    }
  },
  watch: {
    selectedGroup: function (n, o) {
      window.FB.api(
        '/' + n + '/feed',
        {
          fields: 'attachments{description,media,type,subattachments},description,picture,place,coordinates,message,type,permalink_url'
        },
        (response) => {
          if (!response || response.error) {
            // alert('Error occured')
          }
          else {
            this.posts = response.data
            // ?fields=attachments{description,media},description,picture,place,coordinates,message,type,permalink_url
          }
        }
      )
    }
  }
}
</script>

<style>
.card-content .card-img {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 200px;
  width: 200px;
  margin: auto;
}
</style>