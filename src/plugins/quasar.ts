import Vue from 'vue';
import iconSet from 'quasar/icon-set/mdi-v4';
import lang from 'quasar/lang/ja';
import { Quasar, Dark } from 'quasar';

import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/mdi-v4/mdi-v4.css';

import '@/styles/quasar.scss';

Vue.use(Quasar, {
    config: {},
    plugins: {},
    lang,
    iconSet
});

Dark.set(true);
