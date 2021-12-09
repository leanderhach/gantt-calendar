<template>
  <div class="calendar-date-selector">
    <span class="clickable" @click="selectPrevious"><font-awesome-icon icon="chevron-left"></font-awesome-icon></span>
    <button class="button" @click="selectCurrent"><font-awesome-icon icon="circle"></font-awesome-icon></button>
    <span class="clickable" @click="selectNext"><font-awesome-icon icon="chevron-right"></font-awesome-icon></span>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'CalendarDateSelector',

  props: {
    currentDate: {
      type: String,
      required: true,
    },

    selectedDate: {
      type: Object,
      required: true,
    },
  },

  methods: {
    selectPrevious() {
      const newSelectedDate = dayjs(this.selectedDate).subtract(1, 'month');
      this.$emit('dateSelected', newSelectedDate);
    },

    selectCurrent() {
      const newSelectedDate = dayjs(this.currentDate);
      this.$emit('dateSelected', newSelectedDate);
    },

    selectNext() {
      const newSelectedDate = dayjs(this.selectedDate).add(1, 'month');
      this.$emit('dateSelected', newSelectedDate);
    },
  },
};
</script>

<style lang="scss" scoped>
    .calendar-date-selector{
        display:flex;
        flex-direction:row;
        margin-right:20px;
        align-items: center;
    }

    span.clickable{
        display:flex;
        align-items: center;
        padding:0 5px;
    }
    .button{
      outline:none;
      border:none;
      padding:0 5px;
      
      svg {
        width:.6rem;
        height:.6rem;
      }
    }
</style>