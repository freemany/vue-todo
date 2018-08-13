class Utils {
  static guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  static empty(mixed_var) {
    //   example 1: empty(null);
    //   returns 1: true
    //   example 2: empty(undefined);
    //   returns 2: true
    //   example 3: empty([]);
    //   returns 3: true
    //   example 4: empty({});
    //   returns 4: true
    //   example 5: empty({'aFunc' : function () { alert('humpty'); } });
    //   returns 5: false
  
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
  
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixed_var === emptyValues[i]) {
        return true;
      }
    }
  
    if (typeof mixed_var === 'object') {
      for (key in mixed_var) {
        // TODO: should we check for own properties only?
        //if (mixed_var.hasOwnProperty(key)) {
        return false;
        //}
      }
      return true;
    }
  
    return false;
  }
}
export default Utils