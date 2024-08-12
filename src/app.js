import { KEYS, URLS, DEFAULT, URLEntity } from './config/config.js';
import { PropValue, createProp } from './config/prop.js';
import { menuList } from "@/config/state.js";
import UTILS from './config/utils.js';
import axios from 'axios';
import Qs from 'qs';
import router from './router.js';
import { message, Modal, Spin } from 'ant-design-vue';
import { createVNode } from "vue";
const messageDuration = 2;
let loadingModal = [];
const app = {
  URLS,
  KEYS,
  DEFAULT,
  utils: UTILS,
  pageParams: {
  },
  token: createProp(KEYS.TOKEN, PropValue.LOCAL_STORAGE),
  userInfo: createProp(KEYS.USER_INFO, PropValue.LOCAL_STORAGE),
  userMenuList: createProp(KEYS.MENU_LIST, PropValue.SESSION_STORAGE),
  onLaunch() {
    axios.interceptors.response.use(
      (response) => {
        window.console.log(
          response.config.url,
          decodeURIComponent(response.config.data),
          response.headers,
          response.data
        );
        if (response.status === 200 && response.data) {
          const res =
            typeof response.data == 'string'
              ? eval('(' + response.data + ')')
              : response.data;
          if (this.checkRequestResult(res) == 0) {
            return Promise.resolve(res);
          } else {
            return Promise.reject(res);
          }
        } else {
          return Promise.reject(response);
        }
      },
      (error) => Promise.reject(error)
    );
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  },
  showLoading() {
    loadingModal[loadingModal.length] = Modal.info({
      icon: () => createVNode(Spin, { tip: '加载中' }),
      mask: true,
      maskClosable: false,
      centered: true,
      keyboard: false,
      class: 'loading-modal',
    });
  },
  hideLoading() {
    if (loadingModal.length > 0) {
      loadingModal[loadingModal.length - 1].destroy();
      loadingModal.length = loadingModal.length - 1;
    }
  },
  showToast(content, delay = 0) {
    let show = () => {
      message.open({ content, duration: messageDuration });
    };
    if (delay == 0) {
      show();
    } else {
      setTimeout(show, delay);
    }
  },
  getToken() {
    return this.token.get();
  },
  setToken(token) {
    this.token.set(token);
  },
  toLogin() {
    this.userInfo.del();
    this.token.del();
    this.userMenuList.del();
    router.replace({ path: '/login' }).catch(() => { });
  },
  async getMenuList() {
    const menuList = menuList || [];
    this.userMenuList.set(menuList);
    return this.userMenuList.get();
    // let menuList = this.userMenuList.get() || [];
    // if (menuList.length < 1) {
    //   let res = await this.postAsync(URLS.USER_MENU_LIST);
    //   this.userMenuList.set(res.data || []);
    // }
    // return this.userMenuList.get();
  },
  uploadBase(filePath, obj) {
    const data = new FormData();
    data.append('file', filePath);
    if (obj.params) {
      for (let i in obj.params) {
        data.append(i, obj.params[i]);
      }
    }
    obj.params = data;
    obj.method = 'POST';
    return this.requestBase(obj);
  },
  upload(url, filePath, params = {}, success, complete) {
    this.uploadBase(filePath, {
      url,
      success,
      params,
      complete,
    });
  },
  async uploadAsync(url, filePath, obj = {}) {
    return new Promise((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = (e) => {
        resolve(e || {});
      };
      obj.url = url;
      this.uploadBase(filePath, obj);
    });
  },
  checkRequestResult(data) {
    if ('status' in data) {
      if (data.status == 901 || data.status == 903 || data.status == 904 || data.status == 906) {
        data.status == 906 && this.showToast(data.message, 200);
        this.toLogin();
        return 1;
      } else if (data.status != 0) {
        this.showToast(data.message, 200);
        return 2;
      }
    }
    return 0;
  },
  getHeaders() {
    return {
      token: this.getToken(),
      'product-version': DEFAULT.VERSION_NAME,
    };
  },
  async requestAsync(obj) {
    return new Promise((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = (e) => {
        resolve(e || {});
      };
      this.requestBase(obj);
    });
  },
  post(url, params, success, complete) {
    this.requestBase({
      url,
      params,
      success,
      complete,
      method: 'POST',
    });
  },
  get(url, params, success, complete) {
    this.requestBase({
      url,
      params,
      success,
      complete,
      method: 'GET',
    });
  },
  async postAsync(url, params = {}) {
    return this.requestAsync({
      url,
      params,
      method: 'POST',
    });
  },
  async getAsync(url, params = {}) {
    return this.requestAsync({
      url,
      params,
      method: 'GET',
    });
  },
  async deleteAsync(url, params = {}) {
    return this.requestAsync({
      url,
      params,
      method: 'DELETE',
    });
  },
  async putAsync(url, params = {}) {
    return this.requestAsync({
      url,
      params,
      method: 'PUT',
    });
  },
  requestBase(obj) {
    let headers = this.getHeaders();
    const urlObj = obj.url
    if (obj.headers) {
      for (let i in obj.headers) {
        headers[i] = obj.headers[i];
      }
    }
    let url = "", contentType = DEFAULT.CONTENT_TYPE
    if (urlObj instanceof URLEntity) {
      url = urlObj.url
      if (!UTILS.isEmpty(urlObj.contentType)) {
        contentType = urlObj.contentType
      }
    }
    else if (typeof (urlObj) == "string") {
      url = urlObj
    }
    if (obj.method == 'POST') {
      if (contentType == 'multipart/form-data' && !(obj.params instanceof FormData)) {
        obj.params = Qs.stringify(obj.params);
      }
    }
    headers['Content-Type'] = contentType
    let method = null;
    if (obj.method == 'POST') {
      method = axios.post(url, obj.params, { headers });
    } else if (obj.method == 'GET') {
      method = axios.get(url, { params: obj.params, headers });
    } else if (obj.method == 'DELETE') {
      method = axios.delete(url, { params: obj.params, headers });
    } else if (obj.method == 'PUT') {
      method = axios.put(url, { params: obj.params, headers });
    }
    if (method) {
      method
        .then((res) => {
          if (obj.success) {
            obj.success(res);
          }
          if (obj.resolve) {
            obj.resolve(res);
          }
          if (obj.complete) {
            obj.complete(true);
          }
        })
        .catch((e) => {
          // obj.reject && obj.reject(e)
          obj.resolve && obj.resolve({
            status: -100,
            message: "Network Error"
          })
          obj.complete && obj.complete(false, e)
        });
    }
  },
};
export default app;
