// Import the required function from Vue
import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue'; 
import Store from './store/store'; // import your Vuex Store
import markdownItPlugin from './plugins/markdownItPlugin'; 

// Vuetify
import 'vuetify/styles'
// Material Design Icons
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';


//import VeeValidate from 'vee-validate';

// Initialize Vuex store
export const store = createStore(Store);

// Create Vuetify instance
const vuetify = createVuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    defaultTheme: 'dark',
    themes:{
      dark:{
        colors:{
          secondary: '#85c1e9'
        }
      }
    }
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