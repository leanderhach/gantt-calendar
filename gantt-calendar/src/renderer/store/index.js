import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';

import createPersistedState from 'vuex-electron-store';

import modules from './modules';
Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState.create(),
  ],
  state: {
    calendarEvents: [],
  },
  mutations: {
    setCalendarEvents(state, n) {
      console.log('commiting') // eslint-disable-line

      if (state.calendarEvents.find(event => event.id === n.id) === undefined) {
        state.calendarEvents.push(n);
      }
    },
    clearCalendar(state) {
      state.calendarEvents = [];
    },
  },
  actions: {
    setCalendarEvents({ commit }, n) {
            console.log('dispatching') // eslint-disable-line
      commit('setCalendarEvents', n);
    },
    clearCalendar({ commit }) {
      commit('clearCalendar');
    },
  },
  getters: {
    getEvents: state => (date) => {
      const res = [];
      for (let i; i < state.calendarEvents.length; i += 1) {
        res.push({
          eventDate: dayjs(state.calendarEvents[i].date.start),
          currentDate: date,
        });
      }

      return res;
    },
  },
  strict: process.env.NODE_ENV !== 'production',
});
