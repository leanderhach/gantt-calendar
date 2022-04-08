<template>
  <div id="app">
    <sidebar-menu id="menu"></sidebar-menu>
    <router-view id="content"></router-view>
    {{ error }}
  </div>
</template>

<script>
import sidebarMenu from '@/components/partials/sidebarMenu.vue';
import listUpcomingEvents from './utils/listUpcomingEvents';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

export default {
  name: 'gantt-calendar',
  components: {
    sidebarMenu,
  },

  data() {
    return {
      error: '',
      events: [],
    };
  },
  methods: {
    async login() {
      console.log('logging in');
      await this.$gapi.login();

      console.log('gapi login');
      const gapi = await this.$gapi.getGapiClient();

      console.log(gapi);
      await listUpcomingEvents(gapi);
    },
  },
  async mounted() {
    await this.login();
  },
};
</script>

<style lang="scss">
@import './assets/styles/main.scss';
  /* CSS */
  #app{
    min-height:100%;
    display:flex;
    flex-direction: row;
  }
  #content{
    width:95%;
  }
</style>
