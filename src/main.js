import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Header, Picker, Cell, Navbar,Loadmore,TabItem ,MessageBox,Search,InfiniteScroll,Toast} from 'mint-ui';
import Promise from 'es6-promise';
import 'babel-polyfill'
Promise.polyfill();
Vue.component(Picker.name, Picker);
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
   // 设置默认显示的图片
  　　loading: require('./assets/noImg.png'),
  error: require('./assets/noImg.png'),
})

Vue.use(Vuex)
import store from './VueX/store'
import axios from 'axios'
Vue.prototype.$axios = axios; //使用axios网络请求
axios.defaults.timeout = 5000
// 在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

Vue.use(InfiniteScroll);
Vue.component(Search.name, Search);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Cell.name, Cell);
Vue.component(Header.name, Header);
Vue.use(MintUI)
Vue.config.productionTip = false;
//定义axios拦截器
axios.interceptors.response.use(
  config => {
    config.headers['X-Requested-With']='XMLHttpRequst'
    return config;
  },
  err => {
    
  }
 );


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})