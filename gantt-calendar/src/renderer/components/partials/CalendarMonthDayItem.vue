<template>
  <div
    class="calendar__day"
    :class="{
      'calendar__day--not-current': !day.isCurrentMonth,
      'calendar__day--today': isToday
    }"
  >
    <div class="day__title">{{ label }}</div>
    <div class="day__events"></div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

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
      isCreatingEvent: false,
    };
  },

  computed: {
    label() {
      return dayjs(this.day.date).format('D');
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
            font-weight: 600;
            color:var(--gray-300);
            font-family: 'Ubuntu', sans-serif;
        }

        &__events{
            display:flex;
            flex-direction:column;
        }
    }

    .calendar__day{
        min-height:150px;
        font-size:1rem;
        position:relative;
        border-left:0.5px solid var(--gray-100);
        border-bottom:0.5px solid var(--gray-100);

        &:nth-of-type(-n+7){
            border-top:0.5px solid var(--gray-100);
        }

        &::after{
            position:absolute;
            height:100%;
            width:100%;
            background-color:var(--gray-100);
            opacity:0.4;
            display:none;
            content: '';
            top:0;
            left:0;
        }

        &--today{
            .day__title{
                background-color:var(--red-500);
                color:white;
            }
        }

        &--not-current{
            &::after{
                display:block;
            }
        }
    }
</style>