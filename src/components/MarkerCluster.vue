<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import 'leaflet.markercluster'

const props = {
  visible: {
    type: Boolean,
    custom: true,
    default: true
  }
}

export default {
  props: props,
  mounted () {
    this.mapObject = window.L.markerClusterGroup()

    if (this.$parent._isMounted) {
      this.deferredMountedTo(this.$parent.mapObject)
    }
  },
  beforeDestroy () {
    this.setVisible(false)
  },
  methods: {
    deferredMountedTo (parent) {
      this.parent = parent
      var that = this.mapObject
      this.$children.forEach((child) => {
        child.deferredMountedTo(that)
      })
      if (this.visible) {
        this.mapObject.addTo(parent)
      }
    },
    setVisible (newVal, oldVal) {
      if (newVal === oldVal) return
      if (this.mapObject) {
        if (newVal) {
          this.mapObject.addTo(this.parent)
        }
        else {
          this.parent.removeLayer(this.mapObject)
        }
      }
    }
  }
}
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
