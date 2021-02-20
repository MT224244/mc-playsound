import Vue from 'vue';
import iconSet from 'quasar/icon-set/mdi-v5';
import lang from 'quasar/lang/ja';
import { Quasar, Dark, colors, Notify, LocalStorage } from 'quasar';

import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/mdi-v5/mdi-v5.css';

import '@/styles/quasar.scss';

Vue.use(Quasar, {
    config: {
        brand: {
            primary: colors.getPaletteColor('blue-6')
        }
    },
    plugins: {
        Notify,
        LocalStorage
    },
    lang,
    iconSet
});

Dark.set(true);
