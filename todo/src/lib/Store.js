export default
class Store {
    constructor() {
    }

    getItem(key) {
        const data=localStorage.getItem(key);
        if (null === data) {
            return null;
        }
        return JSON.parse(data);
    }

    setItem(key, data) {
        return localStorage.setItem(key, JSON.stringify(data));
    }
}