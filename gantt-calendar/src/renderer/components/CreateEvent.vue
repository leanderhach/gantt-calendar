<template>
    <button class="button event-create" @click="toggleCreateEvent">Create Event</button>
</template>

<script>
export default {
  name: 'CreateEvent',
  methods: {
    toggleCreateEvent() {
      return null;
    },
  },
};
</script>

<style lang="scss">

.event-create{
  background-color: var(--red-500);
  color:white;
}
</style>