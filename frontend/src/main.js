import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowUp, faArrowDown, faAngleLeft, faAngleRight, faAngleDown, faAngleUp, faCheck, faTimes, faHeart, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add([faArrowUp, faArrowDown, faAngleLeft, faAngleRight, faAngleDown, faAngleUp, faCheck, faTimes, faHeart, faExclamationCircle])
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
