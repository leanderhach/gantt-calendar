<template>
  <div id="app">
    <sidebar-menu id="menu"></sidebar-menu>
    <router-view id="content"></router-view>
    {{ error }}
  </div>
</template>

<script>
import sidebarMenu from '@/components/partials/sidebarMenu.vue';
import store from './store';

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
      await this.$gapi.login();
      await this.listUpcomingEvents();
    },
    async listUpcomingEvents() {
      const gapi = await this.$gapi.getGapiClient();

      gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime',
      }).then((response) => {
        const events = response.result.items;

        if (events.length > 0) {
          for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            let when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            store.dispatch('setCalendarEvents', event);
          }
        }
      });
    },
  },
  async mounted() {
    await this.login();
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
    width:95%;
  }
</style>
