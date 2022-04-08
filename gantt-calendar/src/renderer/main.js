import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faSearch, faCog, faPlus, faClock, faTimes, faExpandArrowsAlt, faDotCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Vue from 'vue';
import axios from 'axios';
import vSelect from 'vue-select';
import VueGapi from 'vue-gapi';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import dotenv from 'dotenv';

import App from './App';
import router from './router';
import store from './store';

dotenv.config();

Vue.use(VueGapi, {
  apiKey: process.env.API_KEY,
  clientId: process.env.CLIENT_ID,
  discoveryDocs: process.env.DISCOVERY_DOCS.split(','),
  scope: process.env.SCOPE,
});

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
  faDotCircle,
  faCircle,
]);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);
Vue.component('v-date-picker', DatePicker);

/* eslint-disable no-new */
const app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

window.$appRef = app;
