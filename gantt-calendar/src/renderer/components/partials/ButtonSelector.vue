<template>
    <div class="button-selector">
        <button :class="['select-button', 'mr-2', {'is-brand': currentSelection === index}]" v-for="(option, index) in options" :key="option" @click="switchSelection(index)">{{ option }}</button>
    </div>
</template>

<script>
export default {
  name: 'ButtonSelector',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      currentSelection: 0,
    };
  },

  methods: {
    switchSelection(index) {
      this.currentSelection = index;
      this.$emit('selector:update', this.options[index]);
    },
  },

  mounted() {
    this.$emit('selector:update', this.options[0]);
  },
};
</script>

<style lang="scss">
  .select-button{
    border-radius:0;
    border: none;
    border-top:4px solid var(--gray-100);
    font-family: 'Roboto Condensed', sans-serif;
    padding:10px 20px 14px 20px;
    font-weight:bold;
    color:var(--gray-300);

    &:hover{
      border-top:4px solid var(--gray-300);
      color:var(--gray-500);
    }

    &.is-brand{
      border-top:4px solid var(--red-500);

      &:hover{
      }
    }
  }
</style>