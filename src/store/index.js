import Vue from "vue";
import Vuex from "vuex";
import axios from '../axios-auth';
import router from '../router';
import axiosRefresh from '../axios-refresh';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
  },
  getters: {
    idToken: state => state.idToken
  },
  mutations: {
    updateIdToken(state, idToken) {
      state.idToken = idToken;
    }
  },
  actions: {
    async autoLogin({ commit, dispatch }) {
      const idToken = localStorage.getItem('idToken');
      if (! idToken) {
        return;
      }
      const now = new Date();
      const expiryTimeMs = localStorage.getItem('expiryTimeMs');
      const isExpired = now.getTime() >= expiryTimeMs;
      const refreshToken = localStorage.getItem('refreshToken');
      if (isExpired) {
        await dispatch('refreshIdToken', refreshToken);
      } else {
        const expiresInMs = expiryTimeMs - now.getTime();
        setTimeout(() => {
          dispatch('refreshIdToken', refreshToken);
        }, expiresInMs);
        commit('updateIdToken', idToken);
      }
    },
    login({ dispatch }, authData) {
      axios
      .post(
        '/accounts:signInWithPassword?key=AIzaSyAv00TLj_DpntxJ3k2sumCQshxMjnQELJM',
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true,
        }
      ).then(response => {
        dispatch('setAuthData', {
          idToken: response.data.idToken,
          expiresIn: response.data.expiresIn,
          refreshIdToken: response.data.refreshIdToken,
        });
        router.push('/');
      });
    },
    async refreshIdToken({ dispatch }, refreshToken) {
      await axiosRefresh
      .post(
        '/token?key=AIzaSyAv00TLj_DpntxJ3k2sumCQshxMjnQELJM',
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }
      ).then(response => {
        dispatch('setAuthData', {
          idToken: response.data.id_token,
          expiresIn: response.data.expires_in,
          refreshIdToken: response.data.refresh_token,
        });
      });
    },
    register({ dispatch }, authData) {
      axios
      .post(
        '/accounts:signUp?key=AIzaSyAv00TLj_DpntxJ3k2sumCQshxMjnQELJM',
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true,
        }
      ).then(response => {
        dispatch('setAuthData', {
          idToken: response.data.idToken,
          expiresIn: response.data.expiresIn,
          refreshIdToken: response.data.refreshIdToken,
        });
        router.push('/');
      });
    },
    setAuthData({ commit, dispatch }, authData) {
      const now = new Date();
      const expiryTimeMs = now.getTime() + authData.expiresIn * 1000;
      commit('updateIdToken', authData.idToken);
      localStorage.setItem('idToken', authData.idToken);
      localStorage.setItem('expiryTimeMs', expiryTimeMs);
      localStorage.setItem('refreshToken', authData.refreshToken);
      setTimeout(() => {
        dispatch('refreshIdToken', authData.refreshToken);
      }, authData.expiresIn * 1000);
    },
    logout({ commit }) {
      commit('updateIdToken', null);
      localStorage.removeItem('idToken');
      localStorage.removeItem('expiryTimeMs');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    },
  }
});