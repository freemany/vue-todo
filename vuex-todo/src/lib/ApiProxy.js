export default class ApiProxy {
    constructor() {
        this.calls = {
            'mushodu_GetCouponByCode' : {
                fake: function(params, callback) {
                   console.log(params[0], callback.call(this))
                },
                real: function(params, callback) {
                    DP.mushodo.askSingle('GetCouponByCode', params[0], callback);
                }
            }
        }
    }

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