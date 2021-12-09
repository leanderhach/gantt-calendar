<template>
  <ol class="day-of-week">
    <li
      v-for="(weekday, key) in weekdays"
      :key="weekday"
      :class="[{'current-day': key === currentWeekDay - 1}]"
    >
      {{ weekday }}
    </li>
  </ol>
</template>

<script>
import dayjs from 'dayjs';
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default {
  name: 'CalendarWeekdays',

  computed: {
    weekdays() {
      return WEEKDAYS;
    },
    currentWeekDay() {
      return dayjs().weekday();
    },
  },
};
</script>

<style lang="scss">
  .day-of-week{
    padding:2rem 0 1rem 0;
  }
  .current-day{
    color:var(--red-500);
  }
</style>