<template>
    <div class="event-create">
      <div class="event-create__header">
        <div class="columns">
          <div class="column">
          </div>
          <div class="column">
            <button @click="closeModal" class="icon-button">
              <font-awesome-icon font-awesome-icon icon="times"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
        <div class="event-create__title">
            <div class="form-group form-group__title">
                <input type="text" id="eventName" placeholder=" " v-model="newEvent.title">
                <label for="eventName">Title</label>
            </div>
        </div>
        <div class="event-create__body">
            <h4 class="text is-uppercase has-text-weight-bold">Type</h4>
            <button-selector :options="['event', 'task', 'reminder']" v-on:selector:update="setEventType"></button-selector>
            <h4 class="text is-uppercase has-text-weight-bold">When</h4>
            <div class="columns">
                <div class="column is-one-third form-group">
                    <v-date-picker v-model="newEvent.date">
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                </div>
                <div v-if="!newEvent.allDay" class="column form-group">
                    <div class="columns">
                        <div class="column time-select">
                            <div class="form-group">
                                <input type="text" :value="newEvent.start" @change="updateStart">
                            </div>
                        </div>
                        <div class="seperator">to</div>
                        <div class="column time-select">
                            <div class="form-group">
                                <input type="text" :value="newEvent.end" @change="updateEnd">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="column is-one-third form-group">
                    <v-date-picker v-model="newEvent.end">
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
              <div class="checkbox">
                <label for="">
                  All Day
                  <input :value="newEvent.allDay" @change="changeAllDay" type="checkbox">
                </label>
              </div>
            </div>
            <template v-if="newEvent.eventType != 'reminder'">
              <h4 class="text is-uppercase has-text-weight-bold">Description</h4>
              <div class="columns">
                  <div class="column">
                    <div class="textarea-container">
                      <textarea name="event description" id="" cols="30" rows="2" v-model="newEvent.description"></textarea>
                      <div class="textarea-underline"></div>
                    </div>
                  </div>
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
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ButtonSelector from '@/components/partials/ButtonSelector.vue';

dayjs.extend(customParseFormat);

export default {
  name: 'EventCreateModal',

  components: {
    ButtonSelector,
  },

  data() {
    return {
      templateEvent: {
        title: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        start: dayjs().format('hh:mma'),
        end: dayjs().add(1, 'hour').format('hh:mma'),
        allDay: false,
        eventType: '',
      },
      newEvent: {
        title: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        start: dayjs().format('hh:mma'),
        end: dayjs().add(1, 'hour').format('hh:mma'),
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
      const val = this.cleanTimeInput(event);
      this.newEvent.start = dayjs(`${this.newEvent.date} ${val}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
    },

    updateEnd(val) {
      this.newEvent.end = dayjs(`${this.newEvent.date} ${val.target.value}`, 'YYYY-MM-DD hh:mma').format('hh:mma');
    },

    closeModal() {
      this.$emit('close:modal');
    },

    createEvent() {
      this.$emit('create:event', this.newEvent);
      this.closeModal();
      this.newEvent = JSON.parse(JSON.stringify(this.templateEvent));
    },

    cleanTimeInput(event) {
      const input = event.target.value.replace(/\s/g, '');

      if (!input.includes('am') && !input.includes('pm')) {
        return '12:00am';
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
    .event-create{
        position:absolute;
        top:10px;
        left:10px;
        background-color:white;
        border-radius:10px;
        padding:15px 30px 30px 30px;
        z-index:5;
        min-width:420px;
        box-shadow: -2px -3px 22px -2px rgba(128,128,128,0.75);

        &__body{
            margin-top:2rem;
        }

        &__header{
          margin-bottom:1rem;

          .column:nth-child(2){
            display:flex;
            flex-direction:row;
            justify-content: flex-end;
          }
        }

        &__actions{
          .column:nth-child(2){
            display:flex;
            flex-direction:row;
            justify-content: flex-end;
          }
        }
    }

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

        input{
            border: none;
            border-bottom: 2px solid var(--gray-100);
            border-radius: 5px;
            padding: .75rem;
            font-family: 'Ubuntu', sans-serif;
            font-size: 1rem;
            transition: border .13s ease;
            width: 100%;
            background-color: var(--gray-50);

            &:focus{
                outline: none;
                border-bottom: 2px solid var(--red-300);
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
        width: 4rem;
    }
    .seperator{
        align-self: center;
    }
    .column{
        display: flex;
    }

    .checkbox{
      margin:1.5rem;
      display:flex !important;
    }
</style>