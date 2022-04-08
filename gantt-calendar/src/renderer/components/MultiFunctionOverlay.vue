<template>
    <div :class="['mfo', {'is-active': overlayActive}]">
      <button class="button" @click="toggleOverlay">Close</button>
      <overlay-create-event v-if="overlayContent === 'createEvent'"></overlay-create-event>
    </div>
</template>

<script>
import emitter from 'tiny-emitter/instance';
import OverlayCreateEvent from '../components/partials/overlayCreateEvent.vue';


export default {
  name: 'MultiFunctionOverlay',
  data() {
    return {
      overlayActive: false,
      overlayContent: 'none',
    };
  },
  components: {
    OverlayCreateEvent,
  },
  methods: {
    toggleOverlay() {
      this.overlayActive = !this.overlayActive;
    },
    toggleCreateEvent() {
      console.log('triggered') // eslint-disable-line
      this.overlayContent = 'createEvent';
      this.toggleOverlay();
    },
    async toggleEventView(id) {
      console.log(id) // eslint-disable-line
      await this.$gapi.login();
      const gapi = await this.$api.getGapiClient();

      const res = await gapi.calendar.events.get({
        calendarId: 'primary',
        // Event identifier.
        eventId: id,
      });

      console.log(res) // eslint-disable-line
    },
  },
  beforeMount() {
    emitter.on('createEvent', () => {
      this.toggleCreateEvent();
    });
    emitter.on('viewEvent', (id) => {
      this.toggleEventView(id);
    });
  },
};
</script>

<style lang="scss">
    .mfo{
      position: absolute;
      top:0;
      right: calc(-40% - 15px);
      width:40%;
      height:100%;
      background-color:var(--white);
      z-index:1000;
      box-shadow: -9px -1px 5px 0px rgba(0,0,0,0.15);
      transition: right .13s ease;
      box-sizing: border-box;
      padding:1rem 2rem;



      &::after {
        position:absolute;
        content: '';
        z-index:999;
        width:300%;
        left:-300%;
        height:0;
        backdrop-filter: blur(0px);
        background-color:rgba(0,0,0,0);
        transition: backdrop-filter .13s .13s ease, background-color .13s .13s ease, height 0s .26s ease;
      }

      &.is-active {
        right:0;
        transition: right .13s .13s ease;

        &::after{
          height:100%;
          backdrop-filter: blur(2px);
          background-color:rgba(0,0,0,0.05);
          transition: backdrop-filter .13s ease, background-color .13s ease;
        }
      }
    }
</style>