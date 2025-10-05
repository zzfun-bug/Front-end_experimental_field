import App from './App'

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uViewPlus from 'uview-plus'
import './uni.promisify.adaptor'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uViewPlus)
  return {
    app
  }
}
// #endif

// #ifndef VUE3
import Vue from 'vue'
// main.js
import uView from "uview-ui";
Vue.use(uView);
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif