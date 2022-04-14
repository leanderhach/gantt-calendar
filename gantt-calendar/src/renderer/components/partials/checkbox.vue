<template>
    <div :class="['checkbox', {'checkbox__half-width': halfwidth}]">
        <label for="">
            <p class="text">{{ text }}</p>
            <input :value="boxValue" @change="emitValue" type="checkbox">
            <div class="checkbox__box">
                <div class="checkbox__tick">
                    <font-awesome-icon icon="check"></font-awesome-icon>
                </div>
            </div>
        </label>
    </div>
</template>

<script>
export default {
  name: 'checkbox',
  props: {
    value: {
      default: false,
    },
    text: {
      default: 'Checkbox',
    },
    halfwidth: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      boxValue: this.value,
    };
  },
  methods: {
    emitValue() {
      this.$emit('update', this.boxValue);
    },
  },
};
</script>

<style lang="scss">
    .checkbox{
        margin:1rem 0;
      width:100%;

      &__half-width{
          width:50%;
      }

      input{
        opacity: 0;
        position:absolute;
        width:100%;
        height:100%;
        cursor: pointer;
      }

      label {
        width:100%;
        height:2rem;
        display:flex !important;
        flex-direction:row;
        justify-content:space-between;
      }

      .checkbox__box{
          height:100%;
          width:2rem;
          border:4px solid var(--gray-100);
          display:flex;
          justify-content: center;
          align-items: center;

          .checkbox__tick{
              color:var(--red-500);
              display:none;
            }
      }

      input:checked + .checkbox__box{
          .checkbox__tick {
              display:block;
          }
      }

      input:focus + .checkbox__box {
          border:4px solid var(--gray-300);
      }
    }
</style>