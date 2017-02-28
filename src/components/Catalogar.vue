<template>
  <div class="layout-view">
    <div class="layout-padding">
      <q-select
        type="radio"
        v-model="selectedGroup"
        :options="selectOptions"
      ></q-select>
      <q-datetime
        v-model="date"
        type="date"
      ></q-datetime>
      <div>
        <div v-for="p in posts" class="card">
          <div class="card-title">
            {{getType(p)}}
            <a class="pull-right" :href="p.permalink_url" target="_blank"><i>open_in_new</i></a>
            <a class="pull-right" :href="'https://developers.facebook.com/tools/explorer/?method=GET&path='+p.id+'%3Ffields%3Dattachments{description,media,url,title,type,subattachments,description_tags},caption,child_attachments,coordinates,created_time,description,expanded_height,full_picture,height,icon,id,link,message,message_tags,multi_share_end_card,multi_share_optimized,name,object_id,parent_id,picture,place,privacy,properties,shares,status_type,story,story_tags,timeline_visibility,type,updated_time,via,width,permalink_url,sharedposts'" target="_blank"><i>bug_report</i></a>
          </div>
          <div class="card-content">
            <div v-for="p in getPictures(p)" class="card-img" :style="{ 'background-image': 'url(' + p + ')' }"></div>
            <div v-for="d in getDescriptions(p)">
              {{d}}
            </div>
            <div class="card-actions">
              <button class="positive clear small"><i class="on-left">done</i> Crear caso</button>
              <button class="warning clear small"><i class="on-left">merge_type</i> Fusionar casos</button>
              <button class="negative clear small"><i class="on-left">delete</i> Descartar</button>
            </div>
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
      posts: [],
      date: new Date().toISOString()
    }
  },
  computed: {
    selectOptions: function () {
      return this.$store.state.perfil.fb_groups.map(g => ({ label: g.name, value: g.id }))
    }
  },
  methods: {
    getPictures: function (p) {
      var pic = []
      if (p.attachments) {
        for (var i = 0; i < p.attachments.data.length; i++) {
          if (p.attachments.data[i].media && p.attachments.data[i].media.image && p.attachments.data[i].media.image.src) {
            pic.push(p.attachments.data[i].media.image.src)
          }
          if (p.attachments.data[i].subattachments) {
            for (var j = 0; j < p.attachments.data[i].subattachments.data.length; j++) {
              if (p.attachments.data[i].subattachments.data[j].media && p.attachments.data[i].subattachments.data[j].media.image && p.attachments.data[i].subattachments.data[j].media.image.src) {
                pic.push(p.attachments.data[i].subattachments.data[j].media.image.src)
              }
            }
          }
        }
      }
      if (pic.length === 0 && p.picture) {
        pic.push(p.picture)
      }
      return pic
    },
    getDescriptions: function (p) {
      var des = []
      if (p.attachments) {
        for (var i = 0; i < p.attachments.data.length; i++) {
          if (p.attachments.data[i].description && des.indexOf(p.attachments.data[i].description) === -1) {
            des.push(p.attachments.data[i].description)
          }
          if (p.attachments.data[i].subattachments) {
            for (var j = 0; j < p.attachments.data[i].subattachments.data.length; j++) {
              if (p.attachments.data[i].subattachments.data[j].description && des.indexOf(p.attachments.data[i].subattachments.data[j].description) === -1) {
                des.push(p.attachments.data[i].subattachments.data[j].description)
              }
            }
          }
        }
      }
      if (p.message && des.indexOf(p.message) === -1) {
        des.push(p.message)
      }
      if (p.description && des.indexOf(p.description) === -1) {
        des.push(p.description)
      }
      return des
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
      var since = this.date.split('T')[0]
      var until = new Date(this.date.split('T')[0])
      until.setDate(until.getDate() + 1)
      until = until.toISOString().split('T')[0]
      window.FB.api(
        '/' + n + '/feed',
        {
          fields: 'attachments{description,media,type,subattachments,url,id},description,picture,place,coordinates,message,type,permalink_url,parent_id,from',
          since: since,
          until: until
          // limit: 100
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
  display: inline-block;
  margin: 5px;
  background-color: #fcfcfc;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.card-actions {
  padding: 13px 0 0 0;
  margin-top: 13px;
  border-top: 1px solid lightgray;
}
</style>