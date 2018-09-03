export default {
    call(key, params, callback) {
        if (undefined === this.calls[key] || typeof callback !== 'function') {
            return null;
        }
    
        if (true === Vue.config.productionTip) {
           return this.calls[key].real.call(this, params, callback);
        }
    
        return this.calls[key].fake.call(this, params, callback);
    }    
}