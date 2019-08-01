import Vue from 'vue';
import './plugins/axios'
import App from './App.vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ko';

import './styles.scss';

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
