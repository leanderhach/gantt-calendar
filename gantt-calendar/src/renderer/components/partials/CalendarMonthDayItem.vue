<template>
  <div
    class="calendar__day"
    :class="{
      'calendar__day--not-current': !day.isCurrentMonth,
      'calendar__day--today': isToday
    }"
  >
    <div class="day__title" @click="showDay">{{ label }}</div>
    <div class="day__events">
      <div :class="['event', {'event__on-now': event.time && event.time.onNow === true}]" v-for="(event, key) in storedEvents" :key="key" @click="viewEvent(event.id)">
        <p class="event__title">{{ event.title }}</p>
        <p v-if="event.time" class="event__time">{{ event.time.start }} - {{ event.time.end }} {{ event.time.duration }}</p>
        <p v-else class="event__time">All Day</p>
      </div>
      <button @click="showDay" v-if="storedEvents.length > 2" class="events__see-all">And {{ storedEvents.length - 2 }} More</button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import emitter from 'tiny-emitter/instance';

import store from '../../store';

export default {
  name: 'CalendarMonthDayItem',

  props: {
    day: {
      type: Object,
      required: true,
    },

    isToday: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isShowingDay: false,
    };
  },

  methods: {
    showDay() {
      this.isShowingDay = !this.isShowingDay;
    },
    viewEvent(id) {
      emitter.emit('viewEvent', id);
    },
  },

  computed: {
    label() {
      return dayjs(this.day.date).format('D');
    },
    storedEvents() {
      if (this.day.isCurrentMonth) {
        const res = [];

        console.log(store.state.calendarEvents); // eslint-disable-line

        for (let i = 0; i < store.state.calendarEvents.length; i += 1) {
          const event = store.state.calendarEvents[i];
          let eventIsToday = false;

          // calculate if the event is on today
          if (event.start.date) {
            if (dayjs(this.day.date).diff(dayjs(event.start.date), 'day') === 0 &&
            dayjs(this.day.date).diff(dayjs(event.end.date), 'day') <= 0
            ) {
              eventIsToday = true;
            }
          } else if (event.start.dateTime) {
            if ((dayjs(this.day.date).diff(dayjs(dayjs(event.start.dateTime).format('YYYY-MM-DD')), 'day') === 0) &&
                 (dayjs(this.day.date).diff(dayjs(dayjs(event.end.dateTime).format('YYYY-MM-DD')), 'day') <= 0)) {
              eventIsToday = true;
            }
          }

          if (eventIsToday) {
            const newEvent = {
              id: event.id,
              title: event.summary,
              difference: eventIsToday,
              description: event.description,
            };

            if (event.start.dateTime) {
              newEvent.time = {};

              newEvent.time.start = dayjs(event.start.dateTime).format('hh:mma');
              newEvent.time.end = dayjs(event.end.dateTime).format('hh:mma');


              const currentTimeAfterStart = dayjs().diff(event.start.dateTime, 'minute');
              const currentTimeBeforeEnd = dayjs().diff(event.end.dateTime, 'minute');

              newEvent.time.onNow = currentTimeAfterStart >= 0 && currentTimeBeforeEnd <= 0;
            }

            res.push(newEvent);
          }
        }

        return res;
      }

      return [];
    },
  },
};
</script>

<style lang="scss">
    .day{
        display: flex;
        flex-direction: column;
        align-content:center;
        justify-content:center;

        &__title{
            width: max-content;
            padding: 5px 10px;
            border-radius: 50%;
            font-size:1.2rem;
            font-weight: 600;
            color:var(--gray-300);
            font-family: 'Roboto Condensed', sans-serif;
        }

        &__events{
            display:flex;
            flex-direction:column;
            min-height:calc(25px * 5);
        }
    }

    .events{
      &__see-all{
        border:none;
        outline:none;
        background:transparent;
        text-align: left;
        color:var(--gray-300);
        font-weight:bold;
        text-decoration: underline;
        margin-top:1rem;
        cursor:pointer;
        font-family: 'Roboto Condensed', sans-serif;
      }
    }

    .event {
      &__title{
        font-weight:bold;
      }

      &__time{
        color:var(--gray-300);
      }

      &__on-now{
        color:var(--red-300);
      }
    }

    .calendar__day{
        min-height:150px;
        font-size:1rem;
        position:relative;
        border-top:2px solid var(--gray-300);
        margin:5px 10px;

        &--today{
          border-top:2px solid var(--red-500);

          > .day__title{
            color:var(--red-500);
          }
        }

        &--not-current{
          border-color:var(--gray-100);

          > .day__title{
            color:var(--gray-100);
          }
        }
    }
</style>