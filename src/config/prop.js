import cookie from './cookie.js';
import utils from './utils.js';
export class PropValue {
  static RUNNING = 0;
  static LOCAL_STORAGE = 1;
  static COOKIE = 2;
  static SESSION_STORAGE = 4;
  constructor(key, type) {
    this.get = () => {
      if (utils.isEmpty(this.value)) {
        let value = null;
        if ((type & PropValue.LOCAL_STORAGE) == PropValue.LOCAL_STORAGE) {
          value = localStorage.getItem(key);
        }
        if (utils.isEmpty(value)) {
          if ((type & PropValue.COOKIE) == PropValue.COOKIE) {
            value = cookie.get(key);
          }
        }
        if (utils.isEmpty(value)) {
          if ((type & PropValue.SESSION_STORAGE) == PropValue.SESSION_STORAGE) {
            value = sessionStorage.getItem(key);
          }
        }
        this.value = JSON.parse(utils.isEmpty(value) ? '""' : value);
      }
      return this.value;
    };
    this.set = (value) => {
      this.value = value;
      let str = JSON.stringify(value);
      if (utils.isEmpty(str)) {
        this.del();
      } else {
        if ((type & PropValue.LOCAL_STORAGE) == PropValue.LOCAL_STORAGE) {
          localStorage.setItem(key, str);
        }
        if ((type & PropValue.COOKIE) == PropValue.COOKIE) {
          cookie.set(key, str);
        }
        if ((type & PropValue.SESSION_STORAGE) == PropValue.SESSION_STORAGE) {
          sessionStorage.setItem(key, str);
        }
      }
    };
    this.del = () => {
      delete this.value;
      if ((type & PropValue.LOCAL_STORAGE) == PropValue.LOCAL_STORAGE) {
        localStorage.removeItem(key);
      }
      if ((type & PropValue.COOKIE) == PropValue.COOKIE) {
        cookie.del(key);
      }
      if ((type & PropValue.SESSION_STORAGE) == PropValue.SESSION_STORAGE) {
        sessionStorage.removeItem(key);
      }
    };
  }
}
export function createProp(key, type = PropValue.LOCAL_STORAGE) {
  return new PropValue(key, type);
}
