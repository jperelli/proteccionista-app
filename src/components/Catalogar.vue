<template>
  <div class="layout-view">
    <div class="layout-padding">
      <q-select
        type="radio"
        v-model="selectedGroup"
        :options="selectOptions"
        @input="load_posts"
      ></q-select>
      <q-datetime
        v-model="date"
        type="date"
        @input="load_posts"
      ></q-datetime>
      <div>
        <div v-for="p in posts" v-if="!fbcase(p)" class="card">
          <div class="card-title">
            {{getType(p)}}
            <div style="color:gray;font-size:0.7em">{{p.created_time | date}}</div>
            <a class="pull-right" :href="p.permalink_url" target="_blank"><i>open_in_new</i></a>
            <a class="pull-right" :href="'https://developers.facebook.com/tools/explorer/?method=GET&path='+p.id+'%3Ffields%3Dattachments{description,media,url,title,type,subattachments,description_tags},caption,child_attachments,coordinates,created_time,description,expanded_height,full_picture,height,icon,id,link,message,message_tags,multi_share_end_card,multi_share_optimized,name,object_id,parent_id,picture,place,privacy,properties,shares,status_type,story,story_tags,timeline_visibility,type,updated_time,via,width,permalink_url,sharedposts'" target="_blank"><i>bug_report</i></a>
          </div>
          <div class="card-content">
            <div class="row gutter">
              <div v-bind:class="{ 'width-1of2': p.create_case, 'width-1of1': !p.create_case}">
                <div v-for="p in getPictures(p)" class="card-img" :style="{ 'background-image': 'url(' + p + ')' }"></div>
                <div v-for="d in getDescriptions(p)">
                  {{d}}
                </div>
                <div class="card-actions">
                  <button class="positive clear small" @click="action_create(p)"><i class="on-left">done</i> Crear caso</button>
                  <button class="warning clear small" @click="action_merge(p)"><i class="on-left">merge_type</i> Fusionar casos</button>
                  <button class="negative clear small" @click="action_delete(p)"><i class="on-left">delete</i> Descartar</button>
                </div>
              </div>
              <div v-if="p.create_case" class="card shadow-2 create-case" v-bind:class="{ 'width-1of2': p.create_case }">
                <div class="card-title">
                  Crear caso
                </div>
                <div class="card-content">
                  <div class="row wrap justify-between">
                    <label>
                      <q-checkbox v-model="p.form.issues.Encontrado"></q-checkbox>
                      Encontrado
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues.Perdido"></q-checkbox>
                      Perdido
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues.Traslado"></q-checkbox>
                      Traslado
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues.Tránsito"></q-checkbox>
                      Tránsito
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues.Adopción"></q-checkbox>
                      Adopción
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues['Colaboración Económica']"></q-checkbox>
                      Colaboración Económica
                    </label>
                    <label>
                      <q-checkbox v-model="p.form.issues.Tratamiento"></q-checkbox>
                      Tratamiento
                    </label>
                  </div>

                  <div>
                    <q-datetime
                      v-model="p.form.date"
                      type="date"
                      label="Fecha"
                    ></q-datetime>
                  </div>

                  <div class="floating-label">
                    <input v-model="p.form.title" required class="full-width">
                    <label>Título</label>
                  </div>
                  <div class="floating-label">
                    <textarea v-model="p.form.description" required class="full-width" style="min-height:200px"></textarea>
                    <label>Descripción</label>
                  </div>
                  <v-map :zoom=13 :center="initialLocation" @l-click="mapClick($event, p)">
                    <v-icondefault :image-path="'/statics/leafletImages/'"></v-icondefault>
                    <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                    <v-marker :lat-lng="markerLocation" :draggable="true" v-on:l-dragend="dragend($event, p)"></v-marker>
                  </v-map>
                  <div>
                    Datos del animal
                    <div class="floating-label">
                      <input v-model="p.form.animal.name" required class="full-width">
                      <label>Nombre</label>
                    </div>
                    <q-autocomplete v-model="p.form.animal.type" :delay="300" @search="searchType">
                      <div class="floating-label">
                        <input v-model="p.form.animal.type" required class="full-width">
                        <label>Tipo</label>
                      </div>
                    </q-autocomplete>
                    <q-autocomplete v-model="p.form.animal.color" :delay="300" @search="searchColor">
                      <div class="floating-label">
                        <input v-model="p.form.animal.color" required class="full-width">
                        <label>Color</label>
                      </div>
                    </q-autocomplete>
                    <div class="floating-label">
                      <input v-model="p.form.animal.owner" required class="full-width">
                      <label>Contacto (humano)</label>
                    </div>
                    <q-autocomplete v-model="p.form.animal.race" :delay="300" @search="searchRace">
                      <div class="floating-label">
                        <input v-model="p.form.animal.race" required class="full-width">
                        <label>Raza</label>
                      </div>
                    </q-autocomplete>
                    <div>
                      <q-select
                        label="Tamaño"
                        type="list"
                        v-model="p.form.animal.size"
                        :options="[{label:'Chico',value:'Chico'},{label:'Mediano',value:'Mediano'},{label:'Grande',value:'Grande'}]"
                      ></q-select>
                    </div>
                    <div>
                      <q-select
                        label="Sexo"
                        type="list"
                        v-model="p.form.animal.sex"
                        :options="[{label:'Hembra',value:'Hembra'},{label:'Macho',value:'Macho'}]"
                      ></q-select>
                    </div>
                    <div>
                      <q-select
                        label="Edad"
                        type="list"
                        v-model="p.form.animal.age"
                        :options="[{label:'Cachorro',value:'Cachorro'},{label:'Adulto',value:'Adulto'},{label:'Anciano',value:'Anciano'}]"
                      ></q-select>
                    </div>
                  </div>
                  <div class="card-actions">
                    <button class="positive clear small" @click="action_new_case(p)"><i class="on-left">done</i> Guardar caso</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Dialog, Loading } from 'quasar'

function leaflet2geojsonPoint (p) {
  return {
    type: 'Point',
    coordinates: [p.lat, p.lng]
  }
}

export default {
  data () {
    return {
      selectedGroup: null,
      posts: [],
      date: new Date().toISOString(),
      fbcases: [],
      initialLocation: window.L.latLng(-34.9205, -57.953646),
      markerLocation: window.L.latLng(-34.9205, -57.953646)
    }
  },
  computed: {
    selectOptions: function () {
      return this.$store.state.perfil.fb_groups.map(g => ({ label: g.name, value: g.id }))
    }
  },
  methods: {
    load_posts: function () {
      var since = this.date.split('T')[0]
      var until = new Date(this.date.split('T')[0])
      until.setDate(until.getDate() + 1)
      until = until.toISOString().split('T')[0]
      window.FB.api(
        '/' + this.selectedGroup + '/feed',
        {
          fields: 'attachments{description,media,type,subattachments,url,id},description,picture,message,type,permalink_url,from,created_time,place{location{latitude,longitude}}',
          since: since,
          until: until
          // limit: 100
        },
        (response) => {
          if (!response || response.error) {
            // alert('Error occured')
          }
          else {
            this.posts = response.data.map(p => Object.assign({}, p, {
              form: {
                fbcase: {id_facebook: p.id},
                date: p.created_time,
                title: '',
                description: this.getDescriptions(p).join('\n'),
                location: leaflet2geojsonPoint(this.initialLocation),
                images: this.getPictures(p),
                issues: {
                  'Encontrado': false,
                  'Perdido': false,
                  'Traslado': false,
                  'Tránsito': false,
                  'Adopción': false,
                  'Colaboración Económica': false,
                  'Tratamiento': false
                },
                animal: {
                  name: '',
                  type: '',
                  color: '',
                  owner: '',
                  race: '',
                  size: '',
                  sex: '',
                  age: ''
                }
              }
            }))
            // ?fields=attachments{description,media},description,picture,place,coordinates,message,type,permalink_url
          }
        }
      )
      axios.get('/fbcases?id_group=' + this.selectedGroup)
        .then((response) => {
          this.fbcases = response.data
        })
        .catch((e) => {
          console.log('[1] ' + e)
        })
    },
    dragend: function (event, p) {
      p.form.location = leaflet2geojsonPoint(event.target._latlng)
    },
    mapClick: function (event, p) {
      p.form.location = leaflet2geojsonPoint(event.latlng)
      this.markerLocation = event.latlng
    },
    searchType: function (terms, done) {
      axios.get('/animals/searchTerms?type=' + terms)
        .then((response) => {
          done(response.data.map(t => ({value: t, label: t})))
        })
        .catch((e) => {
          console.log('[1] ' + e)
        })
    },
    searchColor: function (terms, done) {
      axios.get('/animals/searchTerms?color=' + terms)
        .then((response) => {
          done(response.data.map(t => ({value: t, label: t})))
        })
        .catch((e) => {
          console.log('[1] ' + e)
        })
    },
    searchRace: function (terms, done) {
      axios.get('/animals/searchTerms?race=' + terms)
        .then((response) => {
          done(response.data.map(t => ({value: t, label: t})))
        })
        .catch((e) => {
          console.log('[1] ' + e)
        })
    },
    fbcase: function (p) {
      var i = this.fbcases.findIndex(obj => obj.id_facebook === p.id)
      if (i !== -1) {
        return this.fbcases[i]
      }
      else {
        return null
      }
    },
    is_deleted: function (p) {
      return this.fbcases.findIndex(obj => obj.id_facebook === p.id) !== -1
    },
    action_create: function (p) {
      this.$set(p, 'create_case', !p.create_case)
    },
    action_merge: function (p) {
      Dialog.create({
        title: 'No implementado',
        message: 'todavia no esta implementado'
      })
    },
    action_delete: function (p) {
      Loading.show({ delay: 0, message: 'Eliminando caso' })
      axios.post('/fbcases', { id_facebook: p.id })
        .then((response) => {
          axios.get('/fbcases?id_group=' + this.selectedGroup)
            .then((response) => {
              this.fbcases = response.data
              Loading.hide()
            })
            .catch((e) => {
              Dialog.create({
                title: 'Error',
                message: 'No pude eliminar el caso [2]<hr>' + e
              })
              Loading.hide()
            })
        })
        .catch((e) => {
          Dialog.create({
            title: 'Error',
            message: 'No pude eliminar el caso [1]<hr>' + e
          })
          Loading.hide()
        })
    },
    action_new_case: function (p) {
      Loading.show({ delay: 0, message: 'Creando caso' })
      axios.post('/cases', p.form)
        .then((response) => {
          axios.get('/fbcases?id_group=' + this.selectedGroup)
            .then((response) => {
              this.fbcases = response.data
              Loading.hide()
            })
            .catch((e) => {
              Dialog.create({
                title: 'Error',
                message: 'No pude crear el caso [2]<hr>' + e
              })
              Loading.hide()
            })
        })
        .catch((e) => {
          Dialog.create({
            title: 'Error',
            message: 'No pude crear el caso [1]<hr>' + e
          })
          Loading.hide()
        })
    },
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
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
.map-container {
  height: 250px
}

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

.card-content > .row {
  position: relative;
}
.card-content > .row > .create-case {
  position: absolute;
  height: 100%;
  width: 50%;
  right: 0;
  overflow-y: visible;
}
</style>