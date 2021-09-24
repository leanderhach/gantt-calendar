<template>
  <div id="app">
    <sidebar-menu id="menu"></sidebar-menu>
    <router-view id="content"></router-view>
  </div>
</template>

<script>
import sidebarMenu from '@/components/partials/sidebarMenu.vue';

export default {
  name: 'gantt-calendar',
  components: {
    sidebarMenu,
  },
};
</script>

<style lang="scss">
  /* CSS */
  #app{
    min-height:100%;
    display:flex;
    flex-direction: row;
  }
  #content{
    width:80%;
  }
</style>
