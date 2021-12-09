import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faSearch, faCog, faPlus, faClock, faTimes, faExpandArrowsAlt, faDotCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Vue from 'vue';
import axios from 'axios';
import vSelect from 'vue-select';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import VueGapi from 'vue-gapi';

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
  faDotCircle,
  faCircle,
]);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);
Vue.component('v-date-picker', DatePicker);

Vue.use(require('@/assets/styles/main.scss'));

Vue.use(VueGapi, {
  apiKey: 'AIzaSyBZSLLPB6w-zQJH6f_pZmNRKryl74ABkps',
  clientId: '873283495189-3cjhkp8dvcktgs370idskatgrgbsg06s.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
});

/* eslint-disable no-new */
const app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

window.$appRef = app;
