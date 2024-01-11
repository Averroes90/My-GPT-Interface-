// Import the required function from Vue
import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './components/App.vue'; 
import Store from './store'; // import your Vuex Store
import markdownItPlugin from './plugins/markdownItPlugin'; // Adjust the path as needed

// Vuetify
import 'vuetify/dist/vuetify.min.css';
// Material Design Icons
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

//import VeeValidate from 'vee-validate';

// Initialize Vuex store
const store = createStore(Store);

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    defaultTheme: 'dark',
  }
});


// Create a new Vue app and mount it to an element
const app = createApp(App);

//app.config.globalProperties.$delimiters = ['[[', ']]'];
app.use(vuetify);
app.use(store);  // Use Vuex store
//app.use(highlightPlugin);
app.use(markdownItPlugin);


app.mount('#chatAppVueRoot');

if (import.meta.hot) {
  import.meta.hot.accept(['./components/App.vue'], () => {
    // Destroy the old Vue app instance and remount a new one
    app.unmount();
    const NextApp = require('./components/App.vue').default;
    createApp(NextApp).use(vuetify).use(store).mount('#chatAppVueRoot');
  });
}