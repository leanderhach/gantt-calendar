<template>
    <aside class="sidebar-menu">
    </aside>
</template>

<script>

export default {
  name: 'sidebarMenu',

  data() {
    return {
      creatingEvent: false,
    };
  },

  methods: {
    toggleEventCreate() {
      this.creatingEvent = !this.creatingEvent;
    },

    // createEvent(event) {
    //   //console.log(event);
    // },

  },
};
</script>

<style lang="scss">
    .sidebar-menu{
        width:5%;
        max-width:500px;
        height:100%;
        display:flex;
        flex-direction:column;

        &__title{
            color:var(--gray-700);
        }

        &__action{
            .attention-button{
                color:white;
                border:none;
                padding:10px 20px;
                border-radius:50px;
                font-size:1.2rem;
                background-color:var(--red-500);
                font-family: 'Ubuntu', sans-serif;
                font-weight:700;
            }
        }
    }
</style>