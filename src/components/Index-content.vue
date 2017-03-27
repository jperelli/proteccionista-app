<template>
  <div class="layout-view">
    <div class="layout-padding">

      <div class="row wrap justify-between gutter items-stretch">

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Encontrado">
            <img src="http://placehold.it/250x150?text=Encontrado">
          </router-link>
        </div>

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Perdido">
            <img src="http://placehold.it/250x150?text=Perdido">
          </router-link>
        </div>

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Traslado">
            <img src="http://placehold.it/250x150?text=Traslado">
          </router-link>
        </div>

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Tránsito">
            <img src="http://placehold.it/250x150?text=Tránsito">
          </router-link>
        </div>

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Adopción">
            <img src="http://placehold.it/250x150?text=Adoción">
          </router-link>
        </div>

        <div class="md-width-1of2 bg-width-1of2 lg-width-1of3">
          <router-link to="/casos/?issue.type=Colaboración Económica">
            <img src="http://placehold.it/250x150?text=Colaboración Económica">
          </router-link>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
