import { createApp } from 'vue';
import app from './ui/app.vue';
import './variable_logic/event_listener';

$(() => {
  createApp(app).mount('#app');
});
