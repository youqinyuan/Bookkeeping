

import Vue from 'vue';
import Vuex from 'vuex';
import VuexAlong from 'vuex-along'
import  state  from './states';
import  getters  from './getters';
import  mutations  from './mutations';
import  actions  from './actions';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [VuexAlong]
})