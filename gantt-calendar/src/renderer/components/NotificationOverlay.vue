<template>
    <div class="notification-overlay">
        <div class="push-notification-container">
            <div v-for="(item, key) in pushNotifications" :key="key" :class="['push-notification', item.level]">

                <p class="text has-text-weight-bold">{{ item.title }}</p>
                <p class="text">{{ item.body }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import emitter from 'tiny-emitter/instance';

export default {
  name: 'notificationOverlay',
  data() {
    return {
      pushNotifications: [],
    };
  },
  methods: {
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    addPushNotification(notification) {
      this.pushNotifications.push(notification);
      this.clearLastNotification();
    },
    async clearLastNotification() {
      await this.sleep(3000);
      this.pushNotifications.splice(0, 1);
    },
  },
  beforeMount() {
    emitter.on('pushNotification', (notification) => {
      this.addPushNotification(notification);
    });
  },
};
</script>

<style lang="scss">
    .notification-overlay{
        pointer-events:none;
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }

    .push-notification-container {
        position:absolute;
        left:5%;
        bottom:5%;
        width:20%;
    }

    .push-notification {
        padding:1rem 2rem;
        box-shadow: 6px 5px 43px 12px rgba(160,160,160,0.8);
        color:white;
        position:relative;
        margin-bottom:2rem;

        &::after {
            position: absolute;
            top:0;
            left:0;
            width:100%;
            content: '';
            height:10px;
            background-color: rgba(255,255,255,0.3);
        }

        &.danger {
            background-color:var(--bruschetta);
        }

        &.warn {
            background-color:var(--orange);
        }

        &.ok {
            background-color: var(--alien);
        }
    }
</style>