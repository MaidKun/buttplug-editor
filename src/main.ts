import Vue from 'vue'
import App from './App.vue'
import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import "./style.scss";

Vue.config.productionTip = false
Vue.use(BaklavaVuePlugin);

new Vue({
  render: h => h(App),
}).$mount('#app')



