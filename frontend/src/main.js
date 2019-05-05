import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/style.css'

import Vue from 'vue'
import * as uiv from 'uiv'

Vue.use(uiv)

import App from '@/App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
