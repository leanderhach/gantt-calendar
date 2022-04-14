<template>
    <div :class="['mfo-container', {'is-active': overlayActive}]" @click.self="toggleOverlay">
      <div class="mfo" :style="`width:${displayWidth}%`">
        <div class="mfo__header">
          <button class="button" @click.prevent="toggleOverlay"><font-awesome-icon icon="times"></font-awesome-icon></button>
        </div>
        <overlay-create-event v-if="overlayContent === 'createEvent'" v-on:close:modal="toggleOverlay"></overlay-create-event>
        <overlay-view-event v-if="overlayContent === 'viewEvent'" :eventId="currentEvent" v-on:close:modal="toggleOverlay"></overlay-view-event>
      </div>
    </div>
</template>

<script>
import emitter from 'tiny-emitter/instance';
import OverlayCreateEvent from '../components/partials/overlayCreateEvent.vue';
import OverlayViewEvent from '../components/partials/overlayViewEvent.vue';

export default {
  name: 'MultiFunctionOverlay',
  data() {
    return {
      overlayActive: false,
      overlayContent: 'none',
      currentEvent: null,
      focusedDate: '',
      displayWidth: 40,
    };
  },
  components: {
    OverlayCreateEvent,
    OverlayViewEvent,
  },
  methods: {
    toggleOverlay() {
      if (this.overlayActive) {
        this.displayWidth = 40;
      }

      this.overlayActive = !this.overlayActive;
    },
    toggleCreateEvent() {
      console.log('triggered') // eslint-disable-line
      this.overlayContent = 'createEvent';
      this.toggleOverlay();
    },
    toggleEventView(id) {
      this.currentEvent = id;
      this.overlayContent = 'viewEvent';
      this.toggleOverlay();
    },
    toggleDayView(day) {
      this.focusedDate = day;
      this.overlayContent = 'viewDay';
      this.displayWidth = 90;
      this.toggleOverlay();
    },
  },
  beforeMount() {
    emitter.on('createEvent', () => {
      this.toggleCreateEvent();
    });
    emitter.on('viewEvent', (id) => {
      this.toggleEventView(id);
    });
    emitter.on('viewDay', (day) => {
      this.toggleDayView(day);
    });
  },
};
</script>

<style lang="scss">
    .mfo-container{
      position:absolute;
      height:100%;
      width:1px;
      top:0;
      right:0;
      backdrop-filter: blur(0px);
      transition: backdrop-filter .13s, width 0s .13s;


      .mfo{
        position: absolute;
        top:0;
        right: -1000px;
        width:40%;
        margin:5% 0 5% 0;
        height:90%;
        background-color:var(--white);
        z-index:1000;
        box-shadow: 6px 5px 43px 12px rgba(160,160,160,0.8);
        transition: right .13s ease;
        box-sizing: border-box;
        padding:4rem;
        min-width:508px;

        .mfo__header{
          width:100%;
          display:flex;
          flex-direction: row;
          justify-content: flex-end;
          margin-bottom:4rem;

          .button {
            border:none;
            font-size:1.5rem;
          }
        }
      }

      &.is-active{
        width:100%;
        backdrop-filter: blur(2px);

        .mfo {
          right:5%;
          transition: right .13s .13s ease;
        }
      }
    }
</style>