<template>
  <div class="event-view">
    {{ event }}
    <input type="text" class="title display" :value="event['summary']">
    <div class="columns">
      <div class="column">
        <input type="text" :value="start">
      </div>
      <div class="column">
        <input type="text" :value="end">
      </div>
    </div>
    <input type="text" class="text display" :value="event.description">
  </div>
</template>

<script>
import dayjs from 'dayjs';
// eslint-disable-next-line no-unused-vars
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ButtonSelector from '@/components/partials/ButtonSelector.vue';
import Checkbox from '@/components/partials/checkbox.vue';
import listUpcomingEvents from '../../utils/listUpcomingEvents';

dayjs.extend(customParseFormat);

export default {
  name: 'Modal',

  components: {
    ButtonSelector,
    Checkbox,
  },

  props: ['eventId'],
  data() {
    return {
      event: {},
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
    const gapi = await this.$gapi.getGapiClient();

    const { result } = await gapi.client.calendar.events.get({
      calendarId: 'primary',
      eventId: this.eventId,
    });

    if (result) {
      this.event = {
        summary: result.summary,
        description: result.description,
        start: {
          dateTime: dayjs(result.start.dateTime),
        },
        end: {
          dateTime: dayjs(result.end.dateTime),
        },
      };
    }
  },
};
</script>

<style lang="scss">
    .form-group{
        position: relative;

      
        label {
            position: absolute;
            left: 10px;
            top: 5px;
            color: var(--gray-300);
            display: flex;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
        }
 
        input, textarea{
            border: none;
            border-bottom: 4px solid var(--gray-100);
            border-radius:0;
            padding: .75rem;
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 1rem;
            transition: border .13s ease;
            width: 100%;
            background-color: var(--gray-50);

            &:focus{
                outline: none;
                border-bottom: 4px solid var(--red-300);
            }

            &:not(:placeholder-shown) + label {
                display: none;
            }
        }

        &__title{
            input{
                font-size: 1.2rem;
            }

            label{
                margin-top:0.25rem;
                font-size: 1.2rem;
            }
        }
    }

    .time-select{
    }
    .seperator{
        align-self: center;
        font-weight:bold;
    }
    .column{
        display: flex;
    }
    h4{
      margin-top:2rem;
      margin-bottom:1rem;
    }
</style>