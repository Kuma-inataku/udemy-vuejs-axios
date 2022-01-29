import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = "https://firestore.googleapis.com/v1/projects/vuejs-http-9dcd9/databases/(default)/documents";

const interceptorsRequest = axios.interceptors.request.use(
  config => {
    console.log('interceptors request config', config);
    return config;
  },
  error => {
    console.log('interceptors request error', error);
    return Promise.reject();
  }
);
const interceptorsResponse = axios.interceptors.response.use(
  config => {
    console.log('interceptors response config', config);
    return config;
  },
  error => {
    console.log('interceptors response error', error);
    return Promise.reject();
  }
);

axios.interceptors.request.eject(interceptorsRequest);
axios.interceptors.response.eject(interceptorsResponse);

new Vue({
  render: h => h(App),
}).$mount('#app')

