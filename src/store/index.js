import Vue from 'vue';
import Vuex from 'vuex';

import user from './module/user';
import app from './module/app';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  getters
});

export default store;
