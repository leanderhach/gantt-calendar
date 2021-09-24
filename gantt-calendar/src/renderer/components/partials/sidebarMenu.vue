<template>
    <aside class="sidebar-menu">
        <div class="sidebar-menu__title">
            <h1>Looking Glass</h1>
        </div>
        <div class="sidebar-menu__buttons">
            <button class="icon-button"><font-awesome-icon icon="cog"></font-awesome-icon></button>
            <button class="icon-button"><font-awesome-icon icon="search"></font-awesome-icon></button>
        </div>
        <div class="sidebar-menu__calendars">

        </div>
        <div class="sidebar-menu__action">
            <button class="attention-button" @click="toggleEventCreate">Create <font-awesome-icon icon="plus"></font-awesome-icon></button>
        </div>
        <event-create-modal v-if="creatingEvent" v-on:close:modal="toggleEventCreate" v-on:create:event="createEvent"></event-create-modal>
    </aside>
</template>

<script>
import EventCreateModal from '@/components/partials/EventCreateModal';

export default {
  name: 'sidebarMenu',
  components: {
    EventCreateModal,
  },

  data() {
    return {
      creatingEvent: false,
    };
  },

  methods: {
    toggleEventCreate() {
      this.creatingEvent = !this.creatingEvent;
    },

    createEvent(event) {
      console.log(event);
    },

  },
};
</script>

<style lang="scss">
    .sidebar-menu{
        width:20%;
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