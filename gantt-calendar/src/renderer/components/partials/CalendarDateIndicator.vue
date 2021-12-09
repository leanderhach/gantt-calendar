<template>
  <div class="calendar-date-indicator">
      <div class="form-group form-group--inline">
        <v-select class="magic-select" :style="[{'min-width': 'calc(' + (selectedMonth.length + 1) + 'rem)'}]" :clearable="false" :options="months" :value="selectedMonth" @input="changeDate"></v-select>
        <v-select class="magic-select" :options="years" :value="selectedYear" @input="changeDate"></v-select>
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
      months: dayjs.months(),
    };
  },

  methods: {
    changeDate(event) {
      if (this.months.indexOf(event) === -1) {
        this.$emit('change:date', dayjs(this.selectedDate).set('year', event));
      } else {
        this.$emit('change:date', dayjs(this.selectedDate.set('month', this.months.indexOf(event))));
      }
    },
  },

  computed: {
    selectedMonth() {
      return this.selectedDate.format('MMM');
    },
    selectedYear() {
      return this.selectedDate.format('YYYY');
    },
    years() {
      return Array.from({ length: dayjs().year() - 2000 }, (v, k) => k + 1999)
        .concat(Array.from({ length: 80 }, (v, k) => k + dayjs().year()));
    },
  },
};
</script>


<style lang="scss">
    .calendar-date-indicator{
        font-weight:black;
        font-size:2rem;
        display:flex;
        flex-direction:row;
    }
    .heading-input{
      border:none;
      border-bottom:2px solid var(--gray-500);
      appearance: none;
      -webkit-appearance: none;

      option{
        padding:10px 20px;
      }
    }

    .form-group{
      &--inline{
        display:flex;
      }
    }

    .magic-select{
      margin-right:5px;

      .vs__dropdown-toggle{
        border:none;
        padding:0;
        border-radius:0;
        border-bottom:1px solid var(--gray-100);
      }
      .vs__clear, .vs__open-indicator, .vs__actions, .vs__search{
        display:none;
      }

      .vs__selected{
        padding:0 0.125em;
      }

      &:first-of-type{
        .vs__dropdown-menu{
          min-width:10rem;
        }
      }
    }
</style>