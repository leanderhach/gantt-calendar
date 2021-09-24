import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faSearch, faCog, faPlus, faClock, faTimes, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Vue from 'vue';
import axios from 'axios';
import vSelect from 'vue-select';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

import App from './App';
import router from './router';
import store from './store';

library.add([
  faBars,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faSearch,
  faCog,
  faPlus,
  faClock,
  faTimes,
  faExpandArrowsAlt,
]);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);
Vue.component('v-date-picker', DatePicker);

Vue.use(require('@/assets/styles/main.scss'));

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
