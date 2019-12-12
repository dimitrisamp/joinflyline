import { userStorage } from './store/user.js';

export default axios.create({
  baseURL: '/api/',
  headers: {
    Authorization: {
      toString () {
        if(!userStorage.token) return null;
        return `Token ${userStorage.token}`;
      }
    }
  }
})
