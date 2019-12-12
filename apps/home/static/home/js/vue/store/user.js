import api from "../http.js";

export const userStorage = {
  keys: {
    token: "authToken",
    tokenExpiry: "authTokenExpiry"
  },

  /**
   * Stores user sesstion to localstorage
   * @param {string} token
   * @param {string} expiry
   */
  setSession(token, expiry) {
    localStorage.setItem(this.keys.token, token);
    localStorage.setItem(this.keys.tokenExpiry, expiry);
  },

  /**
   * @returns {(string|null)}
   */
  get token() {
    return localStorage.getItem(this.keys.token);
  },

  /**
   * @returns {string}
   */
  get tokenExpiry() {
    return localStorage.getItem(this.keys.tokenExpiry);
  },

  /**
   * @returns {boolean}
   */
  get isExpired() {
    return new Date() > this.tokenExpiry;
  },

  /**
   * @returns {boolean}
   */
  get isSessionValid() {
    return !(this.isExpired || this.token === null);
  }
};

export const userStore = {
  namespaced: true,
  state: {
    authErrorText: "",
    user: {anonymous: true},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    initializeUser(context) {
      return api
        .get("/users/me/")
        .then(response => {
          context.commit("setUser", Object.assign(
            {}, {anonymous: false}, response.data)
          );
        })
        .catch(err => {
          if (err.response.status === 401) {
            context.commit("setUser", { anonymous: true });
          }
        });
    },
    logOut(context, router) {
      localStorage.removeItem("authToken");
      context.commit("setUser", { anonymous: true });
      router.push({ name: "index" });
    },
    authenticate(ctx, params) {
      const {email, password, router, name} = params;
      axios
        .post(
          "/api/auth/login/",
          {},
          {
            headers: {
              Authorization: "Basic " + btoa(`${email}:${password}`)
            }
          }
        )
        .then(response => {
          if (response.status < 400) {
            userStorage.setSession(response.data.token, response.data.expiry);
            ctx.dispatch("initialize").then(() => {
              router.push({ name });
            });
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            ctx.commit('setAuthError', "Incorrect Email or Password");
          } else {
            ctx.commit('setAuthError', "Something went wrong");
          }
        });
    },
  },
  getters: {
    user(state) {
      return state.user
    },
  }
};
