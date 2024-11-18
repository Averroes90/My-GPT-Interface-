// Import the required function from Vue
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { createApp } from 'vue';
import { createStore } from 'vuex';
import { createPinia } from 'pinia';
import App from './App.vue';
import Store from './store/store'; // import your Vuex Store
import markdownItPlugin from './plugins/markdownItPlugin';

// Vuetify
import 'vuetify/styles';
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
    themes: {
      dark: {
        colors: {
          secondary: '#85c1e9',
        },
      },
    },
  },
});

// Create a new Vue app and mount it to an element
const app = createApp(App);

Sentry.init({
  app,
  dsn: "", // Replace with your actual Sentry DSN
  integrations: [
    new Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        "http://127.0.0.1:5001", // Local backend (proxied via Webpack)
        "localhost",             // General local domain for other scenarios
        //"https://api.yourapp.com", // Production backend
        /^\//,                   // Relative paths (if used)
      ],
    }),
    new Sentry.replayIntegration(), // Optional: Include if you want session replay
  ],
  tracesSampleRate: 1.0, // Adjust sample rate for production
  replaysSessionSampleRate: 0.6, // Adjust for development vs production
  replaysOnErrorSampleRate: 1.0, // Always record sessions with errors
});


//app.config.globalProperties.$delimiters = ['[[', ']]'];
app.use(vuetify);
app.use(store); // Use Vuex store
app.use(createPinia());
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
