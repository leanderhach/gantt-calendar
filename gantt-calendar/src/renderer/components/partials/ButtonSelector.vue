<template>
    <div class="button-selector">
        <button :class="['button', 'mr-2', {'is-brand': currentSelection === index}]" v-for="(option, index) in options" :key="option" @click="switchSelection(index)">{{ option }}</button>
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