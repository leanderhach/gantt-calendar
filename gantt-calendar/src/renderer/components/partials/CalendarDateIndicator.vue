<template>
  <div class="calendar-date-indicator">
      <div class="form-group form-group--inline">
        <select name="" id="" v-model="selectedMonth" @change="changeDate">
          <option v-for="(month, key) in months" :key="key" :value="month">{{ month }}</option>
        </select>
        <select name="" id="" v-model="selectedYear" @change="changeDate">
          <option v-for="(year, key) in years" :key="key" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

export default {
  props: {
    selectedDate: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      selectedMonth: this.selectedDate.format('MMM'),
      selectedYear: this.selectedDate.format('YYYY'),
    };
  },

  methods: {
    changeDate(event) {
      if (this.months.indexOf(event.target.value) === -1) {
        this.$emit('change:date', dayjs(this.selectedDate).set('year', event.target.value));
      } else {
        this.$emit('change:date', dayjs(this.selectedDate).set('month', this.months.indexOf(event.target.value)));
      }
    },
  },

  computed: {
    years() {
      return Array.from({ length: dayjs().year() - 2000 }, (v, k) => k + 1999)
        .concat(Array.from({ length: 80 }, (v, k) => k + dayjs().year()));
    },
    months() {
      const fullMonths = dayjs.months();
      const months = [];

      fullMonths.forEach((month) => {
        months.push(month.slice(0, 3));
      });

      return months;
    },
  },
  watch: {
    selectedDate: {
      handler(oldVal, newVal) {
        console.log('Changed!');
        console.log(newVal);
        this.selectedMonth = newVal.format('MMM');
        this.selectedYear = newVal.format('YYYY');
      },
      deep: true,
    },
  },
};
</script>


<style lang="scss" scoped>
    .calendar-date-indicator{
        font-weight:black;
        font-size:2rem;
        display:flex;
        flex-direction:row;
        font-family: 'Peace Sans', sans-serif !important;
    }

    .form-group{
      &--inline{
        display:flex;
      }
    }
    select {
      padding:1rem 2rem;
      margin-right:1rem;
      border:none;
      border-bottom: 4px solid var(--gray-50);
      font-family: 'Peace Sans';
      font-weight:bold;
      font-size: 2rem;
    }
</style>