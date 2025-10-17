import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { useI18nStore } from '@/stores/i18nStore.js';
import '@/assets/base.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

useI18nStore(pinia);

app.mount('#app');
