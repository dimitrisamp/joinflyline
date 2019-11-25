export default axios.create({
  baseURL: '/api/',
  headers: {
    Authorization: {
      toString () {
        const token = localStorage.getItem('authToken');
        if(!token) return null;
        return `Token ${token}`;
      }
    }
  }
})
