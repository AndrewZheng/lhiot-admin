import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './module/user';
import app from './module/app';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  getters,
  plugins: [createPersistedState({
    key: 'vuex_store',
    storage: window.sessionStorage
  })]
});

export default store;
