<template>
    <div class="">
        <div class="event-create__title">
            <div class="form-group form-group__title">
                <input type="text" id="eventName" placeholder=" " v-model="newEvent.title">
                <label for="eventName">Title</label>
            </div>
        </div>
        <div class="event-create__body">
          {{ JSON.stringify(newEvent) }}
            <h4 class="text is-uppercase has-text-weight-bold">Type</h4>
            <button-selector :options="['event', 'task', 'reminder']" v-on:selector:update="setEventType"></button-selector>
            <h4 class="text is-uppercase has-text-weight-bold">When</h4>
            <div class="date-time-selector">
                <div class="form-group">
                    <v-date-picker v-model="newEvent.date">
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                </div>
                <div v-if="!newEvent.allDay" class="form-group">
                    <div class="seperator">From</div>
                    <div class="columns">
                        <div class="column time-select">
                            <div class="form-group">
                                <input type="text" :value="newEvent.start" @change="updateStart">
                            </div>
                        </div>
                        <div class="seperator">To</div>
                        <div class="column time-select">
                            <div class="form-group">
                                <input type="text" :value="newEvent.end" @change="updateEnd">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="form-group">
                    <div class="seperator">To</div>
                    <v-date-picker v-model="newEvent.endDate">
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                </div>
            </div>
            <div class="form-group">
              <checkbox :halfwidth="true" :value="newEvent.allDay" :text="'All Day'" @update="changeAllDay"></checkbox>
            </div>
            <template v-if="newEvent.eventType != 'reminder'">
              <h4 class="text is-uppercase has-text-weight-bold">Description</h4>
              <div class="form-group">
                  <textarea name="event description" id="" cols="30" rows="2" v-model="newEvent.description"></textarea>
              </div>
            </template>
        </div>
        <div class="event-create__actions">
          <div class="columns">
            <div class="column"></div>
            <div class="column">
              <button class="button is-brand" type="submit" @click="createEvent">Create Event</button>
            </div>
          </div>
        </div>
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

dayjs.extend(customParseFormat);

export default {
  name: 'Modal',

  components: {
    ButtonSelector,
    Checkbox,
  },

  data() {
    return {
      templateEvent: {
        title: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        start: dayjs().format('hh:mma'),
        end: dayjs().add(1, 'hour').format('hh:mma'),
        endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        allDay: false,
        eventType: '',
      },
      newEvent: {
        title: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        start: dayjs().format('hh:mma'),
        end: dayjs().add(1, 'hour').format('hh:mma'),
        endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        allDay: false,
        eventType: '',
      },
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
      console.log(event.target.value);
      const val = this.cleanTimeInput(event);
      this.newEvent.start = dayjs(`${dayjs(this.newEvent.date).format('YYYY-MM-DD')} ${val}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
    },

    updateEnd(event) {
      const val = this.cleanTimeInput(event);
      this.newEvent.end = dayjs(`${dayjs(this.newEvent.date).format('YYYY-MM-DD')} ${val}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
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

      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: JSON.parse(gEvent),
      });

      emitter.emit('pushNotification', {
        title: 'Event Created',
        body: `Created ${event.eventType} starting ${event.date} at ${event.start}`,
        level: 'ok',
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
            event.date = dayjs(event.date).add(1, 'day');
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

      if (!input.includes('am') && !input.includes('pm')) {
        return `${input}am`;
      }

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

    .date-time-selector{
      display:flex;
      flex-direction:row;
      justify-content: start;

      .form-group{
        display:flex;
        flex-direction: row;
        
        > .seperator {
          margin:0 1rem;
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