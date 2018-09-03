import { runInThisContext } from "vm";

let MyEventManager = null;

try { 
   MyEventManager= typeof EventManager === undefined ? null : EventManager; 
} catch(e) {
   MyEventManager = {
        on: (key, callback) => {
            console.log('MyEventManager.on', key, callback);
            return true;
        },
        trigger: (key, params) => {
            console.log('MyEventManager.trigger', key, params);
            return true;
        },
  }
  MyEventManager.attach = MyEventManager.on;
  MyEventManager.emit = MyEventManager.trigger;
}

export default MyEventManager


