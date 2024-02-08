<template>
  <div id="app">
    <sidebar-menu id="menu"></sidebar-menu>
    <router-view id="content"></router-view>
    <loading-grid v-if="loading"></loading-grid>
  </div>
</template>

<script>
import sidebarMenu from '@/components/partials/sidebarMenu.vue';
import listUpcomingEvents from './utils/listUpcomingEvents';
import LoadingGrid from './components/partials/loadingGrid.vue';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

export default {
  name: 'gantt-calendar',
  components: {
    sidebarMenu,
    LoadingGrid,
  },

  data() {
    return {
      error: '',
      events: [],
      pollEvent: null,
      loading: true,
    };
  },
  methods: {
    async login() {
      await this.$gapi.login();

      // clear the calendar on starting for the first time
      this.$store.commit('clearCalendar');

      const gapi = await this.$gapi.getGapiClient();
      await listUpcomingEvents(gapi);
      this.loading = false;
    },
    pollCurrentEvents() {
      this.pollEvent = setInterval(() => {
        // this.$store.dispatch('POLL_CURRENT_EVENTS');
      }, 60000);
    },
  },
  async mounted() {
    // perform api login
    await this.login();

    console.log('ready!');
    this.loading = false;
    console.log(this.loading);
    // start background task to update time
    this.pollCurrentEvents();
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
