import Utils from '@/lib/Utils'

class Store {
    getItem(key) {
        const data=localStorage.getItem(key); 
        if (true === Utils.empty(data)) {
            return null;
        }
        return JSON.parse(data);
    }

    setItem(key, data) {
        return localStorage.setItem(key, JSON.stringify(data));
    }
}

export default new Store()