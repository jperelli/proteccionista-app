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
              <carousel :per-page="1">
                <slide v-for="i in c.images">
                  <div class="card-img" :style="{ 'background-image': 'url(' + i + ')' }"></div>
                </slide>
              </carousel>
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

.card-content .card-img {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 200px;
  background-color: #fcfcfc;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.VueCarousel-pagination {
  margin-top: -50px;
}
.VueCarousel-wrapper {
  z-index: -1;
}
.VueCarousel-dot-inner {
  border: 1px solid rgba(255,255,255,0.8);
  opacity: 0.8;
}
</style>
