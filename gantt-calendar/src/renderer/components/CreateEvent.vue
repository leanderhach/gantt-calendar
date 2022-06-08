<template>
    <button class="event-create" @click="createEvent">Create Event</button>
</template>

<script>
import emitter from 'tiny-emitter/instance';

export default {
  name: 'CreateEvent',
  methods: {
    createEvent() {
      emitter.emit('createEvent');
    },
  },
};
</script>

<style lang="scss">
  .event-create {
    background-color: var(--red-500);
    color:white;
    border-radius:0;
    font-weight: bold;
    justify-self: flex-end;
    font-family: 'Roboto Condensed';
    border:none;
    outline:none;
    padding:1rem 2rem;
    font-size:1rem;
    cursor:pointer;
  }
</style>