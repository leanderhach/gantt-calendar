<template>
  <div :class="['event-view', {'editing': isEditing}]">
    <h2 class="title">{{ event.summary }}</h2>
    <div class="row">
        <p class="text">{{ start }} -</p>
        <p class="text"> {{ end }}</p>
    </div>
    <p class="text" v-if="event.description">{{ event.description }}</p>
    <h4 class="title">Participants</h4>
    <div class="columns is-multiline">
      <div class="column is-one-fifth"> {{ event.organizer.email }}</div>
    </div>
    <a :href="event.htmlLink" class="link">View on Google Calendar</a>

    <button class="button" @click="deleteEvent">Delete</button>
    <loading-grid v-if="loading"></loading-grid>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import emitter from 'tiny-emitter/instance';

// eslint-disable-next-line no-unused-vars
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ButtonSelector from '@/components/partials/ButtonSelector.vue';
import Checkbox from '@/components/partials/checkbox.vue';
import listUpcomingEvents from '../../utils/listUpcomingEvents';
import LoadingGrid from './loadingGrid.vue';

dayjs.extend(customParseFormat);

export default {
  name: 'Modal',

  components: {
    ButtonSelector,
    Checkbox,
    LoadingGrid,
  },

  props: ['eventId'],
  data() {
    return {
      event: {},
      loading: false,
      isEditing: false,
      result: {},
    };
  },

  methods: {
    setEventType(event) {
      this.newEvent.eventType = event;

      if (event === 'reminder') {
        this.newEvent.description = '';
      }
    },
    updateStart(event) {
      const val = this.cleanTimeInput(event);
      this.newEvent.start = dayjs(`${this.newEvent.date} ${val}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
    },

    updateEnd(event) {
      const val = this.cleanTimeInput(event);
      this.newEvent.end = dayjs(`${this.newEvent.date} ${val}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
    },

    closeModal() {
      this.$emit('close:modal');
    },

    async deleteEvent() {
      const gapi = await this.$gapi.getGapiClient();

      await gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: this.eventId,
      });

      emitter.emit('pushNotification', {
        title: 'Deleted Event',
        body: '',
        level: 'ok',
      });

      this.$store.commit('clearCalendar');
      await listUpcomingEvents(gapi);
      this.closeModal();
    },

    async createEvent() {
      const event = this.newEvent;
      const gapi = await this.$gapi.getGapiClient();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      let startDateTime;
      let endDateTime;

      // create start and finish dateTimes for the event
      if (!event.allDay) {
        startDateTime = this.createDateTime('start');
        endDateTime = this.createDateTime('end');
      } else {
        startDateTime = dayjs(event.date).format('YYYY-MM-DDTHH:mm:ssZ');
        endDateTime = dayjs(event.endDate).format('YYYY-MM-DDTHH:mm:ssZ');
      }


      // create google calendar object
      const gEvent = JSON.stringify({
        summary: event.title,
        description: event.description,
        start: {
          dateTime: startDateTime,
          timeZone: timezone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: timezone,
        },
      });

      console.log(gEvent);

      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: JSON.parse(gEvent),
      });

      console.log(response);

      // fetch the new event that has been created
      listUpcomingEvents(gapi);

      // close the popup
      this.closeModal();

      this.newEvent = JSON.parse(JSON.stringify(this.templateEvent));
    },

    createDateTime(type) {
      let hour = 0;
      let minute = 0;

      const event = this.newEvent;

      if (event[type].includes('am')) {
        hour = parseInt(event[type].split(':')[0], 10);
        minute = parseInt(event[type].split(':')[1].replace('am', ''), 10);

        // check to make sure the time isn't 12, i.e 00:xx the next day
        if (hour === 12) {
          hour = 0;

          if (type === 'end') {
            event.date = dayjs(event.date).add('day', 1);
          }
        }
      } else if (event[type].includes('pm')) {
        hour = 12 + parseInt(event[type].split(':')[0], 10);
        minute = event[type].split(':')[1].replace('pm', '');
      }

      return `${dayjs(event.date).set('hour', hour).set('minute', minute).format('YYYY-MM-DDTHH:mm:ssZ')}`;
    },
    cleanTimeInput(event) {
      const input = event.target.value.replace(/\s/g, '');
      return input;
    },
    changeAllDay() {
      this.newEvent.allDay = !this.newEvent.allDay;
      if (this.newEvent.allDay) {
        this.newEvent.start = this.newEvent.date;
        this.newEvent.end = dayjs(this.newEvent.date).add(1, 'day');
      } else {
        this.newEvent.start = dayjs().format('hh:mma');
        this.newEvent.end = dayjs().add(1, 'hour').format('hh:mma');
      }
    },
    async getEvent() {
      const gapi = await this.$gapi.getGapiClient();

      const { result } = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: this.eventId,
      });

      this.result = result;

      if (result) {
        this.event = result;
        this.loading = false;
      }
    },
  },
  computed: {
    start() {
      return dayjs(this.event.start.dateTime).format('HH:mma');
    },
    end() {
      return dayjs(this.event.end.dateTime).format('HH:mma');
    },
  },
  async mounted() {
    this.loading = true;
    await this.getEvent();
  },
  watch: {
    eventId: {
      async handler() {
        this.loading = true;
        await this.getEvent();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
  .display {
    border:none;
  
  }
  .row {
    display:flex;
    flex-direction:row;
  }
  .event-view {
    position: relative;
  }
</style>