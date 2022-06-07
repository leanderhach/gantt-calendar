<template>
  <main>
    <div class="calendar">
      <div class="calendar__header">
        <calendar-date-indicator :selectedDate="selectedDate"></calendar-date-indicator>
        <calendar-date-selector :selectedDate="selectedDate" :currentDate="today" v-on:dateSelected="selectDate"></calendar-date-selector>
        <create-event></create-event>
      </div>

      <calendar-weekdays class="week-days"></calendar-weekdays>
      <div class="days-grid">
        <calendar-month-day-item
          v-for="day in days"
          :key="day.date"
          :day="day"
          :is-today="day.date === today"
        ></calendar-month-day-item>
      </div>
    </div>
    <multi-function-overlay></multi-function-overlay>
  </main>
</template>

<script>
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import CalendarDateIndicator from '@/components/partials/CalendarDateIndicator';
import CalendarDateSelector from '@/components/partials/CalendarDateSelector';
import CalendarWeekdays from '@/components/partials/CalendarWeekdays';
import CalendarMonthDayItem from '@/components/partials/CalendarMonthDayItem';
import CreateEvent from '@/components/createEvent';
import MultiFunctionOverlay from '@/components/MultiFunctionOverlay';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default {
  components: {
    CalendarDateIndicator,
    CalendarDateSelector,
    CalendarWeekdays,
    CalendarMonthDayItem,
    CreateEvent,
    MultiFunctionOverlay,
  },
  data() {
    return {
      selectedDate: dayjs(),
    };
  },

  computed: {
    days() {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays,
        ...this.nextMonthDays,
      ];
    },

    today() {
      return dayjs().format('YYYY-MM-DD');
    },

    month() {
      return Number(this.selectedDate.format('M'));
    },

    year() {
      return Number(this.selectedDate.format('YYYY'));
    },

    numberOfDaysInMonth() {
      return dayjs(this.selectedDate).daysInMonth();
    },

    currentMonthDays() {
      return [...Array(this.numberOfDaysInMonth)].map((day, index) =>
        ({
          date: dayjs(`${this.year}-${this.month}-${index + 1}`).format('YYYY-MM-DD'),
          isCurrentMonth: true,
        }));
    },

    previousMonthDays() {
      const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDays[0].date);

      const previousMonth = dayjs(`${this.year}-${this.month}-01`).subtract(1, 'month');

      const visibleNumberOfDaysFromPreviousMonth =
        firstDayOfTheMonthWeekday ?
          firstDayOfTheMonthWeekday - 1 : 6;

      const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, 'day').date();

      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => ({
        date: dayjs(`${previousMonth.year()}-${previousMonth.month()}-${previousMonthLastMondayDayOfMonth + index}`).format('YYYY-MM-DD'),
        isCurrentMonth: false,
        isPreviousMonth: true,
      }));
    },

    nextMonthDays() {
      const lastDayOfTheMonthWeekday = this.getWeekday(`${this.year}-${this.month}-${this.currentMonthDays.length}`);

      const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(1, 'month');

      const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
        ? 7 - lastDayOfTheMonthWeekday
        : lastDayOfTheMonthWeekday;

      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => ({
        date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format('YYYY-MM-DD'),
        isCurrentMonth: false,
        isNextMonth: true,
      }));
    },
  },

  methods: {
    selectDate(newSelectedDate) {
      this.selectedDate = newSelectedDate;
    },

    getWeekday(date) {
      return dayjs(date).weekday();
    },
  },
};
</script>

<style lang="scss">
    .calendar {
      height:100%;
      display:flex;
      flex-direction: column;
    }
    .days-grid{
      display:grid;
      list-style-type:none;
      grid-template-columns: repeat(7, 1fr);
      height:100%;
    }
    .week-days{
      display:grid;
      list-style-type: none;
      grid-template-columns: repeat(7, 1fr);
      font-weight:600;
      height:fit-content;
    }

    .calendar__header{
      display:flex;
      flex-direction:row;
      align-items: center;
      height:fit-content;
    }
</style>